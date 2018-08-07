import React from 'react';
import PropsTypes from 'prop-types';
import Plot from "react-plotly.js/react-plotly";

import {getCompareByKeyFn, getSortedMapPropertiesByNames, getStructuredSortedData} from "../helpers";

MPChartByLevels.propTypes = {
    rowData: PropsTypes.array.isRequired
};

export default function MPChartByLevels(props) {

    const properties = ['part', 'level', 'repetition'];
    const sortedMapProps = getSortedMapPropertiesByNames(props.rowData, properties);

    const structuredSortedData = getStructuredSortedData(props.rowData, sortedMapProps, properties);

    const preparedDataWithSeparator = prepareDataWithSeparator(structuredSortedData, sortedMapProps);

    const shapes = [...(new Array(sortedMapProps.part.length - 1))]
        .map((part, index) => {
            const pos = (index + 1) * sortedMapProps.level.length * sortedMapProps.repetition.length + index;

            const result = {
                type: "line",
                xref: "x",
                yref: "paper",
                x0: pos,
                x1: pos,
                y0: 0,
                y1: 1,
                line: {
                    color: "#ccc"
                }
            };

            return result;
        });

    const layout = {
        width: 1520,
        height: 400,
        title: "MP chart by levels",
        xaxis: {
            type: "category",
            tickvals: preparedDataWithSeparator.tickValue,
            ticktext: preparedDataWithSeparator.tickText
        },
        legend: {
            // xanchor: 'center'
            // orientation: 'h',
            // yanchor: 'bottom'
        },
        shapes: shapes
    };

    const data = sortedMapProps.level.map((lvl, i) => {
        const name = 'level' + lvl;

        return {
            y: preparedDataWithSeparator[name],
            name: 'level-' + lvl,
            mode: 'lines+markers',
            line: {
                shape: 'spline'
            },
            type: 'scatter'
        };
    });


    console.log('preparedDataWithSeparator', preparedDataWithSeparator);

    return (
        <div>
            <Plot
                layout={layout}
                data={data}
            />
        </div>
    );
};

// exclusively this chart method
function prepareDataWithSeparator(structuredData, sortedMapProps) {
    // part - level - repetition
    const ticks = structuredData.reduce((result, part, index) => {
        if(index) {
            // первый разделитель пропускаю
            const sep = {
                tickText: ''
            };

            sortedMapProps.level.forEach(l => {
                sep['level' + l] = null;
            })

            result.push(sep);
        }

        part.forEach(lvl => {

            lvl.forEach(m => {
                const measurement = {
                    tickText: `${m.part}${m.level}${m.repetition}`
                };

                sortedMapProps.level.forEach(level => {
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

const exapleOfResult = [
    {
        tickText: 'part-1 level-A rep-1',
        tickValue: 0,
        levelA: 2,
        levelB: null,
        levelC: null
    },
    {
        tickText: 'part-1 level-A rep-2',
        tickValue: 1,
        levelA: 3,
        levelB: null,
        levelC: null
    },
    {
        tickText: 'part-1 level-A rep-2',
        tickValue: 2,
        levelA: 3,
        levelB: null,
        levelC: null
    },
    {
        tickText: 'part-1 level-B rep-2',
        tickValue: 3,
        levelA: null,
        levelB: 12,
        levelC: null
    }
];