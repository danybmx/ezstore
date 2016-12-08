module.exports = {
  /**
   * Dashboard
   */
  '/': {
    templateUrl: 'static/views/home/dashboard.html',
    controller: 'dashboardController',
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
