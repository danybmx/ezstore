const api = require('./utils');

module.exports = {
  all: (pId) => {
    return api.doGet('/products/'+pId+'/options');
  },
  find: (pId, id) => {
    return api.doGet('/products/'+pId+'/options/' + id);
  },
};
