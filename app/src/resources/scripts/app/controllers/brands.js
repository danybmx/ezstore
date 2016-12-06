module.exports = {
    brandsController: function ($scope, $q, api) {
        // Default values
        $scope.action = 'list';
        $scope.loading = true;
        $scope.error = null;

        // Data containers
        $scope.brands = null;

        // Selected category container
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
            $scope.currentCategroyIndex = null;
            $scope.currentBrand = null;
            $scope.action = 'list';
        };

        // edit
        $scope.editCategory = (index) => {
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
                $scope.error = err.message;
            });
        };

        // save
        $scope.saveCategory = () => {
            const category = {
                name: $scope.currentBrand.name,
                description: $scope.currentBrand.description,
            };

            if ($scope.action == 'edit') {
                api.brands.update($scope.currentBrand.id, category).then((res) => {
                    $scope.brands[$scope.currentBrandIndex] = res.data;
                    $scope.showList();
                }, (err) => {
                    $scope.error = err.message;
                });
            } else {
                api.brands.update(product);
            }
        }
    },
};
