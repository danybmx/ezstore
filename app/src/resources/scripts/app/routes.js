module.exports = {
  /**
   * Dashboard
   */
  '/': {
    // templateUrl: 'static/views/home/dashboard.html',
    // controller: 'dashboardController',
    templateUrl: 'static/views/orders/index.html',
    controller: 'ordersController',
  },

  /**
   * Products
   */
  '/products': {
    templateUrl: 'static/views/products/index.html',
    controller: 'productsController',
  },

  /**
   * Categories
   */
  '/categories': {
    templateUrl: 'static/views/categories/index.html',
    controller: 'categoriesController',
  },

  /**
   * Brands
   */
  '/brands': {
    templateUrl: 'static/views/brands/index.html',
    controller: 'brandsController',
  },

  /**
   * Storages
   */
  '/storages': {
    templateUrl: 'static/views/storages/index.html',
    controller: 'storagesController',
  },

  /**
   * Users
   */
  '/users': {
    templateUrl: 'static/views/users/index.html',
    controller: 'usersController',
  },

  /**
   * Orders
   */
  '/orders': {
    templateUrl: 'static/views/orders/index.html',
    controller: 'ordersController',
  },

  /**
   * Auth
   */
  '/login': {
    templateUrl: 'static/views/home/login.html',
    controller: 'loginController',
  },
  '/logout': {
    template: '',
    controller: function($rootScope, $window) {
      $window.localStorage.setItem('authToken', '');
      $window.localStorage.setItem('user', '');
      $window.location.reload();
    },
  },
};
