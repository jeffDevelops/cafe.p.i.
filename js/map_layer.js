$(document).ready(function() {

  // Sidebar
  var $sidebar = $('.sidebar');
  var $pinToolTrigger = $('#trigger_pin_tool');

  // Map
  var $cursorArea = $('.mapboxgl-canvas-container.mapboxgl-interactive, .mapboxgl-ctrl-nav-compass');
  var $map = $('#map');
  var $marker = $('.marker.map');

  // Create Modal
  var $modal = $('.blur_effect');
  var $cancelButton = $('#cancel_button');
  var $submitButton = $('#submit_form');
  var $modalInput = $('.blur_effect .modal :text');
  var $modalCheckboxes = $('.blur_effect .modal .checked');

  // Data
  var coffeeShop = {
    name: '',
    wifi: false,
    outlets: false,
    workEnvironment: false,
    comfortableSeating: false,
    goodCoffee: false,
    spaceToSitDown: false
  }
  var newCoffeeShops = [];
  var markers = [];
  
  // INITIALIZE MAP
  function reinitializeMap(feature) {
    newCoffeeShops.push(feature);
    console.log(newCoffeeShops);
    
    coffeeShopsLayer = {
      "id": "coffeeShops",
      "type": "symbol",
      "source": {
        "type": "geojson",
        "data": {
          "type": "FeatureCollection",
          "features": newCoffeeShops
        }
      },
      "layout": {
        "icon-allow-overlap": true
      }
    };

    console.log('COFFEESHOPS ARRAY: ', newCoffeeShops);

    if (map.getLayer('coffeeShops')) {
      map.removeLayer('coffeeShops');
    }
    if (map.getSource('coffeeShops')) {
      map.removeSource('coffeeShops');
    }
    map.off('click.triggerPopup');
    markers.forEach(function(marker) {
      marker.remove();
    });
    markers = [];

    map.addLayer(coffeeShopsLayer);

    var popupContent = '' +
      '<div class="popup">' +
      '<h1 class="popup_header">' + feature.properties.coffeeShop.name + '</h1>' + 
      '<p>' + (feature.properties.coffeeShop.comfortableSeating ? '<i class="material-icons">check</i>' : '<i class="material-icons">not_interested</i>') + 'comfortable seating</p>' + 
      '<p>' + (feature.properties.coffeeShop.goodCoffee ? '<i class="material-icons">check</i>' : '<i class="material-icons">not_interested</i>') + 'good coffee</p>' + 
      '<p>' + (feature.properties.coffeeShop.spaceToSitDown ? '<i class="material-icons">check</i>' : '<i class="material-icons">not_interested</i>') + 'space to sit down</p>' +
      '<p>' + (feature.properties.coffeeShop.workEnvironment ? '<i class="material-icons">check</i>' : '<i class="material-icons">not_interested</i>') + 'work-conducive atmosphere</p>' +
      '<p>' + (feature.properties.coffeeShop.wifi === true ? '<i class="material-icons">check</i>' : '<i class="material-icons">not_interested</i>') + 'wi-fi</p>' +
      '<p>' + (feature.properties.coffeeShop.outlets === true ? '<i class="material-icons">check</i>' : '<i class="material-icons">not_interested</i>') + 'accessible outlets</p>' +
      '</div>';
    
    coffeeShopsLayer.source.data.features.forEach(function(marker) {
      
      var marker_img = document.createElement('img');
      marker_img.src = './assets/coffee_marker.png';
      marker_img.className = 'marker';

      var popup = new mapboxgl.Popup({
        offset: 25,
        closeButton: false,
        anchor: 'top',
        closeOnClick: false
      }).setHTML(popupContent)
        .setLngLat(marker.geometry.coordinates);
      
      var newMarker = new mapboxgl.Marker(marker_img)
        .setLngLat(marker.geometry.coordinates)
        .setPopup(popup)
        .addTo(map);
      
      markers.push(newMarker);

      markers.forEach(function(marker) {
        marker.addTo(map);
      });
    });

    //Apply interaction listeners to map features
    map.on('click.triggerPopup', 'coffeeShops', function(event) {
      console.log(event);
    });
    
    resetPinTrigger(event);
    console.log(map.getLayer("coffeeShops"));
  }

  // USER INTERACTION WITH MAP
  $pinToolTrigger.on('click.pin', addPinToMap);

  function addPinToMap() {
    // Hide sidebar to allow interaction with the map
    $sidebar.css('transform', 'translate(-999px)');
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
    // Render modal to ask for details about pin
    map.on('click', renderCreateModal);
  }

  function renderCreateModal(event) {
    // Open the modal
    $modal.css('display', 'block');
    $modal.animate({opacity: 1});
    // Set up cancel button
    $cancelButton.on('click.cancel', function() {
      resetModal();
      map.off('click', renderCreateModal);
      resetPinTrigger();
    });
    $modalCheckboxes.each(function() {
      $(this).data().checked = false;
      $(this).on('click.checkboxes', function() {
        console.log($(this).data().checked);
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
        $(this).off('click.checkboxes');
      });
      placeMarker(event);

      resetModal();
    });
  }

  function resetModal() {
    $modal.animate({opacity: 0}, function() {
      $modal.css('display', 'none');
      $cancelButton.off('click.cancel');
      $modal.css('display', 'none');
      $submitButton.off('click.submit');
      $modalInput.val('');
      $modalCheckboxes.each(function() {
        $(this).data().checked = false;
        $(this).parent().css('background-image', 'linear-gradient(to right, rgba(185, 185, 185, 1), rgba(185, 185, 185, 1))');
        $(this).children().remove();
        map.off('click', renderCreateModal);
      });
    });
  }

  function placeMarker(event) {
    var coordinates = event.lngLat;
    var geojson = {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [coordinates.lng, coordinates.lat]
      },
      "properties": { coffeeShop }
    };

    reinitializeMap(geojson);
  }

  function resetPinTrigger(event) {
    // Reopen the sidebar
    $sidebar.css('transform', 'translate(0)');
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