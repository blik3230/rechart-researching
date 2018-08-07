import React from 'react';
import PropsTypes from 'prop-types';
import Plot from "react-plotly.js/react-plotly";

MPChartByRepetition.propTypes = {
    rowData: PropsTypes.array.isRequired
};

const colors = ['red', 'green', 'blue', 'pink', 'brown', 'orange', 'yellow'];

export default function MPChartByRepetition(props) {

    const sortedMapProps = getSortedMapPropertiesByNames(props.rowData, ['level', 'part', 'repetition']);
    const properties = 'level.part.repetition'.split('.');
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
        width: 1920,
        height: 640,
        title: "A Fancy Plot",
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
            line: {shape: 'linear', color: colors[i]},
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

            const measurement = part.reduce((result, rep) => {
                if(!result.tickText) {
                    result.tickText = rep.level + rep.part;
                }

                result['repetition' + rep.repetition] = rep.value;

                return result;
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

// todo: add jsdoc
function getStructuredSortedData(data, mapProps, props) {
    const rootPropName = props[0];

    return mapProps[rootPropName].reduce((acc, mapPropValue) => {
        const filteredData = data.filter(d => d[rootPropName] === mapPropValue);

        if(props.length > 1) {
            acc.push(getStructuredSortedData(filteredData, mapProps, props.slice(1)));
        } else {
            acc.push(filteredData[0]);
        }

        return acc;
    }, []);
}

function getSortedMapPropertiesByNames(rowData, arrNames) {
    return arrNames.reduce((acc, propName) => {
        acc[propName] = getSortedPropertyValues(rowData, propName);
        return acc;
    }, {});
}

function getSortedPropertyValues(data, propName) {
    return data.reduce((acc, item) => {
        const propValue = item[propName];

        if (acc.indexOf(propValue) === -1) {
            acc.push(propValue);
        }

        return acc;
    }, [])
        .sort(getCompareByKeyFn());
}

/**
 * return compare function for sort method of array
 * @param key {String}- compare objects by key (don't recursively) if equals null compare as simply values
 * @param isStringCompare {Boolean} - if true then values are compare as string. Если одно из значений NaN т.е. массив содержит буквы и должен сравниватся по числовому принципу (AA, A, B, Z, BB, ZZ => A, B, Z, AA, BB, ZZ), то все значения приводятся в верхний регистр.
 * @returns {Function}
 */
const getCompareByKeyFn = (key = null, isStringCompare = false) => (a, b) => {
    let valA = a;
    let valB = b;

    if(key) {
        valA = a[key];
        valB = b[key];
    }

    if (!isStringCompare) {

        if(isNaN(+valA) || isNaN(+valB)) {
            valA = valA.toUpperCase();
            valB = valB.toUpperCase();

            if(valA.length === valB.length) {

                if(valA < valB) return -1;
                if(valA > valB) return 1;
                return 0;
            } else {
                if(valA.length < valB.length) return -1;
                if(valA.length > valB.length) return 1;
                return 0;
            }

        } else {
            valA = +valA;
            valB = +valB;
        }
    }

    if(valA < valB) return -1;
    if(valA > valB) return 1;
    return 0;
};