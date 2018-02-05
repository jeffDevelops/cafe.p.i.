$(document).ready(function() {
  // Landing Div
  var $landingContainer = $('.landing_container');

  // Sidebar
  var $sidebar = $('.sidebar');
  var $menuToggle = $('.menu_toggle');
  var $pinToolTrigger = $('#trigger_pin_tool');
  var $textInputs = $(':text');
  var $sidebarCheckboxes = $('aside .checked');

  // Map
  var $cursorArea = $('.mapboxgl-canvas-container.mapboxgl-interactive, .mapboxgl-ctrl-nav-compass');
  var $map = $('#map');
  var $marker = $('.marker.map');

  // Define the Coffee Shops layer and associated data
  coffeeShopsLayer = {
    "id": "coffeeShops",
    "type": "symbol",
    "source": {
      "type": "geojson",
      "data": {
        "type": "FeatureCollection",
        "features": []
      }
    },
    "layout": {
      "icon-allow-overlap": true
    }
  };

  // Create Modal
  var $modal = $('.blur_effect');
  var $cancelButton = $('#cancel_button');
  var $submitButton = $('#submit_form');
  var $modalInput = $('.blur_effect .modal :text');
  var $modalCheckboxes = $('.blur_effect .modal .checked');

  // Data
  function coffeeShop(name, coordinates, address, wifi, outlets, workEnvironment, comfortableSeating, goodCoffee, spaceToSitDown) {
    this.name = name;
    this.coordinates = coordinates;
    this.address = address;
    this.wifi = wifi;
    this.outlets = outlets;
    this.workEnvironment = workEnvironment;
    this.comfortableSeating = comfortableSeating;
    this.goodCoffee = goodCoffee;
    this.spaceToSitDown = spaceToSitDown;
  }

  var newCoffeeShops = [];
  var markers = [];

  // INITIALIZE MAP
  map.on('load', function() {
    getAllCoffeeShops().then(function(response) {
      initializeMap(response);
    });
  });

  // Hide landing div
  $('#mapbox_trigger').on('click', function() {
    $landingContainer.animate({opacity: 0}, function() {
      $(this).css('display', 'none');
      $sidebar.css('transform', 'translate(0)');
      $sidebar.data('visible', true);
      $menuToggle.css({
        'display': 'block',
        'top': '0',
        'left': '0',
        'box-shadow': 'none',
        'background-color': 'transparent'
      });
    });
  });

  // Toggle the sidebar
  $('.menu_toggle').on('click', function() {
    if ($sidebar.data().visible === true) {
      $sidebar.css('transform', 'translate(-999px)');
      $sidebar.data('visible', false);
      $menuToggle.css({
        'top': '15px',
        'left': '5px',
        'box-shadow': '0 8px 20px -9px #455C7B',
        'background-color': 'rgba(255, 255, 255, .85)'
      });
    } else {
      $sidebar.css('transform', 'translate(0)');
      $sidebar.data('visible', true);
      $menuToggle.css({
        'top': '0',
        'left': '0',
        'box-shadow': 'none',
        'background-color': 'transparent'
      });
    }
  });

  function initializeMap(coffeeShopsArray) {
    coffeeShopsArray.forEach(function(cafe) {
      coffeeShopsLayer.source.data.features.push({
        "type": "feature",
        "geometry": {
          "type": "Point",
          "coordinates": [cafe.coordinates.coordinates[0], cafe.coordinates.coordinates[1]]
        },
        "properties": {
          "name": cafe.name,
          "coordinates": cafe.coordinates,
          "address": cafe.address,
          "wifi": cafe.wifi,
          "outlets": cafe.outlets,
          "workEnvironment": cafe.workEnvironment,
          "comfortableSeating": cafe.comfortableSeating,
          "spaceToSitDown": cafe.spaceToSitDown,
          "goodCoffee": cafe.goodCoffee
        }
      });
    });
    
    // Add the layer to the map
    map.addLayer(coffeeShopsLayer);

    // Generate popups for each coffeeShop in the layer
    coffeeShopsLayer.source.data.features.forEach(function(cafe) {
      console.log(cafe);

      // Generate HTML structure for rendering data for each coffeeShop
      var popupContent = '' +
        '<div class="popup">' +
        '<h1 class="popup_header">' + cafe.properties.name + '</h1>' + 
        '<p>' + (cafe.properties.comfortableSeating ? '<i class="material-icons">check</i>' : '<i class="material-icons">not_interested</i>') + 'comfortable seating</p>' + 
        '<p>' + (cafe.properties.goodCoffee ? '<i class="material-icons">check</i>' : '<i class="material-icons">not_interested</i>') + 'good coffee</p>' + 
        '<p>' + (cafe.properties.spaceToSitDown ? '<i class="material-icons">check</i>' : '<i class="material-icons">not_interested</i>') + 'space to sit down</p>' +
        '<p>' + (cafe.properties.workEnvironment ? '<i class="material-icons">check</i>' : '<i class="material-icons">not_interested</i>') + 'work-conducive atmosphere</p>' +
        '<p>' + (cafe.properties.wifi === true ? '<i class="material-icons">check</i>' : '<i class="material-icons">not_interested</i>') + 'wi-fi</p>' +
        '<p>' + (cafe.properties.outlets === true ? '<i class="material-icons">check</i>' : '<i class="material-icons">not_interested</i>') + 'accessible outlets</p>' +
        '</div>';

      var marker_img = document.createElement('img');
      marker_img.src = './assets/coffee_marker.png';
      marker_img.className = 'marker';
  
      var popup = new mapboxgl.Popup({
        offset: 25,
        closeButton: false,
        anchor: 'top',
        closeOnClick: false
      }).setHTML(popupContent)
        .setLngLat(cafe.geometry.coordinates);
        
      var newMarker = new mapboxgl.Marker(marker_img, {offset: [0,0]})
        .setLngLat(cafe.geometry.coordinates)
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
  }
  
  // REFRESH MAP
  function refreshMap() {
    // Reset Map, CoffeeShops Layer, Markers, and click listeners
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
    
    // Push new coffee shops into the coffeeShops layer
    newCoffeeShops.forEach(function(cafe) {
      coffeeShopsLayer.source.data.features.push({
        "type": "feature",
        "geometry": {
          "type": "Point",
          "coordinates": [cafe.coordinates[0], cafe.coordinates[1]]
        },
        "properties": {
          "name": cafe.name,
          "coordinates": cafe.coordinates,
          "address": cafe.address,
          "wifi": cafe.wifi,
          "outlets": cafe.outlets,
          "workEnvironment": cafe.workEnvironment,
          "comfortableSeating": cafe.comfortableSeating,
          "spaceToSitDown": cafe.spaceToSitDown,
          "goodCoffee": cafe.goodCoffee
        }
      });
    });
    // Add the layer to the map
    map.addLayer(coffeeShopsLayer);
    // Generate popups for each coffeeShop in the layer
    coffeeShopsLayer.source.data.features.forEach(function(cafe) {
      // Generate HTML structure for rendering data for each coffeeShop
      var popupContent = '' +
        '<div class="popup">' +
        '<h1 class="popup_header">' + cafe.properties.name + '</h1>' + 
        '<p>' + (cafe.properties.comfortableSeating ? '<i class="material-icons">check</i>' : '<i class="material-icons">not_interested</i>') + 'comfortable seating</p>' + 
        '<p>' + (cafe.properties.goodCoffee ? '<i class="material-icons">check</i>' : '<i class="material-icons">not_interested</i>') + 'good coffee</p>' + 
        '<p>' + (cafe.properties.spaceToSitDown ? '<i class="material-icons">check</i>' : '<i class="material-icons">not_interested</i>') + 'space to sit down</p>' +
        '<p>' + (cafe.properties.workEnvironment ? '<i class="material-icons">check</i>' : '<i class="material-icons">not_interested</i>') + 'work-conducive atmosphere</p>' +
        '<p>' + (cafe.properties.wifi === true ? '<i class="material-icons">check</i>' : '<i class="material-icons">not_interested</i>') + 'wi-fi</p>' +
        '<p>' + (cafe.properties.outlets === true ? '<i class="material-icons">check</i>' : '<i class="material-icons">not_interested</i>') + 'accessible outlets</p>' +
        '</div>';

      var marker_img = document.createElement('img');
      marker_img.src = './assets/coffee_marker.png';
      marker_img.className = 'marker';
  
      var popup = new mapboxgl.Popup({
        offset: 25,
        closeButton: false,
        anchor: 'top',
        closeOnClick: false
      }).setHTML(popupContent)
        .setLngLat(cafe.geometry.coordinates);
        
      var newMarker = new mapboxgl.Marker(marker_img, {offset: [0,-30]})
        .setLngLat(cafe.geometry.coordinates)
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
    console.log('Hello from addPinToMap');
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
    coordinates = [event.lngLat.lng, event.lngLat.lat];
    console.log(coordinates);
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
      var newCoffeeShop = new coffeeShop();
      newCoffeeShop.name = name;
      newCoffeeShop.coordinates = coordinates;
      // Get value of checkboxes
      $modalCheckboxes.each(function() {
        var criterion = $(this).data('criteria');
        newCoffeeShop[criterion] = $(this).data().checked;
        $(this).off('click.checkboxes');
      });

      // API CALL HERE!
      createNewCoffeeShop(newCoffeeShop);

      newCoffeeShops.push(newCoffeeShop);
      refreshMap();
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
  }

  // SORTING FUNCTIONALITY
  $textInputs.each(function() {
    $(this).on('focus', function() {
      $(this).next().css('transform', 'scaleY(2)');
      $(this).next().css('background-image', 'linear-gradient(to right, rgba(255, 188, 103, 1), rgba(218, 114, 126, 1))');
    });
    $(this).on('blur', function() {
      $(this).next().css('transform', 'scaleY(1)');
      $(this).next().css('background-image', 'linear-gradient(to right, rgba(185, 185, 185, 1), rgba(210, 210, 210, 1))');
    });
  });

  $sidebarCheckboxes.each(function() {
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

});