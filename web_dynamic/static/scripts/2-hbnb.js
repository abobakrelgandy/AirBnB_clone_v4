window.onload = function () {
  const $ = window.$;
  const checkedAmenityIDs = [];
  const checkedAmenityNames = [];
  $('input').on('change', function () {
    if (this.checked) {
      checkedAmenityIDs.push($(this).attr('data-id'));
      checkedAmenityNames.push($(this).attr('data-name'));
    } else {
      checkedAmenityIDs.pop($(this).attr('data-id'));
      checkedAmenityNames.pop($(this).attr('data-name'));
    }
    $('div.amenities h4').text(checkedAmenityNames.join(', '));
  });

  $.ajax('http://0.0.0.0:5001/api/v1/status/', {
    success: function (data, status) {
      if (status === 'success') {
        if (data.status === 'OK') {
          $('DIV#api_status').addClass('available');
        }
      } else {
        $('DIV#api_status').removeClass('available');
      }
    },
    error: function (textStatus, errorThrown) {
      $('DIV#api_status').removeClass('available');
      console.log(textStatus);
      console.log(errorThrown);
    }
  });
};
