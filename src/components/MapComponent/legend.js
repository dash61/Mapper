import { getNumericRangeOfArray } from "../../misc/misc.js";
import L from "leaflet";

const NUM_LEGEND_SEGMENTS = 10;


export default class Legend {
  constructor(map) {
    this.map = map;
    //this.L = L;
    this.legend = null;
    this.fillColor = null;
    this.useLog = false;
  }

  init = (dataPtr) => {
    //OLD WAY: USING BUILT-IN LEGEND CONTROL:
    //var legendControl = new L.Control.Legend();
    //var legendControl = L.Control.Legend();
    //var legendControl = L.control({position: 'bottomright'});
    //legendControl.addTo(this.state.map);

    // NEW WAY: CUSTOM LEGEND CONTROL:
    this.legend = L.control({ position: "topright" });

    let range = getNumericRangeOfArray(dataPtr, 0);
    if (range[0] === 0) range[0] = 1;
    //console.log("CWRP - range=", range);
    let eachSegmentOfRange = (range[1] - range[0]) / NUM_LEGEND_SEGMENTS;
    if (eachSegmentOfRange > 1000.0) {
      this.useLog = true;
      range[0] = Math.log(range[0]); // recalc ranges
      range[1] = Math.log(range[1]);
      eachSegmentOfRange = (range[1] - range[0]) / NUM_LEGEND_SEGMENTS;
    }
    console.log("legend.init - range=", range, ", useLog=", this.useLog, ", segmt=",
      eachSegmentOfRange);

    let colorArray = L.ColorBrewer.Diverging.RdYlGn[NUM_LEGEND_SEGMENTS].slice(0).reverse();

    // Specify an option of interpolate: false to use only discrete colors
    // rather than interpolating between colors.
    this.fillColor = new L.CustomColorFunction(
      range[0],
      range[1],
      colorArray,
      { interpolate: false }
    );

    function generateGradesArray (start, segRange, numSegments)
    {
      let result = [];
      for (let i=0; i<numSegments; i++)
      {
        result.push(start + (segRange * (i+0)));
      }
      //console.log("grades = " + JSON.stringify(result));
      return result;
    }

    this.legend.onAdd = function(map) {
      //grades = [0, 10, 20, 50, 100, 200, 500, 1000],
      let div = L.DomUtil.create("div", "info legend"),
        grades = generateGradesArray(range[0], eachSegmentOfRange, NUM_LEGEND_SEGMENTS),
        labels = [],//["<strong>LEGEND   </strong>"],
        from,
        to;

      for (let i = 0; i < grades.length; i++) {
        from = Math.exp(grades[i]);
        to = Math.exp(grades[i + 1]) - 1;
        from = (i===0 ? Math.floor(from) : Math.ceil(from));
        to = Math.ceil(to);

        labels.push(
          '<i class="legend" style="background:' +
            colorArray[i] +
            '"></i> ' +
            from +
            (to ? "&ndash;" + to : "+")
        );
      }
      //getColor(grades[i], grades, colorArray)
      div.innerHTML = labels.join("<br>");
      //div.innerHTML = labels;
      return div;
    };
    this.legend.addTo(this.map);
  }

  removeLegend = () => {
    this.map.removeControl(this.legend);
    this.legend = null;
  }

  getControl = () => {
    return this.legend;
  }

  getFillColor = () => {
    return this.fillColor;
  }

  getUseLog = () => {
    return this.useLog;
  }
}
