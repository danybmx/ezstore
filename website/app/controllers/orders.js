const router = require('koa-router')();
const ordersApi = require('../api/orders');

router.get('/orders', function* () {
  if (this.user) {
    // Featured products
    try {
      const orders = yield ordersApi.all(this.user.token);
      this.render('orders/index', {
        orders: orders,
      });
    } catch (err) {
      this.throw(err.message, 500);
    }
  } else {
    this.session.flash = 'Antes necesitas acceder a tu cuenta';
    this.redirect('/');
  }
});

module.exports = {
    path: '',
    router: router,
};
