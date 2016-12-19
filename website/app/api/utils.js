const fetch = require('node-fetch');
const config = require('../config');

const apiAddress = config.apiAddress;

const defaultOptions = {
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  compress: true,
  timeout: 1000,
};

const doRequest = (method, url, body, options) => {
  if (!url.match(/^https?:\/\//)) url = apiAddress + url;
  if (typeof options === 'undefined' || options === null) options = {};
  options.headers = Object.assign(
    {},
    defaultOptions.headers, options.headers || {}
  );
  options = Object.assign({}, defaultOptions, options);
  options.method = method;
  if (body) {
    options.body = body;
    options.headers['Content-Length'] = new Buffer(body).length;
  }
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

module.exports = {
  doGet: doGet,
  doPost: doPost,
  doPut: doPut,
  doDelete: doDelete,
};
