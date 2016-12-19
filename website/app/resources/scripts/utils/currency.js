module.exports = function(input, symbol = '€') {
  return parseFloat(input).toFixed(2).replace('.', ',') + symbol;
};
