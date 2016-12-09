module.exports = {
  usersController: function($scope, $q, api) {
    // Default values
    $scope.action = 'list';
    $scope.loading = true;
    $scope.error = null;
    $scope.forms = {};

    // Data containers
    $scope.users = null;

    // Selected user container
    $scope.currentUser = null;
    $scope.currentUserIndex = null;

    // handleError
    const handleError = (err) => {
      if (err.data.reasons) {
        $scope.error = err.data.reasons;
      } else {
        $scope.error = err.data.message;
      }

      throw new Error(err.data.message);
    };

    // Loda data
    $scope.loadData = () => {
      // Load users
      api.users.all().then((res) => {
        $scope.loading = false;
        $scope.users = res.data;
      }, (err) => {
        $scope.users = null;
        handleError(err);
      });
    };
    $scope.loadData();

    // isCurrentAction function
    $scope.isCurrentAction = (action) => {
      return $scope.action === action;
    };

    $scope.showList = () => {
      $scope.currentUserIndex = null;
      $scope.currentUser = null;
      $scope.action = 'list';
    };

    $scope.createUser = () => {
      $scope.action = 'create';
      $scope.currentUser = {
        address: {},
      };
    };

    // edit
    $scope.editUser = (index) => {
      $scope.currentUserIndex = index;
      $scope.currentUser = null;
      $scope.action = 'edit';

      $scope.loading = true;
      api.users.find($scope.users[index].id).then((response) => {
        $scope.currentUser = response.data;

        if ($scope.currentUser.address === null) {
          $scope.currentUser.address = {};
        }

        $scope.loading = false;
      }, (err) => {
        $scope.loading = false;
        $scope.currentUser = null;
        $scope.currentUserIndex = null;
        handleError(err);
      });
    };

    // save
    $scope.saveUser = () => {
      const user = {
        email: '',
        password: '',
      };

      let defer;
      if ($scope.action === 'edit') {
        defer = api.users.update($scope.currentUser.id, user);
      } else {
        defer = api.users.create(user);
      }

      defer.then((res) => {
        if ($scope.action === 'edit') {
          $scope.users[$scope.currentUserIndex] = res.data;
        } else {
          $scope.users.push(res.data);
        }
        $scope.showList();
      }, (err) => {
        $scope.forms.userForm.$submitted = false;
        handleError(err);
      });
    };

    // deleteProduct
    $scope.deleteUser = (index) => {
      if (confirm('Are you sure?')) {
        $scope.loading = true;
        api.users.delete($scope.users[index].id).then((res) => {
          $scope.users.splice(index, 1);
          $scope.loading = false;
        }, (err) => {
          handleError(err);
        });
      };
    };
  },
};
