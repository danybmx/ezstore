module.exports = {
  productsController: function ($scope, $q, api) {
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
    $scope.loadData = () => {
      $q.all([
        // Load products
        $q((resolve, reject) => {
          api.products.all().then((res) => {
            $scope.products = res.data;
            resolve('products');
          }, reject);
        }),

        // Load brands
        $q((resolve, reject) => {
          api.brands.all().then((res) => {
            $scope.brands = res.data;
            resolve('brands');
          }, reject);
        }),

        // Load categories
        $q((resolve, reject) => {
          api.categories.all().then((res) => {
            $scope.categories = res.data;
            resolve('categories');
          }, reject);
        }),
      ]).then((data) => {
        $scope.loading = false;
      }, (err) => {
        $scope.products = null;
        $scope.brands = null;
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
      $scope.currentProductIndex = null;
      $scope.currentProduct = null;
      $scope.action = 'list';
    }

    // editProduct
    $scope.editProduct = (index) => {
      $scope.currentProductIndex = index;
      $scope.currentProduct = null;
      $scope.action = 'edit';

      $scope.loading = true;
      api.products.find($scope.products[index].id).then((response) => {
        $scope.currentProduct = response.data;
        $scope.loading = false;
      }, (err) => {
        $scope.loading = false;
        $scope.currentProduct = null;
        $scope.currentProductIndex = null;
        $scope.error = err.message;
      });
    };

    // saveProduct
    $scope.saveProduct = () => {
      const product = {
        name: $scope.currentProduct.name,
        description: $scope.currentProduct.description,
        brandId: $scope.currentProduct.brand.id,
        categoryId: $scope.currentProduct.category.id,
      };

      if ($scope.action == 'edit') {
        api.products.update($scope.currentProduct.id, product).then((res) => {
          $scope.products[$scope.currentProductIndex] = res.data;
          $scope.showList();
        }, (err) => {
          $scope.error = err.message;
        });
      } else {
        api.products.update(product);
      }
    }
  },
};
