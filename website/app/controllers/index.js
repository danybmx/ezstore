var router = require('koa-router')();

var controllers = [
  'home',
];

controllers.forEach((controllerFile) => {
  var controller = require(`./${controllerFile}`);
  controller.routes(router);
});

module.exports = router;
