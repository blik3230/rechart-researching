import React from 'react';
import PropsTypes from 'prop-types';
import Plot from "react-plotly.js/react-plotly";

import {
    getSortedChartDataInfo,
    getStructuredSortedData,
    getLayout,
    getChartSeparatorShapes
} from "../helpers";

MPChartByRepetition.propTypes = {
    rawData: PropsTypes.array.isRequired
};

export default function MPChartByRepetition(props) {

    const chartSetting = {
        short: true
    };

    const chartConfig = getChartConfigurations(props.rawData, chartSetting);

    return (
        <div>
            <Plot
                data={chartConfig.data}
                layout={chartConfig.layout}
            />
        </div>
    );
};

/**
 * Returns the complete plot configuration object for plotly.js.
 * (For each type of graph, the implementation is structurally different)
 *
 * @param rawData - received data from server (the "cells" properties)
 * @param settings {Object} for configuring type of chart
 */
function getChartConfigurations(rawData, settings) {

    const sequenceProps = ['level', 'part', 'repetition'];

    // the sorted information about chart data entities by the required sequence.
    const chartDataInfo = getSortedChartDataInfo(rawData, sequenceProps);

    // structured data by the required sequence of properties
    const structuredSortedData = getStructuredSortedData(rawData, chartDataInfo, sequenceProps);

    // an intermediate object with prepared data for chart
    const preparedData = prepareDataWithSeparator(structuredSortedData, chartDataInfo);

    // make separators
    const separatorsCount = chartDataInfo.level.length - 1;
    const intervalBetweenSeparators = chartDataInfo.part.length;
    const shapes = getChartSeparatorShapes(separatorsCount, intervalBetweenSeparators);

    // make layout
    const layoutSetting = {
        width: 1520,
        height: 400,
        title: "MP chart by repetitions"
    };
    const layout = getLayout(preparedData.tickValue, preparedData.tickText, shapes, layoutSetting);


    // make data array
    // todo: Perhaps should move the creation of this array to a separate helper function?
    const data = chartDataInfo.repetition.map((rep) => {
        const name = 'repetition' + rep;

        return {
            y: preparedData[name],
            name: 'repetition-' + rep,
            mode: 'lines+markers',
            line: {
                shape: 'spline'
            },
            type: 'scatter'
        };
    });

    return {data, layout};
}

// this function exclusively for this chart
function prepareDataWithSeparator(structuredData, chartDataInfo) {
    // levels - parts - repetitions
    const ticks =  structuredData.reduce((result, level, index) => {
        if (index) {
            // разделитель не ставится перед первым уровнем
            const sep = {
                tickText: ''
            };

            chartDataInfo.repetition.forEach(r => {
               sep['repetition' + r] = null;
            });

            result.push(sep);
        }

        level.forEach(part => {

            const measurement = part.reduce((acc, rep) => {
                if(!acc.tickText) {
                    acc.tickText = rep.level + rep.part;
                }

                acc['repetition' + rep.repetition] = rep.value;

                return acc;
            }, {});


            result.push(measurement);
        });

        return result;
    }, []);
    
    const r =  ticks.reduce((result, tick, index) => {
        const keys = Object.keys(tick);

        keys.forEach(key => {
           if(!result[key]) {
               result[key] = [];
           }

           result[key].push(tick[key]);
        });

        result.tickValue.push(index);

        return result;
    }, {tickValue: []});

    return r;
}