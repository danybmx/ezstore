(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var run = require('./app/run');
var config = require('./app/config');
var controllers = require('./app/controllers');
var services = require('./app/services');

// Create the app module and name it.
var app = angular.module('managementApp', ['ngRoute', 'ngAnimate', 'ngTouch', 'ui.bootstrap']);

// Add controllers dynamically
for (var key in controllers) {
  if (controllers.hasOwnProperty(key)) {
    var controller = controllers[key];
    app.controller(key, controller);
  }
}

// Add services dynamically
for (var _key in services) {
  if (services.hasOwnProperty(_key)) {
    var service = services[_key];
    app.service(_key, service);
  }
}

// Set app config
app.config(config);

// Set app run commands
app.run(run);

angular.element(function () {
  angular.bootstrap(document, ['managementApp']);
});

},{"./app/config":2,"./app/controllers":4,"./app/run":8,"./app/services":10}],2:[function(require,module,exports){
'use strict';

var routes = require('./routes');

module.exports = function ($routeProvider) {
  for (var key in routes) {
    var route = routes[key];
    $routeProvider.when(key, route);
  }
  $routeProvider.otherwise('/');
};

},{"./routes":7}],3:[function(require,module,exports){
"use strict";

module.exports = {
  dashboardController: function dashboardController($scope) {
    $scope.message = "Hello!";
  }
};

},{}],4:[function(require,module,exports){
'use strict';

var modules = [require('./dashboard'), require('./products'), require('./users')];

var controllers = {};

for (var i = 0; i < modules.length; i++) {
  Object.assign(controllers, modules[i]);
}

module.exports = controllers;

},{"./dashboard":3,"./products":5,"./users":6}],5:[function(require,module,exports){
'use strict';

module.exports = {
  productsController: function productsController($scope, $q, api) {
    // Default values
    $scope.action = 'list';
    $scope.loading = true;
    $scope.error = null;

    // Data containers
    $scope.brand = null;
    $scope.categories = null;
    $scope.products = null;

    // Selected product container
    $scope.currentProduct = null;
    $scope.currentProductIndex = null;

    // Loda data
    $scope.loadData = function () {
      $q.all([
      // Load products
      $q(function (resolve, reject) {
        api.products.all().then(function (res) {
          $scope.products = res.data;
          resolve('products');
        }, reject);
      }),

      // Load brands
      $q(function (resolve, reject) {
        api.brands.all().then(function (res) {
          $scope.brands = res.data;
          resolve('brands');
        }, reject);
      }),

      // Load categories
      $q(function (resolve, reject) {
        api.categories.all().then(function (res) {
          $scope.categories = res.data;
          resolve('categories');
        }, reject);
      })]).then(function (data) {
        $scope.loading = false;
      }, function (err) {
        $scope.products = null;
        $scope.brands = null;
        $scope.categories = null;
        $scope.error = 'Error while requesting ' + err.config.url;
      });
    };
    $scope.loadData();

    // isCurrentAction function
    $scope.isCurrentAction = function (action) {
      return $scope.action === action;
    };

    $scope.showList = function () {
      $scope.currentProductIndex = null;
      $scope.currentProduct = null;
      $scope.action = 'list';
    };

    // editProduct
    $scope.editProduct = function (index) {
      $scope.currentProductIndex = index;
      $scope.currentProduct = null;
      $scope.action = 'edit';

      $scope.loading = true;
      api.products.find($scope.products[index].id).then(function (response) {
        $scope.currentProduct = response.data;
        $scope.loading = false;
      }, function (err) {
        $scope.loading = false;
        $scope.currentProduct = null;
        $scope.currentProductIndex = null;
        $scope.error = err.data.message;
      });
    };

    // saveProduct
    $scope.saveProduct = function () {
      var product = {
        name: $scope.currentProduct.name,
        description: $scope.currentProduct.description,
        brandId: $scope.currentProduct.brand.id,
        categoryId: $scope.currentProduct.category.id
      };

      if ($scope.action == 'edit') {
        api.products.update($scope.currentProduct.id, product).then(function (res) {
          $scope.products[$scope.currentProductIndex] = res.data;
          $scope.showList();
        }, function (err) {
          $scope.error = err.data.message;
        });
      } else {
        api.products.update(product);
      }
    };
  }
};

},{}],6:[function(require,module,exports){
'use strict';

module.exports = {
  loginController: function loginController($rootScope, $scope, $http, $location) {
    $scope.authenticate = function ($event) {
      $event.preventDefault();

      var authenticationData = $scope.authForm.email + ':' + $scope.authForm.password;
      $http.get('http://localhost:8080/auth', {
        headers: {
          Authorization: 'Basic ' + btoa(authenticationData)
        }
      }).then(function (res) {
        if (res.data.token) {
          $rootScope.authToken = res.data.token;
          window.localStorage.setItem('authToken', $rootScope.authToken);

          $http.get('http://localhost:8080/users/me', {
            headers: {
              Authorization: 'Bearer ' + $rootScope.authToken
            }
          }).then(function (res) {
            if (res.data) {
              $rootScope.user = res.data;
              $location.path('/');
            }
          }, function (err) {
            $scope.error = 'Some problem has been ocurred';
            $scope.authForm.$setPristine();
          });
        } else {
          $scope.error = 'Username or password was wrong';
          $scope.authForm.$setPristine();
        }
      }, function (err) {
        $scope.error = 'Username or password was wrong';
        $scope.authForm.$setPristine();
      });
    };
  }
};

},{}],7:[function(require,module,exports){
'use strict';

module.exports = {
  /***************/
  /** Dashboard **/
  /***************/
  '/': {
    templateUrl: 'static/views/home/dashboard.html',
    controller: 'dashboardController'
  },

  /**************/
  /** Products **/
  /**************/
  '/products': {
    templateUrl: 'static/views/products/index.html',
    controller: 'productsController'
  },

  /**********/
  /** Auth **/
  /**********/
  '/login': {
    templateUrl: 'static/views/home/login.html',
    controller: 'loginController'
  },
  '/logout': {
    template: '',
    controller: function controller($rootScope, $window) {
      $window.localStorage.setItem('authToken', '');
      $window.localStorage.setItem('user', '');
      $window.location.reload();
    }
  }
};

},{}],8:[function(require,module,exports){
'use strict';

module.exports = function ($rootScope, $location, $route, $http) {
  $rootScope.authToken = window.localStorage.getItem('authToken');
  $rootScope.loading = false;

  if ($rootScope.authToken) {
    $rootScope.loading = true;
    $http.get('http://localhost:8080/users/me', {
      headers: {
        Authorization: 'Bearer ' + $rootScope.authToken
      }
    }).then(function (res) {
      $rootScope.loading = false;
      if (res.data) {
        $rootScope.user = res.data;
        $location.path($rootScope.goAfterLogin || '/');
      }
    }, function (err) {
      $rootScope.loading = false;
      $location.path('/login');
    });
  }

  $rootScope.isAuth = function () {
    return !!$rootScope.user;
  };

  $rootScope.$on('$routeChangeStart', function (next, current) {
    if (!$rootScope.user && $location.path() !== '/login') {
      $rootScope.goAfterLogin = $location.path();
      $location.path('/login');
    }
  });

  $rootScope.$on('$routeChangeSuccess', function (next, data) {
    $rootScope.controller = data.controller;
  });

  $http.defaults.headers.common.Authorization = 'Bearer ' + $rootScope.authToken;
};

},{}],9:[function(require,module,exports){
'use strict';

var apiAddress = 'http://localhost:8080';

module.exports = function ($rootScope, $http) {
  var options = {
    headers: {
      Authorization: 'Bearer ' + $rootScope.authToken
    }
  };

  this.products = {
    all: function all() {
      return $http.get(apiAddress + '/products', options);
    },
    find: function find(id) {
      return $http.get(apiAddress + '/products/' + id, options);
    },
    update: function update(id, product) {
      return $http.put(apiAddress + '/products/' + id, product, options);
    }
  };

  this.categories = {
    all: function all() {
      return $http.get(apiAddress + '/categories', options);
    },
    create: function create() {}
  };

  this.brands = {
    all: function all() {
      return $http.get(apiAddress + '/brands', options);
    }
  };
};

},{}],10:[function(require,module,exports){
'use strict';

var services = {
  api: require('./api')
};

module.exports = services;

},{"./api":9}],11:[function(require,module,exports){
'use strict';

var app = require('./app');

},{"./app":1}]},{},[11])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvcmVzb3VyY2VzL3NjcmlwdHMvYXBwLmpzIiwic3JjL3Jlc291cmNlcy9zY3JpcHRzL2FwcC9jb25maWcuanMiLCJzcmMvcmVzb3VyY2VzL3NjcmlwdHMvYXBwL2NvbnRyb2xsZXJzL2Rhc2hib2FyZC5qcyIsInNyYy9yZXNvdXJjZXMvc2NyaXB0cy9hcHAvY29udHJvbGxlcnMvaW5kZXguanMiLCJzcmMvcmVzb3VyY2VzL3NjcmlwdHMvYXBwL2NvbnRyb2xsZXJzL3Byb2R1Y3RzLmpzIiwic3JjL3Jlc291cmNlcy9zY3JpcHRzL2FwcC9jb250cm9sbGVycy91c2Vycy5qcyIsInNyYy9yZXNvdXJjZXMvc2NyaXB0cy9hcHAvcm91dGVzLmpzIiwic3JjL3Jlc291cmNlcy9zY3JpcHRzL2FwcC9ydW4uanMiLCJzcmMvcmVzb3VyY2VzL3NjcmlwdHMvYXBwL3NlcnZpY2VzL2FwaS5qcyIsInNyYy9yZXNvdXJjZXMvc2NyaXB0cy9hcHAvc2VydmljZXMvaW5kZXguanMiLCJzcmMvcmVzb3VyY2VzL3NjcmlwdHMvbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUEsSUFBTSxNQUFNLFFBQVEsV0FBUixDQUFaO0FBQ0EsSUFBTSxTQUFTLFFBQVEsY0FBUixDQUFmO0FBQ0EsSUFBTSxjQUFjLFFBQVEsbUJBQVIsQ0FBcEI7QUFDQSxJQUFNLFdBQVcsUUFBUSxnQkFBUixDQUFqQjs7QUFFQTtBQUNBLElBQU0sTUFBTSxRQUFRLE1BQVIsQ0FBZSxlQUFmLEVBQWdDLENBQUMsU0FBRCxFQUFZLFdBQVosRUFBeUIsU0FBekIsRUFBb0MsY0FBcEMsQ0FBaEMsQ0FBWjs7QUFFQTtBQUNBLEtBQUssSUFBSSxHQUFULElBQWdCLFdBQWhCLEVBQTZCO0FBQzNCLE1BQUksWUFBWSxjQUFaLENBQTJCLEdBQTNCLENBQUosRUFBcUM7QUFDbkMsUUFBTSxhQUFhLFlBQVksR0FBWixDQUFuQjtBQUNBLFFBQUksVUFBSixDQUFlLEdBQWYsRUFBb0IsVUFBcEI7QUFDRDtBQUNGOztBQUVEO0FBQ0EsS0FBSyxJQUFJLElBQVQsSUFBZ0IsUUFBaEIsRUFBMEI7QUFDeEIsTUFBSSxTQUFTLGNBQVQsQ0FBd0IsSUFBeEIsQ0FBSixFQUFrQztBQUNoQyxRQUFNLFVBQVUsU0FBUyxJQUFULENBQWhCO0FBQ0EsUUFBSSxPQUFKLENBQVksSUFBWixFQUFpQixPQUFqQjtBQUNEO0FBQ0Y7O0FBRUQ7QUFDQSxJQUFJLE1BQUosQ0FBVyxNQUFYOztBQUVBO0FBQ0EsSUFBSSxHQUFKLENBQVEsR0FBUjs7QUFFQSxRQUFRLE9BQVIsQ0FBZ0IsWUFBVztBQUN6QixVQUFRLFNBQVIsQ0FBa0IsUUFBbEIsRUFBNEIsQ0FBQyxlQUFELENBQTVCO0FBQ0QsQ0FGRDs7Ozs7QUM5QkEsSUFBTSxTQUFTLFFBQVEsVUFBUixDQUFmOztBQUVBLE9BQU8sT0FBUCxHQUFpQixVQUFTLGNBQVQsRUFBeUI7QUFDeEMsT0FBSyxJQUFJLEdBQVQsSUFBZ0IsTUFBaEIsRUFBd0I7QUFDdEIsUUFBTSxRQUFRLE9BQU8sR0FBUCxDQUFkO0FBQ0EsbUJBQWUsSUFBZixDQUFvQixHQUFwQixFQUF5QixLQUF6QjtBQUNEO0FBQ0QsaUJBQWUsU0FBZixDQUF5QixHQUF6QjtBQUNELENBTkQ7Ozs7O0FDRkEsT0FBTyxPQUFQLEdBQWlCO0FBQ2YsdUJBQXFCLDZCQUFVLE1BQVYsRUFBa0I7QUFDckMsV0FBTyxPQUFQLEdBQWlCLFFBQWpCO0FBQ0Q7QUFIYyxDQUFqQjs7Ozs7QUNBQSxJQUFNLFVBQVUsQ0FDZCxRQUFRLGFBQVIsQ0FEYyxFQUVkLFFBQVEsWUFBUixDQUZjLEVBR2QsUUFBUSxTQUFSLENBSGMsQ0FBaEI7O0FBTUEsSUFBTSxjQUFjLEVBQXBCOztBQUVBLEtBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxRQUFRLE1BQTVCLEVBQW9DLEdBQXBDLEVBQXlDO0FBQ3ZDLFNBQU8sTUFBUCxDQUFjLFdBQWQsRUFBMkIsUUFBUSxDQUFSLENBQTNCO0FBQ0Q7O0FBRUQsT0FBTyxPQUFQLEdBQWlCLFdBQWpCOzs7OztBQ1pBLE9BQU8sT0FBUCxHQUFpQjtBQUNmLHNCQUFvQiw0QkFBVSxNQUFWLEVBQWtCLEVBQWxCLEVBQXNCLEdBQXRCLEVBQTJCO0FBQzdDO0FBQ0EsV0FBTyxNQUFQLEdBQWdCLE1BQWhCO0FBQ0EsV0FBTyxPQUFQLEdBQWlCLElBQWpCO0FBQ0EsV0FBTyxLQUFQLEdBQWUsSUFBZjs7QUFFQTtBQUNBLFdBQU8sS0FBUCxHQUFlLElBQWY7QUFDQSxXQUFPLFVBQVAsR0FBb0IsSUFBcEI7QUFDQSxXQUFPLFFBQVAsR0FBa0IsSUFBbEI7O0FBRUE7QUFDQSxXQUFPLGNBQVAsR0FBd0IsSUFBeEI7QUFDQSxXQUFPLG1CQUFQLEdBQTZCLElBQTdCOztBQUVBO0FBQ0EsV0FBTyxRQUFQLEdBQWtCLFlBQU07QUFDdEIsU0FBRyxHQUFILENBQU87QUFDTDtBQUNBLFNBQUcsVUFBQyxPQUFELEVBQVUsTUFBVixFQUFxQjtBQUN0QixZQUFJLFFBQUosQ0FBYSxHQUFiLEdBQW1CLElBQW5CLENBQXdCLFVBQUMsR0FBRCxFQUFTO0FBQy9CLGlCQUFPLFFBQVAsR0FBa0IsSUFBSSxJQUF0QjtBQUNBLGtCQUFRLFVBQVI7QUFDRCxTQUhELEVBR0csTUFISDtBQUlELE9BTEQsQ0FGSzs7QUFTTDtBQUNBLFNBQUcsVUFBQyxPQUFELEVBQVUsTUFBVixFQUFxQjtBQUN0QixZQUFJLE1BQUosQ0FBVyxHQUFYLEdBQWlCLElBQWpCLENBQXNCLFVBQUMsR0FBRCxFQUFTO0FBQzdCLGlCQUFPLE1BQVAsR0FBZ0IsSUFBSSxJQUFwQjtBQUNBLGtCQUFRLFFBQVI7QUFDRCxTQUhELEVBR0csTUFISDtBQUlELE9BTEQsQ0FWSzs7QUFpQkw7QUFDQSxTQUFHLFVBQUMsT0FBRCxFQUFVLE1BQVYsRUFBcUI7QUFDdEIsWUFBSSxVQUFKLENBQWUsR0FBZixHQUFxQixJQUFyQixDQUEwQixVQUFDLEdBQUQsRUFBUztBQUNqQyxpQkFBTyxVQUFQLEdBQW9CLElBQUksSUFBeEI7QUFDQSxrQkFBUSxZQUFSO0FBQ0QsU0FIRCxFQUdHLE1BSEg7QUFJRCxPQUxELENBbEJLLENBQVAsRUF3QkcsSUF4QkgsQ0F3QlEsVUFBQyxJQUFELEVBQVU7QUFDaEIsZUFBTyxPQUFQLEdBQWlCLEtBQWpCO0FBQ0QsT0ExQkQsRUEwQkcsVUFBQyxHQUFELEVBQVM7QUFDVixlQUFPLFFBQVAsR0FBa0IsSUFBbEI7QUFDQSxlQUFPLE1BQVAsR0FBZ0IsSUFBaEI7QUFDQSxlQUFPLFVBQVAsR0FBb0IsSUFBcEI7QUFDQSxlQUFPLEtBQVAsK0JBQXlDLElBQUksTUFBSixDQUFXLEdBQXBEO0FBQ0QsT0EvQkQ7QUFnQ0QsS0FqQ0Q7QUFrQ0EsV0FBTyxRQUFQOztBQUVBO0FBQ0EsV0FBTyxlQUFQLEdBQXlCLFVBQUMsTUFBRCxFQUFZO0FBQ25DLGFBQU8sT0FBTyxNQUFQLEtBQWtCLE1BQXpCO0FBQ0QsS0FGRDs7QUFJQSxXQUFPLFFBQVAsR0FBa0IsWUFBTTtBQUN0QixhQUFPLG1CQUFQLEdBQTZCLElBQTdCO0FBQ0EsYUFBTyxjQUFQLEdBQXdCLElBQXhCO0FBQ0EsYUFBTyxNQUFQLEdBQWdCLE1BQWhCO0FBQ0QsS0FKRDs7QUFNQTtBQUNBLFdBQU8sV0FBUCxHQUFxQixVQUFDLEtBQUQsRUFBVztBQUM5QixhQUFPLG1CQUFQLEdBQTZCLEtBQTdCO0FBQ0EsYUFBTyxjQUFQLEdBQXdCLElBQXhCO0FBQ0EsYUFBTyxNQUFQLEdBQWdCLE1BQWhCOztBQUVBLGFBQU8sT0FBUCxHQUFpQixJQUFqQjtBQUNBLFVBQUksUUFBSixDQUFhLElBQWIsQ0FBa0IsT0FBTyxRQUFQLENBQWdCLEtBQWhCLEVBQXVCLEVBQXpDLEVBQTZDLElBQTdDLENBQWtELFVBQUMsUUFBRCxFQUFjO0FBQzlELGVBQU8sY0FBUCxHQUF3QixTQUFTLElBQWpDO0FBQ0EsZUFBTyxPQUFQLEdBQWlCLEtBQWpCO0FBQ0QsT0FIRCxFQUdHLFVBQUMsR0FBRCxFQUFTO0FBQ1YsZUFBTyxPQUFQLEdBQWlCLEtBQWpCO0FBQ0EsZUFBTyxjQUFQLEdBQXdCLElBQXhCO0FBQ0EsZUFBTyxtQkFBUCxHQUE2QixJQUE3QjtBQUNBLGVBQU8sS0FBUCxHQUFlLElBQUksT0FBbkI7QUFDRCxPQVJEO0FBU0QsS0FmRDs7QUFpQkE7QUFDQSxXQUFPLFdBQVAsR0FBcUIsWUFBTTtBQUN6QixVQUFNLFVBQVU7QUFDZCxjQUFNLE9BQU8sY0FBUCxDQUFzQixJQURkO0FBRWQscUJBQWEsT0FBTyxjQUFQLENBQXNCLFdBRnJCO0FBR2QsaUJBQVMsT0FBTyxjQUFQLENBQXNCLEtBQXRCLENBQTRCLEVBSHZCO0FBSWQsb0JBQVksT0FBTyxjQUFQLENBQXNCLFFBQXRCLENBQStCO0FBSjdCLE9BQWhCOztBQU9BLFVBQUksT0FBTyxNQUFQLElBQWlCLE1BQXJCLEVBQTZCO0FBQzNCLFlBQUksUUFBSixDQUFhLE1BQWIsQ0FBb0IsT0FBTyxjQUFQLENBQXNCLEVBQTFDLEVBQThDLE9BQTlDLEVBQXVELElBQXZELENBQTRELFVBQUMsR0FBRCxFQUFTO0FBQ25FLGlCQUFPLFFBQVAsQ0FBZ0IsT0FBTyxtQkFBdkIsSUFBOEMsSUFBSSxJQUFsRDtBQUNBLGlCQUFPLFFBQVA7QUFDRCxTQUhELEVBR0csVUFBQyxHQUFELEVBQVM7QUFDVixpQkFBTyxLQUFQLEdBQWUsSUFBSSxPQUFuQjtBQUNELFNBTEQ7QUFNRCxPQVBELE1BT087QUFDTCxZQUFJLFFBQUosQ0FBYSxNQUFiLENBQW9CLE9BQXBCO0FBQ0Q7QUFDRixLQWxCRDtBQW1CRDtBQXRHYyxDQUFqQjs7Ozs7QUNBQSxPQUFPLE9BQVAsR0FBaUI7QUFDZixtQkFBaUIseUJBQVMsVUFBVCxFQUFxQixNQUFyQixFQUE2QixLQUE3QixFQUFvQyxTQUFwQyxFQUErQztBQUM5RCxXQUFPLFlBQVAsR0FBc0IsVUFBUyxNQUFULEVBQWlCO0FBQ3JDLGFBQU8sY0FBUDs7QUFFQSxVQUFNLHFCQUFxQixPQUFPLFFBQVAsQ0FBZ0IsS0FBaEIsR0FBd0IsR0FBeEIsR0FBOEIsT0FBTyxRQUFQLENBQWdCLFFBQXpFO0FBQ0EsWUFBTSxHQUFOLENBQVUsNEJBQVYsRUFBd0M7QUFDdEMsaUJBQVM7QUFDUCx5QkFBZSxXQUFXLEtBQUssa0JBQUw7QUFEbkI7QUFENkIsT0FBeEMsRUFJRyxJQUpILENBSVEsVUFBUyxHQUFULEVBQWM7QUFDcEIsWUFBSSxJQUFJLElBQUosQ0FBUyxLQUFiLEVBQW9CO0FBQ2xCLHFCQUFXLFNBQVgsR0FBdUIsSUFBSSxJQUFKLENBQVMsS0FBaEM7QUFDQSxpQkFBTyxZQUFQLENBQW9CLE9BQXBCLENBQTRCLFdBQTVCLEVBQXlDLFdBQVcsU0FBcEQ7O0FBRUEsZ0JBQU0sR0FBTixDQUFVLGdDQUFWLEVBQTRDO0FBQzFDLHFCQUFTO0FBQ1AsNkJBQWUsWUFBWSxXQUFXO0FBRC9CO0FBRGlDLFdBQTVDLEVBSUcsSUFKSCxDQUlRLFVBQVMsR0FBVCxFQUFjO0FBQ3BCLGdCQUFJLElBQUksSUFBUixFQUFjO0FBQ1oseUJBQVcsSUFBWCxHQUFrQixJQUFJLElBQXRCO0FBQ0Esd0JBQVUsSUFBVixDQUFlLEdBQWY7QUFDRDtBQUNGLFdBVEQsRUFTRyxVQUFTLEdBQVQsRUFBYztBQUNmLG1CQUFPLEtBQVAsR0FBZSwrQkFBZjtBQUNBLG1CQUFPLFFBQVAsQ0FBZ0IsWUFBaEI7QUFDRCxXQVpEO0FBYUQsU0FqQkQsTUFpQk87QUFDTCxpQkFBTyxLQUFQLEdBQWUsZ0NBQWY7QUFDQSxpQkFBTyxRQUFQLENBQWdCLFlBQWhCO0FBQ0Q7QUFDRixPQTFCRCxFQTBCRyxVQUFTLEdBQVQsRUFBYztBQUNmLGVBQU8sS0FBUCxHQUFlLGdDQUFmO0FBQ0EsZUFBTyxRQUFQLENBQWdCLFlBQWhCO0FBQ0QsT0E3QkQ7QUE4QkQsS0FsQ0Q7QUFtQ0Q7QUFyQ2MsQ0FBakI7Ozs7O0FDQUEsT0FBTyxPQUFQLEdBQWlCO0FBQ2Y7QUFDQTtBQUNBO0FBQ0EsT0FBSztBQUNILGlCQUFhLGtDQURWO0FBRUgsZ0JBQVk7QUFGVCxHQUpVOztBQVNmO0FBQ0E7QUFDQTtBQUNBLGVBQWE7QUFDWCxpQkFBYSxrQ0FERjtBQUVYLGdCQUFZO0FBRkQsR0FaRTs7QUFpQmY7QUFDQTtBQUNBO0FBQ0EsWUFBVTtBQUNSLGlCQUFhLDhCQURMO0FBRVIsZ0JBQVk7QUFGSixHQXBCSztBQXdCZixhQUFXO0FBQ1QsY0FBVSxFQUREO0FBRVQsZ0JBQVksb0JBQVMsVUFBVCxFQUFxQixPQUFyQixFQUE4QjtBQUN4QyxjQUFRLFlBQVIsQ0FBcUIsT0FBckIsQ0FBNkIsV0FBN0IsRUFBMEMsRUFBMUM7QUFDQSxjQUFRLFlBQVIsQ0FBcUIsT0FBckIsQ0FBNkIsTUFBN0IsRUFBcUMsRUFBckM7QUFDQSxjQUFRLFFBQVIsQ0FBaUIsTUFBakI7QUFDRDtBQU5RO0FBeEJJLENBQWpCOzs7OztBQ0FBLE9BQU8sT0FBUCxHQUFpQixVQUFTLFVBQVQsRUFBcUIsU0FBckIsRUFBZ0MsTUFBaEMsRUFBd0MsS0FBeEMsRUFBK0M7QUFDOUQsYUFBVyxTQUFYLEdBQXVCLE9BQU8sWUFBUCxDQUFvQixPQUFwQixDQUE0QixXQUE1QixDQUF2QjtBQUNBLGFBQVcsT0FBWCxHQUFxQixLQUFyQjs7QUFFQSxNQUFJLFdBQVcsU0FBZixFQUEwQjtBQUN4QixlQUFXLE9BQVgsR0FBcUIsSUFBckI7QUFDQSxVQUFNLEdBQU4sQ0FBVSxnQ0FBVixFQUE0QztBQUMxQyxlQUFTO0FBQ1AsdUJBQWUsWUFBWSxXQUFXO0FBRC9CO0FBRGlDLEtBQTVDLEVBSUcsSUFKSCxDQUlRLFVBQVMsR0FBVCxFQUFjO0FBQ3BCLGlCQUFXLE9BQVgsR0FBcUIsS0FBckI7QUFDQSxVQUFJLElBQUksSUFBUixFQUFjO0FBQ1osbUJBQVcsSUFBWCxHQUFrQixJQUFJLElBQXRCO0FBQ0Esa0JBQVUsSUFBVixDQUFlLFdBQVcsWUFBWCxJQUEyQixHQUExQztBQUNEO0FBQ0YsS0FWRCxFQVVHLFVBQVMsR0FBVCxFQUFjO0FBQ2YsaUJBQVcsT0FBWCxHQUFxQixLQUFyQjtBQUNBLGdCQUFVLElBQVYsQ0FBZSxRQUFmO0FBQ0QsS0FiRDtBQWNEOztBQUVELGFBQVcsTUFBWCxHQUFvQixZQUFXO0FBQzdCLFdBQU8sQ0FBQyxDQUFDLFdBQVcsSUFBcEI7QUFDRCxHQUZEOztBQUlBLGFBQVcsR0FBWCxDQUFlLG1CQUFmLEVBQW9DLFVBQVMsSUFBVCxFQUFlLE9BQWYsRUFBd0I7QUFDMUQsUUFBSyxDQUFFLFdBQVcsSUFBYixJQUFxQixVQUFVLElBQVYsT0FBcUIsUUFBL0MsRUFBeUQ7QUFDdkQsaUJBQVcsWUFBWCxHQUEwQixVQUFVLElBQVYsRUFBMUI7QUFDQSxnQkFBVSxJQUFWLENBQWUsUUFBZjtBQUNEO0FBQ0YsR0FMRDs7QUFPQSxhQUFXLEdBQVgsQ0FBZSxxQkFBZixFQUFzQyxVQUFTLElBQVQsRUFBZSxJQUFmLEVBQXFCO0FBQ3pELGVBQVcsVUFBWCxHQUF3QixLQUFLLFVBQTdCO0FBQ0QsR0FGRDs7QUFJQSxRQUFNLFFBQU4sQ0FBZSxPQUFmLENBQXVCLE1BQXZCLENBQThCLGFBQTlCLEdBQThDLFlBQVksV0FBVyxTQUFyRTtBQUNELENBdENEOzs7OztBQ0FBLElBQU0sYUFBYSx1QkFBbkI7O0FBRUEsT0FBTyxPQUFQLEdBQWlCLFVBQVMsVUFBVCxFQUFxQixLQUFyQixFQUE0QjtBQUMzQyxNQUFNLFVBQVU7QUFDZCxhQUFTO0FBQ1AscUJBQWUsWUFBWSxXQUFXO0FBRC9CO0FBREssR0FBaEI7O0FBTUEsT0FBSyxRQUFMLEdBQWdCO0FBQ2QsU0FBSyxlQUFNO0FBQ1QsYUFBTyxNQUFNLEdBQU4sQ0FBVSxhQUFhLFdBQXZCLEVBQW9DLE9BQXBDLENBQVA7QUFDRCxLQUhhO0FBSWQsVUFBTSxjQUFDLEVBQUQsRUFBUTtBQUNaLGFBQU8sTUFBTSxHQUFOLENBQVUsYUFBYSxZQUFiLEdBQTRCLEVBQXRDLEVBQTBDLE9BQTFDLENBQVA7QUFDRCxLQU5hO0FBT2QsWUFBUSxnQkFBQyxFQUFELEVBQUssT0FBTCxFQUFpQjtBQUN2QixhQUFPLE1BQU0sR0FBTixDQUFVLGFBQWEsWUFBYixHQUE0QixFQUF0QyxFQUEwQyxPQUExQyxFQUFtRCxPQUFuRCxDQUFQO0FBQ0Q7QUFUYSxHQUFoQjs7QUFZQSxPQUFLLFVBQUwsR0FBa0I7QUFDaEIsU0FBSyxlQUFNO0FBQ1QsYUFBTyxNQUFNLEdBQU4sQ0FBVSxhQUFhLGFBQXZCLEVBQXNDLE9BQXRDLENBQVA7QUFDRCxLQUhlO0FBSWhCLFlBQVEsa0JBQU0sQ0FDYjtBQUxlLEdBQWxCOztBQVFBLE9BQUssTUFBTCxHQUFjO0FBQ1osU0FBSyxlQUFNO0FBQ1QsYUFBTyxNQUFNLEdBQU4sQ0FBVSxhQUFhLFNBQXZCLEVBQWtDLE9BQWxDLENBQVA7QUFDRDtBQUhXLEdBQWQ7QUFLRCxDQWhDRDs7Ozs7QUNGQSxJQUFNLFdBQVc7QUFDZixPQUFLLFFBQVEsT0FBUjtBQURVLENBQWpCOztBQUlBLE9BQU8sT0FBUCxHQUFpQixRQUFqQjs7Ozs7QUNKQSxJQUFJLE1BQU0sUUFBUSxPQUFSLENBQVYiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiY29uc3QgcnVuID0gcmVxdWlyZSgnLi9hcHAvcnVuJyk7XG5jb25zdCBjb25maWcgPSByZXF1aXJlKCcuL2FwcC9jb25maWcnKTtcbmNvbnN0IGNvbnRyb2xsZXJzID0gcmVxdWlyZSgnLi9hcHAvY29udHJvbGxlcnMnKTtcbmNvbnN0IHNlcnZpY2VzID0gcmVxdWlyZSgnLi9hcHAvc2VydmljZXMnKTtcblxuLy8gQ3JlYXRlIHRoZSBhcHAgbW9kdWxlIGFuZCBuYW1lIGl0LlxuY29uc3QgYXBwID0gYW5ndWxhci5tb2R1bGUoJ21hbmFnZW1lbnRBcHAnLCBbJ25nUm91dGUnLCAnbmdBbmltYXRlJywgJ25nVG91Y2gnLCAndWkuYm9vdHN0cmFwJ10pO1xuXG4vLyBBZGQgY29udHJvbGxlcnMgZHluYW1pY2FsbHlcbmZvciAobGV0IGtleSBpbiBjb250cm9sbGVycykge1xuICBpZiAoY29udHJvbGxlcnMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgIGNvbnN0IGNvbnRyb2xsZXIgPSBjb250cm9sbGVyc1trZXldO1xuICAgIGFwcC5jb250cm9sbGVyKGtleSwgY29udHJvbGxlcik7XG4gIH1cbn1cblxuLy8gQWRkIHNlcnZpY2VzIGR5bmFtaWNhbGx5XG5mb3IgKGxldCBrZXkgaW4gc2VydmljZXMpIHtcbiAgaWYgKHNlcnZpY2VzLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICBjb25zdCBzZXJ2aWNlID0gc2VydmljZXNba2V5XTtcbiAgICBhcHAuc2VydmljZShrZXksIHNlcnZpY2UpO1xuICB9XG59XG5cbi8vIFNldCBhcHAgY29uZmlnXG5hcHAuY29uZmlnKGNvbmZpZyk7XG5cbi8vIFNldCBhcHAgcnVuIGNvbW1hbmRzXG5hcHAucnVuKHJ1bik7XG5cbmFuZ3VsYXIuZWxlbWVudChmdW5jdGlvbigpIHtcbiAgYW5ndWxhci5ib290c3RyYXAoZG9jdW1lbnQsIFsnbWFuYWdlbWVudEFwcCddKTtcbn0pO1xuIiwiY29uc3Qgcm91dGVzID0gcmVxdWlyZSgnLi9yb3V0ZXMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigkcm91dGVQcm92aWRlcikge1xuICBmb3IgKGxldCBrZXkgaW4gcm91dGVzKSB7XG4gICAgY29uc3Qgcm91dGUgPSByb3V0ZXNba2V5XTtcbiAgICAkcm91dGVQcm92aWRlci53aGVuKGtleSwgcm91dGUpO1xuICB9XG4gICRyb3V0ZVByb3ZpZGVyLm90aGVyd2lzZSgnLycpO1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xuICBkYXNoYm9hcmRDb250cm9sbGVyOiBmdW5jdGlvbiAoJHNjb3BlKSB7XG4gICAgJHNjb3BlLm1lc3NhZ2UgPSBcIkhlbGxvIVwiO1xuICB9LFxufTtcbiIsImNvbnN0IG1vZHVsZXMgPSBbXG4gIHJlcXVpcmUoJy4vZGFzaGJvYXJkJyksXG4gIHJlcXVpcmUoJy4vcHJvZHVjdHMnKSxcbiAgcmVxdWlyZSgnLi91c2VycycpLFxuXTtcblxuY29uc3QgY29udHJvbGxlcnMgPSB7fTtcblxuZm9yIChsZXQgaSA9IDA7IGkgPCBtb2R1bGVzLmxlbmd0aDsgaSsrKSB7XG4gIE9iamVjdC5hc3NpZ24oY29udHJvbGxlcnMsIG1vZHVsZXNbaV0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNvbnRyb2xsZXJzO1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gIHByb2R1Y3RzQ29udHJvbGxlcjogZnVuY3Rpb24gKCRzY29wZSwgJHEsIGFwaSkge1xuICAgIC8vIERlZmF1bHQgdmFsdWVzXG4gICAgJHNjb3BlLmFjdGlvbiA9ICdsaXN0JztcbiAgICAkc2NvcGUubG9hZGluZyA9IHRydWU7XG4gICAgJHNjb3BlLmVycm9yID0gbnVsbDtcblxuICAgIC8vIERhdGEgY29udGFpbmVyc1xuICAgICRzY29wZS5icmFuZCA9IG51bGw7XG4gICAgJHNjb3BlLmNhdGVnb3JpZXMgPSBudWxsO1xuICAgICRzY29wZS5wcm9kdWN0cyA9IG51bGw7XG5cbiAgICAvLyBTZWxlY3RlZCBwcm9kdWN0IGNvbnRhaW5lclxuICAgICRzY29wZS5jdXJyZW50UHJvZHVjdCA9IG51bGw7XG4gICAgJHNjb3BlLmN1cnJlbnRQcm9kdWN0SW5kZXggPSBudWxsO1xuXG4gICAgLy8gTG9kYSBkYXRhXG4gICAgJHNjb3BlLmxvYWREYXRhID0gKCkgPT4ge1xuICAgICAgJHEuYWxsKFtcbiAgICAgICAgLy8gTG9hZCBwcm9kdWN0c1xuICAgICAgICAkcSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgYXBpLnByb2R1Y3RzLmFsbCgpLnRoZW4oKHJlcykgPT4ge1xuICAgICAgICAgICAgJHNjb3BlLnByb2R1Y3RzID0gcmVzLmRhdGE7XG4gICAgICAgICAgICByZXNvbHZlKCdwcm9kdWN0cycpO1xuICAgICAgICAgIH0sIHJlamVjdCk7XG4gICAgICAgIH0pLFxuXG4gICAgICAgIC8vIExvYWQgYnJhbmRzXG4gICAgICAgICRxKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICBhcGkuYnJhbmRzLmFsbCgpLnRoZW4oKHJlcykgPT4ge1xuICAgICAgICAgICAgJHNjb3BlLmJyYW5kcyA9IHJlcy5kYXRhO1xuICAgICAgICAgICAgcmVzb2x2ZSgnYnJhbmRzJyk7XG4gICAgICAgICAgfSwgcmVqZWN0KTtcbiAgICAgICAgfSksXG5cbiAgICAgICAgLy8gTG9hZCBjYXRlZ29yaWVzXG4gICAgICAgICRxKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICBhcGkuY2F0ZWdvcmllcy5hbGwoKS50aGVuKChyZXMpID0+IHtcbiAgICAgICAgICAgICRzY29wZS5jYXRlZ29yaWVzID0gcmVzLmRhdGE7XG4gICAgICAgICAgICByZXNvbHZlKCdjYXRlZ29yaWVzJyk7XG4gICAgICAgICAgfSwgcmVqZWN0KTtcbiAgICAgICAgfSksXG4gICAgICBdKS50aGVuKChkYXRhKSA9PiB7XG4gICAgICAgICRzY29wZS5sb2FkaW5nID0gZmFsc2U7XG4gICAgICB9LCAoZXJyKSA9PiB7XG4gICAgICAgICRzY29wZS5wcm9kdWN0cyA9IG51bGw7XG4gICAgICAgICRzY29wZS5icmFuZHMgPSBudWxsO1xuICAgICAgICAkc2NvcGUuY2F0ZWdvcmllcyA9IG51bGw7XG4gICAgICAgICRzY29wZS5lcnJvciA9IGBFcnJvciB3aGlsZSByZXF1ZXN0aW5nICR7ZXJyLmNvbmZpZy51cmx9YDtcbiAgICAgIH0pO1xuICAgIH07XG4gICAgJHNjb3BlLmxvYWREYXRhKCk7XG5cbiAgICAvLyBpc0N1cnJlbnRBY3Rpb24gZnVuY3Rpb25cbiAgICAkc2NvcGUuaXNDdXJyZW50QWN0aW9uID0gKGFjdGlvbikgPT4ge1xuICAgICAgcmV0dXJuICRzY29wZS5hY3Rpb24gPT09IGFjdGlvbjtcbiAgICB9O1xuXG4gICAgJHNjb3BlLnNob3dMaXN0ID0gKCkgPT4ge1xuICAgICAgJHNjb3BlLmN1cnJlbnRQcm9kdWN0SW5kZXggPSBudWxsO1xuICAgICAgJHNjb3BlLmN1cnJlbnRQcm9kdWN0ID0gbnVsbDtcbiAgICAgICRzY29wZS5hY3Rpb24gPSAnbGlzdCc7XG4gICAgfVxuXG4gICAgLy8gZWRpdFByb2R1Y3RcbiAgICAkc2NvcGUuZWRpdFByb2R1Y3QgPSAoaW5kZXgpID0+IHtcbiAgICAgICRzY29wZS5jdXJyZW50UHJvZHVjdEluZGV4ID0gaW5kZXg7XG4gICAgICAkc2NvcGUuY3VycmVudFByb2R1Y3QgPSBudWxsO1xuICAgICAgJHNjb3BlLmFjdGlvbiA9ICdlZGl0JztcblxuICAgICAgJHNjb3BlLmxvYWRpbmcgPSB0cnVlO1xuICAgICAgYXBpLnByb2R1Y3RzLmZpbmQoJHNjb3BlLnByb2R1Y3RzW2luZGV4XS5pZCkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgICAgJHNjb3BlLmN1cnJlbnRQcm9kdWN0ID0gcmVzcG9uc2UuZGF0YTtcbiAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgIH0sIChlcnIpID0+IHtcbiAgICAgICAgJHNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgJHNjb3BlLmN1cnJlbnRQcm9kdWN0ID0gbnVsbDtcbiAgICAgICAgJHNjb3BlLmN1cnJlbnRQcm9kdWN0SW5kZXggPSBudWxsO1xuICAgICAgICAkc2NvcGUuZXJyb3IgPSBlcnIubWVzc2FnZTtcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICAvLyBzYXZlUHJvZHVjdFxuICAgICRzY29wZS5zYXZlUHJvZHVjdCA9ICgpID0+IHtcbiAgICAgIGNvbnN0IHByb2R1Y3QgPSB7XG4gICAgICAgIG5hbWU6ICRzY29wZS5jdXJyZW50UHJvZHVjdC5uYW1lLFxuICAgICAgICBkZXNjcmlwdGlvbjogJHNjb3BlLmN1cnJlbnRQcm9kdWN0LmRlc2NyaXB0aW9uLFxuICAgICAgICBicmFuZElkOiAkc2NvcGUuY3VycmVudFByb2R1Y3QuYnJhbmQuaWQsXG4gICAgICAgIGNhdGVnb3J5SWQ6ICRzY29wZS5jdXJyZW50UHJvZHVjdC5jYXRlZ29yeS5pZCxcbiAgICAgIH07XG5cbiAgICAgIGlmICgkc2NvcGUuYWN0aW9uID09ICdlZGl0Jykge1xuICAgICAgICBhcGkucHJvZHVjdHMudXBkYXRlKCRzY29wZS5jdXJyZW50UHJvZHVjdC5pZCwgcHJvZHVjdCkudGhlbigocmVzKSA9PiB7XG4gICAgICAgICAgJHNjb3BlLnByb2R1Y3RzWyRzY29wZS5jdXJyZW50UHJvZHVjdEluZGV4XSA9IHJlcy5kYXRhO1xuICAgICAgICAgICRzY29wZS5zaG93TGlzdCgpO1xuICAgICAgICB9LCAoZXJyKSA9PiB7XG4gICAgICAgICAgJHNjb3BlLmVycm9yID0gZXJyLm1lc3NhZ2U7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYXBpLnByb2R1Y3RzLnVwZGF0ZShwcm9kdWN0KTtcbiAgICAgIH1cbiAgICB9XG4gIH0sXG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gIGxvZ2luQ29udHJvbGxlcjogZnVuY3Rpb24oJHJvb3RTY29wZSwgJHNjb3BlLCAkaHR0cCwgJGxvY2F0aW9uKSB7XG4gICAgJHNjb3BlLmF1dGhlbnRpY2F0ZSA9IGZ1bmN0aW9uKCRldmVudCkge1xuICAgICAgJGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgIGNvbnN0IGF1dGhlbnRpY2F0aW9uRGF0YSA9ICRzY29wZS5hdXRoRm9ybS5lbWFpbCArICc6JyArICRzY29wZS5hdXRoRm9ybS5wYXNzd29yZDtcbiAgICAgICRodHRwLmdldCgnaHR0cDovL2xvY2FsaG9zdDo4MDgwL2F1dGgnLCB7XG4gICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICBBdXRob3JpemF0aW9uOiAnQmFzaWMgJyArIGJ0b2EoYXV0aGVudGljYXRpb25EYXRhKSxcbiAgICAgICAgfSxcbiAgICAgIH0pLnRoZW4oZnVuY3Rpb24ocmVzKSB7XG4gICAgICAgIGlmIChyZXMuZGF0YS50b2tlbikge1xuICAgICAgICAgICRyb290U2NvcGUuYXV0aFRva2VuID0gcmVzLmRhdGEudG9rZW47XG4gICAgICAgICAgd2luZG93LmxvY2FsU3RvcmFnZS5zZXRJdGVtKCdhdXRoVG9rZW4nLCAkcm9vdFNjb3BlLmF1dGhUb2tlbik7XG5cbiAgICAgICAgICAkaHR0cC5nZXQoJ2h0dHA6Ly9sb2NhbGhvc3Q6ODA4MC91c2Vycy9tZScsIHtcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgQXV0aG9yaXphdGlvbjogJ0JlYXJlciAnICsgJHJvb3RTY29wZS5hdXRoVG9rZW4sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0pLnRoZW4oZnVuY3Rpb24ocmVzKSB7XG4gICAgICAgICAgICBpZiAocmVzLmRhdGEpIHtcbiAgICAgICAgICAgICAgJHJvb3RTY29wZS51c2VyID0gcmVzLmRhdGE7XG4gICAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSwgZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgICAgICAkc2NvcGUuZXJyb3IgPSAnU29tZSBwcm9ibGVtIGhhcyBiZWVuIG9jdXJyZWQnO1xuICAgICAgICAgICAgJHNjb3BlLmF1dGhGb3JtLiRzZXRQcmlzdGluZSgpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICRzY29wZS5lcnJvciA9ICdVc2VybmFtZSBvciBwYXNzd29yZCB3YXMgd3JvbmcnO1xuICAgICAgICAgICRzY29wZS5hdXRoRm9ybS4kc2V0UHJpc3RpbmUoKTtcbiAgICAgICAgfVxuICAgICAgfSwgZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgICRzY29wZS5lcnJvciA9ICdVc2VybmFtZSBvciBwYXNzd29yZCB3YXMgd3JvbmcnO1xuICAgICAgICAkc2NvcGUuYXV0aEZvcm0uJHNldFByaXN0aW5lKCk7XG4gICAgICB9KTtcbiAgICB9O1xuICB9LFxufTtcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xuICAvKioqKioqKioqKioqKioqL1xuICAvKiogRGFzaGJvYXJkICoqL1xuICAvKioqKioqKioqKioqKioqL1xuICAnLyc6IHtcbiAgICB0ZW1wbGF0ZVVybDogJ3N0YXRpYy92aWV3cy9ob21lL2Rhc2hib2FyZC5odG1sJyxcbiAgICBjb250cm9sbGVyOiAnZGFzaGJvYXJkQ29udHJvbGxlcicsXG4gIH0sXG5cbiAgLyoqKioqKioqKioqKioqL1xuICAvKiogUHJvZHVjdHMgKiovXG4gIC8qKioqKioqKioqKioqKi9cbiAgJy9wcm9kdWN0cyc6IHtcbiAgICB0ZW1wbGF0ZVVybDogJ3N0YXRpYy92aWV3cy9wcm9kdWN0cy9pbmRleC5odG1sJyxcbiAgICBjb250cm9sbGVyOiAncHJvZHVjdHNDb250cm9sbGVyJyxcbiAgfSxcblxuICAvKioqKioqKioqKi9cbiAgLyoqIEF1dGggKiovXG4gIC8qKioqKioqKioqL1xuICAnL2xvZ2luJzoge1xuICAgIHRlbXBsYXRlVXJsOiAnc3RhdGljL3ZpZXdzL2hvbWUvbG9naW4uaHRtbCcsXG4gICAgY29udHJvbGxlcjogJ2xvZ2luQ29udHJvbGxlcicsXG4gIH0sXG4gICcvbG9nb3V0Jzoge1xuICAgIHRlbXBsYXRlOiAnJyxcbiAgICBjb250cm9sbGVyOiBmdW5jdGlvbigkcm9vdFNjb3BlLCAkd2luZG93KSB7XG4gICAgICAkd2luZG93LmxvY2FsU3RvcmFnZS5zZXRJdGVtKCdhdXRoVG9rZW4nLCAnJyk7XG4gICAgICAkd2luZG93LmxvY2FsU3RvcmFnZS5zZXRJdGVtKCd1c2VyJywgJycpO1xuICAgICAgJHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKTtcbiAgICB9LFxuICB9LFxufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oJHJvb3RTY29wZSwgJGxvY2F0aW9uLCAkcm91dGUsICRodHRwKSB7XG4gICRyb290U2NvcGUuYXV0aFRva2VuID0gd2luZG93LmxvY2FsU3RvcmFnZS5nZXRJdGVtKCdhdXRoVG9rZW4nKTtcbiAgJHJvb3RTY29wZS5sb2FkaW5nID0gZmFsc2U7XG5cbiAgaWYgKCRyb290U2NvcGUuYXV0aFRva2VuKSB7XG4gICAgJHJvb3RTY29wZS5sb2FkaW5nID0gdHJ1ZTtcbiAgICAkaHR0cC5nZXQoJ2h0dHA6Ly9sb2NhbGhvc3Q6ODA4MC91c2Vycy9tZScsIHtcbiAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgQXV0aG9yaXphdGlvbjogJ0JlYXJlciAnICsgJHJvb3RTY29wZS5hdXRoVG9rZW4sXG4gICAgICB9LFxuICAgIH0pLnRoZW4oZnVuY3Rpb24ocmVzKSB7XG4gICAgICAkcm9vdFNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgIGlmIChyZXMuZGF0YSkge1xuICAgICAgICAkcm9vdFNjb3BlLnVzZXIgPSByZXMuZGF0YTtcbiAgICAgICAgJGxvY2F0aW9uLnBhdGgoJHJvb3RTY29wZS5nb0FmdGVyTG9naW4gfHwgJy8nKTtcbiAgICAgIH1cbiAgICB9LCBmdW5jdGlvbihlcnIpIHtcbiAgICAgICRyb290U2NvcGUubG9hZGluZyA9IGZhbHNlO1xuICAgICAgJGxvY2F0aW9uLnBhdGgoJy9sb2dpbicpO1xuICAgIH0pO1xuICB9XG5cbiAgJHJvb3RTY29wZS5pc0F1dGggPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gISEkcm9vdFNjb3BlLnVzZXI7XG4gIH07XG5cbiAgJHJvb3RTY29wZS4kb24oJyRyb3V0ZUNoYW5nZVN0YXJ0JywgZnVuY3Rpb24obmV4dCwgY3VycmVudCkge1xuICAgIGlmICggISAkcm9vdFNjb3BlLnVzZXIgJiYgJGxvY2F0aW9uLnBhdGgoKSAhPT0gJy9sb2dpbicpIHtcbiAgICAgICRyb290U2NvcGUuZ29BZnRlckxvZ2luID0gJGxvY2F0aW9uLnBhdGgoKTtcbiAgICAgICRsb2NhdGlvbi5wYXRoKCcvbG9naW4nKTtcbiAgICB9XG4gIH0pO1xuXG4gICRyb290U2NvcGUuJG9uKCckcm91dGVDaGFuZ2VTdWNjZXNzJywgZnVuY3Rpb24obmV4dCwgZGF0YSkge1xuICAgICRyb290U2NvcGUuY29udHJvbGxlciA9IGRhdGEuY29udHJvbGxlcjtcbiAgfSk7XG5cbiAgJGh0dHAuZGVmYXVsdHMuaGVhZGVycy5jb21tb24uQXV0aG9yaXphdGlvbiA9ICdCZWFyZXIgJyArICRyb290U2NvcGUuYXV0aFRva2VuO1xufTtcbiIsImNvbnN0IGFwaUFkZHJlc3MgPSAnaHR0cDovL2xvY2FsaG9zdDo4MDgwJztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigkcm9vdFNjb3BlLCAkaHR0cCkge1xuICBjb25zdCBvcHRpb25zID0ge1xuICAgIGhlYWRlcnM6IHtcbiAgICAgIEF1dGhvcml6YXRpb246ICdCZWFyZXIgJyArICRyb290U2NvcGUuYXV0aFRva2VuLFxuICAgIH0sXG4gIH07XG5cbiAgdGhpcy5wcm9kdWN0cyA9IHtcbiAgICBhbGw6ICgpID0+IHtcbiAgICAgIHJldHVybiAkaHR0cC5nZXQoYXBpQWRkcmVzcyArICcvcHJvZHVjdHMnLCBvcHRpb25zKTtcbiAgICB9LFxuICAgIGZpbmQ6IChpZCkgPT4ge1xuICAgICAgcmV0dXJuICRodHRwLmdldChhcGlBZGRyZXNzICsgJy9wcm9kdWN0cy8nICsgaWQsIG9wdGlvbnMpO1xuICAgIH0sXG4gICAgdXBkYXRlOiAoaWQsIHByb2R1Y3QpID0+IHtcbiAgICAgIHJldHVybiAkaHR0cC5wdXQoYXBpQWRkcmVzcyArICcvcHJvZHVjdHMvJyArIGlkLCBwcm9kdWN0LCBvcHRpb25zKTtcbiAgICB9XG4gIH07XG5cbiAgdGhpcy5jYXRlZ29yaWVzID0ge1xuICAgIGFsbDogKCkgPT4ge1xuICAgICAgcmV0dXJuICRodHRwLmdldChhcGlBZGRyZXNzICsgJy9jYXRlZ29yaWVzJywgb3B0aW9ucyk7XG4gICAgfSxcbiAgICBjcmVhdGU6ICgpID0+IHtcbiAgICB9XG4gIH07XG5cbiAgdGhpcy5icmFuZHMgPSB7XG4gICAgYWxsOiAoKSA9PiB7XG4gICAgICByZXR1cm4gJGh0dHAuZ2V0KGFwaUFkZHJlc3MgKyAnL2JyYW5kcycsIG9wdGlvbnMpO1xuICAgIH1cbiAgfVxufTtcbiIsImNvbnN0IHNlcnZpY2VzID0ge1xuICBhcGk6IHJlcXVpcmUoJy4vYXBpJyksXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHNlcnZpY2VzO1xuIiwidmFyIGFwcCA9IHJlcXVpcmUoJy4vYXBwJyk7XG4iXX0=
