import React from "react";
import ReactDOM from "react-dom";

import SecondChart from "./Components/Charts/SecondChart";

import "./styles.css";
import RechartsResultFirst from "./Components/Charts/recharts-result-first";
import RechartsResultSecond from "./Components/Charts/recharts-result-second";
import FirstPlotChart from "./Components/Charts/FirstPlotChart";
import MPChartByRepetitionsContainer from "./Components/Charts/MPChartByRepetitions/MPChartByRepetitionsContainer";

function App() {


    return (
        <div className="App">
            <RechartsResultFirst/>
            <RechartsResultSecond/>
            <MPChartByRepetitionsContainer/>
        </div>
    );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App/>, rootElement);
