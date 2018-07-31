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

export default class SecondChart extends Component {
  static PropTypes = {
    data: PropTypes.array.isRequired
  };

  ditectX = args => {
    return <div>test</div>;
  };

  data = [];

  render() {
    const data = [
      {
        name: "seperator"
      },
      {
        name: "1A",
        rep1: 8,
        rep2: 9,
        rep3: 10
      },
      {
        name: "2A",
        rep1: 7,
        rep2: 5,
        rep3: 6
      },
      {
        name: "3A",
        rep1: 3,
        rep2: 9,
        rep3: 7
      },
      {
        name: "seperatorA"
      },
      {
        name: "1B",
        rep1: 10,
        rep2: 5,
        rep3: 8
      },
      {
        name: "2B",
        rep1: 3,
        rep2: 10,
        rep3: 4
      },
      {
        name: "3B",
        rep1: 10,
        rep2: 9,
        rep3: 2
      },
      {
        name: "seperatorB"
      }
    ];

    return (
      <LineChart
        width={800}
        height={400}
        data={data}
        margin={{ top: 30, right: 40 }}
      >
        <CartesianGrid stroke="#eee" strokeDasharray="5 2" />
        <XAxis
          dataKey="name"
          height="30"
          allowDuplicatedCategory={true}
          tick={<CustomLabel />}
        />
        <YAxis />
        <ReferenceLine x="seperatorA" strokeWidth={5} stroke="#ccc" />
        <Line type="monotone" dataKey="rep1" stroke="red" />
        <Line type="monotone" dataKey="rep2" stroke="blue" />
        <Line type="monotone" dataKey="rep3" stroke="green" />
        <Tooltip />
      </LineChart>
    );
  }
}

function CustomLabel(props) {
  console.log(props);
  if (props.payload.value.includes("seperator")) {
    return null;
  }

  return (
    <text {...props} y={props.y + 16}>
      {props.payload.value}
    </text>
  );
}
