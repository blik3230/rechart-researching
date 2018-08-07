import React from 'react';
import PropsTypes from 'prop-types';
import Plot from "react-plotly.js/react-plotly";

import {getSortedMapPropertiesByNames, getStructuredSortedData} from "../helpers";

MPChartByRepetition.propTypes = {
    rowData: PropsTypes.array.isRequired
};

export default function MPChartByRepetition(props) {

    const properties = ['level', 'part', 'repetition'];
    const sortedMapProps = getSortedMapPropertiesByNames(props.rowData, properties);
    const structuredSortedDataAsArr = getStructuredSortedData(props.rowData, sortedMapProps, properties);
    const preparedDataWithSeparator = prepareDataWithSeparator(structuredSortedDataAsArr, sortedMapProps);
    const shapes = [...(new Array(sortedMapProps.level.length - 1))]
        .map((level, index) => {
            const pos = (index + 1) * sortedMapProps.part.length + index;

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
        title: "MP chart by repetitions",
        xaxis: {
            type: "category",
            tickvals: preparedDataWithSeparator.tickValue,
            ticktext: preparedDataWithSeparator.tickText
        },
        shapes: shapes
    };

    const data = sortedMapProps.repetition.map((rep, i) => {
        const name = 'repetition' + rep;

        return {
            y: preparedDataWithSeparator[name],
            name: 'repetition-' + rep,
            mode: 'lines+markers',
            line: {
                shape: 'spline'
            },
            // marker: {
            //     // symbol: "circle-open-dot",
            //     // size: 8,
            //     // line: {
            //     //     width: 2
            //     // }
            // },
            type: 'scatter'
        };
    });

    return (
        <div>
            <Plot
                data={data}
                layout={layout}
            />
        </div>
    );
};

// exclusively this chart method
function prepareDataWithSeparator(structuredData, sortedMapProps) {
    // levels - parts - repetitions
    const ticks =  structuredData.reduce((result, level, index) => {
        if (index) {
            // разделитель не ставится перед первым уровнем
            const sep = {
                tickText: ''
            };

            sortedMapProps.repetition.forEach(r => {
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