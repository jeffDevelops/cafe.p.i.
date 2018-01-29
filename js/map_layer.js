$(document).ready(function() {

  var $pinToolTrigger = $('#trigger_pin_tool');
  var $cursorArea = $('.mapboxgl-canvas-container.mapboxgl-interactive, .mapboxgl-ctrl-nav-compass');
  var $map = $('#map');

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
    map.on('click', placeMarker);
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
        properties: {
          coffeeShopName: 'placeholder string',
          wifi: false,
          outlets: false,
          workEnvironment: false,
          comfortableSeating: false,
          goodCoffee: false,
          spaceToSitDown: false
        }
      }]
    }
    geojson.features.forEach(function(marker) {
      var marker_img = document.createElement('img');
      marker_img.src = '../assets/coffee_marker.png';
      marker_img.className = 'marker';
      var popup = '<h1>Hello World</h1>';
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