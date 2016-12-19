const router = require('koa-router')();
const productsApi = require('../api/products');
const ordersApi = require('../api/orders');
const config = require('../config');
const paypal = require('paypal-rest-sdk');

paypal.configure({
    'mode': config.paypalMode,
    'client_id': config.paypalClientId,
    'client_secret': config.paypalClientSecret,
});

router.get('/shopcart', function* () {
  // Shopcart
  try {
    this.render('shopcart/index');
  } catch (err) {
    this.throw(err.message, 500);
  }
});

router.get('/shopcart/checkout', function* () {
  if (!this.user) {
    this.session.redirectAfterLogin = '/shopcart/checkout';
    this.redirect('/sign');
  } else {
    if (typeof this.session.shopcart.user !== 'undefined') {
      this.session.shopcart.user = user.id;
      this.session.shopcart.firstName = this.user.firstName;
      this.session.shopcart.lastName = this.user.lastName;
    }
    this.render('shopcart/checkout');
  }
});

router.post('/shopcart/checkout', function* () {
  if (!this.user) {
    this.redirect('/sign');
  } else {
    this.session.shopcart.firstName = this.request.body.firstName;
    this.session.shopcart.lastName = this.request.body.lastName;
    this.session.shopcart.shippingAddress = this.request.body.shippingAddress;
    this.redirect('/shopcart/confirm');
  }
});

router.get('/shopcart/confirm', function* () {
  if (!this.user) {
    this.redirect('/sign');
  } else {
    this.render('shopcart/confirm');
  }
});

router.get('/shopcart/payment', function* () {
  if (!this.user) {
    this.redirect('/sign');
  } else if (this.session.shopcart.products.length < 1) {
    this.redirect('/');
  } else {
    const shopcart = this.session.shopcart;
    const address = {
      line1: shopcart.shippingAddress.address,
      postalCode: shopcart.shippingAddress.postalCode,
      city: shopcart.shippingAddress.city,
      state: shopcart.shippingAddress.state,
      country: shopcart.shippingAddress.country,
    };
    const orderData = {
      customerName: shopcart.firstName + ' ' + shopcart.lastName,
      orderType: 'ORDER',
      paymentMethod: 'PAYPAL',
      shipping: shopcart.shipping,
      billingAddress: address,
      shippingAddress: address,
      products: shopcart.products.map((product) => {
        return {
          option: product.option,
          product: product.product,
          discount: 0,
          ean: product.option.ean,
          reference: product.option.reference,
          name: product.product.name + ' - ' + product.option.name,
          price: product.option.price,
          total: product.option.price * product.units,
          units: product.units,
        };
      }),
    };

    const paypalProcess = (cb) => {
      ordersApi.create(orderData, this.user.token).then((order) => {
        const createPaymentJSON = {
          'intent': 'sale',
          'payer': {
            'payment_method': 'paypal',
          },
          'redirect_urls': {
            'return_url': 'http://ezstore.dpstudios.es/shopcart/paypal/paid',
            'cancel_url': 'http://ezstore.dpstudios.es/shopcart/paypal/cancel',
          },
          'transactions': [{
            'item_list': {
              'items': order.products.map((p) => {
                return {
                  name: p.name,
                  sku: p.reference || p.name,
                  price: p.price,
                  currency: 'EUR',
                  quantity: p.units,
                };
              }),
            },
            'amount': {
              'currency': 'EUR',
              'total': order.total,
              'details': {
                'subtotal': order.subtotal,
                'shipping': order.shipping,
                'tax': order.total - order.subtotal - order.shipping,
              },
            },
            'description': 'Pago del pedido ' + order.reference,
          }],
        };

        paypal.payment.create(createPaymentJSON, (error, payment) => {
          order.paymentInfo = payment.id;
          ordersApi.update(order, this.user.token);
          if (error) {
            throw error;
          } else {
            for (let index = 0; index < payment.links.length; index++) {
              if (payment.links[index].rel === 'approval_url') {
                cb(null, payment.links[index].href);
              }
            }
            cb('Some problem has been ocurred with the payment', null);
          }
        });
      });
    };
    result = yield paypalProcess;
    if (result) {
      this.redirect(result);
    }
  }
});

// WS
router.post('/shopcart/:productId/:productSlug', function* () {
  const optionId = this.request.body.optionId;
  const productId = this.params.productId;
  const productSlug = this.params.productSlug;

  const shopcart = this.session.shopcart;
  const product = yield productsApi.find(productId);
  let option;
  product.options.forEach((o) => {
    if (o.id === parseInt(optionId)) option = o;
  });

  if (option) {
    let index = shopcart.products.findIndex((o) => o.option.id === option.id);
    if (index < 0) {
      shopcart.products.push({
        product: product,
        option: option,
        price: option.priceTaxIncluded,
        units: 0,
        total: 0,
      });
      index = shopcart.products.length - 1;
    }

    shopcart.products[index].units += 1;
    shopcart.products[index].total += option.priceTaxIncluded;
    this.session.shopcart = recalculateShopcart(shopcart);

    this.redirect('/products/'+productId+'/'+productSlug+'/'+optionId);
  }

  this.redirect('back');
});

router.get('/shopcart/delete/:optionId', function* () {
  const shopcart = this.session.shopcart;

  const index = shopcart.products.findIndex((o) => {
    return o.option.id === parseInt(this.params.optionId);
  });
  if (index >= 0) {
    shopcart.products.splice(index, 1);
  }

  this.session.shopcart = recalculateShopcart(shopcart);
  this.redirect('back');
});

// Private
const recalculateShopcart = (shopcart) => {
  let total = 0;
  for (k in shopcart.products) {
    if (shopcart.products.hasOwnProperty(k)) {
      const product = shopcart.products[k];
      total += product.total;
    }
  }
  shopcart.subtotal = total;
  if (shopcart.subtotal === 0) {
    shopcart.total = total;
  } else {
    shopcart.total = total + shopcart.shipping;
  }
  return shopcart;
};

module.exports = {
    path: '',
    router: router,
};
