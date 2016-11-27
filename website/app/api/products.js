const api = require('./utils');

module.exports = {
  all: () => {
    return api.doGet('/products');
  },
  find: (id) => {
    return api.getGet('/products/id');
  }
};
