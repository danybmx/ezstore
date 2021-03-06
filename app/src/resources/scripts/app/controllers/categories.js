module.exports = {
  categoriesController: function($scope, $q, api) {
    // Default values
    $scope.action = 'list';
    $scope.loading = true;
    $scope.error = null;
    $scope.forms = {};

    // Data containers
    $scope.categories = null;

    // Selected category container
    $scope.currentCategory = null;
    $scope.currentCategoryIndex = null;

    // Loda data
    $scope.loadData = () => {
      // Load categories
      api.categories.all().then((res) => {
        $scope.loading = false;
        $scope.categories = res.data;
      }, (err) => {
        $scope.categories = null;
        $scope.error = `Error while requesting ${err.config.url}`;
      });
    };
    $scope.loadData();

    // isCurrentAction function
    $scope.isCurrentAction = (action) => {
      return $scope.action === action;
    };

    $scope.showList = () => {
      $scope.currentCategoryIndex = null;
      $scope.currentCategory = null;
      $scope.action = 'list';
    };

    $scope.createCategory = () => {
      $scope.action = 'create';
      $scope.currentCategory = {
        visible: true,
      };
    };

    // edit
    $scope.editCategory = (index) => {
      $scope.currentCategoryIndex = index;
      $scope.currentCategory = null;
      $scope.action = 'edit';

      $scope.loading = true;
      api.categories.find($scope.categories[index].id).then((response) => {
        $scope.currentCategory = response.data;
        $scope.loading = false;
      }, (err) => {
        $scope.loading = false;
        $scope.currentCategory = null;
        $scope.currentCategoryIndex = null;
        $scope.error = err.data.message;
      });
    };

    // save
    $scope.saveCategory = () => {
      const category = {
        name: $scope.currentCategory.name,
        url: $scope.currentCategory.url,
        visible: $scope.currentCategory.visible,
      };

      let defer;
      if ($scope.action === 'edit') {
        defer = api.categories.update($scope.currentCategory.id, category);
      } else {
        defer = api.categories.create(category);
      }

      defer.then((res) => {
        if ($scope.action === 'edit') {
          $scope.categories[$scope.currentCategoryIndex] = res.data;
        } else {
          $scope.categories.push(res.data);
        }
        $scope.showList();
      }, (err) => {
        $scope.error = err.data.message;
      });
    };

    // deleteProduct
    $scope.deleteCategory = (index) => {
      if (confirm('Are you sure?')) {
        $scope.loading = true;
        api.categories.delete($scope.categories[index].id).then((res) => {
          $scope.categories.splice(index, 1);
          $scope.loading = false;
        }, (err) => {
          $scope.error = err.data.message;
        });
      };
    };
  },
};
