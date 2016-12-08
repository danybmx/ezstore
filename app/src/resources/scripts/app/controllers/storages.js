module.exports = {
  storagesController: function($scope, $q, api) {
    // Default values
    $scope.action = 'list';
    $scope.loading = true;
    $scope.error = null;
    $scope.forms = {};

    // Data containers
    $scope.storages = null;

    // Selected storage container
    $scope.currentStorage = null;
    $scope.currentStorageIndex = null;

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
      // Load storages
      api.storages.all().then((res) => {
        $scope.loading = false;
        $scope.storages = res.data;
      }, (err) => {
        $scope.storages = null;
        handleError(err);
      });
    };
    $scope.loadData();

    // isCurrentAction function
    $scope.isCurrentAction = (action) => {
      return $scope.action === action;
    };

    $scope.showList = () => {
      $scope.currentStorageIndex = null;
      $scope.currentStorage = null;
      $scope.action = 'list';
    };

    $scope.createStorage = () => {
      $scope.action = 'create';
      $scope.currentStorage = {
        address: {},
      };
    };

    // edit
    $scope.editStorage = (index) => {
      $scope.currentStorageIndex = index;
      $scope.currentStorage = null;
      $scope.action = 'edit';

      $scope.loading = true;
      api.storages.find($scope.storages[index].id).then((response) => {
        $scope.currentStorage = response.data;

        if ($scope.currentStorage.address === null) {
          $scope.currentStorage.address = {};
        }

        $scope.loading = false;
      }, (err) => {
        $scope.loading = false;
        $scope.currentStorage = null;
        $scope.currentStorageIndex = null;
        handleError(err);
      });
    };

    // save
    $scope.saveStorage = () => {
      const storage = {
        name: $scope.currentStorage.name,
        phone: $scope.currentStorage.phone,
        address: $scope.currentStorage.address,
      };

      let defer;
      if ($scope.action === 'edit') {
        defer = api.storages.update($scope.currentStorage.id, storage);
      } else {
        defer = api.storages.create(storage);
      }

      defer.then((res) => {
        if ($scope.action === 'edit') {
          $scope.storages[$scope.currentStorageIndex] = res.data;
        } else {
          $scope.storages.push(res.data);
        }
        $scope.showList();
      }, (err) => {
        $scope.forms.storageForm.$submitted = false;
        handleError(err);
      });
    };

    // deleteProduct
    $scope.deleteStorage = (index) => {
      if (confirm('Are you sure?')) {
        $scope.loading = true;
        api.storages.delete($scope.storages[index].id).then((res) => {
          $scope.storages.splice(index, 1);
          $scope.loading = false;
        }, (err) => {
          handleError(err);
        });
      };
    };
  },
};
