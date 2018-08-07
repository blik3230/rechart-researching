import React from "react";
import ReactDOM from "react-dom";

import SecondChart from "./Components/Charts/SecondChart";

import "./styles.css";
import RechartsResultFirst from "./Components/Charts/recharts-result-first";
import RechartsResultSecond from "./Components/Charts/recharts-result-second";
import FirstPlotChart from "./Components/Charts/FirstPlotChart";
import MPChartByRepetitionsContainer from "./Components/Charts/Plotly/MPChartByRepetitions/MPChartByRepetitionsContainer";
import MPChartByLevelsContainer from "./Components/Charts/Plotly/MPChartByLevels/MPChartByLevelsContainer";

function App() {


    return (
        <div className="App">
            {/*<RechartsResultFirst/>*/}
            <RechartsResultSecond/>
            <MPChartByRepetitionsContainer/>
            <MPChartByLevelsContainer/>
        </div>
    );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App/>, rootElement);
