import React, { Component } from "react";
import Plot from "react-plotly.js";

export default class FirstPlotChart extends Component {
  render() {
    return (
      <Plot
        data={[
          {
            y: [1, 2, 6, null, 2, 4, 3, null, 2, 3, 5],
            xaxis: "xaxis1",
            type: "scatter",
            mode: "lines+markers",
            name: "repetition 1",
            connectgaps: false,
            marker: {
              symbol: "circle",
              size: 10,
              color: "red"
            }
          }
          // {
          //   x: ["1A", "1B", "1C", "", "2A", "2B", "2C", ""],
          //   y: [2, 6, 3, null, 5, 3, 5, null],
          //   xaxis: "xaxis2",
          //   type: "scatter",
          //   mode: "lines+markers",
          //   name: "repetition 2",
          //   marker: {
          //     symbol: "circle",
          //     size: 10,
          //     color: "green"
          //   }
          // }
        ]}
        layout={{
          width: 620,
          height: 540,
          title: "A Fancy Plot",
          xaxis1: {
            type: "category",
            categoryorder: "array",
            categoryarray: ["A1", "A2", "A3", "A4", "B1", "B2", "B3", "B4"]
          },
          xaxis2: {
            type: "category"
          },
          shapes: [
            {
              type: "line",
              xref: "x",
              yref: "paper",
              x0: "",
              x1: "",
              y0: 0,
              y1: 1,
              line: {
                color: "#ccc"
              }
            }
          ]
        }}
      />
    );
  }
}
