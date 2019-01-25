//import fetch from 'cross-fetch';
import getData from "../misc/get_data.js";
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
  LOAD_DATA_FROM_CACHE,
  DONE_LOADING_JSON
} from "../constants";

// Action creators. Imported and called by components/App.js.
export const pickDataSource = dataSource => {
  return {
    type: PICK_DATA_SOURCE,
    dataSource
  };
};

export const pickDataSource2 = dataSource => {
  return {
    type: PICK_DATA_SOURCE2,
    dataSource
  };
};

export const pickYear = year => {
  return {
    type: PICK_YEAR,
    year
  };
};

export const requestRemoteData = () => {
  return {
    type: REQUEST_REMOTE_DATA
  };
};

export const errorRemoteData = error => {
  return {
    type: ERROR_REMOTE_DATA,
    error
  };
};

export const receiveRemoteData = data => {
  return {
    type: RECEIVE_REMOTE_DATA,
    data
  };
};

export const clearData = () => {
  return {
    type: CLEAR_DATA
  };
};

export const turnLayerOn = layerName => {
  return {
    type: TURN_LAYER_ON,
    layerName
  };
};

export const turnLayerOff = layerName => {
  return {
    type: TURN_LAYER_OFF,
    layerName
  };
};

export const loadLayerData = (data, layerName) => {
  return {
    type: LOAD_LAYER_DATA,
    data,
    layerName
  };
};

export const loadDataFromCache = overlayKey => {
  return {
    type: LOAD_DATA_FROM_CACHE,
    overlayKey
  };
};

export const doneLoadingJson = () => {
  return {
    type: DONE_LOADING_JSON
  }
}

// Check cache; call with state.currentUrl.
function isOverlayDataCached(state, urlHash) {
  if (state.overlayData) {
    // for safety
    for (const [key, val] of Object.entries(state.overlayData)) {
      console.log(
        "actions - isOverlayDataCached, val.urlHash=" +
          val.urlHash +
          ", urlHash=" +
          urlHash
      );
      if (val.urlHash === urlHash) return key; // a string w/ the overlay name in it
    }
  }
  return "";
}

function fetchMapData(getState) {
  return dispatch => {
    dispatch(requestRemoteData());
    let state = getState();
    getData(state.currentUrl, state.currentUrlParams, dispatch);
    return;
  };
}

function shouldFetchMapData(state) {
  console.log(
    "actions - shouldFetchMapData, state=",
    state,
    ", url=",
    state.currentUrl,
    ", url params=",
    state.currentUrlParams
  );
  const overlayKey = isOverlayDataCached(
    state,
    state.currentUrl,
    state.currentUrlParams
  );
  if (!overlayKey) {
    // key is blank, fetch map data
    return true;
  } else {
    return false;
  }
}

export function fetchMapDataIfNeeded() {
  return (dispatch, getState) => {
    if (shouldFetchMapData(getState())) {
      return dispatch(fetchMapData(getState));
    } else {
      const localState = getState();
      let hash = localState.currentUrl;
      // let hash =
      //   localState.currentUrl + JSON.stringify(localState.currentUrlParams);
      for (const [key, val] of Object.entries(localState.overlayData)) {
        console.log(
          "actions - fetchMapDataIfNeeded, val.urlHash=" +
            val.urlHash +
            ", urlHash=" +
            hash
        );
        if (val.urlHash === hash) dispatch(loadDataFromCache(key));
      }
    }
  };
}
