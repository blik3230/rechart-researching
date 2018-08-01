import React, { Component } from "react";
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

export default class FirstChart extends Component {
  static PropTypes = {
    data: PropTypes.array.isRequired
  };

  ditectX = args => {
    return <div>test</div>;
  };

  render() {
    const { data } = this.props;

    return (
      <LineChart
        width={800}
        height={400}
        data={data}
        margin={{ top: 30, right: 40 }}
      >
        <CartesianGrid stroke="#eee" strokeDasharray="5 2" />
        <ReferenceLine x="point 2" strokeWidth={5} stroke="#ccc" />
        <ReferenceLine x="point 3" strokeWidth={5} stroke="#ccc" />
        <ReferenceLine x="point 4" strokeWidth={5} stroke="#ccc" />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#8884d8"
          type="category"
        />
        <XAxis dataKey="name" height="30" allowDuplicatedCategory={true} />
        <YAxis />
        <Tooltip />
      </LineChart>
    );
  }
}
