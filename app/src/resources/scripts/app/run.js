const helpers = require('./helpers');

module.exports = function($rootScope, $location, $route, $http) {
  $rootScope.authToken = window.localStorage.getItem('authToken');
  $rootScope.loading = false;

  for(const name in helpers) {
    if (helpers.hasOwnProperty(name)) {
      $rootScope[name] = helpers[name];
    }
  }

  if ($rootScope.authToken) {
    $rootScope.loading = true;
    $http.get('http://localhost:8080/users/me', {
      headers: {
        Authorization: 'Bearer ' + $rootScope.authToken,
      },
    }).then(function(res) {
      $rootScope.loading = false;
      if (res.data) {
        $rootScope.user = res.data;
        $location.path($rootScope.goAfterLogin || '/');
      }
    }, function(err) {
      $rootScope.loading = false;
      $location.path('/login');
    });
  }

  $rootScope.isAuth = function() {
    return !!$rootScope.user;
  };

  $rootScope.$on('$routeChangeStart', function(next, current) {
    if ( ! $rootScope.user && $location.path() !== '/login') {
      $rootScope.goAfterLogin = $location.path();
      $location.path('/login');
    }
  });

  $rootScope.$on('$routeChangeSuccess', function(next, data) {
    $rootScope.controller = data.controller;
  });

  $http.defaults.headers.common.Authorization = 'Bearer ' + $rootScope.authToken;
};
