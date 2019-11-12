require(["esri/map",
    "esri/toolbars/draw",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/symbols/SimpleLineSymbol",
    "esri/symbols/CartographicLineSymbol",
    "esri/graphic",
    "dojo/_base/Color",
    "dojo/query",
    "dojo/on",
    "dojo/dom",
    "dojo/domReady!"],
      function(Map, Draw, SimpleMarkerSymbol, SimpleLineSymbol, CartographicLineSymbol, Graphic, color, query, on, dom) {
        "use strict"

        var tb;

    // Create map
        var map = new Map("mapDiv", {
        basemap: "streets",
    center: [-122.31, 47.67],
    zoom: 8
  });

  var popup = map.infoWindow;
  popup.highlight = false;
  popup.titleInBody = false;
  popup.domNode.className += " light";

  // Wire events
  on(map, "load", initToolbar);
  // Wire UI events
 // on(dom.byId("addPoint"),"click", setActiveTool);
  //on(dom.byId("addLine"),"click", setActiveTool);
  on(dom.byId("addPolygon"),"click", setActiveTool);
  on(dom.byId("clear"),"click", setActiveTool);

  // Load the drawing toolbar widget
        function initToolbar() {
        tb = new Draw(map);
    // Do something after graphics are sketched on the map
    tb.on("draw-end", addGraphic);
    // Override the default marker symbol
    tb.markerSymbol = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_SQUARE, 7,
      new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new color([255,0,0]), 1),
      new color([255,0,0,1]));
  }

  // Set the active draw tool and lock the map
        function setActiveTool(e) {
          var esriToolType = e.currentTarget.id;
          switch (esriToolType) {
            case "addPoint":
      esriToolType = Draw.POINT;
      setMessage("Click the map to add a point");
      break;
    case "addLine":
      esriToolType = Draw.POLYLINE;
      setMessage("Click the map. Double-click to finish line.");
      break;
    case "addPolygon":
      esriToolType = Draw.POLYGON;
      setMessage("Click the map. Double-click to finish polygon.");
      break;
    default:
      setMessage("Click a button to start");
      esriToolType = null;
  }

          if (esriToolType) {
        tb.activate(esriToolType);  // Example type - Draw.POINT
    map.disablePan();
    map.disableDoubleClickZoom();
          } else {
        tb.deactivate();
    map.enablePan();
    map.enableDoubleClickZoom();
    map.graphics.clear();
  }
  setSelected(e.currentTarget);
}

// Add the graphic with symbol
        function addGraphic(evt) {
          var geometry = evt.geometry;
    var symbol = dom.byId("symbol").value;
          if (symbol) {
        symbol = eval(symbol);
    } else {
            switch (geometry.type) {
              case 'point':
      symbol = tb.markerSymbol;
      break;
    case 'polyline':
      symbol = tb.lineSymbol;
      break;
    case 'polygon':
      symbol = tb.fillSymbol;
      break;
    default:
  }
}
map.graphics.add(new Graphic(geometry, symbol));
}

        function setSelected(button) {
        query(".btn-group > .btn").removeClass("active");
    query(button).addClass("active");
  }

        function setMessage(msg) {
          var element = document.getElementById("userMessage");
    element.innerHTML = msg;
  }

    });