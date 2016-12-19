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
      }
      $('#product-option-select').change();
    }
  }
});

},{"./utils/currency":2}],2:[function(require,module,exports){
module.exports = function(input, symbol = '€') {
  return parseFloat(input).toFixed(2).replace('.', ',') + symbol;
};

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHAvcmVzb3VyY2VzL3NjcmlwdHMvbWFpbi5qcyIsImFwcC9yZXNvdXJjZXMvc2NyaXB0cy91dGlscy9jdXJyZW5jeS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6Q0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiY29uc3QgY3VycmVuY3kgPSByZXF1aXJlKCcuL3V0aWxzL2N1cnJlbmN5Jyk7XG5cbiQoJyNwcm9kdWN0LW9wdGlvbi1zZWxlY3QnKS5jaGFuZ2UoZnVuY3Rpb24oKSB7XG4gIGNvbnN0ICR0aGlzID0gJCh0aGlzKTtcbiAgY29uc3Qgb3B0aW9ucyA9ICR0aGlzLmRhdGEoJ29wdGlvbnMnKTtcbiAgY29uc3QgcHJvZHVjdFVybCA9ICR0aGlzLmRhdGEoJ3Byb2R1Y3RVcmwnKTtcbiAgY29uc3Qgc2VsZWN0ZWRJZCA9IHBhcnNlSW50KCR0aGlzLnZhbCgpKTtcbiAgY29uc3Qgc2VsZWN0ZWRPcHRpb24gPSBvcHRpb25zLmZpbHRlcigob3B0KSA9PiBvcHQuaWQgPT09IHNlbGVjdGVkSWQpWzBdO1xuICAkKCcjb3B0aW9uLXByaWNlJykuaHRtbChjdXJyZW5jeShzZWxlY3RlZE9wdGlvbi5wcmljZVRheEluY2x1ZGVkKSk7XG4gICQoJyNuby1zdG9jaycpLmhpZGUoKTtcbiAgJCgnI2xhc3QtdW5pdHMnKS5oaWRlKCk7XG5cbiAgd2luZG93LmxvY2F0aW9uLmhhc2ggPSBzZWxlY3RlZElkO1xuXG4gIGlmIChzZWxlY3RlZE9wdGlvbi5pbWFnZXMpIHtcbiAgICBjb25zdCBpbWFnZSA9IHNlbGVjdGVkT3B0aW9uLmltYWdlc1swXTtcbiAgICAkKCdsaVtkYXRhLWlkPScgKyBpbWFnZS5pZCArICddJykuY2xpY2soKTtcbiAgfVxuXG4gIGlmIChzZWxlY3RlZE9wdGlvbi5hdmFpbGFibGVTdG9jayA8IDEpIHtcbiAgICAkKCcjYWRkLXRvLWNhcnQnKS5wcm9wKCdkaXNhYmxlZCcsIHRydWUpO1xuICAgICQoJyNuby1zdG9jaycpLnNob3coKTtcbiAgfSBlbHNlIHtcbiAgICAkKCcjYWRkLXRvLWNhcnQnKS5wcm9wKCdkaXNhYmxlZCcsIGZhbHNlKTtcbiAgICBpZiAoc2VsZWN0ZWRPcHRpb24uYXZhaWxhYmxlU3RvY2sgPD0gMykge1xuICAgICAgJCgnI2xhc3QtdW5pdHMnKS5zaG93KCk7XG4gICAgfVxuICB9XG59KTtcblxuJChkb2N1bWVudCkucmVhZHkoKCkgPT4ge1xuICBpZiAodHlwZW9mIHNlY3Rpb24gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgaWYgKHNlY3Rpb24gPT09ICdwcm9kdWN0LXNob3cnKSB7XG4gICAgICBpZiAod2luZG93LmxvY2F0aW9uLmhhc2gpIHtcbiAgICAgICAgJCgnI3Byb2R1Y3Qtb3B0aW9uLXNlbGVjdCcpXG4gICAgICAgICAgLnZhbCh3aW5kb3cubG9jYXRpb24uaGFzaC5yZXBsYWNlKCcjJywgJycpKTtcbiAgICAgIH1cbiAgICAgICQoJyNwcm9kdWN0LW9wdGlvbi1zZWxlY3QnKS5jaGFuZ2UoKTtcbiAgICB9XG4gIH1cbn0pO1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpbnB1dCwgc3ltYm9sID0gJ+KCrCcpIHtcbiAgcmV0dXJuIHBhcnNlRmxvYXQoaW5wdXQpLnRvRml4ZWQoMikucmVwbGFjZSgnLicsICcsJykgKyBzeW1ib2w7XG59O1xuIl19
