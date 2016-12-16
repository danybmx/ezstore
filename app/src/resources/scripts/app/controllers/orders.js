module.exports = {
  ordersController: function($scope, $q, $timeout, $filter, api) {
    // Default values
    $scope.action = 'list';
    $scope.loading = true;
    $scope.error = null;
    $scope.forms = {};

    // Data containers
    $scope.orders = null;
    $scope.products = null;

    // Selected order container
    $scope.currentOrder = null;
    $scope.currentOrderIndex = null;

    // Loda data
    $scope.loadData = () => {
      // Load orders
      api.orders.all().then((res) => {
        $scope.loading = false;
        $scope.orders = res.data;
      }, (err) => {
        $scope.orders = null;
        $scope.error = `Error while requesting ${err.config.url}`;
      });
    };
    $scope.loadData();

    // isCurrentAction function
    $scope.isCurrentAction = (action) => {
      return $scope.action === action;
    };

    $scope.showList = () => {
      $scope.currentOrderIndex = null;
      $scope.currentOrder = null;
      $scope.action = 'list';
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
        $scope.orders = null;
        $scope.error = `Error while requesting ${err.config.url}`;
      });
    };

    $scope.editOrder = ($index) => {
      loadProducts();

      api.orders.find($scope.orders[$index].id).then((res) => {
        $scope.currentOrder = res.data;
      }, (err) => {
        // TODO ADD HANDLER
        console.log(err);
      });

      $scope.currentOrder = $scope.orders[$index];
      $scope.action = 'edit';
    };

    $scope.createOrder = () => {
      loadProducts();
      $scope.currentOrder = {
        customer: {},
        billingAddress: {},
        shippingAddress: {},
        useBillingAddressForShipping: true,
        products: [],
        subtotal: 0,
        total: 0,
        shipping: 0,
        discount: 0,
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

    $scope.saveOrder = () => {
      let defer;
      const order = {
        id: $scope.currentOrder.id,
        customer: $scope.currentOrder.customer || null,
        customerName: $scope.currentOrder.customerName,
        vat: $scope.currentOrder.vat,
        mail: '',
        phone: '',
        notes: $scope.currentOrder.notes,
        discount: $scope.currentOrder.discount,
        subtotal: $scope.currentOrder.subtotal,
        shipping: $scope.currentOrder.shipping,
        total: $scope.currentOrder.total,
        paid: false,
        products: $scope.currentOrder.products,
        taxes: $scope.currentOrder.taxes,
        billingAddress: $scope.currentOrder.billingAddress,
        shippingAddress: $scope.currentOrder.useBillingAddressForShipping
          ? $scope.currentOrder.billingAddress
          : $scope.currentOrder.shippingAddress,
      };

      if ($scope.currentOrder.id) {
        defer = api.orders.update(order.id, order);
      } else {
        defer = api.orders.create(order);
      }

      defer.then((res) => {
        console.log(res.data);
      });
    };
  },
};
