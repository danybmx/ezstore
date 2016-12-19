const api = require('./utils');

module.exports = {
  all: () => {
    return api.doGet('/orders');
  },
  find: (id) => {
    return api.doGet('/orders/' + id);
  },
  create: (order, token) => {
    return api.doPost('/orders', JSON.stringify(order), {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    });
  },
  update: (order, token) => {
    order.reference = null;
    return api.doPut('/orders', JSON.stringify(order), {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    });
  },
};
