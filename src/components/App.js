import React, { Component } from 'react'; //'preact-compat';
import { connect } from 'react-redux'; //'preact-redux';
import { pickDataSource,
         pickDataSource2,
         pickYear,
         requestRemoteData,
         errorRemoteData,
         receiveRemoteData,
         clearData,
         loadLayerData,
         turnLayerOn,
         turnLayerOff,
         fetchMapDataIfNeeded } from '../actions/actions.js'; // action creators
import './App.css';
import MyMap from './MapComponent/Map';
import DataSelect from './DataSelectComponent/DataSelect';


class App extends Component {
    constructor(props)
    {
        super(props);
        this.state = {
            blah: 5
        }
        //const { outerObj } = this.props;
        console.log("App ctor - props = ", props);// drl debug
        this.local_pickDataSource = this.local_pickDataSource.bind(this);
        this.local_pickDataSource2 = this.local_pickDataSource2.bind(this);
        this.local_pickYear = this.local_pickYear.bind(this);
        this.local_requestRemoteData = this.local_requestRemoteData.bind(this);
        this.local_errorRemoteData = this.local_errorRemoteData.bind(this);
        this.local_receiveRemoteData = this.local_receiveRemoteData.bind(this);
        this.local_clearData = this.local_clearData.bind(this);
        this.local_loadLayerData = this.local_loadLayerData.bind(this);
        this.local_turnLayerOn = this.local_turnLayerOn.bind(this);
        this.local_turnLayerOff = this.local_turnLayerOff.bind(this);
    }

    // Invoking one of these will call dispatch to call that action on the reducer.
    local_pickDataSource(dataSource) {
        console.log("App class - local_pickDataSource called");
        this.props.pickDataSource(dataSource);
    }

    local_pickDataSource2(dataSource) {
        console.log("App class - local_pickDataSource2 called");
        this.props.pickDataSource2(dataSource);
    }

    local_pickYear(year) {
        console.log("App class - local_pickYear called, year=", year);
        this.props.pickYear(year);
    }

    local_requestRemoteData() {
        console.log("App class - local_requestRemoteData called");
        // calc what layer this corresponds to
        this.props.fetchMapDataIfNeeded();
    }

    local_errorRemoteData(error) {
        console.log("App class - local_errorRemoteData called");
        this.props.errorRemoteData(error);
    }

    local_receiveRemoteData() {
        console.log("App class - local_receiveRemoteData called");
        this.props.receiveRemoteData();
    }

    local_clearData() {
        console.log("App class - local_clearData called");
        this.props.clearData();
    }

    local_loadLayerData(data, layerName) {
        console.log("App class - local_clearData called");
        this.props.loadLayerData(data, layerName);
    }

    local_turnLayerOn(layerName) {
        console.log("App class - local_turnLayerOn called");
        this.props.turnLayerOn(layerName);
    }

    local_turnLayerOff(layerName) {
        console.log("App class - local_turnLayerOff called");
        this.props.turnLayerOff(layerName);
    }

    componentDidMount()
    {
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
        // this.local_updatePosts(initialData);
        //});
        //const { dispatch, selectedSubreddit } = this.props;
        //dispatch (fetchMapDataIfNeeded (selectedSubreddit));
    }

    render()
    {
        const styles = {
            container: {
                backgroundColor: '#87cefa', // or #afeeee or #b0e0e6 or #87ceeb
                margin: '20px',
                padding: '0px'
            },
            map: {
                height: '600px',
                width: '100%',
                padding: 0,
                margin: 0,
                overflow: 'hidden'
            },
            data: {
                //overflowY: 'auto',
                height: '300px',
                paddingBottom: '20px',
                margin: 0
            },
            col: {
                marginBottom: '20px',
                padding: '0px'
            },
            btn: {
                height: '10px',
                width: '10px',
                paddingBottom: '2px'
            }
        }
        return (
            <div className="App container">
                <header className="sticky">
                    <h2>Mapper</h2>
                </header>
                <div className="row" style={ styles.map }>
                    <div className='col-sm-12 mapColumn'>
                        <MyMap loadLayerData={this.local_loadLayerData}
                               turnLayerOn={this.local_turnLayerOn}
                               turnLayerOff={this.local_turnLayerOff}
                               clearData={this.local_clearData}
                               mapData={this.props.storeData}/>
                    </div>
                </div>
                <div className="row" style={ styles.data }>
                    <div className='col-sm-12 dataColumn'>
                        <DataSelect onYearChange={this.local_pickYear}
                                    onDataSrcChange={this.local_pickDataSource}
                                    onDataSrc2Change={this.local_pickDataSource2}
                                    onGoPressed={this.local_requestRemoteData}
                                    onClearPressed={this.local_clearData}
                                    errorStr={this.props.storeData.errorStr}/>
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
    }
}

// pickYear etc below are all action creators imported above. These fns will be turned
// into props properties, though wrapped in another function that calls dispatch, so that
// invoking this.props.pickYear() will call dispatch to call that action on the reducer.
// Notice the (App) at the end. This means the connect call returns a react
// component class with all the internal wiring for redux, which then gets initialized
// with the App class. So it is kind of like a mix-in.

// Connect returns a component that links App to these new behaviors specified by the
// args passed to it.
export default connect(mapStateToProps, { pickDataSource,
                                          pickDataSource2,
                                          pickYear,
                                          requestRemoteData,
                                          errorRemoteData,
                                          receiveRemoteData,
                                          clearData,
                                          loadLayerData,
                                          turnLayerOn,
                                          turnLayerOff,
                                          fetchMapDataIfNeeded
                                        })(App);








