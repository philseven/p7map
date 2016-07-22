google.maps.event.addDomListener(window, 'load', function() {
  var map = new google.maps.Map(document.getElementById('map-canvas'), {
    center: { lat: 14.5941032, lng: 121.0561089 },
    zoom: 15,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });

  var panelDiv = document.getElementById('panel');

  var data = new LocationDataSource;

  var view = new storeLocator.View(map, data, {
    geolocation: true,
    features: data.getFeatures(),
    markerIcon: '../img/7-eleven-24px.png'
  });

  new storeLocator.Panel(panelDiv, {
    view: view
  });
});
