import React, { Component } from "react";

import {
  DATA_SRC_CENSUS,
  DATA_SRC_BLS,
  DATA_SRC_FEMA,
  DATA_SRC_USGS,
  DATA_SRC_MISC,
  DATA_SRC2_TOTALPOP,
  DATA_SRC2_POPWHITE,
  DATA_SRC2_POPBLK,
  DATA_SRC2_POPASIA,
  DATA_SRC2_POPHISP,
  DATA_SRC2_POPOTHER,
  DATA_SRC2_POPMALE,
  DATA_SRC2_POPFEM,
  DATA_SRC2_POPLESSHI,
  DATA_SRC2_POPHI,
  DATA_SRC2_POPLESSCOLL,
  DATA_SRC2_POPBACH,
  DATA_SRC2_POPSCH,
  DATA_SRC2_POPCOLL,
  DATA_SRC_BLS_EMPLOYMENT
} from "../../constants";

var census_sources = [
  { name: DATA_SRC2_TOTALPOP, value: "Total Population" },
  { name: DATA_SRC2_POPWHITE, value: "Population - White Only" },
  { name: DATA_SRC2_POPBLK, value: "Population - African American Only" },
  { name: DATA_SRC2_POPASIA, value: "Population - Asian Only" },
  { name: DATA_SRC2_POPHISP, value: "Population - Hispanic Only" },
  { name: DATA_SRC2_POPOTHER, value: "Population - All Others" },
  { name: DATA_SRC2_POPMALE, value: "Population - Males Only" },
  { name: DATA_SRC2_POPFEM, value: "Population - Females Only" },
  { name: DATA_SRC2_POPLESSHI, value: "Population - Less than High School" },
  { name: DATA_SRC2_POPHI, value: "Population - High School Graduates" },
  { name: DATA_SRC2_POPLESSCOLL, value: "Population - Some College" },
  { name: DATA_SRC2_POPBACH, value: "Population - Bachelors or Higher" },
  { name: DATA_SRC2_POPSCH, value: "Population - School Enrollment" },
  { name: DATA_SRC2_POPCOLL, value: "Population - College Enrollment" }
];

var bls_sources = [
  { name: DATA_SRC_BLS_EMPLOYMENT, value: "Total Employment" }
];

export default class MyDS2Select extends Component {
  constructor(props) {
    super(props);
    this.state = {
      options: [], // defaults
      src2SelectValue: DATA_SRC2_TOTALPOP,
      finalStr: ""
    };
  }

  fillOptions = (props) => {
    let srcArray = [];
    //this.setState({ options: [] }); // this doesn't work
    this.state.options = []; // clear old options array or get errors about duplicate keys
    switch (props.source) {
      case DATA_SRC_CENSUS:
        srcArray = census_sources;
        break;
      case DATA_SRC_BLS:
        srcArray = bls_sources;
        break;
      case DATA_SRC_FEMA:
        break;
      case DATA_SRC_USGS:
        break;
      case DATA_SRC_MISC:
        break;
      default:
        break;
    }
    for (let i = 0; i < srcArray.length; i++) {
      let option = srcArray[i];
      this.state.options.push(
        <option key={i} value={option.name}>
          {option.value}
        </option>
      ); // must include 'key' or will get warning about it
    }
    this.forceUpdate(); // this compensates for not using setState on options
  }
  componentWillReceiveProps(nextprops) {
    this.fillOptions(nextprops);
  }
  renderOptions = () => {
    return this.state.options.map(item => {
      return item;
    });
  }
  // Use renderOptions to fill in each option tag
  render() {
    return <select onChange={e => this.props.onChange(e.target.value)}>
      {this.renderOptions()}
      </select>;
  }
}
