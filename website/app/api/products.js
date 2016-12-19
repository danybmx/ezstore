const api = require('./utils');

module.exports = {
  all: () => {
    return api.doGet('/products');
  },
  featured: () => {
    return api.doGet('/products/featured');
  },
  find: (id) => {
    return api.doGet('/products/' + id);
  },
  category: (categoryId) => {
    return api.doGet('/products/category/'+categoryId);
  },
};
