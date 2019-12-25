/*BG controller for BG View*/

require([
    "esri/Map",
    "esri/views/SceneView",
    "esri/layers/FeatureLayer",
    "esri/layers/TileLayer",
    "esri/widgets/Legend",
    "esri/request",
    "esri/widgets/Expand",
    "esri/widgets/Bookmarks",
],
    function (Map, SceneView, FeatureLayer, TileLayer, Legend, esriRequest, Expand, Bookmarks) {
        /*****************************************************************
         * Create two TileLayer instances. One pointing to a
         * cached map service depicting U.S. male population and the other
         * pointing to a layer of roads and highways.
         *****************************************************************/
        var resultsDiv = document.getElementById("resultsDiv");

        var input = document.getElementById("inputUrl");

        // Define the 'options' for the request
        var options = {
            query: {
                f: "json"
            },
            responseType: "json"
        };
        //getting emodis DropDown
        // emodisDropDown();
        function emodisDropDown() {
            var url = "https://tiles.arcgis.com/tiles/Ezk9fcjSUkeadg6u/arcgis/rest/services/Modis2018/MapServer?f=pjson&cacheKey=8b49d656f0fc583b";
            esriRequest(url, options).then(function (response) {
                var emodisDropDownOptions = response.data.layers;
                var valTest = document.getElementById("modisDropSel");
                for (i = 0; i < emodisDropDownOptions.length; i++) {
                    var car = new Option(emodisDropDownOptions[i].name, emodisDropDownOptions[i].id);
                    valTest.options.add(car);
                }
            });
        }

        //getting prism DropDown
       // prismDropDown();
        function prismDropDown() {
            var url = "https://tiles.arcgis.com/tiles/Ezk9fcjSUkeadg6u/arcgis/rest/services/PICO_2011_2018/MapServer";
            esriRequest(url, options).then(function (response) {
                var prismDropDownOptions = response.data.layers;
                var valTest = document.getElementById("prismDropSel");
                for (i = 0; i < prismDropDownOptions.length; i++) {
                    var car = new Option(prismDropDownOptions[i].name, prismDropDownOptions[i].id);
                    valTest.options.add(car);
                }
            });
        }
        var housingLayer = new TileLayer({
            url: "https://tiles.arcgis.com/tiles/Ezk9fcjSUkeadg6u/arcgis/rest/services/NDVI_comp_258_0915_2019/MapServer",
            opacity: 0.6,
          
        });
       

        /*****************************************************************
         * Layers may be added to the map in the map's constructor
         *****************************************************************/
        var map = new Map({
            basemap: "oceans",
            layers: [housingLayer]           
        });
        var modisLayer = '';
        var prismLayer = '';

        /*****************************************************************
         * Or they may be added to the map using map.add()
         *****************************************************************/

        //map.layers.add(prismLayer);
        // MapView to SceneView
        var view = new SceneView({                    
            container: "viewDiv",
            map: map,
           /* camera: {
                // autocasts as new Camera()
                position: {
                    // autocasts as new Point()
                    x: 32.253460,
                    y: -110.911789,                  
                },            
               
            }*/
           // center: [-110.911789, 32.253460],
           // zoom: 6,
        });

        /*****************************************************************
         * The map handles the layers' data while the view and layer views
         * take care of renderering the layers
         *****************************************************************/
        view.on("layerview-create", function (event) {
            if (event.layer.id === "ny-housing") {
                // Explore the properties of the population layer's layer view here
                console.log(
                    "LayerView for male population created!",
                    event.layerView
                );
            }
            if (event.layer.id === "streets") {
                // Explore the properties of the transportation layer's layer view here
                // Explore the properties of the transportation layer's layer view here
                console.log("LayerView for streets created!", event.layerView);
            }
        });

        /*****************************************************************
         * Layers are promises that resolve when loaded, or when all their
         * properties may be accessed. Once the population layer has loaded,
         * the view will animate to it's initial extent.
         *****************************************************************/
   
           
                       
        view.when(function () {
            housingLayer.when(function () {
               view.goTo(housingLayer.fullExtent);
               // view.goTo(housingLayer.setExtent(startExtent));
            });
        });
                

        //default button hidden
        document.getElementById("prismShow").style.visibility = 'hidden';
        document.getElementById("modisShow").style.visibility = 'hidden';
        document.getElementById("dynamicShow").style.visibility = 'hidden';
        document.getElementById("diffShow").style.visibility = 'hidden';
        document.getElementById("bgShow").style.visibility = 'hidden';
        document.getElementById("targetShow").style.visibility = 'hidden';


        // button click okay for selection
        document.getElementById("clickOkay").addEventListener("click", function (event) {
            var prismDropVal = document.getElementById("prismSelVal").checked ? (document.getElementById("prismDropSel").value == "Please Select" ? undefined : document.getElementById("prismDropSel").value) : undefined;
            var modisDropVal = document.getElementById("modisSelVal").checked ? (document.getElementById("modisDropSel").value == "Please Select" ? undefined : document.getElementById("modisDropSel").value) : undefined;
            var dynamicsDropVal = document.getElementById("dynamicsSelVal").checked ? (document.getElementById("dynamicsDropSel").value == "Please Select" ? undefined : document.getElementById("dynamicsDropSel").value) : undefined;
            var diffDropVal = document.getElementById("diffSelVal").checked ? (document.getElementById("diffDropSel").value == "Please Select" ? undefined : document.getElementById("diffDropSel").value) : undefined;
            var bgDropVal = document.getElementById("bgSelVal").checked ? (document.getElementById("bgDropSel").value == "Please Select" ? undefined : document.getElementById("bgDropSel").value) : undefined;
            var targetDropVal = document.getElementById("targetSelVal").checked ? (document.getElementById("targetDropSel").value == "Please Select" ? undefined : document.getElementById("targetDropSel").value) : undefined;

            hideOptions(prismDropVal, modisDropVal, dynamicsDropVal, diffDropVal, bgDropVal, targetDropVal);
            clickOkay(map, prismDropVal, modisDropVal, dynamicsDropVal, diffDropVal, bgDropVal, targetDropVal, prismLayer, modisLayer);
        });

        //functio hide or show button
        function hideOptions(prismDropVal, modisDropVal, dynamicsDropVal, diffDropVal, bgDropVal, targetDropVal) {
            prismDropVal != undefined ? document.getElementById("prismShow").style.visibility = 'visible' : document.getElementById("prismShow").style.visibility = 'hidden';
            modisDropVal != undefined ? document.getElementById("modisShow").style.visibility = 'visible' : document.getElementById("modisShow").style.visibility = 'hidden';
            dynamicsDropVal != undefined ? document.getElementById("dynamicShow").style.visibility = 'visible' : document.getElementById("dynamicShow").style.visibility = 'hidden';
            diffDropVal != undefined ? document.getElementById("diffShow").style.visibility = 'visible' : document.getElementById("diffShow").style.visibility = 'hidden';
            bgDropVal != undefined ? document.getElementById("bgShow").style.visibility = 'visible' : document.getElementById("bgShow").style.visibility = 'hidden';
            targetDropVal != undefined ? document.getElementById("targetShow").style.visibility = 'visible' : document.getElementById("targetShow").style.visibility = 'hidden';
        }

        function clickOkay(map, prismDropVal, modisDropVal, dynamicsDropVal, diffDropVal, bgDropVal, targetDropVal, prismLayer, modisLayer) {

            var prismLayerToggle = document.getElementById("prismLayerSel");
            var ndviLayerToggle = document.getElementById("ndviLayerSel");
            var dynamicsLayerToggle = document.getElementById("dynamicsLayerSel");
            var differenceLayerToggle = document.getElementById("differenceLayerSel");
            var bgLayerToggle = document.getElementById("bgLayersel");
            var targetLayerToggle = document.getElementById("targetLayerSel");

            prismLayerToggle.checked = prismDropVal != undefined ? false : true;
            ndviLayerToggle.checked = modisDropVal != undefined ? false : true;
            dynamicsLayerToggle.checked = dynamicsDropVal != undefined ? false : true;
            differenceLayerToggle.checked = diffDropVal != undefined ? false : true;
            bgLayerToggle.checked = bgDropVal != undefined ? false : true;
            targetLayerToggle.checked = targetDropVal != undefined ? false : true;

            var test = map.allLayers._items.length;
            for (i = 0; i < test; i++) {
                var re = map.allLayers._items[0]
                map.allLayers.remove(re);
            }
            var length = map.layers._items.length;
            for (i = 0; i < length; i++) {
                var rr = map.layers._items[0]
                map.layers.remove(rr);
            }

            if (prismDropVal != undefined) {
                map.layers.remove(prismLayer);
                prismLayer = new TileLayer({
                    url: "https://tiles.arcgis.com/tiles/Ezk9fcjSUkeadg6u/arcgis/rest/services/" + prismDropVal + "/MapServer",
                    //url: "https://tiles.arcgis.com/tiles/Ezk9fcjSUkeadg6u/arcgis/rest/services/precipitation_buffelgrass_prism_0909_tif/MapServer",
                    //url: "https://tiles.arcgis.com/tiles/Ezk9fcjSUkeadg6u/arcgis/rest/services/USA_NPN_12_13_2019_climate_prism_ppt_tif/MapServer",
                    // This property can be used to uniquely identify the layer
                    visible: true
                });
                prismLayerToggle.checked = true;
                map.add(prismLayer);
            }
            if (modisDropVal != undefined) {
                map.layers.remove(modisLayer);
                if (modisDropVal) {
                    modisLayer = new TileLayer({
                        url: "https://tiles.arcgis.com/tiles/Ezk9fcjSUkeadg6u/arcgis/rest/services/" + modisDropVal + "/MapServer",
                        // This property can be used to uniquely identify the layer
                        visible: true
                    });
                    ndviLayerToggle.checked = true;
                }
                map.layers.add(modisLayer);
            }
            if (dynamicsDropVal != undefined) {
                dynamicsLayer = new TileLayer({
                    url: "https://tiles.arcgis.com/tiles/Ezk9fcjSUkeadg6u/arcgis/rest/services/mod09q1_a2018001_ndvi_img/MapServer",
                    // This property can be used to uniquely identify the layer
                    visible: true
                });
                dynamicsLayerToggle.checked = true;
                map.add(dynamicsLayer);
            }
            if (diffDropVal != undefined) {
                differenceLayer = new TileLayer({
                    url:"https://tiles.arcgis.com/tiles/Ezk9fcjSUkeadg6u/arcgis/rest/services/difference_0930_0915geo_img_20/MapServer",
                    //url: "https://tiles.arcgis.com/tiles/Ezk9fcjSUkeadg6u/arcgis/rest/services/difference_0930_0915geo_img/MapServer",
                    // This property can be used to uniquely identify the layer
                    visible: true
                });
                differenceLayerToggle.checked = true;

                map.add(differenceLayer);
            }
            if (bgDropVal != undefined) {
                bgLayer = new FeatureLayer({
                    url: "https://services1.arcgis.com/Ezk9fcjSUkeadg6u/arcgis/rest/services/BGpts_from_JM/FeatureServer",
                    visible: true,
                    zoom: 9,
                    center: [-110.9747, 32.2226]
                });
                bgLayerToggle.checked = true;
                map.add(bgLayer);
            }
            if (targetDropVal != undefined) {
                targetLayer = new TileLayer({
                    url: "https://tiles.arcgis.com/tiles/Ezk9fcjSUkeadg6u/arcgis/rest/services/BG_targets_2019_0930_3dyn_ppt0918m250_img/MapServer",
                    visible: true
                });
                targetLayerToggle.checked = true;
                map.add(targetLayer);
            }

          /*  var legend = new Legend({
                view: view,
                layerInfos: [
                    {
                        layer: prismLayer,
                        title: "Prism Layer Display"
                    }, {
                        layer: modisLayer,
                        title: "Prism Layer Display"
                    }, {
                        layer: dynamicsLayer,
                        title: "Prism Layer Display"
                    }, {
                        layer: differenceLayer,
                        title: "Prism Layer Display"
                    }, {
                        layer: bgLayer,
                        title: "Prism Layer Display"
                    }, {
                        layer: targetLayer,
                        title: "Prism Layer Display"
                    }
                ]

            });*/

            // Add widget to the bottom right corner of the view
          //  view.ui.add(legend, "top-left");
            var test11 = new Expand({
                view: view,
                content: new Legend({ view: view }),
                group: "top-left",
                expanded: false
            });
            view.ui.remove([test11, "top-left"]);
            view.ui.add([
                new Expand({
                    view: view,
                    content: new Legend({ view: view }),
                    group: "top-left",
                    expanded: true
                })/*,
                new Expand({
                    view: view,
                    content: new Bookmarks({ view: view }),
                    group:"top-left"
                }
                )*/],
                "top-left");

            ndviLayerToggle.addEventListener("change", function () {
                modisLayer.visible = ndviLayerToggle.checked;
            });
            prismLayerToggle.addEventListener("change", function () {

                prismLayer.visible = prismLayerToggle.checked;
            });
            dynamicsLayerToggle.addEventListener("change", function () {
                dynamicsLayer.visible = dynamicsLayerToggle.checked;
            });
            differenceLayerToggle.addEventListener("change", function () {
                differenceLayer.visible = differenceLayerToggle.checked;
            });
            bgLayerToggle.addEventListener("change", function () {
                bgLayer.visible = bgLayerToggle.checked;
            });
            targetLayerToggle.addEventListener("change", function () {
                targetLayer.visible = targetLayerToggle.checked;
            });
        }
    });

