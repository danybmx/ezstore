module.exports = {
  productsController: function($scope, Upload, $q, api) {
    // Default values
    $scope.action = 'list';
    $scope.loading = true;
    $scope.error = null;
    $scope.forms = {};
    $scope.uploading = false;

    // Data containers
    $scope.brand = null;
    $scope.categories = null;
    $scope.storages = null;
    $scope.products = null;

    // Selected product container
    $scope.optionsToBeDeleted = [];
    $scope.imagesToBeDeleted = [];
    $scope.currentProduct = null;
    $scope.currentProductIndex = null;

    // Stock container
    $scope.currentStock = null;
    $scope.currentOption = null;
    $scope.savingStock = false;

    // Uploader
    $scope.imageUpload = null;
    $scope.imageUploadErrFile = null;

    // handleError
    const handleError = (err) => {
      if (err.data.reasons) {
        $scope.error = err.data.reasons;
      } else {
        $scope.error = err.data.message;
      }

      throw new Error(err.data.message);
    };

    // Load data
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

        // Load storages
        $q((resolve, reject) => {
          api.storages.all().then((res) => {
            $scope.storages = res.data;
            resolve('storages');
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
      $scope.error = null;
      $scope.action = 'list';
    };

    // editProduct
    $scope.editProduct = (index) => {
      $scope.currentProductIndex = index;
      $scope.currentProduct = null;
      $scope.action = 'edit';

      $scope.loading = true;
      api.products.find($scope.products[index].id).then((response) => {
        $scope.currentProduct = response.data;
        $scope.currentProduct.images.map((image) => {
          image.options = {};

          $scope.currentProduct.options.forEach((opt, index) => {
            opt.images.forEach((im) => {
              if (im.id === image.id) {
                image.options[index] = true;
              }
            });
          });
          return image;
        });
        $scope.loading = false;
      }, (err) => {
        $scope.loading = false;
        $scope.currentProduct = null;
        $scope.currentProductIndex = null;
        $scope.error = err.data.message;
      });
    };

    // createProduct
    $scope.createProduct = () => {
      $scope.currentProductIndex = null;
      $scope.currentProduct = {
        options: [],
        images: [],
        brand: null,
        category: null,
      };
      $scope.action = 'create';
    };

    // saveProduct
    $scope.saveProduct = () => {
      const product = {
        name: $scope.currentProduct.name,
        description: $scope.currentProduct.description,
        brandId: $scope.currentProduct.brand.id,
        categoryId: $scope.currentProduct.category.id,
      };

      let productDefer;
      const imagesDefers = [];
      const optionsDefers = [];

      if ($scope.action === 'edit') {
        productDefer = api.products.update($scope.currentProduct.id, product);
      } else {
        productDefer = api.products.create(product);
      }

      // Product was saved
      productDefer.then((res) => {
        const pId = res.data.id;

        $scope.currentProduct.options.map((opt) => {
          opt.imagesIds = [];
          return opt;
        });

        $scope.imagesToBeDeleted.forEach((iId) => {
          imagesDefers.push(
            api.products.images.delete($scope.currentProduct.id, iId)
          );
        });
        $scope.imagesToBeDeleted = [];

        $scope.currentProduct.images.map((image) => {
          const defered = $q.defer();
          imagesDefers.push(defered.promise);

          if (image.id) {
            for (const key in image.options) {
              if (image.options.hasOwnProperty(key)) {
                if (image.options[key] === true) {
                  $scope.currentProduct.options[key].imagesIds.push(image.id);
                }
              }
            }
            defered.resolve();
          } else {
            api.products.images.create(pId, {
              file: image.file,
            }).then((res) => {
              for (const key in image.options) {
                if (image.options.hasOwnProperty(key)) {
                  if (image.options[key] === true) {
                    $scope.currentProduct.options[key].imagesIds
                      .push(res.data.id);
                  }
                }
              }
              defered.resolve();
            }, defered.reject);
          }
        });

        // All images was saved
        $q.all(imagesDefers).then(() => {
          $scope.currentProduct.options.map((option) => {
            const optionMessage = {
              name: option.name,
              ean: option.ean,
              price: option.price,
              discount: option.discount,
              reference: option.reference,
              imagesIds: option.imagesIds,
            };

            if (option.id) {
              optionsDefers.push(
                api.products.options.update(pId, option.id, optionMessage)
              );
            } else {
              optionsDefers.push(
                api.products.options.create(pId, optionMessage)
              );
            }
          });

          $scope.optionsToBeDeleted.forEach((oId) => {
            optionsDefers.push(
              api.products.options.delete($scope.currentProduct.id, oId)
            );
          });
          $scope.optionsToBeDeleted = [];

          // Options was saved
          $q.all(optionsDefers).then(() => {
            api.products.find(pId).then((res) => {
              if ($scope.action === 'edit') {
                $scope.products[$scope.currentProductIndex] = res.data;
              } else {
                $scope.products.push(res.data);
              }

              $scope.showList();
            }, (err) => { // Error when find a product
              $scope.forms.productForm.$submitted = false;
              handleError(err);
            });
          }, (err) => { // Error when saving options
            $scope.forms.productForm.$submitted = false;
            handleError(err);
          });
        }, (err) => { // Error when saving images
          $scope.forms.productForm.$submitted = false;
          handleError(err);
        });
      }, (err) => { // Error when saving product
        $scope.forms.productForm.$submitted = false;
        handleError(err);
      });
    };

    // deleteProduct
    $scope.deleteProduct = (index) => {
      if (confirm('Are you sure?')) {
        $scope.loading = true;
        api.products.delete($scope.products[index].id).then((res) => {
          $scope.products.splice(index, 1);
          $scope.loading = false;
        }, (err) => {
          $scope.error = err.data.message;
        });
      };
    };

    // addOption
    $scope.addOption = () => {
      $scope.currentProduct.options.push({images: []});
    };

    // deleteOption
    $scope.deleteOption = ($index) => {
      if (confirm('Are you sure?')) {
        const option = $scope.currentProduct.options[$index];
        $scope.currentProduct.images.map((image) => {
          let newOptions = {};
          for (const key in image.options) {
            if (image.options.hasOwnProperty(key)) {
              if (parseInt(key) !== $index) {
                if (parseInt(key) > $index) {
                  newOptions[key-1] = image.options[key];
                } else {
                  newOptions[key] = image.options[key];
                }
              }
            }
          }
          image.options = newOptions;
          return image;
        });

        $scope.currentProduct.options.splice($index, 1);

        if (option.id) {
          $scope.optionsToBeDeleted.push(option.id);
        }
      }
    };

    // deleteImage
    $scope.deleteImage = ($index) => {
      if (confirm('Are you sure?')) {
        const image = $scope.currentProduct.images[$index];
        $scope.currentProduct.images.splice($index, 1);

        if (image.id) {
          $scope.imagesToBeDeleted.push(image.id);
        }
        console.log($scope.imagesToBeDeleted);
      };
    };

    // uploadFile
    $scope.uploadFile = (file, errFiles) => {
      $scope.imageUpload = file;
      $scope.imageUploadErrFile = errFiles && errFiles[0];

      if (file) {
        $scope.uploading = true;
        file.upload = api.products.images.upload(file);
        file.upload.then((res) => {
          $scope.currentProduct.images.push({
            file: res.data.file,
            name: '',
            option: null,
          });
          $scope.uploading = false;
        }, (err) => {
          handleError(err);
        }, (evt) => {
          file.progress = Math.min(100, parseInt(100 * evt.loaded / evt.total));
        });
      }
    };

    // manageStock
    $scope.manageStock = ($index) => {
      $scope.currentProduct = $scope.products[$index];
      $scope.currentProductIndex = $index;
      $scope.action = 'stock';
    };

    // getStock
    $scope.getStock = (option, storage) => {
      for (let i = 0; i < option.stock.length; i++) {
        const stock = option.stock[i];
        if (stock.storage.id === storage.id) {
          return stock;
        }
      }
    };

    // isCurrentStock
    $scope.isCurrentStock = (option, storage) => {
      if ($scope.currentStock) {
        return $scope.currentOption.id === option.id
          && $scope.currentStock.storage.id === storage.id;
      } else {
        return false;
      }
    };

    // editStock
    $scope.editStock = (option, storage) => {
      $scope.currentOption = option;
      $scope.currentStock = $scope.getStock(option, storage);
    };

    // saveStock
    $scope.saveStock = () => {
      $scope.savingStock = true;
      api.products.options.stock.set(
        $scope.currentProduct.id,
        $scope.currentOption.id,
        $scope.currentStock.storage.id,
        $scope.currentStock.units
      ).then((res) => {
        $scope.savingStock = false;
        $scope.currentOption = null;
        $scope.currentStock = null;
      }, (err) => {
        handleError(err);
      });
    };
  },
};
