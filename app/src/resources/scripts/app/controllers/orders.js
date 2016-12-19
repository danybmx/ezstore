module.exports = {
  ordersController: function(
      $scope,
      $q,
      $anchorScroll,
      $timeout,
      $filter,
      api) {
    // Default values
    $scope.action = 'list';
    $scope.loading = true;
    $scope.error = null;
    $scope.forms = {};
    $scope.options = {
      showTaxes: false,
    };

    // Data containers
    $scope.orders = null;
    $scope.products = null;
    $scope.orderTypes = null;

    // Selected order container
    $scope.createOrderOptions = {};
    $scope.currentOrder = null;
    $scope.currentOrderIndex = null;

    // handleError
    const handleError = (err) => {
      if (err.data.reasons) {
        $scope.error = err.data.reasons;
      } else {
        $scope.error = err.data.message;
      }

      throw new Error(err.data.message);
    };

    // Check if can create an order
    $scope.canCreateOrder = () => {
      return $scope.createOrderOptions.storage
        && $scope.createOrderOptions.orderType;
    };

    // Watch errors
    $scope.$watch('error', (value) => {
      if (value !== '') {
        $anchorScroll('header');
      }
    });

    $scope.markAsPaid = (id) => {
      const $index = getOrderIndex(id);
      const order = $scope.orders[$index];
      const modOrder = Object.assign({}, order, {paid: true});
      api.orders.update(order.id, modOrder).then(() => {
        $scope.loadData();
      });
    };
    $scope.markAsSent = (id) => {
      const $index = getOrderIndex(id);
      const order = $scope.orders[$index];
      const modOrder = Object.assign({}, order, {sent: true});
      api.orders.update(order.id, modOrder).then(() => {
        $scope.loadData();
      });
    };

    // Loda data
    $scope.loadData = () => {
      // Load orders
      api.orders.all().then((res) => {
        $scope.loading = false;
        $scope.orders = res.data;
      }, (err) => {
        $scope.orders = null;
        handleError(err);
      });

      api.orders.types().then((res) => {
        $scope.orderTypes = res.data;
      }, (err) => {
        handleError(err);
      });

      api.storages.all().then((res) => {
        $scope.storages = res.data;
      }, (err) => {
        handleError(err);
      });
    };
    $scope.loadData();

    // isCurrentAction function
    $scope.isCurrentAction = (action) => {
      return $scope.action === action;
    };

    $scope.getPrice = (p) => {
      let price = p;
      if ($scope.options.showTaxes) {
        if ($scope.currentOrder.taxes) {
          $scope.currentOrder.taxes.map((tax) => {
            price += Math.round(p * tax.value) / 100;
            return tax;
          });
        }
      }
      return price;
    };

    $scope.showList = () => {
      $scope.currentOrderIndex = null;
      $scope.currentOrder = null;
      $scope.action = 'list';
      $scope.error = null;
    };

    const loadProducts = () => {
      api.products.all().then((res) => {
        $scope.loading = false;
        $scope.products = [];
        for (let x = 0; x < res.data.length; x++) {
          const p = res.data[x];
          for (let y = 0; y < p.options.length; y++) {
            const po = p.options[y];
            const stockObj = [];
            for (let a = 0; a < po.stock.length; a++) {
              const s = po.stock[a];
              stockObj.push(`${s.storage.name}: ${s.units}`);
            }

            $scope.products.push({
              product: p,
              option: po,
              price: po.price,
              discount: po.discount,
              name: p.name + ' - ' + po.name,
              displayName: po.reference + ' | '
                + p.name + ' - '
                + po.name + ' | '
                + $filter('currency')(po.price, '') + '€ | '
                + stockObj.join(' | '),
              stock: po.stock,
            });
          }
        }
      }, (err) => {
        handleError(err);
      });
    };

    const getOrderIndex = (id) => {
      for (let i = 0; i < $scope.orders.length; i++) {
        if ($scope.orders[i].id === parseInt(id)) {
          return i;
        }
      }
    };

    $scope.editOrder = (id) => {
      const $index = getOrderIndex(id);
      loadProducts();

      api.orders.find($scope.orders[$index].id).then((res) => {
        $scope.currentOrder = res.data;
        $scope.currentOrderIndex = $index;
        if (res.data.billingAddress.fullAddress
          === res.data.shippingAddress.fullAddress) {
          $scope.currentOrder.useBillingAddressForShipping = true;
        }
      }, (err) => {
        handleError(err);
      });

      $scope.currentOrder = $scope.orders[$index];
      $scope.action = 'edit';
    };

    $scope.createOrder = () => {
      loadProducts();
      $scope.currentOrder = {
        customer: null,
        billingAddress: {},
        shippingAddress: {},
        useBillingAddressForShipping: true,
        products: [],
        subtotal: 0,
        total: 0,
        shipping: 0,
        discount: 0,
        storage: $scope.createOrderOptions.storage,
        orderType: $scope.createOrderOptions.orderType,
        taxes: [
          {
            name: 'IVA',
            value: 21,
            total: 0,
          },
        ],
      };

      $scope.action = 'create';
    };

    $scope.deleteProduct = ($index) => {
      $scope.currentOrder.products.splice($index, 1);
      $scope.recalculate();
    };

    $scope.addProduct = ($item) => {
      $scope.currentOrder.products.push({
        product: $item.product,
        option: $item.option,
        reference: $item.option.reference,
        ean: $item.option.ean,
        name: $item.name,
        price: $item.option.price,
        discount: $item.option.discount,
        units: 1,
        total: $item.option.price,
      });
      $scope.recalculate();
      $timeout(() => {
        $scope.productSearch = '';
      }, 100);
      return false;
    };

    $scope.recalculate = () => {
      let subtotal = 0;
      $scope.currentOrder.products.map((product) => {
        product.total = product.units * product.price;
        if (product.discount) {
          product.total *= (100 - product.discount) / 100;
        }
        subtotal += product.total;
        return product;
      });

      $scope.currentOrder.subtotal = subtotal;

      let total = subtotal;
      if ($scope.currentOrder.discount) {
        total *= (100 - parseFloat($scope.currentOrder.discount)) / 100;
      }
      total += parseFloat($scope.currentOrder.shipping) || 0;

      if ($scope.currentOrder.taxes) {
        $scope.currentOrder.taxes.map((tax) => {
          tax.total = Math.round(total * tax.value) / 100;
          total += tax.total;
          return tax;
        });
      }

      $scope.currentOrder.total = Math.round(total * 100) / 100;
    };

    $scope.deleteOrder = (id) => {
      const $index = getOrderIndex(id);
      if (confirm('Are you sure?')) {
        api.orders.delete($scope.orders[$index].id).then((res) => {
          $scope.orders.splice($index, 1);
        }, (err) => {
          handleError(err);
        });
      }
    };

    $scope.saveOrder = () => {
      let defer;

      let shippingAddress = $scope.currentOrder.shippingAddress;
      if ($scope.currentOrder.useBillingAddressForShipping) {
        shippingAddress = Object.assign({},
          $scope.currentOrder.billingAddress,
          {
            id: $scope.currentOrder.shippingAddress.id || null,
          }
        );
      }

      const order = {
        id: $scope.currentOrder.id,
        storage: $scope.currentOrder.storage,
        customer: $scope.currentOrder.customer || null,
        customerName: $scope.currentOrder.customerName,
        vat: $scope.currentOrder.vat,
        notes: $scope.currentOrder.notes,
        discount: $scope.currentOrder.discount,
        subtotal: $scope.currentOrder.subtotal,
        shipping: $scope.currentOrder.shipping,
        total: $scope.currentOrder.total,
        paid: $scope.currentOrder.paid,
        orderType: $scope.currentOrder.orderType,
        products: $scope.currentOrder.products,
        taxes: $scope.currentOrder.taxes,
        billingAddress: $scope.currentOrder.billingAddress,
        shippingAddress: shippingAddress,
      };

      if ($scope.currentOrder.id) {
        defer = api.orders.update(order.id, order);
      } else {
        defer = api.orders.create(order);
      }

      defer.then((res) => {
        if ($scope.currentOrderIndex !== null) {
          $scope.orders[$scope.currentOrderIndex] = res.data;
        } else {
          $scope.orders.unshift(res.data);
        }
        $scope.currentOrderIndex = null;
        $scope.currentOrder = null;
        $scope.showList();
      }, (err) => {
        if (err.data.exception === 'NoStockException') {
          $scope.error = `No stock enough for "${err.data.details.productName}".
          Maximum available is ${err.data.details.availableUnits}`;
        } else {
          handleError(err);
        }
      });
    };
  },
};
