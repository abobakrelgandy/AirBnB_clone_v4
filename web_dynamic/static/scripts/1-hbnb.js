window.onload = function () {
  const $ = window.$;
  // TO-DO
  // Listen for changes on each input checkbox tag:
  //   if the checkbox is checked, you must store the Amenity ID in a variable (dictionary or list)
  //   if the checkbox is unchecked, you must remove the Amenity ID from the variable
  //   update the h4 tag inside the div Amenities with the list of Amenities checked
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
};
