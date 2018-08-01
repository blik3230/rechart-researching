/**
 * First chart for result of the experiment Type 2
 */

import React, {Component} from "react";
import PropTypes from "prop-types";
import {
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Label,
    Legend,
    ReferenceLine,
    ResponsiveContainer
} from "recharts";


import CustomLabel from "../CustomLabel";
import mockData from '../../mock_data';


// todo: генерировать цвет для кождого репетишина при конвертации.
const colors = [
    'red',
    'green',
    'blue',
    'orange',
];

export default class RechartsResultSecond extends Component {

    // объеденить два свойства.
    data = conversionDataForChart([...mockData.experimentType2Data.table[0].cells]);
    entityNames = getObjLevelPartRepetitionNames([...mockData.experimentType2Data.table[0].cells]);
    render() {

        console.log();

        return (
            <LineChart
                margin={{top: 5, right: 20, left: 20, bottom: 20}}
                data={this.data}
                width={this.data.length * 16}
                height={200}
            >
                <CartesianGrid stroke="#eee" strokeDasharray="5 2" />
                <XAxis
                    dataKey="tickName"
                    height={30}
                    tick={<CustomLabel />}
                    allowDataOverflow
                    //interval={2}
                />
                <YAxis
                    domain={[5.94, 6.06]}
                />
                {
                    this.entityNames.parts.map(part => {
                        return(
                            <ReferenceLine key={part} x={`separator ${part}`} strokeWidth={2} stroke="#666" />
                        )
                    })
                }
                {
                    this.entityNames.levels.map((level, index) => {
                        return(
                            <Line key={level} type="monotone" dataKey={level} stroke={colors[index]} />
                        )
                    })
                }
                <Tooltip />
                <Legend
                    align="left"
                    verticalAlign="top"
                    height={35}
                    margin={{ top: 100, left: 100, right: 0, bottom: 100 }}
                />
            </LineChart>
        );
    }
}

function conversionDataForChart(data) {
    const entityNames = getObjLevelPartRepetitionNames(data);

    const result = entityNames.parts.map(partName => {
        const measurementsByPartName = data.filter(item => item.part === partName)
            .sort(getCompareByKeyFn('level', true));

        return entityNames.levels.map(levelName => {
            const tmpResult = measurementsByPartName
                .filter(item => item.level === levelName)
                .sort(getCompareByKeyFn('repetition'));

            console.log(tmpResult);

            return tmpResult;
        });
    });

    return result.reduce((acc, parts, i) => {
        parts.forEach(levels => {
            levels.forEach(measurment => {
                acc.push({
                    tickName: `${measurment.part}${measurment.level}${measurment.repetition}`,
                    [measurment.level]: measurment.value
                })
            });
        });

        acc.push({tickName: 'separator ' + entityNames.parts[i]});

        return acc;
    }, [{tickName: 'separator empty'}]);
}



// получить список всех левелов, партов и репетишинов
function getObjLevelPartRepetitionNames(mockData) {
    const result = {
        levels: [],
        parts: [],
        repetitions: []
    };

    mockData.reduce((acc, measurement) => {
        const levelName = measurement.level;
        const partName = measurement.part;
        const repetitionName = measurement.repetition;

        if(acc.levels.indexOf(levelName) === -1) {
            acc.levels.push(levelName);
        }

        if(acc.parts.indexOf(partName) === -1) {
            acc.parts.push(partName);
        }

        if(acc.repetitions.indexOf(repetitionName) === -1) {
            acc.repetitions.push(repetitionName);
        }

        return acc;
    }, result);

    result.levels.sort(getCompareByKeyFn(null, true));
    result.parts.sort(getCompareByKeyFn());
    result.repetitions.sort(getCompareByKeyFn());

    return result;
}

/**
 * return compare function for sort method of array
 * @param key {String}- compare objects by key (don't recursively) if equals null compare as simply values
 * @param isStringCompare {Boolean} - if true then values are compare as string
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
        valA = +valA;
        valB = +valB;
    }

    if(valA < valB) return -1;
    if(valA > valB) return 1;
    return 0;
};
