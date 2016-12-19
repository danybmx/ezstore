const router = require('koa-router')();
const productsApi = require('../api/products');

router.get('/', function* () {
  // Featured products
  try {
    const products = yield productsApi.featured();
    this.render('home/index', {products: products});
  } catch (err) {
    this.throw(err.message, 500);
  }
});

module.exports = {
    path: '',
    router: router,
};
