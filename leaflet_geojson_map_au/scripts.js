
(function() {

  var map = L.map('map', {
    attributionControl: false
  });

	L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', {attribution: 'OSM'}).addTo(map);
  //L.tileLayer('http://{s}.tile.stamen.com/{style}/{z}/{x}/{y}.png', { style: 'toner-background' }).addTo(map);
  //L.tileLayer('http://{s}.tile.stamen.com/{z}/{x}/{y}.png').addTo(map);

  //$.getJSON("states.min.geojson", function(data) {
  $.getJSON("states.geojson", function(data) {

    var info = L.control();
    //https://leafletjs.com/examples/extending/extending-3-controls.html

    info.update = function (props) {
      //called by mouseover event
      if (props) { console.log("info.update : props=", props) }
      this._div.innerHTML = (props ? '<b>' + props['STATE_NAME']
                                    + '<br>population:'+props['POPULATION'] +'</b>'
                                    : 'Hover over a state');
    };

    info.onAdd = function (map) {
      this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
      this.update();
      return this._div;
    };

    info.addTo(map);

    var geojson = L.geoJson(data, {
      style: function (feature) {
        return {
          color: '#c2807d',
          weight: 2,
          fillOpacity: 0.5
        };
      },
      onEachFeature: function (feature, layer) {
        // layer.bindPopup(feature.properties['STATE_NAME']);
        //refer states.geojson > features[{xxx},{}, etc]
        //xxx = "properties": {"STATE_CODE": "1", "STATE_NAME": "New South Wales"}

        layer
        .on('mouseover', function(e) {
          layer.setStyle({
            weight: 4,
            fillOpacity: 0.8
          });
          info.update(layer.feature.properties);
        })
        .on('mouseout', function(e) {
          geojson.resetStyle(layer);
          info.update();
        })
      }
    })

    geojson.addTo(map);
    var bounds = geojson.getBounds();

    map.fitBounds(bounds);

    map.options.maxBounds = bounds;
    map.options.minZoom = map.getZoom();
  });

})();
