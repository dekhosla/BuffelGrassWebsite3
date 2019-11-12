// "dojo/domReady!",
require([
    "esri/Map",
    "esri/views/MapView",
   
      "esri/widgets/BasemapToggle"
  
], function (Map, MapView, BasemapToggle) {

        /*on(dom.byId("submitRequest"), "click", getContent);
        function getContent() {
            var test = "test";
        }-*/

    /******************************************************************
     *
     * Set the initial map and zoom/center example
     *
     ******************************************************************/

    // Create a basemap and set properties in map constructor. Try changing to various basemaps
    // streets, satellite, hybrid, topo, gray, dark-gray, oceans, national-geographic, terrain
    // osm, dark-gray-vector, gray-vector, streets-vector, topo-vector, streets-night-vector
    // streets-relief-vector, streets-navigation-vector

    var map = new Map({
        basemap: "streets-vector"
    });

    view = new MapView({
        container: "viewDiv",
        map: map,       
        center: [-111.0937, 34.0489],
        zoom: 6
    });      

        // 1 - Create the widget
        var toggle = new BasemapToggle({
            // 2 - Set properties
            view: view, // view that provides access to the map's 'topo' basemap
            nextBasemap: "topo-vector" // allows for toggling to the 'hybrid' basemap
        });

        // Add widget to the top right corner of the view
        view.ui.add(toggle, "top-right");       

});
