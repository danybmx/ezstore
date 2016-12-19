const apiUrl = 'http://localhost:8080';

module.exports = function($rootScope, $http, Upload) {
  const options = {
    headers: {
      Authorization: 'Bearer ' + $rootScope.authToken,
    },
  };

  this.products = {
    all: () => {
      return $http.get(apiUrl + '/products', options);
    },
    find: (id) => {
      return $http.get(apiUrl + '/products/' + id, options);
    },
    update: (id, product) => {
      return $http.put(apiUrl + '/products/' + id, product, options);
    },
    create: (product) => {
      return $http.post(apiUrl + '/products', product, options);
    },
    delete: (id) => {
      return $http.delete(apiUrl + '/products/' + id, options);
    },
    images: {
      upload: (file) => {
        return Upload.upload({
          url: apiUrl + '/media/products',
          data: {file: file},
          options: options,
        });
      },
      update: (productId, id, image) => {
        return $http.put(
          apiUrl + '/products/' + productId + '/images/' + id,
          image,
          options
        );
      },
      create: (productId, image) => {
        return $http.post(
          apiUrl + '/products/' + productId + '/images',
          image,
          options
        );
      },
      delete: (productId, id) => {
        return $http.delete(
          apiUrl + '/products/' + productId + '/images/' + id,
          options
        );
      },
    },
    options: {
      update: (productId, id, option) => {
        return $http.put(
          apiUrl + '/products/' + productId + '/options/' + id,
          option,
          options
        );
      },
      create: (productId, option) => {
        return $http.post(
          apiUrl + '/products/' + productId + '/options',
          option,
          options
        );
      },
      delete: (pId, oId) => {
        return $http.delete(
          `${apiUrl}/products/${pId}/options/${oId}`,
          options
        );
      },
      stock: {
        set: (pId, oId, sId, units) => {
          return $http.put(
            `${apiUrl}/products/${pId}/options/${oId}/stock/${sId}/${units}`,
            null,
            options
          );
        },
      },
    },
  };

  this.categories = {
    all: () => {
      return $http.get(apiUrl + '/categories', options);
    },
    find: (id) => {
      return $http.get(apiUrl + '/categories/' + id, options);
    },
    create: (category) => {
      return $http.post(apiUrl + '/categories', category, options);
    },
    update: (id, category) => {
      return $http.put(apiUrl + '/categories/' + id, category, options);
    },
    delete: (id) => {
      return $http.delete(apiUrl + '/categories/' + id, options);
    },
  };

  this.brands = {
    all: () => {
      return $http.get(apiUrl + '/brands', options);
    },
    find: (id) => {
      return $http.get(apiUrl + '/brands/' + id, options);
    },
    create: (brand) => {
      return $http.post(apiUrl + '/brands', brand, options);
    },
    update: (id, brand) => {
      return $http.put(apiUrl + '/brands/' + id, brand, options);
    },
    delete: (id) => {
      return $http.delete(apiUrl + '/brands/' + id, options);
    },
  };

  this.storages = {
    all: () => {
      return $http.get(apiUrl + '/storages', options);
    },
    find: (id) => {
      return $http.get(apiUrl + '/storages/' + id, options);
    },
    create: (brand) => {
      return $http.post(apiUrl + '/storages', brand, options);
    },
    update: (id, brand) => {
      return $http.put(apiUrl + '/storages/' + id, brand, options);
    },
    delete: (id) => {
      return $http.delete(apiUrl + '/storages/' + id, options);
    },
    setAsPrimary: (id) => {
      return $http.get(apiUrl + '/storages/primary/' + id, options);
    },
  };

  this.users = {
    roles: () => {
      return $http.get(apiUrl + '/users/roles', options);
    },
    all: () => {
      return $http.get(apiUrl + '/users', options);
    },
    find: (id) => {
      return $http.get(apiUrl + '/users/' + id, options);
    },
    create: (user) => {
      return $http.post(apiUrl + '/users', user, options);
    },
    update: (id, user) => {
      return $http.put(apiUrl + '/users/' + id, user, options);
    },
    delete: (id) => {
      return $http.delete(apiUrl + '/users/' + id, options);
    },
    addresses: {
      create: (uId, address) => {
        return $http.post(apiUrl + '/addresses/' + uId, address, options);
      },
      update: (uId, aId, address) => {
        return $http.put(
          apiUrl + '/addresses/' + uId + '/' + aId, address, options
        );
      },
      delete: (uId, aId) => {
        return $http.delete(apiUrl + '/addresses/' + uId + '/' + aId, options);
      },
      setDefaultAddress: (addressType, uId, aId) => {
        return $http.put(
          `${apiUrl}/addresses/default/${addressType}/${uId}/${aId}`,
          options
        );
      },
    },
  };

  this.orders = {
    all: () => {
      return $http.get(apiUrl + '/orders/mng', options);
    },
    find: (id) => {
      return $http.get(apiUrl + '/orders/mng/' + id, options);
    },
    create: (order) => {
      return $http.post(apiUrl + '/orders/mng', order, options);
    },
    update: (id, order) => {
      return $http.put(apiUrl + '/orders/mng/' + id, order, options);
    },
    delete: (id) => {
      return $http.delete(apiUrl + '/orders/mng/' + id, options);
    },
    types: () => {
      return $http.get(apiUrl + '/orders/types', options);
    },
  };
};
