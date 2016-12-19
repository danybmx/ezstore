(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
const currency = require('./utils/currency');

$('#product-option-select').change(function() {
  const $this = $(this);
  const options = $this.data('options');
  const productUrl = $this.data('productUrl');
  const selectedId = parseInt($this.val());
  const selectedOption = options.filter((opt) => opt.id === selectedId)[0];
  $('#option-price').html(currency(selectedOption.priceTaxIncluded));
  $('#no-stock').hide();
  $('#last-units').hide();

  window.location.hash = selectedId;

  if (selectedOption.images) {
    const image = selectedOption.images[0];
    $('li[data-id=' + image.id + ']').click();
  }

  if (selectedOption.availableStock < 1) {
    $('#add-to-cart').prop('disabled', true);
    $('#no-stock').show();
  } else {
    $('#add-to-cart').prop('disabled', false);
    if (selectedOption.availableStock <= 3) {
      $('#last-units').show();
    }
  }
});

$(document).ready(() => {
  if (typeof section !== 'undefined') {
    if (section === 'product-show') {
      if (window.location.hash) {
        $('#product-option-select')
          .val(window.location.hash.replace('#', ''));
      } else {
        $('#product-option-select').change();
      }
    }
  }
});

},{"./utils/currency":2}],2:[function(require,module,exports){
module.exports = function(input, symbol = '€') {
  return parseFloat(input).toFixed(2).replace('.', ',') + symbol;
};

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHAvcmVzb3VyY2VzL3NjcmlwdHMvbWFpbi5qcyIsImFwcC9yZXNvdXJjZXMvc2NyaXB0cy91dGlscy9jdXJyZW5jeS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJjb25zdCBjdXJyZW5jeSA9IHJlcXVpcmUoJy4vdXRpbHMvY3VycmVuY3knKTtcblxuJCgnI3Byb2R1Y3Qtb3B0aW9uLXNlbGVjdCcpLmNoYW5nZShmdW5jdGlvbigpIHtcbiAgY29uc3QgJHRoaXMgPSAkKHRoaXMpO1xuICBjb25zdCBvcHRpb25zID0gJHRoaXMuZGF0YSgnb3B0aW9ucycpO1xuICBjb25zdCBwcm9kdWN0VXJsID0gJHRoaXMuZGF0YSgncHJvZHVjdFVybCcpO1xuICBjb25zdCBzZWxlY3RlZElkID0gcGFyc2VJbnQoJHRoaXMudmFsKCkpO1xuICBjb25zdCBzZWxlY3RlZE9wdGlvbiA9IG9wdGlvbnMuZmlsdGVyKChvcHQpID0+IG9wdC5pZCA9PT0gc2VsZWN0ZWRJZClbMF07XG4gICQoJyNvcHRpb24tcHJpY2UnKS5odG1sKGN1cnJlbmN5KHNlbGVjdGVkT3B0aW9uLnByaWNlVGF4SW5jbHVkZWQpKTtcbiAgJCgnI25vLXN0b2NrJykuaGlkZSgpO1xuICAkKCcjbGFzdC11bml0cycpLmhpZGUoKTtcblxuICB3aW5kb3cubG9jYXRpb24uaGFzaCA9IHNlbGVjdGVkSWQ7XG5cbiAgaWYgKHNlbGVjdGVkT3B0aW9uLmltYWdlcykge1xuICAgIGNvbnN0IGltYWdlID0gc2VsZWN0ZWRPcHRpb24uaW1hZ2VzWzBdO1xuICAgICQoJ2xpW2RhdGEtaWQ9JyArIGltYWdlLmlkICsgJ10nKS5jbGljaygpO1xuICB9XG5cbiAgaWYgKHNlbGVjdGVkT3B0aW9uLmF2YWlsYWJsZVN0b2NrIDwgMSkge1xuICAgICQoJyNhZGQtdG8tY2FydCcpLnByb3AoJ2Rpc2FibGVkJywgdHJ1ZSk7XG4gICAgJCgnI25vLXN0b2NrJykuc2hvdygpO1xuICB9IGVsc2Uge1xuICAgICQoJyNhZGQtdG8tY2FydCcpLnByb3AoJ2Rpc2FibGVkJywgZmFsc2UpO1xuICAgIGlmIChzZWxlY3RlZE9wdGlvbi5hdmFpbGFibGVTdG9jayA8PSAzKSB7XG4gICAgICAkKCcjbGFzdC11bml0cycpLnNob3coKTtcbiAgICB9XG4gIH1cbn0pO1xuXG4kKGRvY3VtZW50KS5yZWFkeSgoKSA9PiB7XG4gIGlmICh0eXBlb2Ygc2VjdGlvbiAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBpZiAoc2VjdGlvbiA9PT0gJ3Byb2R1Y3Qtc2hvdycpIHtcbiAgICAgIGlmICh3aW5kb3cubG9jYXRpb24uaGFzaCkge1xuICAgICAgICAkKCcjcHJvZHVjdC1vcHRpb24tc2VsZWN0JylcbiAgICAgICAgICAudmFsKHdpbmRvdy5sb2NhdGlvbi5oYXNoLnJlcGxhY2UoJyMnLCAnJykpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgJCgnI3Byb2R1Y3Qtb3B0aW9uLXNlbGVjdCcpLmNoYW5nZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufSk7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGlucHV0LCBzeW1ib2wgPSAn4oKsJykge1xuICByZXR1cm4gcGFyc2VGbG9hdChpbnB1dCkudG9GaXhlZCgyKS5yZXBsYWNlKCcuJywgJywnKSArIHN5bWJvbDtcbn07XG4iXX0=
