$(document).ready(function() {

  // Sidebar
  var $pinToolTrigger = $('#trigger_pin_tool');

  // Map
  var $cursorArea = $('.mapboxgl-canvas-container.mapboxgl-interactive, .mapboxgl-ctrl-nav-compass');
  var $map = $('#map');

  // Create Modal
  var $modal = $('.blur_effect');
  var $cancelButton = $('#cancel_button');
  var $submitButton = $('#submit_form');
  var $modalInput = $('.blur_effect .modal :text');
  var $modalCheckboxes = $('.blur_effect .modal .checked');


  var coffeeShop = {
    name: '',
    wifi: false,
    outlets: false,
    workEnvironment: false,
    comfortableSeating: false,
    goodCoffee: false,
    spaceToSitDown: false
  }

  $pinToolTrigger.on('click.pin', addPinToMap);

  function addPinToMap() {
    $pinToolTrigger.css({
      'background-image': 'linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0)',
      'background-color': 'rgba(0, 0, 0, 0)'
    });
    $pinToolTrigger.children().css({
      'background-color': 'rgb(230, 230, 230)',
    });
    $pinToolTrigger.toggleClass('activated');
    $pinToolTrigger.off('click.pin');
    // Change the cursor to indicate user can place pin
    $cursorArea.css('cursor', 'copy');
    // Get lat and long of click
    map.on('click', renderCreateModal);
  }

  function renderCreateModal(event) {
    // Open the modal
    $modal.css('display', 'block');
    $modal.animate({opacity: 1});
    // Set click handler
    $cancelButton.on('click.cancel', function() {
      $modal.animate({opacity: 0}, function() {
        $modal.css('display', 'none');
        $cancelButton.off('click.cancel');
      });
    });
    $modalCheckboxes.each(function() {
      $(this).data('checked', false);
      $(this).on('click', function() {
        if (!$(this).data().checked) {
          $(this).data().checked = true;
          $(this).parent().css('background-image', 'linear-gradient(to right, rgba(255, 188, 103, 1), rgba(218, 114, 126, 1))');
          $(this).prepend('<i class="material-icons checkmark">check</i>')
        } else {
          $(this).data().checked = false;
          $(this).parent().css('background-image', 'linear-gradient(to right, rgba(185, 185, 185, 1), rgba(185, 185, 185, 1))');
          $(this).children().remove();
        }
      });
    });
    $submitButton.on('click.submit', function() {
      // Get value of input
      var name = $modalInput.val();
      coffeeShop.name = name;
      // Get value of checkboxes
      $modalCheckboxes.each(function() {
        var criterion = $(this).data('criteria');
        coffeeShop[criterion] = $(this).data().checked;
      });
      $modal.animate({opacity: 0}, function() {
        $modal.css('display', 'none');
        $submitButton.off('click.submit');
        placeMarker(event);
      });
    });
  }

  function placeMarker(event) {
    var coordinates = event.lngLat;
    console.log(coordinates);
    var geojson = {
      type: 'FeatureCollection',
      features: [{
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [coordinates.lng, coordinates.lat]
        },
        properties: { coffeeShop }
      }]
    }
    geojson.features.forEach(function(marker) {
      console.log(marker.properties.coffeeShop);
      var marker_img = document.createElement('img');
      marker_img.src = '../assets/coffee_marker.png';
      marker_img.className = 'marker';
      var popup = '<h1>'+ marker.properties.coffeeShop.name +'</h1>';
      new mapboxgl.Popup({
        offset: 25,
        closeButton: true,
        anchor: 'top',
        closeOnClick: true
      })
        .setHTML(popup)
        .setLngLat(marker.geometry.coordinates)
        .addTo(map);
      new mapboxgl.Marker(marker_img)
      .setLngLat(marker.geometry.coordinates)
      .addTo(map);
    });
    resetPinTrigger(event);
  }

  function resetPinTrigger(event) {
    // Reset cursor to hand and reactivate the pin tool button
    $cursorArea.css('cursor', 'pointer');
    $pinToolTrigger.css('background-image', 'linear-gradient(to right, rgba(255, 188, 103, 1), rgba(218, 114, 126, 1)');
    $pinToolTrigger.children().css({
      'background-color': 'rgb(255, 255, 255)'
    });
    $pinToolTrigger.toggleClass('activated');
    $pinToolTrigger.on('click.pin', addPinToMap);
    map.off('click', placeMarker);
  }

});