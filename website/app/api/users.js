const api = require('./utils');

module.exports = {
  login: (email, password) => {
    return api.doGet('/auth', {
      headers: {
        Authorization: 'Basic ' + new Buffer(
          email+':'+password
        ).toString('base64'),
      },
    });
  },
  me: (token) => {
    return api.doGet('/users/me', {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    });
  },
  find: (id) => {
    return api.doGet('/users/' + id);
  },
};
