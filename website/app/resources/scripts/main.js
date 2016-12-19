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
