const fetch = require('node-fetch');

const apiAddress = 'http://api:8080/';

const defaultOptions = {
  headers: {
    'Accept': 'application/json',
  },
  compress: true,
  timeout: 1000,
};

const doRequest = (method, url, body, options) => {
  if (typeof options === 'undefined' || options === null) options = {};
  options = Object.assign({}, defaultOptions, options);
  options.method = method;

  return new Promise((resolve, reject) => {
    fetch(url, options)
      .then((res) => res.json())
      .then(resolve)
      .catch(reject);
  });
};

const doGet = (url, options) => {
  return doRequest('GET', url, null, options);
};

const doPost = (url, body, options) => {
  return doRequest('POST', url, body, options);
};

const doPut = (url, body, options) => {
  return doRequest('PUT', url, body, options);
};

const doDelete = (url, options) => {
  return doRequest('DELETE', url, null, options);
};

const products = {
  getAll: () => doGet(apiAddress + 'products'),
};

module.exports = {
  products: products,
};
