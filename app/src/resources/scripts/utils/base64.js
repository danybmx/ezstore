module.exports = {
  encode: function(string) {
    return btoa(string);
  },
  decode: function(encodedString) {
    return atob(encodedString);
  }
};
