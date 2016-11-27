var Base64 = require('./utils/base64');

// Create the app module and name it.
var managementApp = angular.module('managementApp', ['ngRoute']);

// Configure routes
managementApp.config(function($routeProvider) {
  $routeProvider
  .when('/login', {
    name: 'login',
    templateUrl: 'static/views/home/login.html',
    controller: 'loginController',
  })
  .when('/', {
    name: 'home',
    templateUrl: 'static/views/home/dashboard.html',
    controller: 'homeController',
  })
  .when('/logout', {
    template: '',
    controller: function($rootScope, $location) {
      $rootScope.authToken = null;
      window.localStorage.setItem('authToken', '');
      $location.path('/login');
    }
  })
  .otherwise('/');
});

managementApp.run(function($rootScope, $location, $http) {
  $rootScope.authToken = window.localStorage.getItem('authToken');

  $rootScope.isAuth = function() {
    return !!$rootScope.authToken;
  };

  $rootScope.$on('$routeChangeStart', function(next, current) {
    if (!$rootScope.authToken && current.name !== 'login') {
      $location.path('/login');
    }
  });

  $http.defaults.headers.common.Authorization = 'Bearer ' + $rootScope.authToken;
});

managementApp.controller('homeController', function($scope) {
  $scope.message = "Hello!";
});

managementApp.controller('loginController', function($rootScope, $scope, $http, $location) {

  $scope.authenticate = function($event) {
    $event.preventDefault();

    const authenticationData = $scope.authForm.email + ':' + $scope.authForm.password;
    $http.get('http://localhost:8080/auth', {
      headers: {
        Authorization: 'Basic ' + Base64.encode(authenticationData),
      },
    }).then(function(res) {
      if (res.data.token) {
        $rootScope.authToken = res.data.token;
        window.localStorage.setItem('authToken', $rootScope.authToken);
        $location.path('/');
      } else {
        $scope.error = 'Username or password was wrong';
        $scope.authForm.$setPristine();
      }
    }, function(err) {
      $scope.error = 'Username or password was wrong';
      $scope.authForm.$setPristine();
    });
  }
});

angular.element(function() {
  angular.bootstrap(document, ['managementApp']);
});
