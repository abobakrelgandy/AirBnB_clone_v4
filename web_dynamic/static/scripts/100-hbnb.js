$(document).ready(onReady);
function onReady() {
  const states = {};

  const getChecked = (...types) =>
    Object.values(states).filter(
      (state) => state.checked && types.indexOf(state.type) !== -1
    );

  const updateStateNames = () => {
    const amenitiesUI = $("div.amenities > h4");
    const locationsUI = $("div.locations > h4");

    const amenities = getChecked("amenity")
      .map((state) => state.name)
      .join(", ");
    const locations = getChecked("state", "city")
      .map((state) => state.name)
      .join(", ");

    if (amenities.length) amenitiesUI.text(amenities);
    else amenitiesUI.html("&nbsp;");

    if (locations.length) locationsUI.text(locations);
    else locationsUI.html("&nbsp;");
  };

  const updatePlaces = (places = []) => {
    $("section.places").empty();
    console.log(places);
    for (const place of places) {
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
  };

  const searchPlaces = (data = {}) => {
    $.ajax("http://0.0.0.0:5001/api/v1/places_search/", {
      type: "POST",
      data: JSON.stringify(data),
      contentType: "application/json",
      success: updatePlaces,
    });
  };

  $.ajax("http://0.0.0.0:5001/api/v1/status/", {
    success: function(data, status) {
      $("DIV#api_status").toggleClass(
        "available",
        status === "success" && data.status === "OK"
      );
    },
    error: function(textStatus, errorThrown) {
      $("DIV#api_status").removeClass("available");
      console.log(textStatus);
      console.log(errorThrown);
    },
  });

  $("input[data-type]").on("change", function(_) {
    const id = $(this).attr("data-id");
    states[id] = {
      id,
      name: $(this).attr("data-name"),
      type: $(this).attr("data-type"),
      checked: $(this).is(":checked"),
    };
    updateStateNames();
  });

  $("section.filters > button").click(function() {
    searchPlaces({
      amenities: getChecked("amenity").map((state) => state.id),
      states: getChecked("state").map((state) => state.id),
      cities: getChecked("city").map((state) => state.id),
    });
  });

  searchPlaces();
}
