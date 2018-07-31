import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Label,
  ReferenceLine
} from "recharts";

const series = [
  {
    name: "Series 1",
    data: [
      { category: "A", value: Math.random() },
      { category: "B", value: Math.random() },
      { category: "C", value: Math.random() }
    ]
  },
  {
    name: "Series 2",
    data: [
      { category: "B", value: Math.random() },
      { category: "C", value: Math.random() },
      { category: "D", value: Math.random() }
    ]
  },
  {
    name: "Series 3",
    data: [
      { category: "C", value: Math.random() },
      { category: "D", value: Math.random() },
      { category: "E", value: Math.random() }
    ]
  }
];

export default class ThirdChart extends Component {
  static PropTypes = {
    data: PropTypes.array.isRequired
  };

  ditectX = args => {
    return <div>test</div>;
  };

  render() {
    return (
      <LineChart width={800} height={400} margin={{ top: 30, right: 40 }}>
        <CartesianGrid stroke="#eee" strokeDasharray="5 2" />
        <YAxis />

        <XAxis dataKey="category" height="30" xAxisId="s.name" />
        {series.map(s => (
          <Fragment>
            <Line
              xAxisId="s.name"
              type="monotone"
              dataKey="s.data.category"
              stroke="red"
            />
          </Fragment>
        ))}

        <Tooltip />
      </LineChart>
    );
  }
}
