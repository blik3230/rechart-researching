import React from "react";
import ReactDOM from "react-dom";

import FirstChart from "./FirstChart";
import SecondChart from "./SecondChart";
import ThirdChart from "./ThirdChart";

import "./styles.css";

function App() {
  const data = [
    {
      name: "point 1",
      value: 200
    },
    {
      name: "point 2",
      value: 300
    },
    {
      name: "point 3"
    },
    {
      name: "point 4",
      value: 320
    },
    {
      name: "point 5",
      value: 360
    }
  ];

  return (
    <div className="App">
      <FirstChart data={data} />
      <SecondChart />
      <ThirdChart />
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
