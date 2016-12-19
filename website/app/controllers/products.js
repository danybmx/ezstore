const router = require('koa-router')();
const productsApi = require('../api/products');

router.get('/products/:id/:slug/:optionId?', function* () {
  // Featured products
  try {
    const product = yield productsApi.find(this.params.id);
    this.render('products/show', {
      product: product,
      selectedOption: this.params.optionId,
      productUrl: '/products/' + product.id + '/' + this.params.slug,
    });
  } catch (err) {
    this.throw(err.message, 500);
  }
});

module.exports = {
    path: '',
    router: router,
};
