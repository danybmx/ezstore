module.exports = {
  brandsController: function($scope, $q, api) {
    // Default values
    $scope.action = 'list';
    $scope.loading = true;
    $scope.error = null;
    $scope.forms = {};

    // Data containers
    $scope.brands = null;

    // Selected brand container
    $scope.currentBrand = null;
    $scope.currentBrandIndex = null;

    // Loda data
    $scope.loadData = () => {
      // Load brands
      api.brands.all().then((res) => {
        $scope.loading = false;
        $scope.brands = res.data;
      }, (err) => {
        $scope.brands = null;
        $scope.error = `Error while requesting ${err.config.url}`;
      });
    };
    $scope.loadData();

    // isCurrentAction function
    $scope.isCurrentAction = (action) => {
      return $scope.action === action;
    };

    $scope.showList = () => {
      $scope.currentBrandIndex = null;
      $scope.currentBrand = null;
      $scope.action = 'list';
    };

    $scope.createBrand = () => {
      $scope.action = 'create';
      $scope.currentBrand = {
        visible: true,
      };
    };

    // edit
    $scope.editBrand = (index) => {
      $scope.currentBrandIndex = index;
      $scope.currentBrand = null;
      $scope.action = 'edit';

      $scope.loading = true;
      api.brands.find($scope.brands[index].id).then((response) => {
        $scope.currentBrand = response.data;
        $scope.loading = false;
      }, (err) => {
        $scope.loading = false;
        $scope.currentBrand = null;
        $scope.currentBrandIndex = null;
        $scope.error = err.data.message;
      });
    };

    // save
    $scope.saveBrand = () => {
      const brand = {
        name: $scope.currentBrand.name,
        url: $scope.currentBrand.url,
        visible: $scope.currentBrand.visible,
      };

      let defer;
      if ($scope.action === 'edit') {
        defer = api.brands.update($scope.currentBrand.id, brand);
      } else {
        defer = api.brands.create(brand);
      }

      defer.then((res) => {
        if ($scope.action === 'edit') {
          $scope.brands[$scope.currentBrandIndex] = res.data;
        } else {
          $scope.brands.push(res.data);
        }
        $scope.showList();
      }, (err) => {
        $scope.error = err.data.message;
      });
    };

    // deleteProduct
    $scope.deleteBrand = (index) => {
      if (confirm('Are you sure?')) {
        $scope.loading = true;
        api.brands.delete($scope.brands[index].id).then((res) => {
          $scope.brands.splice(index, 1);
          $scope.loading = false;
        }, (err) => {
          $scope.error = err.data.message;
        });
      };
    };
  },
};
