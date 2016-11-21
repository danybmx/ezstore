const router = require('koa-router')();

router.get('/', function* () {
  this.render('home/index');
});

module.exports = {
    path: '',
    router: router,
};
