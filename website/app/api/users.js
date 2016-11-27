const api = require('./utils');

module.exports = {
  find: (id) => {
    return api.doGet('/users/' + id);
  },
};
