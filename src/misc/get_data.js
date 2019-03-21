import { receiveRemoteData, errorRemoteData } from "../actions/actions.js";

// Just a helper function to get data from a URL and return it.
// Being async, it will first return an OK response that the fetch is underway.
// Later, it will return the data.
function getData(url, urlParams, dispatch) {
  let blsURLfound = url.search("api.bls.gov"); // -1 rtnd if not found

  let requestData = {};

  if (blsURLfound === -1) {
    requestData = new Request(url, {
      method: "GET",  // use GET FOR CENSUS DATA
      header: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        "X-Frame-Options": "SAMEORIGIN",  // I'm not sure if these 3 lines do anything helpful
        "X-Xss-Protection": "1; mode=block",
        "X-Content-Type-Options": "nosniff"
      }
    });

    fetch(url, requestData) // this works, (requestData) does not
      .then(response => {
        if (response.ok) {
          return response;
        } else {
          throw Error(response.statusText);
        }
      })
      .then(response => response.json())
      .then(data => {
        dispatch(receiveRemoteData(data));
      })
      .catch(error => {
        dispatch(errorRemoteData(error));
      });
  }
}

export default getData;
