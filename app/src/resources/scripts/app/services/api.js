const apiAddress = 'http://localhost:8080';

module.exports = function($rootScope, $http) {
  const options = {
    headers: {
      Authorization: 'Bearer ' + $rootScope.authToken,
    },
  };

  this.products = {
    all: () => {
      return $http.get(apiAddress + '/products', options);
    },
    find: (id) => {
      return $http.get(apiAddress + '/products/' + id, options);
    },
    update: (id, product) => {
      return $http.put(apiAddress + '/products/' + id, product, options);
    }
  }

  this.categories = {
    all: () => {
      return $http.get(apiAddress + '/categories', options);
    },
    create: () => {
    }
  }

  this.brands = {
    all: () => {
      return $http.get(apiAddress + '/brands', options);
    }
  }
};
