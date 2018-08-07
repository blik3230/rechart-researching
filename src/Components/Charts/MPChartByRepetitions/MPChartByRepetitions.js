import React from 'react';
import PropsTypes from 'prop-types';
import Plot from "react-plotly.js/react-plotly";

MPChartByRepetition.propTypes = {
    rowData: PropsTypes.array.isRequired
};


export default function MPChartByRepetition(props) {

    //const data = convertCharacteristicToChartData(props.rowData);



    const sortedMapProps = getSortedMapPropertiesByNames(props.rowData, ['level', 'part', 'repetition']);

    // console.log(sortedMapProps);

    // создаю массивы массивов в указаной последовательности
    const properties = 'level.part.repetition'.split('.');


    const structuredSortedDataAsArr = getStructuredSortedData(props.rowData, sortedMapProps, properties);
    const preparedDataWithSeparator = prepareDataWithSeparator(structuredSortedDataAsArr, sortedMapProps);

    console.log('preparedDataWithSeparator', preparedDataWithSeparator);


    // console.time('asObj');
    // const structuredSortedData = getStructuredSortedDataAsObj(props.rowData, sortedMapProps, properties);
    // console.timeEnd('asObj');
    //
    // console.time('asArr');
    // console.timeEnd('asArr');
    //
    // console.time('без рекурсии');
    // const  structuredSortedDataArr = getStructuredSortedDataDraft(props.rowData, sortedMapProps, 'repetition.level.part');
    // console.timeEnd('без рекурсии');

    // console.log('-----------------')
    // console.log('structuredSortedDataAsArr', structuredSortedDataAsArr)

    // const extandedData = expandData(structuredSortedDataAsArr);
    // console.log('extandedData', extandedData);

    // представление в виде массива работает быстрее чем представление в виде объекта, иногда в 2 раза.
    // представление в виде объекта расматривалось для удобства доступа к отдельным сущностям измерений по ключевым свойствам.
    // с помошью объекта карты можно удобно находить нужные измерения и с помошью массива (todo: нужно реализовать соответ. функцию)
    // !!!
    // На самом деле разница в производительности не существенная,
    // оставить два метода и в последствии выбрать тот с которым будет легче обращаться к нужному измерению, с ходу кажется что это объект!!!;
    // todo: !!! метод который возвращает объект в нутри должен содержать тоже объекты
    //
    // console.log('structuredSortedData', structuredSortedData);
    // console.log('structuredSortedDataAsArr', structuredSortedDataAsArr);
    // console.log('массив без рекурсии', structuredSortedDataArr);

    const colors = ['red', 'green', 'blue', 'pink', 'brown', 'orange', 'yellow'];

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
        shapes: shapes/*[
            {
                type: "line",
                xref: "x",
                yref: "paper",
                x0: 3,
                x1: 3,
                y0: 0,
                y1: 1,
                line: {
                    color: "#ccc"
                }
            },
            {
                type: "line",
                xref: "x",
                yref: "paper",
                x0: 7,
                x1: 7,
                y0: 0,
                y1: 1,
                line: {
                    color: "#ccc"
                }
            }
        ]*/
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

function convertCharacteristicToChartData(rowData) {
    const trace1 = {
        //x: ["A1", "A2", "A3", "A4", "B1", "B2", "B3", "B4"],
        y: [5, 3, 2, null, 1, 5, 3, null, 2, 4, 1],
        name: 'repetition-1',
        mode: 'lines+markers',
        line: {shape: 'linear'},
        type: 'scatter'
    };
    const trace2 = {
        y: [2, 4, 5, null, 5, 1, 4, null, 4, 2, 5],
        name: 'repetition-2',
        mode: 'lines+markers',
        line: {shape: 'linear', color: 'red'},
        type: 'scatter'
    };
    const trace3 = {};

    return [trace1, trace2, trace3];
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


function getStructuredSortedDataAsObj(data, mapProps, props) {
    const rootPropName = props[0];

    return mapProps[rootPropName].reduce((acc, mapPropValue) => {
        const filteredData = data.filter(d => d[rootPropName] === mapPropValue);

        if(props.length > 1) {
            acc[mapPropValue] = getStructuredSortedData(filteredData, mapProps, props.slice(1));
            console.log('returned value', acc[mapPropValue]);
        } else {
            acc[mapPropValue] = filteredData[0];
        }

        return acc;
    }, {});
}


// Возвращает массив массивов рекурсивно в указаной последовательности.
function getStructuredSortedDataDraft(data, mapProps, format) {
    const properties = format.split('.');

    const firstPropertyName = properties[0];

    const result = mapProps[firstPropertyName].map(pValue => {

        const items = data.filter(i => {
            return i[firstPropertyName] === pValue;
        });

        //const sortedItems = items.sort(getCompareByKeyFn(firstPropertyName));
        const secondPropertyName = properties[1];

        return mapProps[secondPropertyName].map(spValue => {

            const itemsLv2 = items.filter(iLv2 => iLv2[secondPropertyName] === spValue);

            const thirdPropertyName = properties[2];

            return mapProps[thirdPropertyName].map(thpValue => {

                const itemsLv3 = itemsLv2.filter(iLv3 => iLv3[thirdPropertyName] === thpValue)[0];

                return itemsLv3;
            });
        });
    });

    return result;
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

function getXAxesData(data) {

}