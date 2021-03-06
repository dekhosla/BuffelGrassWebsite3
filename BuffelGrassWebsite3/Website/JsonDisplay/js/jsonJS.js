﻿
require(["esri/map",
    "esri/graphic",
    "esri/layers/FeatureLayer",
    "esri/InfoTemplate",
    "esri/graphicsUtils",
    "esri/Color",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/symbols/SimpleLineSymbol",
    "esri/symbols/SimpleFillSymbol",
    "esri/request",
    "esri/geometry/Point",
    "esri/geometry/Multipoint",
    "esri/geometry/Polyline",
    "esri/geometry/Polygon",
    "dojo/keys",
    "dojo/on",
    "dojo/dom",
    "dojo/domReady!"],
    function (Map, Graphic, FeatureLayer, InfoTemplate, graphicsUtils, Color, SimplePointSymbol, SimpleLineSymbol, SimpleFillSymbol, esriRequest, Point, MulitPoint, Polyline, Polygon, keys, on, dom) {
        "use strict";

        // Create map
        var map = new Map("mapDiv", {
            basemap: "hybrid",
            center: [-111.0937, 34.0489],
            zoom: 6
        });

        // GeoJSON layer
        var featureLayer,
            simplePointSym = new SimplePointSymbol(),
            simpleLineSym = new SimpleLineSymbol("solid", new Color([50, 50, 50, 1]), 1),
            simplePolygonSym = new SimpleFillSymbol("solid", simpleLineSym, new Color([255, 50, 50, 0.5]));

        // Set popup
        var popup = map.infoWindow;
        popup.highlight = false;
        popup.titleInBody = false;
        //popup.domNode.style.marginTop = "-5px";
        popup.domNode.className += " light";

        // Wire UI events
        on(dom.byId("btnAddCanada"), "click", getGeoJSON);
        on(dom.byId("btnAddUsa"), "click", getGeoJSON);
        on(dom.byId("btnPointData"), "click", getGeoJSON);
        on(dom.byId("btnCrimeData"), "click", getGeoJSON);
        on(dom.byId("btnBuffelData"), "click", getGeoJSON);
       

        // Get the GeoJSON to add - file or endpoint will work
        function getGeoJSON(e) {
            var requestHandle,
                val = e.currentTarget.dataSrc;
            filePath = "http://localhost:51179/Website/Data/" + val;

            // xhr request to get data
            requestHandle = esriRequest({
                url: filePath,
                handleAs: "json"
            });
            requestHandle.then(addGeoJSONLayer, errorLoadingGeoJSON);
        }

        function requestSucceeded(response, io) {
            // Add to map
            addGeoJSONLayer(response);
        }

        function requestFailed(error, io) {
            console.log("Could not load GeoJSON. " + error);
        }

        // GeoJSON to ArcGIS geometry type
        function getEsriGeometryType(geometryGeoJson) {
            var type;
            switch (geometryGeoJson) {
                case "Point":
                    type = "esriGeometryPoint";
                    break;
                case "MultiPoint":
                    type = "esriGeometryMultipoint";
                    break;
                case "LineString":
                    type = "esriGeometryPolyline";
                    break;
                case "Polygon":
                    type = "esriGeometryPolygon";
                    break;
                case "MultiPolygon":
                    type = "esriGeometryPolygon";
                    break;
                case "Feature Layer":
                    type = "esriGeometryPoint";
                    break;
            }

            return type;
        }

        function getEsriSymbol(geometryType) {
            var sym;
            switch (geometryType) {
                case "esriGeometryPoint":
                    sym = simplePointSym;
                    break;
                case "esriGeometryMultipoint":
                    sym = simplePointSym;
                    break;
                case "esriGeometryPolyline":
                    sym = simpleLineSym;
                    break;
                case "esriGeometryPolygon":
                    sym = simplePolygonSym;
                    break;
            }
            return sym;
        }

        function createFeatureCollection(geometryType) {
            // TODO - need to pull definition from GeoJSON attributes!
            var layerDefinition = {
                "geometryType": geometryType,
                "objectIdField": "ObjectID",
                "fields": [{
                    "name": "ObjectID",
                    "alias": "ObjectID",
                    "type": "esriFieldTypeOID"
                }, {
                    "name": "type",
                    "alias": "Type",
                    "type": "esriFieldTypeString"
                }]
            };
            var featureCollection = {
                layerDefinition: layerDefinition,
                featureSet: {
                    features: [],
                    geometryType: geometryType
                }
            };
            return featureCollection;
        }

        function createFeature(arcgis, sym) {
            var shape = new Graphic(arcgis).setSymbol(sym);
            // Do other things with shape...
            return shape;
        }

        // Use Terraformer to convert geojson to arcgis json
        function createFeatureSet(geojson, geometryType) {
            var featureSet = [];
            // convert the geojson object to a arcgis json representation
            var primitive = new Terraformer.FeatureCollection(geojson);
            var arcgis = Terraformer.ArcGIS.convert(primitive);
            // NOTE: Assumes same geojson geometry type for entire file!
            var sym = getEsriSymbol(geometryType);
            for (var i = 0; i < arcgis.length; i++) {
                featureSet.push(createFeature(arcgis[i], sym));
            }
            return featureSet;
        }

        // Create a feature layer for the GeoJSON
        function addGeoJSONLayer(geojson) {
            if (!geojson.features.length) {
                return;
            }
            removeGeoJSONLayer();
            // Get geometry type - assume same geometry for entire file!
            var esriGeometryType = getEsriGeometryType(geojson.features[0].geometry.type);
            // Create an skeleton collection and popup definition
            var featureCollection = createFeatureCollection(esriGeometryType);
            var infoTemplate = new InfoTemplate("GeoJSON Data", "${*}");
            // Create feature layer
            featureLayer = new FeatureLayer(featureCollection, {
                mode: FeatureLayer.MODE_SNAPSHOT,
                outFields: ["*"],
                infoTemplate: infoTemplate
            });
            // Add it to the map
            map.addLayer(featureLayer);
            // Add graphics to the featurelayer
            var featureSet = createFeatureSet(geojson, esriGeometryType);
            featureLayer.applyEdits(featureSet, null, null);
        }

        // Remove existing layer
        function removeGeoJSONLayer() {
            if (featureLayer) {
                map.removeLayer(featureLayer);
                map.infoWindow.hide();
            }
        }

        // Error
        function errorLoadingGeoJSON(e) {
            console.log("Error loading GeoJSON. " + e);
        }

    });
