require([
    "esri/map",
    "esri/layers/CSVLayer",
    "esri/Color",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/renderers/SimpleRenderer",
    "esri/InfoTemplate",
    "esri/urlUtils",
    "dojo/domReady!"
], function (
    Map, CSVLayer, Color, SimpleMarkerSymbol, SimpleRenderer, InfoTemplate, urlUtils
) {
        urlUtils.addProxyRule({
            proxyUrl: "/proxy",
            urlPrefix: "earthquake.usgs.gov"
        });
        map = new Map("map", {
            basemap: "gray",
            center: [-60, -10],
            zoom: 4
        });
        csv = new CSVLayer("http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.csv", {
            copyright: "USGS.gov"
        });
        var orangeRed = new Color([238, 69, 0, 0.5]); // hex is #ff4500
        var marker = new SimpleMarkerSymbol("solid", 15, null, orangeRed);
        var renderer = new SimpleRenderer(marker);
        csv.setRenderer(renderer);
        var template = new InfoTemplate("${type}", "${place}");
        csv.setInfoTemplate(template);
        map.addLayer(csv);
    });
