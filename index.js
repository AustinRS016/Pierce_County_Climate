mapboxgl.accessToken = 'pk.eyJ1IjoiYXVzdGlucnMxNiIsImEiOiJja2hjcjAyYWwwMTIyMnVsNXc3ajUwMmk0In0.b8-Uodu2rXl9TvsX7vatSQ';


var map = new mapboxgl.Map({
  container: 'map', // HTML container id
  style: 'mapbox://styles/austinrs16/ckoqf7lh646z517msf4mttqe9', // style URL
  center: [-122.05, 47.1], // starting position as [lng, lat]
  zoom: 9, // starting zoom
});


map.on('load', function(){
  map.addSource('census',{
       "type": "geojson",
       "data": "jsons/census.geojson"
   });


  map.addLayer({
     "id":"census",
     "type":"fill",
     "source":"census",
     "layout": {'visibility': 'visible'},
     "paint": {
      'fill-antialias': false,
      'fill-color': 'grey',
      'fill-opacity': .4
    },

   });

   map.addSource('safety',{
        "type": "geojson",
        "data": "jsons/safetyIndex.geojson"
    });
    map.addLayer({
      "id":"safety",
      "type":"fill",
      "source":"safety",
      "layout": {'visibility': 'visible'},
      "paint": {
        'fill-antialias': false,
       'fill-color': [
         'interpolate',['linear'],
         ['get', 'gridcode'],
         2,
         ['to-color', 'blue'],
         14,
         ['to-color', 'red']
       ],
       'fill-opacity': .7,

     },

    });

    map.addSource('stations',{
           "type": "geojson",
           "data": "jsons/pierceWeatherStats.json"
       });
      map.addLayer({
         "id":"Rainfall/Stations",
         "type":"circle",
         "source":"stations",
         "layout": {'visibility': 'visible'},
         "paint": {
          'circle-color': 'yellow',
          'circle-radius': 10,
          'circle-opacity': 0
        },
       });
       map.addLayer({
          "id":"stations",
          "type":"circle",
          "source":"stations",
          "layout": {'visibility': 'visible'},
          "paint": {
           'circle-color': 'black',
           'circle-radius': 3,
         },
        });
       map.addLayer({
          "id":"rain",
          "type":"circle",
          "source":"stations",
          "layout": {'visibility': 'none'},
          "paint": {
           'circle-opacity': .7,
           'circle-stroke-width': 1,
           'circle-color': 'green',
           'circle-radius': [
             'interpolate',
             ['linear'],
             ['get','avgYearlyPrecip(in)'],
             0, 5,
             4, 12,
             80, 20,
           ]
         },

        });
        map.addLayer({
           "id":"snow",
           "type":"circle",
           "source":"stations",
           "layout": {'visibility': 'none'},
           "paint": {
            'circle-opacity': .7,
            'circle-stroke-width': 1,
            'circle-color': 'green',
            'circle-radius': [
              'interpolate',
              ['linear'],
              ['get','avgYearlySnowfall(in)'],
              0, 5,
              4, 12,
              80, 20,
            ]
          },

         });
         map.addLayer({
            "id": 'rainCount',
            "type": 'symbol',
            "source": 'stations',
            "filter": ['has', 'avgYearlyPrecip(in)'],
            "layout": {
              'visibility': 'none',
              'text-field': ['concat',[
                'number-format',
                ['get','avgYearlyPrecip(in)'],
                {'max-fraction-digits':1},
              ], 'in'],
              'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
              'text-size': 12,

                },
            "paint": {
              'text-halo-color': 'black',
              'text-halo-width': .5,
              'text-color': 'white',
            }
            });
            map.addLayer({
               "id": 'snowCount',
               "type": 'symbol',
               "source": 'stations',
               "filter": ['has', 'avgYearlyPrecip(in)'],
               "layout": {
                 'visibility': 'none',
                 'text-field': ['concat',[
                   'number-format',
                   ['get','avgYearlySnowfall(in)'],
                   {'max-fraction-digits':1},
                 ], 'in'],
                 'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
                 'text-size': 12,
                   },
               "paint": {
                 'text-halo-color': 'black',
                 'text-halo-width': .5,
                 'text-color': 'white',
               }
               });

  map.addSource('roads',{
                    "type": "geojson",
                    "data": "jsons/roads.json"
                });
     map.addLayer({
                  "id":"roads",
                  "type":"line",
                  "source":"roads",
                  "layout": {'visibility': 'visible'},
                  "paint": {
                    "line-opacity": {
                      stops: [[9,0],[12,1]]
                    },
                   'line-color': 'black',
                   'line-width': .5
                 },

                });
    });



    // var toggleableLayerIds = ['Rainfall/Stations'];
toggleLayer(['snowCount', 'snow'], 'Snow')
toggleLayer(['rainCount', 'rain'], 'Rain')

function toggleLayer(ids, name) {

        var link = document.createElement('a');
        link.href = '#';
        link.className = '';
        link.textContent = name;

        link.onclick = function (e) {
            e.preventDefault();
            e.stopPropagation();

          for (layers in ids){
            var visibility = map.getLayoutProperty(ids[layers], 'visibility');
            if (visibility === 'visible') {
              map.setLayoutProperty(ids[layers], 'visibility', 'none');
              this.className='';
            } else {
              this.className = 'active';
              map.setLayoutProperty(ids[layers], 'visibility', 'visible');
            }
          }


        };

        var layers = document.getElementById('menu');
        layers.appendChild(link);
    }

    // for (var i = 0; i < toggleableLayerIds.length; i++) {
    //     var id = toggleableLayerIds[i];
    //
    //     var link = document.createElement('a');
    //     link.href = '#';
    //     link.className = '';
    //     link.textContent = id;
    //
    //     link.onclick = function (e) {
    //         var clickedLayer = this.textContent;
    //         e.preventDefault();
    //         e.stopPropagation();
    //
    //         var visibility = map.getLayoutProperty(clickedLayer, 'visibility');
    //
    //         if (visibility === 'visible') {
    //             map.setLayoutProperty(clickedLayer, 'visibility', 'none');
    //             map.setLayoutProperty('rainCount', 'visibility', 'visible');
    //             map.setLayoutProperty('rain', 'visibility', 'visible');
    //
    //             this.className = '';
    //         } else {
    //             this.className = 'active';
    //             map.setLayoutProperty(clickedLayer, 'visibility', 'visible');
    //             map.setLayoutProperty('rainCount', 'visibility', 'none');
    //             map.setLayoutProperty('rain', 'visibility', 'none');
    //         }
    //     };
    //
    //     var layers = document.getElementById('menu');
    //     layers.appendChild(link);
    // }

map.on('click', 'Rainfall/Stations', function (e) {
  var coordinates = e.features[0].geometry.coordinates.slice();
   new mapboxgl.Popup()
   .setLngLat(coordinates)
   .setHTML("<span class='head'>"+e.features[0].properties['NAME']+"</span>" +
        "<br>Data present for " + (e.features[0].properties['totalDays']/365).toFixed(0) + " years, " +
        (e.features[0].properties['totalDays']%365) + " days" +
        "<br><span class='desc'>Yearly AVERAGES(in):</span>" +
        "<br>Snowfall: " + e.features[0].properties['avgYearlySnowfall(in)'].toFixed(2) +
        "<br>Rainfall: " + e.features[0].properties['avgYearlyPrecip(in)'].toFixed(2) +
        "<br><span class='desc'>Daily AVERAGE(in):</span>" +
        "<br>Snow Depth: " + e.features[0].properties['avgDailySnDepth(in)'].toFixed(2))
   .addTo(map);
});

map.on('mouseenter', 'Rainfall/Stations', function () {
  map.getCanvas().style.cursor = 'pointer';
});

map.on('mouseleave', 'Rainfall/Stations', function () {
  map.getCanvas().style.cursor = '';
});



    // map.addSource('Schools',{
    //      "type": "geojson",
    //      "data": "jsons/Schools_geo.geojson"
    //  });
    //  map.addLayer({
    //    "id":"schools",
    //    "type":"circle",
    //    "source":"Schools",
    //    "layout": {'visibility': 'visible'},
    //    "paint": {
    //     'circle-color': 'green',
    //     'circle-radius': 3.5
    //   },
    //
    //  });
