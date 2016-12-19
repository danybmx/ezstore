module.exports = {
  loginController: function($rootScope, $scope, $http, $location) {
    $scope.authenticate = function($event) {
      $event.preventDefault();

      const email = $scope.authForm.email;
      const password = $scope.authForm.password;
      const authenticationData = email + ':' + password;

      $http.get('http://ezstore.dpstudios.es:8080/auth', {
        headers: {
          Authorization: 'Basic ' + btoa(authenticationData),
        },
      }).then(function(res) {
        if (res.data.token) {
          $rootScope.authToken = res.data.token;
          window.localStorage.setItem('authToken', $rootScope.authToken);

          $http.get('http://ezstore.dpstudios.es:8080/users/me', {
            headers: {
              Authorization: 'Bearer ' + $rootScope.authToken,
            },
          }).then(function(res) {
            if (res.data) {
              $rootScope.user = res.data;
              $location.path('/');
            }
          }, function(err) {
            $scope.error = 'Some problem has been ocurred';
            $scope.authForm.$setPristine();
          });
        } else {
          $scope.error = 'Username or password was wrong';
          $scope.authForm.$setPristine();
        }
      }, function(err) {
        $scope.error = 'Username or password was wrong';
        $scope.authForm.$setPristine();
      });
    };
  },
};
