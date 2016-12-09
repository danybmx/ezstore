const routes = require('./routes');

module.exports = function($routeProvider) {
  for (let key in routes) {
    if (routes.hasOwnProperty(key)) {
      const route = routes[key];
      $routeProvider.when(key, route);
    }
  }
  $routeProvider.otherwise('/');
};
