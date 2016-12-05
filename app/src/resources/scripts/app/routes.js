module.exports = {
  /***************/
  /** Dashboard **/
  /***************/
  '/': {
    templateUrl: 'static/views/home/dashboard.html',
    controller: 'dashboardController',
  },

  /**************/
  /** Products **/
  /**************/
  '/products': {
    templateUrl: 'static/views/products/index.html',
    controller: 'productsController',
  },

  /**********/
  /** Auth **/
  /**********/
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
