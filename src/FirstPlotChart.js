import React, { Component } from "react";
import Plot from "react-plotly.js";

export default class FirstPlotChart extends Component {
  render() {
    return (
      <Plot
        data={[
          {
            x: ["1A", "1B", "1C", "", "2A", "2B", "2C"],
            y: [1, 2, 6, null, 2, 4, 3],
            xaxis: "xaxis1",
            type: "scatter",
            mode: "lines+markers",
            marker: {
              symbol: "circle",
              size: 10,
              color: "red"
            }
          },
          {
            x: ["1A", "1B", "1C", "", "2A", "2B", "2C"],
            y: [2, 6, 3, null, 5, 3, 5],
            xaxis: "xaxis2",
            type: "scatter",
            mode: "lines+markers",
            marker: {
              symbol: "circle",
              size: 10,
              color: "green"
            }
          }
        ]}
        layout={{
          width: 620,
          height: 540,
          title: "A Fancy Plot",
          xaxis1: {
            type: "category"
          },
          xaxis2: {
            type: "category"
          }
        }}
      />
    );
  }
}
