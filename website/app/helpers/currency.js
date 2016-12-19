module.exports = {
  moduleName: 'currency',
  moduleBody: function(input, symbol = '€') {
    return parseFloat(input).toFixed(2).replace('.', ',') + symbol;
  },
};
