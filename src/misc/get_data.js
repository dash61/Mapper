//import fetch from 'cross-fetch';
//import 'whatwg-fetch';
//import axios from 'axios';
//import Cookies from 'js-cookie';
import { receiveRemoteData, errorRemoteData } from "../actions/actions.js";

// Just a helper function to get data from a URL and return it.
// Being async, it will first return an OK response that the fetch is underway.
// Later, it will return the data.
function getData(url, urlParams, dispatch) {
  let blsURLfound = url.search("api.bls.gov"); // -1 rtnd if not found
  let stringedData = JSON.stringify(urlParams);
  console.log("getData - searching for bls string, blsURLfound=", blsURLfound);
  console.log("getData - urlParams=", urlParams);
  console.log("getData - stringed urlParams=", stringedData);
  console.log("getData - stringed urlParams len=", stringedData.length);

  // const headers = new Headers({
  //     'Accept': 'application/json',
  //     'Content-Type': 'application/json'
  // });
  let requestData = {};

  if (blsURLfound === -1) {
    // use GET FOR CENSUS DATA
    requestData = new Request(url, {
      method: "GET",
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
          console.log("fetched response =", response);
          return response;
        } else {
          console.log("Data not available");
          throw Error(response.statusText);
        }
      })
      .then(response => response.json())
      .then(data => {
        console.log("RCVD DATA: ", data);
        dispatch(receiveRemoteData(data));
      })
      .catch(error => {
        console.log("There was an error:", error);
        dispatch(errorRemoteData(error));
      });
  }
  //else  // use POST FOR BLS - THIS DOESN'T WORK - GET CORS ERROR NO MATTER WHAT; NEED A WORKAROUND
  //{
  // requestData = new Request(url, {
  //     method: 'POST',
  //     headers: {'Accept': '*/*', //application/json', //, text/plain, */*',
  //               'Content-Type': 'application/json', //;odata=verbose;charset=utf-8',
  //               'Accept-Encoding': 'gzip, deflate',
  //               //'User-Agent': 'python-requests/2.18.4',
  //               'Connection': 'keep-alive'},
  //               // 'Content-Length': stringedData.length.toString()},
  //               // 'Access-Control-Allow-Origin': '*',
  //               // 'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token'},
  //     body: stringedData,
  //     credentials: 'same-origin',
  //     mode: 'no-cors',
  //     DataServiceVersion: '2.0'
  // });
  // const bodyUsed = requestData.bodyUsed;
  // console.log('getData - bodyUsed=', bodyUsed);
  // headers: {'Accept': 'application/json, text/plain, */*',
  //           'Content-Type': 'application/json'},
  // mode: 'cors'

  // requestData = {
  //     method: 'POST',
  //     headers: {'Accept': 'application/json, text/plain, */*',
  //               'Content-Type': 'application/json'},
  //     body: JSON.stringify(urlParams)
  // };

  //console.log('getData - requestData=', requestData);
  //console.log('getData - request bodyUsed=', requestData.bodyUsed);
  //{"seriesid":["CUUR0000SA0","SUUR0000SA0"],"startyear":"2011","endyear":"2012"}

  //fetch (requestData)
  // fetch (url, {
  //     method: 'POST',
  //     headers: {'Accept': '*/*', //application/json', //, text/plain, */*',
  //               'Content-Type': 'application/json;odata=verbose;charset=utf-8',
  //               'Accept-Encoding': 'gzip, deflate',
  //               //'User-Agent': 'python-requests/2.18.4',
  //               'Connection': 'keep-alive'},
  //               //'Content-Length': stringedData.length.toString()},
  //               // 'Access-Control-Allow-Origin': '*',
  //               // 'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token'},
  //     body: stringedData,
  //     credentials: 'same-origin',
  //     mode: 'no-cors',
  //     DataServiceVersion: '2.0'
  // }

  // let csrftoken = Cookies.get('csrftoken'); // probably don't need
  // console.log("get_data - csrftoken = ", csrftoken);
  // axios.defaults.headers.post['Content-Type'] = 'application/json';
  // axios.defaults.xsrfCookieName = "csrftoken";
  // axios.defaults.xsrfHeaderName = "X-CSRFToken";

  //axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
  //axios.defaults.headers.post['Access-Control-Allow-Headers'] = 'Origin, Content-Type, X-Auth-Token';
  // axios.post(url, {
  //     data: stringedData,
  //     headers: {'Content-type': 'application/json', 'Origin': 'http://localhost:3000'},
  //     withCredentials: true // false is the default
  // })
  // .then((response) => {
  //     if (response.ok) {
  //         console.log('fetched response =', response);
  //         return response;
  //     }
  //     else {
  //         console.log('Data not available, response=', response);
  //         throw Error(response.statusText);
  //     }
  // })
  // .then(response => response.json())
  // .then((data) => { console.log("RCVD DATA: ", data); dispatch(receiveRemoteData(data)); })
  // .catch((error) => { console.log('There was an error:', error); dispatch(errorRemoteData(error)); })
  //}
  //let data = {};
}

export default getData;
