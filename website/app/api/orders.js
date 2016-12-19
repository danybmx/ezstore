const api = require('./utils');

module.exports = {
  all: (token) => {
    return api.doGet('/orders', {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    });
  },
  find: (id, token) => {
    return api.doGet('/orders/' + id, {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    });
  },
  findByPaymentTransaction: (transaction, token) => {
    return api.doGet('/orders/findByPaymentTransaction/' + transaction, {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    });
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
