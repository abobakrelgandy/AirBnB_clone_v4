$(document).ready(onReady);
function onReady() {
  const users = {};
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

  const getUser = (id) => {
    return new Promise((resolve) => {
      if (!id) return resolve({});
      if (users[id]) return resolve(users[id]);
      $.ajax("http://0.0.0.0:5001/api/v1/users/" + id, {
        success: function(data) {
          users[id] = data;
          resolve(data);
        },
      });
    });
  };

  const getReviews = (id) => {
    return new Promise((resolve) => {
      if (!id) return resolve([]);
      $.ajax("http://0.0.0.0:5001/api/v1/places/" + id + "/reviews", {
        success: function(data) {
          resolve(data);
        },
      });
    });
  };

  const createReviewsButton = () => {
    const $btn = $('<span/>').text('show');
    $btn.on("click", function() {
      if ($(this).text() === "show") {
        $(this).text("hide");
        // $("div.reviews").show();
      } else {
        $(this).text("show");
        $("div.reviews").hide();
      }
    })

    return $btn;
  }

  const createPlace = async (place) => {
    const $place = $('<article/>');
    const $title = $('<div class="title_box"/>').append(
      $('<h2/>').text(place.name),
      $('<div class="price_by_night"/>')
        .text('$' + (place.price_by_night || 0))
    );
    $place.append($title);

    const $information = $('<div class="information"/>');
    $information.append(
      $('<div class="max_guest"/>').text(
        `${place.max_guest || 0} Guest${place.max_guest > 1 ? "s" : ""}`
      ),
      $('<div class="number_rooms"/>').text(
        `${place.number_rooms || 0} Bedroom${place.number_rooms > 1 ? "s" : ""}`
      ),
      $('<div class="number_bathrooms"/>').text(
        `${place.number_bathrooms || 0} Bathroom${place.number_bathrooms > 1 ? "s" : ""}`
      )
    );
    $place.append($information);

    const owner = await getUser(place.user_id);
    $place.append($('<div class="user"/>').append(
      $('<strong>Owner</strong>'),
      `: ${owner.first_name} ${owner.last_name}`));

    $place.append($('<div class="description"/>').text(
      place.description || "No description provided"
    ));

    // !TODO:  add amenities section
    // !FIX: css styling

    // !TODO: add the show/hide button with fetch/parse features
    const reviews = await getReviews(place.id);
    const $reviews = $('<div class="reviews"/>');
    const reviewsList = $('<ul/>');
    $reviews.append($('<h2/>').text(`${reviews.length} Reviews`));
    for (const review of reviews) {
      const user = getUser(review.user_id);
      $reviewsList.append(
        $('<li/>').append(
          $('<h3/>').text(
            // !TODO: add formatted date of each review
            `From ${user.first_name || ''} ${user.last_name || ''}`),
          $('<p/>').text(review.text)
        )
      );
    }

    $reviews.append(reviewsList);
    $place.append($reviews);

    return $place;
  };

  const updatePlaces = async (places = []) => {
    console.log(places);
    const $places = $("section.places").empty();
    for (const place of places) {
      const $place = await createPlace(place);
      $places.append($place);
    };
  };

  const searchPlaces = (data = {}) => {
    $.ajax("http://0.0.0.0:5001/api/v1/places_search/", {
      type: "POST",
      data: JSON.stringify(data),
      contentType: "application/json",
      success: (data) => updatePlaces(data),
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
