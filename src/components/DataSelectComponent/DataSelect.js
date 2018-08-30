import React, { Component }  from 'react';
import MyDS2Select from './DataSelectSrc2.js';
import { DATA_SRC_CENSUS, DATA_SRC2_TOTALPOP } from '../../constants.js';

// the UI component for selecting the data source
export default class DataSelect extends Component
{
    constructor(props) {
        super(props);
        this.state = {
            src1SelectValue: DATA_SRC_CENSUS,    // defaults
            src2SelectValue: DATA_SRC2_TOTALPOP
        }
        console.log("DataSelect - props=", props); // loadLayerData is passed; call this to update the store (during init, and later)
    }
    changeSrc(value)
    {
        console.log("changeSrc - picked value=", value);
        this.setState({src1SelectValue: value});
        this.props.onDataSrcChange(value);
    }
    changeSrc2(value)
    {
        console.log("changeSrc2 - picked value=", value);
        this.setState({src2SelectValue: value});
        this.props.onDataSrc2Change(value);
    }
    render() {
        //const { onYearChange, onDataSrcChange, onDataSrc2Change, onGoPressed, onClearPressed, errorStr } = this.props;
        console.log("DataSelect - props=", this.props);
        const styles = {
            hr_style: {
                marginTop: '0px',
                borderTopWidth: '2px',
                marginBottom: '10px',
                marginLeft: '0px',
                marginRight: '0px'
            },
            data_style: {
                margin: '5px 0px'
            },
            btns_style: {
                marginLeft: '0px'
            },
            h2_style: {
                marginLeft: '5px'
            },
            go_btn_style: {
                height: '26px',
                padding: '5px',
                margin: '0px 6px',
                lineHeight: '19px'
            },
            p_style: {
                width: '50px',
                borderStyle: 'solid',
                borderRadius: '4px',
                borderWidth: '1px',
                borderColor: '#ddd',
                display: 'inline',
                backgroundColor: '#e49999',
                boxShadow: '1px 2px 1px rgba(0, 0, 0, 0.2)',
                padding: '1px 4px 0px 0px',
                margin: '0px 6px'
            }
        }
        return (
            <div id='data-selector-component' className="data-sources">
                <hr style={styles.hr_style}/>
                <div style={styles.data_style}>
                    <h2 style={styles.h2_style}>Data Sources</h2>
                    <div className='button-group responsive-padding' style={styles.btns_style}>
                        <select name='data_src' id="src-dropdown" onChange={e => this.changeSrc(e.target.value)}>
                            <option value="census">Census Bureau</option>
                        </select>
                        <MyDS2Select name='data_src2' id="src2-dropdown" onChange={e => this.changeSrc2(e.target.value)} source={this.state.src1SelectValue}>
                        </MyDS2Select>
                        <select name='data_year' id="yr-dropdown" onChange={e => this.props.onYearChange(e.target.value)}>
                            <option value="2015">2015</option>
                            <option value="2014">2014</option>
                            <option value="2013">2013</option>
                            <option value="2012">2012</option>
                            <option value="2011">2011</option>
                            <option value="2010">2010</option>
                            <option value="2009">2009</option>
                            <option value="2008">2008</option>
                        </select>
                        <button id='goBtn' style={styles.go_btn_style} onClick={this.props.onGoPressed}>
                            Go!
                        </button>
                        <button id='clearBtn' style={styles.go_btn_style} onClick={this.props.onClearPressed}>
                            Clear
                        </button>
                        { this.props.errorStr && 
                            <p id='pField' style={styles.p_style} >
                                <span> Error: {this.props.errorStr} </span>
                            </p>
                        }
                    </div>
                </div>
            </div>
        );
    }
}
/* for the future, get these running:
                            <option value="bls">Bureau of Labor Statistics</option>
                            <option value="fema">FEMA</option>
                            <option value="usgs">USGS</option>
The Bureau of Labor Statistics (BLS) has a CORS issue (ie, it doesn't handle it)
and so you can't access them via a browser like I'm doing here. You will have to
instead use something like an AWS server to ping them. Probably be better to have
the AWS server ping all sites, and use an api to go back and forth from the
browser to AWS.

For the years dropdown:
                            <option value="2017">2017</option>
                            <option value="2016">2016</option>
These don't work with the Census Bureau; apparently, they don't have the data
online yet.
*/
