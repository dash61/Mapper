import React, { Component } from "react"; //'preact-compat';
import { connect } from "react-redux"; //'preact-redux';
import {
  pickDataSource,
  pickDataSource2,
  pickYear,
  requestRemoteData,
  errorRemoteData,
  receiveRemoteData,
  clearData,
  loadLayerData,
  turnLayerOn,
  turnLayerOff,
  fetchMapDataIfNeeded,
  doneLoadingJson
} from "../actions/actions.js"; // action creators
import "./App.css";
import MyMap from "./MapComponent/Map";
import DataSelect from "./DataSelectComponent/DataSelect";
import Spinner from './Spinner/spinner';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      blah: 5
    };
    //const { outerObj } = this.props;
    console.log("App ctor - props = ", props); // drl debug
  }

  // Invoking one of these will call dispatch to call that action on the reducer.
  // props.pickDataSource = dataSource => {
  //   console.log("App class - props.pickDataSource called");
  //   this.props.pickDataSource(dataSource);
  // };
  //
  // props.pickDataSource2 = dataSource => {
  //   console.log("App class - props.pickDataSource2 called");
  //   this.props.pickDataSource2(dataSource);
  // };
  //
  // props.pickYear = (year) => {
  //   console.log("App class - props.pickYear called, year=", year);
  //   this.props.pickYear(year);
  // }
  //
  // props.requestRemoteData = () => {
  //   console.log("App class - props.requestRemoteData called");
  //   // calc what layer this corresponds to
  //   this.props.fetchMapDataIfNeeded();
  // }
  //
  // props.errorRemoteData = (error) => {
  //   console.log("App class - props.errorRemoteData called");
  //   this.props.errorRemoteData(error);
  // }
  //
  // props.receiveRemoteData = () => {
  //   console.log("App class - props.receiveRemoteData called");
  //   this.props.receiveRemoteData();
  // }
  //
  // props.clearData = () => {
  //   console.log("App class - props.clearData called");
  //   this.props.clearData();
  // }
  //
  // props.loadLayerData = (data, layerName) => {
  //   console.log("App class - props.clearData called");
  //   this.props.loadLayerData(data, layerName);
  // }
  //
  // props.turnLayerOn = (layerName) => {
  //   console.log("App class - props.turnLayerOn called");
  //   this.props.turnLayerOn(layerName);
  // }
  //
  // props.turnLayerOff = (layerName) => {
  //   console.log("App class - props.turnLayerOff called");
  //   this.props.turnLayerOff(layerName);
  // }

  componentDidMount() {
    // fetch("https://jsonbin.io/b/59f721644ef213575c9f6531")
    // .then( response => response.json())
    // .then( data => {
    // let initialData = {
    //     data: [],
    //     //selected: [],
    //     year: 2015,
    //     url: "",
    //     dataSrc: DATA_SRC_CENSUS
    // };
    // this.props.updatePosts(initialData);
    //});
    //const { dispatch, selectedSubreddit } = this.props;
    //dispatch (fetchMapDataIfNeeded (selectedSubreddit));
  }

  render() {
    const styles = {
      container: {
        backgroundColor: "#87cefa", // or #afeeee or #b0e0e6 or #87ceeb
        margin: "20px",
        padding: "0px"
      },
      map: {
        height: "600px",
        width: "100%",
        padding: 0,
        margin: 0,
        overflow: "hidden"
      },
      data: {
        //overflowY: 'auto',
        height: "300px",
        paddingBottom: "20px",
        margin: 0
      },
      col: {
        marginBottom: "20px",
        padding: "0px"
      },
      btn: {
        height: "10px",
        width: "10px",
        paddingBottom: "2px"
      },
      spinnerDiv: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '8px',
        width: '30%',
        height: '25%',
        position: 'absolute',
        left: '35%',
        top: '25%',
        zIndex: 1000,
      },
      spinnerText: {
        top: '65%',
        left: '32%',
        position: 'absolute',
      },
      spinnerAlt: {
        top: '40%',
      },
    };
    return (
      <div className="App container">
        <header className="sticky">
          <h2>Mapper</h2>
        </header>
        <div className="row" style={styles.map}>
          <div className="col-sm-12 mapColumn">
            { this.props.storeData.loading && (
              <div style={styles.spinnerDiv}>
                <Spinner barbackgroundcolor={'red'}
                  style={styles.spinnerAlt}
                />
                <p style={styles.spinnerText}>Loading...</p>
              </div>
            )}
            <MyMap
              loadLayerData={this.props.loadLayerData}
              turnLayerOn={this.props.turnLayerOn}
              turnLayerOff={this.props.turnLayerOff}
              clearData={this.props.clearData}
              doneLoadingJson={this.props.doneLoadingJson}
              mapData={this.props.storeData}
            />
          </div>
        </div>
        <div className="row" style={styles.data}>
          <div className="col-sm-12 dataColumn">
            <DataSelect
              onYearChange={this.props.pickYear}
              onDataSrcChange={this.props.pickDataSource}
              onDataSrc2Change={this.props.pickDataSource2}
              onGoPressed={this.props.fetchMapDataIfNeeded}
              onClearPressed={this.props.clearData}
              errorStr={this.props.storeData.errorStr}
            />
          </div>
        </div>
      </div>
    );
  }
}

// Mini css - columns:
// Use col-sm, or one of the variants: col-sm-1 (or 2 thru 12)
// You can use instead: col-md-x or col-lg-x.

// Notice this function is not part of the class above.
// See docs for this fn and the connect fn below at:
// https://github.com/reactjs/react-redux/blob/master/docs/api.md#api
// "This fn takes the state of the entire store and returns an object
// to be passed as props."
function mapStateToProps(state) {
  return {
    storeData: state
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
    pickDataSource,
    pickDataSource2,
    pickYear,
    requestRemoteData,
    errorRemoteData,
    receiveRemoteData,
    clearData,
    loadLayerData,
    turnLayerOn,
    turnLayerOff,
    fetchMapDataIfNeeded,
    doneLoadingJson
  }
)(App);
