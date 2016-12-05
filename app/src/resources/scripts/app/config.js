const routes = require('./routes');

module.exports = function($routeProvider) {
  for (let key in routes) {
    const route = routes[key];
    $routeProvider.when(key, route);
  }
  $routeProvider.otherwise('/');
};
