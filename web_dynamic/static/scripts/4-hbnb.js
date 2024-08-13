window.onload = function() {
  const $ = window.$;
  const checkedAmenityIDs = [];
  const checkedAmenityNames = [];
  $("input").on("change", function() {
    if (this.checked) {
      checkedAmenityIDs.push($(this).attr("data-id"));
      checkedAmenityNames.push($(this).attr("data-name"));
    } else {
      checkedAmenityIDs.pop($(this).attr("data-id"));
      checkedAmenityNames.pop($(this).attr("data-name"));
    }
    $("div.amenities h4").text(checkedAmenityNames.join(", "));
  });

  $.ajax("http://0.0.0.0:5001/api/v1/places_search/", {
    type: "POST",
    data: "{}",
    contentType: "application/json",
    success: function(data) {
      console.log(data);
      for (const place of data) {
        $("section.places").append(`<article>
            <div class="title_box">
              <h2>${place.name}</h2>
              <div class="price_by_night">${place.price_by_night}</div>
            </div>
            <div class="information">
              <div class="max_guest">${place.max_guest} Guest</div>
              <div class="number_rooms">${place.number_rooms} Bedroom</div>
              <div class="number_bathrooms">${place.number_bathrooms} Bathroom</div>
            </div>
            <div class="description">
              ${place.description}
            </div>
          </article>`);
      }
    },
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

  $("button").click(function() {
    $.ajax("http://0.0.0.0:5001/api/v1/places_search/", {
      type: "POST",
      data: JSON.stringify({ 'amenities': checkedAmenityIDs }),
      contentType: "application/json",
      success: function(data) {
        console.log(data);
        $("section.places").empty();
        for (const place of data) {
          $("section.places").append(`<article>
            <div class="title_box">
              <h2>${place.name}</h2>
              <div class="price_by_night">${place.price_by_night}</div>
            </div>
            <div class="information">
              <div class="max_guest">${place.max_guest} Guest</div>
              <div class="number_rooms">${place.number_rooms} Bedroom</div>
              <div class="number_bathrooms">${place.number_bathrooms} Bathroom</div>
            </div>
            <div class="description">
              ${place.description}
            </div>
          </article>`);
        }
      },
    });
  });
};
