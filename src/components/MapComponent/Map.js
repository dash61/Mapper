import React, { Component } from "react"; //'preact-compat';
import { connect } from "react-redux"; //'preact-redux';
import { doneLoadingJson } from "../../actions/actions.js"; // action creators
import L from "leaflet";
import "leaflet-dvf";
import { basemapLayer } from "esri-leaflet"; // old: , tiledMapLayer
import { Map } from "react-leaflet"; // old: , TileLayer
import { countyNameLookup } from "./countyNames.js";
import "../../../node_modules/leaflet/dist/leaflet.css";
import "./map.css";
import { geoType } from "../../constants.js";
import { reformatData } from "../../misc/misc.js";
import {
  RECEIVE_REMOTE_DATA,
  CLEAR_DATA,
  LOAD_DATA_FROM_CACHE
} from "../../constants.js";
import $ from 'jquery';
import Legend from './legend';



// for large json data files, do: var data = JSON.parse(json_data);

// store the map configuration properties in an object,
// we could also move this to a separate file & import it if desired.
let config = {};
config.params = {
  center: [40.0, -100.0],
  zoom: 4,
  maxZoom: 20,
  minZoom: 2,
  imageBounds: [
    [48.1, -126.144], // latlng fmt
    [24.3, -69.35]
  ]
};
config.tileLayer = {
  //uri: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
  //uri: 'http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
  params: {
    //attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
    id: "",
    accessToken: process.env.REACT_APP_MAP_ACCESS_TOKEN,
    noWrap: false,
    continuousWorld: false,
    bounds: [[-90, -180], [90, 180]] // keep from duplicating world map
  }
};

class MyMap extends Component {
  constructor(props) {
    super(props);
    console.log("MyMap - props=", props); // loadLayerData is passed; call this to update the store (during init, and later)
    const { loadLayerData, turnLayerOn, turnLayerOff } = props; // why is mapData not used?
    this._mapNode = null;
    this.markers = [];
    this.geoData = [];
    this.loadLayerData = loadLayerData;
    this.turnLayerOn = turnLayerOn;
    this.turnLayerOff = turnLayerOff;
    this.legend = null;
    this.localDoneLoading = false;
    this.state = {
      // NOT a US state
      currentZoomLevel: config.params.zoom,
      map: null,
      countries: null,
      states: null,
      //states2: null,
      counties: null,
      countyNameLookup: null,
      ourLayerGroup: null,
      layerData: null,
      visible: false, // this is from some old code that I copied that deals w/ markers; inside zoomend fn
      baseMap: null,
    };
  }

  // This fn is only called once, when the states layer is created.
  // This should match setCountyStyle when zoom=4, highlightOn=false.
  countiesStyle = () => {
    // feature) {
    return {
      weight: 0.2,
      opacity: 0.0,
      color: "grey",
      dashArray: 4,
      fillOpacity: 0.0
      //fillColor : 'white',
    };
  };

  // This fn is only called once, when the states layer is created.
  // This should match setStateStyle when zoom=4, highlightOn=false.
  statesStyle = () => {
    // feature) {
    return {
      weight: 0.2,
      //opacity : 1,
      color: "grey",
      dashArray: 4,
      fillOpacity: 0.0
      //fillColor : 'white',
    };
  };

  // This fn is only called once, when the countries layer is created.
  countriesStyle = () => {
    // feature) {
    return {
      weight: 0.4,
      opacity: 0.7,
      color: "grey",
      fillOpacity: 0.0
      //fillColor : 'white',
    };
  };

  highlightFeatureState = e => {
    this.setStateStyle(e.target, this.state.currentZoomLevel, true);
    this.setCountyStyle(e.target, this.state.currentZoomLevel, true);
    if (!L.Browser.ie && !L.Browser.opera) {
      e.target.bringToFront();
    }
  };

  highlightFeatureCountry = e => {
    this.setCountryStyle(e.target, this.state.currentZoomLevel, true);
    if (!L.Browser.ie && !L.Browser.opera) {
      e.target.bringToFront();
    }
  };

  // This fn gets called once.
  setCountryStyle = (layer, zoom, highlightOn) => {
    let newWeight = 1;
    let newColor = "grey";
    let newFillOpacity = 0.0;
    let newOpacity = 0.7;

    if (zoom < 4) newWeight = 0.2;
    else if (zoom === 4) newWeight = 0.4;
    else if (zoom > 4) newWeight = 0.6;
    else if (zoom > 5) newWeight = 1.0;

    if (highlightOn) {
      newColor = "darkgrey";
      newFillOpacity = 0.3;
      newOpacity = 1.0;
      newWeight += 1.0;
    }

    layer.setStyle({
      weight: newWeight,
      opacity: newOpacity,
      color: newColor,
      fillOpacity: newFillOpacity,
      fillColor: "white"
    });
  };

  // This fn gets called once.
  setStateStyle = (layer, zoom, highlightOn) => {
    let newWeight = 1;
    let newColor = "grey";
    let newFillOpacity = 0.0;
    let newOpacity = 0.7;

    if (zoom < 4) newWeight = 0.2;
    else if (zoom === 4) newWeight = 0.2;
    else if (zoom > 4) newWeight = 0.2;

    if (highlightOn) {
      newColor = "darkblue";
      newFillOpacity = 0.3;
      newOpacity = 1.0;
      newWeight += 0.6;
    }

    layer.setStyle({
      weight: newWeight,
      opacity: newOpacity,
      color: newColor,
      dashArray: 4,
      fillOpacity: newFillOpacity,
      fillColor: "white"
    });
  };

  // This fn gets called once.
  setCountyStyle = (layer, zoom, highlightOn) => {
    let newWeight = 1;
    let newColor = "grey";
    let newFillOpacity = 0.0;
    let newOpacity = 0.7;
    //let marker = null;

    if (zoom > 8) {
      newWeight = 0.2;
      newOpacity = 0.7;
      // NOTE - TOPO MAPS ALREADY HAS THE NAMES OF THE COUNTIES IF ZOOM = 9 (not at 8 or 10).
      //        NAT GEO MAP AND OTHERS DO NOT.
      // TO get this to work - you may have to do what statesOnEachFeature does below:
      // create a marker for every county ahead of time, hide each one, then only show
      // one when you are at a sufficient zoom level and w/in the bounds + some distance.
      //
      // const name = layer.feature.properties.name; // THIS DOESN'T WORK
      // marker = new L.marker(layer.getBounds().getCenter(), { opacity: 0.01 }); //opacity may be set to zero
      // marker.bindTooltip("County", {permanent: true, className: "my-label", offset: [0, 0] });
      // marker.addTo(this.state.map);
    } else if (zoom >= 7) {
      newWeight = 0.2;
      newOpacity = 0.7;
    } else if (zoom < 7) {
      newOpacity = 0.0;
    }

    if (highlightOn) {
      newColor = "darkblue";
      newFillOpacity = 0.3;
      newOpacity = 1.0;
      newWeight += 0.6;
    }

    layer.setStyle({
      weight: newWeight,
      opacity: newOpacity,
      color: newColor,
      dashArray: 4,
      fillOpacity: newFillOpacity,
      fillColor: "white"
    });
  };

  resetHighlightState = e => {
    this.setStateStyle(e.target, this.state.currentZoomLevel, false);
    this.setCountyStyle(e.target, this.state.currentZoomLevel, false);
  };

  resetHighlightCountry = e => {
    this.setCountryStyle(e.target, this.state.currentZoomLevel, false);
  };

  zoomToFeature = e => {
    // pad fitBounds() so features aren't hidden under the Filter UI element
    var fitBoundsParams = {
      paddingTopLeft: [10, 10],
      paddingBottomRight: [10, 10]
    };
    // set the map's center & zoom so that it fits the geographic extent of the layer
    this.state.map.fitBounds(e.target.getBounds(), fitBoundsParams);
  };

  componentWillUnmount = () => {
    // code to run just before unmounting the component
    // this destroys the Leaflet map object & related event listeners
    //this.state.map.remove();
  };

  // componentWillMount = () => {
  //   console.log("cwm - entered");
  // }

  // This gets called once *per county* when the county2.json file is loaded.
  countiesOnEachFeature = (feature, layer) => {
    //console.log ("countiesOnEachFeature enter; feature=", feature);
    let tempObj = {};
    tempObj.name = feature.properties.NAME;
    tempObj.fips = feature.properties.COUNTYFP; // 3 chars
    tempObj.stateFP = feature.properties.STATEFP; // 2 chars
    this.geoData.push(tempObj);

    layer.on({
      mouseover: this.highlightFeatureCountry,
      mouseout: this.resetHighlightCountry,
      click: this.zoomToFeature
    });
  };

  // This gets called once *per state* when the states2.json file is loaded.
  statesOnEachFeature = (feature, layer) => {
    //console.log("Inside the statesOnEachFeature function!!!!!!!!!!!!");
    //this.markers.push(
    //    L.circleMarker(
    //        layer.getBounds().getCenter(),
    //        {
    //            radius : 0.0,
    //            opacity : 0,
    //            fillOpacity : 0
    //        }
    //    )
    //);
    //var markersCount = this.markers.length;
    //console.log("Num markers = " + markersCount);
    //this.markers[markersCount - 1].bindTooltip(
    //    feature.properties.name,
    //    {
    //        noHide : true,
    //        className : 'map-label',
    //        pane : 'mapPane'
    //    }
    //);
    //this.markers[markersCount - 1].addTo(this.state.map);
    //this.markers[markersCount - 1].hideLabel();
    let tempObj = {};
    tempObj.name = feature.properties.name;
    tempObj.fips = feature.properties.fips; // 4 chars
    tempObj.abbrev = feature.properties.abbrev;
    tempObj.postal = feature.properties.postal;
    tempObj.region = feature.properties.region;
    tempObj.subregion = feature.properties.region_sub;
    tempObj.latitude = feature.properties.latitude;
    tempObj.longitude = feature.properties.longitude;
    this.geoData.push(tempObj);

    layer.on({
      mouseover: this.highlightFeatureState,
      mouseout: this.resetHighlightState,
      click: this.zoomToFeature
    });
  };

  // This gets called once *per country* when the countries3a.json file is loaded.
  countriesOnEachFeature = (feature, layer) => {
    // if (feature.properties.NAME == 'Aruba')
    //     console.log ("countriesOnEachFeature enter; feature=", feature);
    let tempObj = {};
    tempObj.name = feature.properties.NAME;
    tempObj.fips = feature.properties.FIPS_10_; // 2 chars
    tempObj.formal_name = feature.properties.FORMAL_EN;
    tempObj.owner = feature.properties.SOVEREIGNT;
    tempObj.abbrev = feature.properties.ABBREV;
    tempObj.postal = feature.properties.POSTAL;
    tempObj.region = feature.properties.CONTINENT;
    tempObj.subregion = feature.properties.SUBREGION;
    this.geoData.push(tempObj);

    layer.on({
      mouseover: this.highlightFeatureCountry,
      mouseout: this.resetHighlightCountry,
      click: this.zoomToFeature
    });
  };

  // Turn on or off an overlay layer. Pass in name string of layer and on/off boolean.
  // This will add or remove the layer from the layers group.
  changeLayerVisibility = (layerName, isVisible) => {
    for (let key in this.state.layerData) {
      if (key === layerName) {
        let value = this.state.layerData[key];
        if (isVisible) {
          this.state.ourLayerGroup.addLayer(value.layerPtr);
          //this.state.layerData[key].visible = true;
          //this.setState({ layerData[key].visible: true });
          // return {...state,
          //         ...{ layerData: {...state.layerData,
          //         ...{ [action.layerName]: {...state.layerData[action.layerName],
          //         ...{ layerOn: true }}}}}}; // works

          this.setState(prevState => ({
            layerData: {
              ...prevState.layerData,
              ...{
                [key]: {
                  ...prevState.layerData[key],
                  ...{ visible: true }
                }
              }
            }
          }));
        } else {
          this.state.ourLayerGroup.removeLayer(value.layerPtr);
          //this.state.layerData[key].visible = false;
          //this.setState({ layerData[key].visible: false });
          this.setState(prevState => ({
            layerData: {
              ...prevState.layerData,
              ...{
                [key]: {
                  ...prevState.layerData[key],
                  ...{ visible: false }
                }
              }
            }
          }));
        }
      }
    }
  };

  // // taken from http://leafletjs.com/examples/choropleth/.
  // getColor = (d) =>
  // {
  //     return d > 1000 ? '#800026' :
  //            d > 500  ? '#BD0026' :
  //            d > 200  ? '#E31A1C' :
  //            d > 100  ? '#FC4E2A' :
  //            d > 50   ? '#FD8D3C' :
  //            d > 20   ? '#FEB24C' :
  //            d > 10   ? '#FED976' :
  //                       '#FFEDA0';
  // }

  // arrayToMap = (array, fromKey, toKey) =>
  // {
  // 		var map = {};
  // 		var item;
  // 		var from;
  // 		var to;
  //
  // 		for (var index = 0; index < array.length; ++index) {
  // 			item = array[index];
  // 			from = item[fromKey];
  // 			to = toKey ? item[toKey] : item;
  // 			map[from] = to;
  // 		}
  // 		return map;
  // }

  componentDidMount = () => {
    // code to run just after the component "mounts" / DOM elements are created

    // create the Leaflet map object
    if (!this.state.map) this.init(this._mapNode);

    let that = this;
    $.when(
      $.getJSON("https://s3.amazonaws.com/drl-mapperfiles/countries3a.json"),
      $.getJSON("https://s3.amazonaws.com/drl-mapperfiles/states2.json"),
      $.getJSON("https://s3.amazonaws.com/drl-mapperfiles/county2.json")
    ).then(
      (data, data2, data3) => {
        that.setState({countries: data[0], states: data2[0], counties: data3[0]});
        // that.setState({states: data2});
        // that.setState({counties: data3});
        console.log("cdm - received all 3 json files from S3");
        this.localDoneLoading = true;
        this.props.doneLoadingJson();
      },
      err => {
        console.log(err);
      }
    );

    // OLD WAY - GET EACH FILE ASYNCHRONOUSLY, BUT WE DON'T KNOW WHEN ALL
    //           3 ARE DONE. USE THE ABOVE TO KNOW THAT AND TURN OFF SPINNER.
    // $.getJSON("https://s3.amazonaws.com/drl-mapperfiles/countries3a.json", (data) => {
    //   console.log("cdm1 - grabbed countries data");
    //   that.setState({countries: data});
    // });
    // $.getJSON("https://s3.amazonaws.com/drl-mapperfiles/states2.json", (data) => {
    //   console.log("cdm2 - grabbed states data");
    //   that.setState({states: data});
    // });
    // $.getJSON("https://s3.amazonaws.com/drl-mapperfiles/county2.json", (data) => {
    //   console.log("cdm3 - grabbed counties data");
    //   that.setState({counties: data});
    // });

  };

  componentWillReceiveProps = nextprops => {
    console.log("CWRP - action=", nextprops.mapData.action);

    if (nextprops.mapData.action === CLEAR_DATA) {
      this.changeLayerVisibility("EXTRA", false);
      this.turnLayerOff("extra");
      if (this.state.map && this.legend)
      {
        //console.log("CWRP - Removing legend");
        this.legend.removeLegend();
        this.legend = null;
      }
      //this.props.clearData ();
    }

    if (nextprops.mapData.action === RECEIVE_REMOTE_DATA ||
        nextprops.mapData.action === LOAD_DATA_FROM_CACHE)
    {
      console.log("CWRP - going to draw new data, props=", nextprops);

      this.changeLayerVisibility("EXTRA", false);
      this.turnLayerOff("extra");
      if (this.state.map && this.legend)
      {
        //console.log("CWRP - Removing legend");
        this.legend.removeLegend();
        this.legend = null;
      }

      //overlay = +nextprops.mapData.currentOverlay; // convert to number
      let dataPtr =
        nextprops.mapData.overlayData[nextprops.mapData.currentOverlay].data;
      this.legend = new Legend (this.state.map);
      this.legend.init(dataPtr);

      let features = this.state.counties.features;
      let nameLookup = L.GeometryUtils.arrayToMap(
        this.state.countyNameLookup,
        "FIPS"
      );
      //let nameLookup = this.arrayToMap(this.state.countyNameLookup, 'FIPS');
      console.log("CWRP - features=", features,
        ", nameLookup=", nameLookup); // drl debug only

      for (let i = 0; i < features.length; ++i) {
        //features[i].properties.FIPS = features[i].id.toString();
        features[i].properties.FIPS =
          features[i].properties.STATEFP + features[i].properties.COUNTYFP;

        let countyInfo = nameLookup[features[i].properties.FIPS];

        if (countyInfo) {
          features[i].properties.county = countyInfo.County;
          features[i].properties.state = countyInfo.State;
          features[i].properties.name =
            countyInfo.County + ", " + countyInfo.State;
        }
      }

      let fillColor = this.legend.getFillColor();
      let useLog = this.legend.getUseLog();

      let options = {
        locationMode: L.LocationModes.LOOKUP,
        getIndexKey: function(location, record) {
          if (location) return location.text;
          else return null;
        },
        recordsField: null,
        codeField: "FIPS",
        locationLookup: this.state.counties, // A GeoJSON FeatureCollection that will be used to lookup boundaries/location
        locationTextField: "FIPS",
        //includeBoundary: true, // Whether or not to include a background boundary so people know what boundary each marker is associated with
        layerOptions: {
          fillOpacity: 0.5,
          opacity: 1.0,
          weight: 0.0,
          numberOfSides: 50 //,
          //gradient: true
        },
        tooltipOptions: {
          iconSize: new L.Point(130, 60),
          iconAnchor: new L.Point(-5, 60)
        },
        displayOptions: {}
      };
      options.displayOptions["Legend"] = {
        fillColor: fillColor, // fillColor.minPoint = Point, has x and y
        //color: color // ditto
      };
      console.log("CWRP - options=", options);

      let reformattedArray = reformatData(dataPtr, useLog);
      //console.log("CWRP - hasOwnProperty FIPS=", reformattedArray.hasOwnProperty("FIPS"));

      // probably passing wrong data struct in 1st arg:
      let countyChoropleth = new L.ChoroplethDataLayer(
        reformattedArray,
        options
      ); // old: countyStats

      //let radius = new L.LinearFunction([range[0], 5], [range[1], 20]);
      // var symbolOptions = $.extend(true, {}, options);

      // symbolOptions.layerOptions.gradient = true;
      // symbolOptions.displayOptions[field].radius = radius;

      // var countySymbols = new L.DataLayer(countyStats, symbolOptions);
      // layerControl.addOverlay(countyChoropleth, 'Choropleth');
      // layerControl.addOverlay(countySymbols, 'Symbols');

      this.state.map.addLayer(countyChoropleth);

      //statesLayer.setStyle(this.statesStyle);
      this.state.ourLayerGroup.addLayer(countyChoropleth);
      const layerID = this.state.ourLayerGroup.getLayerId(countyChoropleth);
      this.setState(prevState => ({
        layerData: {
          ...prevState.layerData,
          ...{
            ["EXTRA"]: {
              layerID: layerID,
              layerPtr: countyChoropleth,
              layerOn: true,
              gType: geoType.COUNTY
            }
          }
        }
      }));

      // this.state.layerData['EXTRA'] = {
      //     layerID: layerID,
      //     layerPtr: countyChoropleth,
      //     layerOn: true,
      //     gType: geoType.STATE
      // };
      // TO clear an array: a = []; OR: a.splice(0, a.length); OR: a.length = 0;
      //this.geoData.splice(0, this.geoData.length); // empty array
      //this.geoData.length = 0;
      this.loadLayerData(this.state.layerData["EXTRA"], "extra");
    }
  };

  // From leaflet docs: "There are two types of layers: (1) base layers that are mutually exclusive
  // (only one can be visible on your map at a time), e.g. tile layers, and (2) overlays, which are
  // all the other stuff you put over the base layers."
  // (Overlays can get more geom or can be markers, tooltips, etc.)

  // Create a L.layerGroup, then add all overlays you want visible to that group (.addLayer).
  // Remove them via removeLayer.

  parse (file)
  {
    const reader = new FileReader();
    console.log("file to read = " + file);
    reader.readAsText(file);
    const result = new Promise((resolve, reject) => {
      reader.onload = function(event) {
      resolve(reader.result)
      }
    })
    //console.log(result)
  }

  // readTextFile(file)
  // {
  //   console.log("file to read = " + file);
  //   var rawFile = new XMLHttpRequest();
  //   rawFile.open("GET", file, false);
  //   rawFile.onreadystatechange = function ()
  //   {
  //     if(rawFile.readyState === 4)
  //     {
  //       if(rawFile.status === 200 || rawFile.status === 0)
  //       {
  //         console.log("readTextFile: "+JSON.stringify(rawFile));
  //         console.log("readTextFile - read the file ok");
  //         return rawFile.responseText;
  //       }
  //       else {
  //         console.log("readTextFile - did NOT read the file");
  //       }
  //     }
  //   }
  //   rawFile.send(null);
  // }

  // - Use map.removeLayer(layerptr); to remove a layer.
  // - L.control.layers adds a control to the map so you can switch on/off layers manually:
  //   Could also create a control layers group and use that to control on/off of layers:
  //   var controlLayers = L.control.layers().addTo(map);
  //   var geojsonLayer = L.geoJson(geojson, ...).addTo(map); // don't add to map if don't want to show initially, just create
  //   controlLayers.addOverlay(geojsonLayer, 'name of it');
  init(id) {
    if (this.state.map) return;
    //console.log("init - id=", id, ", countries=", countries);

    // console.log('Current window pathname: ' + window.location.pathname);
    // console.log('Current doc pathname: ' + document.location.pathname);
    // console.log('Current directory: ' + process.cwd());
    // console.log('public url: ', process.env.REACT_APP_PUBLIC_URL);

    // this function creates the Leaflet map object and is called after the Map component mounts
    const leafletMap = id.leafletElement;

    // let blob = this.readTextFile('file://data/county2.json');
    // console.log("blob = "+JSON.stringify(blob));
    // let fileData = this.parse(blob);
    // let counties = JSON.parse(fileData);
    //
    // blob = this.readTextFile(process.env.REACT_APP_PUBLIC_URL + '/data/countries3a.json');
    // fileData = this.parse(blob);
    // let countries = JSON.parse(fileData);
    //
    // fileData = this.parse(process.env.PUBLIC_URL + '/data/states2.json');
    // let states = JSON.parse(fileData);

    //import states from "../../../data/states2.json";
    //import countries from "../../../data/countries3a.json";;
    //import counties from "../../../data/county2.json";


    // set our state to include the tile layer
    this.setState({ map: id.leafletElement }); // DON'T USE this.state.map BELOW; WON'T WORK!
    this.setState({
      // states: states,
      // countries: countries,
      // counties: counties,
      countyNameLookup: countyNameLookup
    });

    // a TileLayer is used as the "basemap"
    //this.state.baseMap = L.tileLayer(config.tileLayer.uri, config.tileLayer.params).addTo(this.state.map);
    this.setState({
      baseMap: basemapLayer("Topographic", config.tileLayer.params).addTo(
        leafletMap
      )
    }); // or "Streets"

    leafletMap.createPane("countiesPane");
    leafletMap.getPane("countiesPane").style.zIndex = 641; // set below state until zoom > 6
    leafletMap.createPane("statesPane");
    leafletMap.getPane("statesPane").style.zIndex = 645;
    leafletMap.createPane("countriesPane");
    leafletMap.getPane("countriesPane").style.zIndex = 640;

    leafletMap.fitBounds(config.params.imageBounds);
    leafletMap.on("zoomend", e => {
      const updatedZoomLevel = leafletMap.getZoom();
      this.handleZoomLevelChange(updatedZoomLevel);
      //console.log("new zoom is ", updatedZoomLevel, ", local state=", this.state);
      //console.log("new zoom is ", updatedZoomLevel, ", store state=", this.props.mapData);
      if (updatedZoomLevel > 5) {
        if (!this.state.visible) {
          for (let i = 0; i < this.markers.length; i++) {
            //this.markers[i].showLabel();
          }
          this.setState({ visible: true });
        }
      } else {
        if (this.state.visible) {
          for (let i = 0; i < this.markers.length; i++) {
            //this.markers[i].hideLabel();
          }
          this.setState({ visible: false });
        }
      }
    });
  }

  componentDidUpdate(prevProps, prevState) {
    // code to run when the component receives new props or state
    // check to see if geojson is stored, map is created, and geojson overlay needs to be added
    //console.log("cdu - states = " + this.state.states);
    if (this.state.states && this.state.countries && this.state.counties) {
      //this.props.doneLoadingJson();

      //console.log ("componentDidUpdate - enter");
      // 1. Create a group layer object.
      // 2. Create a layer data structure for each layer.
      // 3. Add each layer to the group.
      // 4. Add group to map.
      // Now you can independently add/remove layers from group and they will add/remove from map.
      if (this.state.map && !this.state.ourLayerGroup) {
        //console.log ("componentDidUpdate - ourLayerGroup =", this.state.ourLayerGroup);
        //return;

        const ourLayerGroup = L.layerGroup(); // 1. Create a group layer object.
        this.setState({ ourLayerGroup: ourLayerGroup });

        // Create layer overlay for countries -------------------------------
        const countriesLayer = L.geoJSON(this.state.countries, {
          //style : this.countriesStyle, // don't need to call this per country, apply later to whole layer
          onEachFeature: this.countriesOnEachFeature,
          pane: "countriesPane"
        });

        countriesLayer.setStyle(this.countriesStyle);
        ourLayerGroup.addLayer(countriesLayer);
        let layerID = ourLayerGroup.getLayerId(countriesLayer);
        let layerData = {};
        layerData["COUNTRY"] = {
          layerID: layerID,
          layerPtr: countriesLayer,
          layerOn: true,
          gType: geoType.COUNTRY,
          arrayOfCountries: [...this.geoData]
        };
        this.geoData.splice(0, this.geoData.length); // empty array
        this.geoData.length = 0; // and make sure it's empty
        this.loadLayerData(layerData["COUNTRY"], "country");

        // Create layer overlay for states  ---------------------------------
        const statesLayer = L.geoJSON(this.state.states, {
          //style : this.statesStyle, // don't need to call this per state, apply later to whole layer
          onEachFeature: this.statesOnEachFeature,
          pane: "statesPane"
        });
        statesLayer.setStyle(this.statesStyle);
        ourLayerGroup.addLayer(statesLayer);
        layerID = ourLayerGroup.getLayerId(statesLayer);
        layerData["STATE"] = {
          layerID: layerID,
          layerPtr: statesLayer,
          layerOn: true,
          gType: geoType.STATE,
          arrayOfStates: [...this.geoData]
        };
        // TO clear an array: a = []; OR: a.splice(0, a.length); OR: a.length = 0;
        this.geoData.splice(0, this.geoData.length); // empty array
        this.geoData.length = 0;
        this.loadLayerData(layerData["STATE"], "state");

        // Create layer overlay for counties --------------------------------
        const countiesLayer = L.geoJSON(this.state.counties, {
          //style : this.countiesStyle, // don't need to call this per county, apply later to whole layer
          onEachFeature: this.countiesOnEachFeature,
          pane: "countiesPane"
        });
        countiesLayer.setStyle(this.countiesStyle);
        ourLayerGroup.addLayer(countiesLayer);
        layerID = ourLayerGroup.getLayerId(countiesLayer);
        layerData["COUNTY"] = {
          layerID: layerID,
          layerPtr: countiesLayer,
          layerOn: true,
          gType: geoType.COUNTY,
          arrayOfCounties: [...this.geoData]
        };
        // TO clear an array: a = []; OR: a.splice(0, a.length); OR: a.length = 0;
        this.geoData.splice(0, this.geoData.length); // empty array
        this.geoData.length = 0;
        this.loadLayerData(layerData["COUNTY"], "county");

        //this.turnLayerOff('country'); // JUST A TEST!!!!!!!!!!!!!!

        this.setState({ layerData: layerData });
        console.log("componentDidUpdate - layerData =", layerData);

        ourLayerGroup.addTo(this.state.map); // add entire group to map
        console.log("componentDidUpdate - local state =", this.state);

        // TODO - *TRY* LATER - CLEAR OUT ORIGINAL this.states, this.countries, this.counties
        // objects; data should already be in the layers now

        var esriNatGeo = basemapLayer(
          "NationalGeographic",
          config.tileLayer.params
        );
        var esriStreets = basemapLayer("Streets", config.tileLayer.params);
        var esriShadedRelief = basemapLayer(
          "ShadedRelief",
          config.tileLayer.params
        );
        var esriImagery = basemapLayer("Imagery", config.tileLayer.params);
        var esriTerrain = basemapLayer("Terrain", config.tileLayer.params);

        // json object for layer switcher control basemaps
        var baseLayers = {
          "Esri Topographic": this.state.baseMap,
          "National Geographic": esriNatGeo,
          Streets: esriStreets,
          "Shaded Relief": esriShadedRelief,
          Imagery: esriImagery,
          Terrain: esriTerrain
        };

        // add layer groups to layer switcher control
        var controlLayers = L.control.layers(baseLayers).addTo(this.state.map);
        controlLayers.setPosition("bottomright");
      }
    }
  }

  // NOTE - country zindex is kept at 640.
  handleZoomLevelChange = newZoomLevel => {
    if (!this.localDoneLoading)
      return;

    this.setState({ currentZoomLevel: newZoomLevel });
    if (newZoomLevel <= 3) {
      this.state.map.getPane("statesPane").style.zIndex = 635; // pop below countries pane
      this.state.map.getPane("countiesPane").style.zIndex = 630; // pop below states pane
    } else if (newZoomLevel < 7) {
      this.state.map.getPane("statesPane").style.zIndex = 645; // pop above countries pane
      this.state.map.getPane("countiesPane").style.zIndex = 630; // pop below states pane
    } else {
      this.state.map.getPane("statesPane").style.zIndex = 645; // pop above countries pane
      this.state.map.getPane("countiesPane").style.zIndex = 648; // pop above states pane
    }
    //console.log ("handleZoomLevelChange - layerData = ", this.state.layerData);
    this.setStateStyle(
      this.state.layerData["STATE"].layerPtr,
      newZoomLevel,
      false
    );
    this.setCountyStyle(
      this.state.layerData["COUNTY"].layerPtr,
      newZoomLevel,
      false
    );
    this.setCountryStyle(
      this.state.layerData["COUNTRY"].layerPtr,
      newZoomLevel,
      false
    );
  };

  render() {
    return (
      <div id="map-component">
        <Map
          ref={m => (this._mapNode = m)} // in React, this is a 'callback ref'
          center={config.params.center}
          zoom={config.params.zoom}
          maxZoom={config.params.maxZoom}
          minZoom={config.params.minZoom}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    mapData: state
  };
}

// pickYear etc below are all action creators imported above. These fns will be turned
// into props properties, though wrapped in another function that calls dispatch, so that
// invoking this.props.pickYear() will call dispatch to call that action on the reducer.
// Notice the (App) at the end. This means the connect call returns a react
// component class with all the internal wiring for redux, which then gets initialized
// with the App class. So it is kind of like a mix-in.

// Connect returns a component that links App to these new behaviors specified by the
// args passed to it.
export default connect(
  mapStateToProps,
  {
    doneLoadingJson
  }
)(MyMap);
