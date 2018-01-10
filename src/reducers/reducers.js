import {
    PICK_DATA_SOURCE,
    PICK_DATA_SOURCE2,
    PICK_YEAR,
    LOAD_LAYER_DATA,      // see layerData below; this is for all the predefined layers
    TURN_LAYER_ON,        // layer name
    TURN_LAYER_OFF,       // ditto
    REQUEST_REMOTE_DATA,  // url, 
    ERROR_REMOTE_DATA,
    RECEIVE_REMOTE_DATA,
    LOAD_DATA_FROM_CACHE,
    CLEAR_DATA,
    DATA_SRC_CENSUS,
    DATA_SRC2_TOTALPOP
} from '../constants';

import figureOutURL from '../components/DataSelectComponent/urlcalc.js'
import { customReducer, isEmpty1 } from '../misc/misc.js'

// From the article - 
// https://hackernoon.com/a-guide-to-creating-web-applications-with-react-and-redux-2f6bc0775951
// [A] reducer is a function that is told what type of action is being performed
// (along with any parameters that are in the action’s payload), and its job is to
// change the application’s state accordingly. The reducer is a pure function that
// takes the last state and an action and returns the next state.


/* Shape of the data:
{
    action: '',             // current action being performed
    currentUrl: '',
    dataSrc: '',
    dataSrc2: '',
    isFetching: false,      // ie, fetching data for an overlay layer, will get added to extra layer?
    drawLatestData: false,
    currentOverlay: '',
    error: false,
    errorStr: '',
    layerData: {   // fixed number of layers; 'extra' layer is used to plot overlay data
        country: {
            layerId: 0,
            layerPtr: {},
            layerOn: true,
            gType: geoType.COUNTRY,
            arrayOfCountries: [
                // Data from json:    // COUNTRY              STATE                COUNTY
                name: "name",         // all
                fips: "US00",         // FIPS_10_, 2 chars    fips, 4 chars        COUNTYFP, 3 chars
                formal_name: "name",  // FORMAL_EN
                owner: "name",        // SOVEREIGNT
                abbrev: "AA",         // 2 chars              2 chars
                postal: "AA",         // 2 chars              2 chars
                region: "West",       // CONTINENT            region
                subregion: "WWest",   // SUBREGION            region_sub
                latitude: 40.0,       //                      state only
                longitude: 40.0,      //                      state only
                stateFP: "xx",        //                                           STATEFP, 2 chars
            ]
        },
        state: {
            layerOn: true,
            ...
        },
        county: {   // also: tract, district, city, township, etc
            layerOn: true,
            ...
        },
        extra: {
            layerOn: false,
            ...
        }
    },
    overlayData: {
        1: {
            url: 'string',
            data: [ // one overall array to hold all rows
                row[
                    {
                        value: 0,
                        state: 1,
                        county: 1,
                        tract: 1
                    }
                ] // lots of these rows
            ]
        },
        2: {
            url: 'string',
            data: [] // etc
        }
    }
}

const layerData = {
    name: 'country',
    isFetching: false, // this is for overlay data, not layer data
    layerOn: true,
    error: false,
    errorStr: "",
    //baseLayer: true,
    url: "",              // for overlays only; will also act as a hash, for caching
    gType: geoType.STATE, // default
    // Data from json:    // COUNTRY              STATE                COUNTY
    name: "name",         // all
    fips: "US00",         // FIPS_10_, 2 chars    fips, 4 chars        COUNTYFP, 3 chars
    formal_name: "name",  // FORMAL_EN
    owner: "name",        // SOVEREIGNT
    abbrev: "AA",         // 2 chars              2 chars
    postal: "AA",         // 2 chars              2 chars
    region: "West",       // CONTINENT            region
    subregion: "WWest",   // SUBREGION            region_sub
    latitude: 40.0,       //                      state only
    longitude: 40.0,      //                      state only
    stateFP: "xx",        //                                           STATEFP, 2 chars
    geometry: {}
};
*/


// rename posts to mapData
// create just enough here to make a simple ui button and output div such that hitting
// the button creates the url and prints it in the div.
const mainReducer = (state = { year: 2017, 
                               dataSrc: DATA_SRC_CENSUS,
                               dataSrc2: DATA_SRC2_TOTALPOP,
                               errorStr: '',
                               drawLatestData: false,
                               layerData: {},
                               action:''}, action) =>
{
    state.action = action.type;      // save what action was performed
    let urlResults = '';

    console.log("REDUCER start - state=", state, ", action=", action);

    switch (action.type)
    {
        case PICK_DATA_SOURCE:
             console.log("Reducer - PICK_DATA_SOURCE called");
             urlResults = figureOutURL(state.year, action.dataSource, state.dataSrc2);
             return Object.assign({}, state, {
                error: false,
                errorStr: '',
                dataSrc: action.dataSource,
                currentUrl: urlResults[0],
                currentUrlParams: urlResults[1]
             });

        case PICK_DATA_SOURCE2:
             console.log("Reducer - PICK_DATA_SOURCE2 called");
             urlResults = figureOutURL(state.year, state.dataSrc, action.dataSource);
             return Object.assign({}, state, {
                error: false,
                errorStr: '',
                dataSrc2: action.dataSource,
                currentUrl: urlResults[0],
                currentUrlParams: urlResults[1]
             });

        case PICK_YEAR:
             console.log("Reducer - PICK_YEAR called");
             urlResults = figureOutURL(action.year, state.dataSrc, state.dataSrc2);
             return {...state,
                error: false,
                errorStr: '',
                year: action.year,
                currentUrl: urlResults[0],
                currentUrlParams: urlResults[1]
             };

        case LOAD_LAYER_DATA:  // this is for all the predefined layers
             console.log("Reducer - LOAD_LAYER_DATA");
             let tempObj2 = { [action.layerName]: { ...action.data } };
             let tempObj3 = Object.assign({}, state.layerData, tempObj2);
             return Object.assign({}, state, { layerData: tempObj3 });

        case LOAD_DATA_FROM_CACHE:
             console.log("Reducer - LOAD_DATA_FROM_CACHE");
             //url = state.overlayData[action.key].url;
             return Object.assign({}, state, {
                isFetching: false,
                error: false,
                errorStr: '',
                currentOverlay: action.overlayKey,
                drawLatestData: true
             });

        case REQUEST_REMOTE_DATA: // to get overlay data; only use this action if the data is not in cache
             console.log("Reducer - REQUEST_REMOTE_DATA");
             urlResults = figureOutURL(state.year, state.dataSrc, state.dataSrc2);
             return Object.assign({}, state, {
                isFetching: true,
                error: false,
                errorStr: '',
                currentUrl: urlResults[0],
                currentUrlParams: urlResults[1]
             });

        case RECEIVE_REMOTE_DATA:
             console.log("Reducer - RECEIVE_REMOTE_DATA");
             let numLayers = (state.overlayData ? Object.keys(state.overlayData).length : 0); // old num layers
             let newLayerName = '' + (numLayers+1); // key is now a number as a string
             console.log("Reducer - RECEIVE_REMOTE_DATA, numLayers=", numLayers, ", name=", newLayerName);

             let newArray = customReducer (action.data);
             console.log("Reducer - RECEIVE_REMOTE_DATA, newArray=", newArray);
             console.log("Reducer - RECEIVE_REMOTE_DATA, currentUrlParams=", state.currentUrlParams);
             let hash = '';
             if (isEmpty1(state.currentUrlParams))
                hash = state.currentUrl;
             else
                hash = state.currentUrl + state.currentUrlParams.toString();

             return {...state, ...{
                isFetching: false,
                currentOverlay: newLayerName,
                drawLatestData: true,
                overlayData: {...state.overlayData, 
                              ...{ [newLayerName]: {
                                  url: state.currentUrl,
                                  urlParams: state.currentUrlParams,
                                  urlHash: hash,
                                  data: newArray}}}}};  // json data rcvd -> processed thru custom reducer fn}


/* TODO - Fix legend if we change the range and data values to be ln(value) so we can
display a big range of 85 to 10 million sanely. Legend min and max are wrong, but not
too hard to fix, but tooltip is also wrong; can we intercept this before it is 
displayed and reverse the ln(value) we did earlier?

Also - Get BLS data source working.
*/

        case ERROR_REMOTE_DATA:
             console.log("Reducer - ERROR_REMOTE_DATA");
             return {...state,
                error: true,
                errorStr: action.error.message,
                isFetching: false };

        case CLEAR_DATA:          // to remove all overlay data
             console.log("Reducer - CLEAR_DATA called");
             return {...state,
                currentOverlay: '',
                error: false,
                errorStr: '',
                drawLatestData: false };

        case TURN_LAYER_ON:
             console.log("Reducer - TURN_LAYER_ON called");
             return {...state,
                     ...{ layerData: {...state.layerData,
                     ...{ [action.layerName]: {...state.layerData[action.layerName],
                     ...{ layerOn: true }}}}}}; // works

        case TURN_LAYER_OFF:
             console.log("Reducer - TURN_LAYER_OFF called");
             //return {...state, layerData[action.layerName]: { layerOn: false }};
             // let tempLayerName = action.layerName;
             // let obj1 = { layerOn: false };
             // let obj2 = { ...state.layerData[tempLayerName], ...obj1 };
             // let obj3 = { [tempLayerName]: obj2 };
             // let obj4 = { ...state.layerData, ...obj3 };
             // let obj5 = { layerData: obj4};
             // console.log("Reducer - TURN_LAYER_OFF, obj1=", obj1, ", obj2=", obj2);
             // console.log("Reducer - TURN_LAYER_OFF, obj3=", obj3, ", obj4=", obj4);
             // console.log("Reducer - TURN_LAYER_OFF, obj5=", obj5);
             //return {...state, ...obj5}; // works
             //return {...state, ...{ layerData: obj4}}; // works
             //return {...state, ...{ layerData: { ...state.layerData, ...obj3 }}}; // works
             //return {...state, ...{ layerData: { ...state.layerData, ...{ [tempLayerName]: obj2 }}}}; // works
             //return {...state, ...{ layerData: { ...state.layerData, ...{ [tempLayerName]: { ...state.layerData[tempLayerName], ...obj1 }}}}}; // works
             return {...state,
                     ...{ layerData: {...state.layerData,
                     ...{ [action.layerName]: {...state.layerData[action.layerName],
                     ...{ layerOn: false }}}}}}; // works

        default:
             console.log("Reducer LayerData - default called");
             return state;
    }
}

export default mainReducer;