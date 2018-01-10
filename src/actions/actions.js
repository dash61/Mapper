//import fetch from 'cross-fetch';
import getData from '../misc/get_data.js'
import {
    PICK_DATA_SOURCE,
    PICK_DATA_SOURCE2,
    PICK_YEAR,
    LOAD_LAYER_DATA,
    TURN_LAYER_ON,
    TURN_LAYER_OFF,
    REQUEST_REMOTE_DATA,
    ERROR_REMOTE_DATA,
    RECEIVE_REMOTE_DATA,
    CLEAR_DATA,
    LOAD_DATA_FROM_CACHE
} from '../constants';

// Actions, from https://redux.js.org/docs/basics/Actions.html:
// Actions are payloads of information that send data from your application to your store.
// They are the only source of information for the store. You send them to the store
// using store.dispatch().

// Action creators are functions that create actions (actions are the payload, ie data,
// of the mechanism to update state). They just return an action.

// Action creators. Imported and called by components/App.js.
export const pickDataSource = (dataSource) => {
    return {
        type: PICK_DATA_SOURCE,
        dataSource
    };
}

export const pickDataSource2 = (dataSource) => {
    return {
        type: PICK_DATA_SOURCE2,
        dataSource
    };
}

export const pickYear = (year) => {
    return {
        type: PICK_YEAR,
        year
    };
}

export const requestRemoteData = () => {
    console.log("requestRemoteData - start");
    return {
        type: REQUEST_REMOTE_DATA
    };
}

export const errorRemoteData = (error) => {
    console.log("errorRemoteData - start, error=", error);
    return {
        type: ERROR_REMOTE_DATA,
        error
    };
}

export const receiveRemoteData = (data) => {
    console.log("receiveRemoteData - start");
    return {
        type: RECEIVE_REMOTE_DATA,
        data
    };
}

export const clearData = () => {
    return {
        type: CLEAR_DATA
    };
}

export const turnLayerOn = (layerName) => {
    return {
        type: TURN_LAYER_ON,
        layerName
    };
}

export const turnLayerOff = (layerName) => {
    return {
        type: TURN_LAYER_OFF,
        layerName
    };
}

export const loadLayerData = (data, layerName) => {
    return {
        type: LOAD_LAYER_DATA,
        data,
        layerName
    };
}

export const loadDataFromCache = (overlayKey) => {
    return {
        type: LOAD_DATA_FROM_CACHE,
        overlayKey
    };
}



// Check cache; call with state.currentUrl.
function isOverlayDataCached (state, urlHash)
{
    if (state.overlayData)   // for safety
    {
        console.log("actions - isOverlayDataCached, state=", state);
        for (const [key, val] of Object.entries(state.overlayData))
        {
            if (val.urlHash === urlHash)
                return key;  // a string w/ the overlay name in it
        }
    }
    return '';
}

function fetchMapData(getState) {
    console.log("actions - fetchMapData called, state=", getState());
    return dispatch => {
        dispatch(requestRemoteData());
        let state = getState();
        console.log("actions - fetchMapData, after requestRemoteData, state=", state);
        getData(state.currentUrl, state.currentUrlParams, dispatch);
        return;
    }
}

function shouldFetchMapData(state) {
    console.log("actions - shouldFetchMapData, state=", state, ", url=", state.currentUrl,
        ", url params=", state.currentUrlParams);
    const overlayKey = isOverlayDataCached (state, state.currentUrl, state.currentUrlParams);
    if (!overlayKey) {
        console.log("actions - shouldFetchMapData - key is blank, fetch map data");
        return true;
    }
    else {
        console.log("actions - shouldFetchMapData - key is ", overlayKey, ", use cache");
        return false;
    }
}

export function fetchMapDataIfNeeded() {
    console.log("actions - fetchMapDataIfNeeded called");
    return (dispatch, getState) => {
        if (shouldFetchMapData(getState())) {
            return dispatch(fetchMapData(getState));
        }
        else
        {
            const localState = getState();
            let hash = localState.currentUrl + localState.currentUrlParams.toString();
            console.log("fetchMapDataIfNeeded - url hash=", hash);
            for (const [key, val] of Object.entries(localState.overlayData))
            {
                if (val.urlHash === hash)
                    dispatch(loadDataFromCache(key));
            }
        }
    }
}

