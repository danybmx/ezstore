const router = require('koa-router')();
const api = require('../providers/api');

router.get('/', function* () {
  // Featured products
  yield api.products.getAll()
    .then((products) => {
      this.render('home/index', {
        products: products,
      });
    })
    .catch(console.error);
});

module.exports = {
    path: '',
    router: router,
};
