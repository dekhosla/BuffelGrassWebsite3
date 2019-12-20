
require([    
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/FeatureLayer",
    "esri/widgets/Popup",
    "esri/widgets/Legend"
], function (Map, MapView, FeatureLayer, Popup, Legend) {

    var map = new Map({
        basemap: "hybrid"
    });

    var view = new MapView({
        container: "viewDiv",
        map: map,
        zoom: 9,
        center: [-110.9747, 32.2226]

               /* extent: {
        // autocasts as new Extent()
        xmin: -9177811,
    ymin: 4247000,
    xmax: -9176791,
    ymax: 4247784,
    spatialReference: 102100
    }*/
    });
    view.ui.add(new Legend({ view: view }), "bottom-left");

    var template = {
        // autocasts as new PopupTemplate()
        title: "{NAME} in {COUNTY}",
        content: [
            {
                // It is also possible to set the fieldInfos outside of the content
                // directly in the popupTemplate. If no fieldInfos is specifically set
                // in the content, it defaults to whatever may be set within the popupTemplate.
                type: "fields",
                fieldInfos: [
                    {
                        fieldName: "County",
                        label: "County"
                    },
                    {
                        fieldName: "CWM_Area",
                        label: "Area",
                        format: {
                            digitSeparator: true,
                            places: 0
                        }
                    },
                    {
                        fieldName: "commonname",
                        label: "Name",
                        format: {
                            digitSeparator: true,
                            places: 0
                        }
                    },
                    {
                        fieldName: "Obsdate",
                        label: "Recorder Date",
                        format: {
                            digitSeparator: true,
                            places: 0
                        }
                    }
                ]
            }
        ]
    };

/********************
* Add feature layer
********************/

// Carbon storage of trees in Warren Wilson College.
            var featureLayer = new FeatureLayer({
        url:
                    "https://services1.arcgis.com/Ezk9fcjSUkeadg6u/arcgis/rest/services/BGpts_from_JM/FeatureServer",
                 popupTemplate: template
});

            map.add(featureLayer);

        });