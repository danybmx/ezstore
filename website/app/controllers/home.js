const router = require('koa-router')();
const api = require('../providers/api');

router.get('/', function* () {
  // Featured products
  try {
    const products = yield api.products.getAll();
    this.render('home/index', {products: products});
  } catch (err) {
    this.throw('Internal Server Error.', 500);
  }
});

module.exports = {
    path: '',
    router: router,
};
