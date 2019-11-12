require([
    "esri/WebMap",
    "esri/views/MapView",
    "esri/tasks/support/Query",
    "esri/core/watchUtils",
    "dojo/dom-construct",
    "dojo/on",
    "dojo/dom",
    "dojo/domReady!"
], function (WebMap, MapView, Query, watchUtils, domConstruct, on, dom) {

    /******************************************************************
     *
     * Webmap example
     *
     ******************************************************************/

    // Step 1: Pass a webmap instance to the map and specify the id for the webmap item
    var map = new WebMap({
        portalItem: { // autocast (no need to specifically require it above)
            id: "dfda29a241064bc8b32e409bb2814012"
        }
    });

    var view = new MapView({
        container: "viewDiv",
        // Step 2: Set the view's map to that of the specified webmap above
        map: map,
        zoom: 9,
        center: [-87.623177, 41.881832],
    });

});