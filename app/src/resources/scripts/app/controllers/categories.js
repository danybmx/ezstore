module.exports = {
    categoriesController: function ($scope, $q, api) {
        // Default values
        $scope.action = 'list';
        $scope.loading = true;
        $scope.error = null;

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
            $scope.currentCategroyIndex = null;
            $scope.currentCategory = null;
            $scope.action = 'list';
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
                $scope.error = err.message;
            });
        };

        // save
        $scope.saveCategory = () => {
            const category = {
                name: $scope.currentCategory.name,
                description: $scope.currentCategory.description,
            };

            if ($scope.action == 'edit') {
                api.categories.update($scope.currentCategory.id, category).then((res) => {
                    $scope.categories[$scope.currentCategoryIndex] = res.data;
                    $scope.showList();
                }, (err) => {
                    $scope.error = err.message;
                });
            } else {
                api.categories.update(product);
            }
        }
    },
};
