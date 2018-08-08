import React from 'react';
import PropsTypes from 'prop-types';
import Plot from "react-plotly.js/react-plotly";

import {
    getChartSeparatorShapes,
    getLayout,
    getSortedChartDataInfo,
    getStructuredSortedData
} from "../helpers";

MPChartByLevels.propTypes = {
    rawData: PropsTypes.array.isRequired
};

export default function MPChartByLevels(props) {

    const chartSetting = {
        short: true
    };

    const chartConfig = getChartConfigurations(props.rawData, chartSetting);

    return (
        <div>
            <Plot
                layout={chartConfig.layout}
                data={chartConfig.data}
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

    const sequenceProps = ['part', 'level', 'repetition'];

    // the sorted information about chart data entities by the required sequence.
    const chartDataInfo = getSortedChartDataInfo(rawData, sequenceProps);

    // structured data by the required sequence of properties
    const structuredSortedData = getStructuredSortedData(rawData, chartDataInfo, sequenceProps);

    // an intermediate object with prepared data for chart
    const preparedData = prepareDataWithSeparator(structuredSortedData, chartDataInfo);

    // make separators
    const separatorsCount = chartDataInfo.part.length - 1;
    const intervalBetweenSeparators = chartDataInfo.level.length * chartDataInfo.repetition.length;
    const shapes = getChartSeparatorShapes(separatorsCount, intervalBetweenSeparators);

    // make layout
    const layoutSetting = {
        width: 1520,
        height: 400,
        title: "MP chart by levels"
    };
    const layout = getLayout(preparedData.tickValue, preparedData.tickText, shapes, layoutSetting);

    // make data array
    const data = chartDataInfo.level.map((lvl, i) => {
        const name = 'level' + lvl;

        return {
            y: preparedData[name],
            name: 'level-' + lvl,
            mode: 'lines+markers',
            line: {
                shape: 'spline'
            },
            type: 'scatter'
        };
    });

    return {data, layout}
}

// exclusively this chart method
function prepareDataWithSeparator(structuredData, chartDataInfo) {
    // part - level - repetition
    const ticks = structuredData.reduce((result, part, index) => {
        if(index) {
            // первый разделитель пропускаю
            const sep = {
                tickText: ''
            };

            chartDataInfo.level.forEach(l => {
                sep['level' + l] = null;
            })

            result.push(sep);
        }

        part.forEach(lvl => {

            lvl.forEach(m => {
                const measurement = {
                    tickText: `${m.part}${m.level}${m.repetition}`
                };

                chartDataInfo.level.forEach(level => {
                    const value = m.level === level? m.value: null;

                    measurement['level' + level] = value;
                });

                result.push(measurement);
            });

        });

        return result;
    }, []);

    // todo: this code is the clone from the chart by repetition. Should be making a separate method!
    const resultObj = ticks.reduce((acc, tick, index) => {
        const keys = Object.keys(tick);

        keys.forEach(key => {
            if(!acc[key]) {
                acc[key] = [];
            }

            acc[key].push(tick[key]);
        });

        acc.tickValue.push(index);

        return acc;

    }, {tickValue: []});

    return resultObj;
}