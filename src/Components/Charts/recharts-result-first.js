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

export default class RechartsResultFirst extends Component {

    measurementsObj = conversionExperimentType2Data(mockData);


    render() {

        console.log(this.measurementsObj);

        return (
            <ResponsiveContainer height={200} width={this.measurementsObj.data.length*50}>
                <LineChart
                    margin={{top: 5, right: 20, left: 20, bottom: 20}}
                    data={this.measurementsObj.data}
                >
                    <CartesianGrid stroke="#eee" strokeDasharray="5 2" />
                    <XAxis
                        dataKey="tickName"
                        height={30}
                        tick={<CustomLabel />}
                        allowDataOverflow
                        // interval={0}
                    />
                    <YAxis
                        domain={[5.94, 6.06]}
                    />
                    {
                        this.measurementsObj.levelNames.map(level => {
                            return(
                                <ReferenceLine key={level} x={`separator ${level}`} strokeWidth={2} stroke="#666" />
                            )
                        })
                    }
                    {
                        this.measurementsObj.repetitionNames.map((rep, index) => {
                            return(
                                <Line key={rep} type="monotone" dataKey={rep} stroke={colors[index]} />
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
            </ResponsiveContainer>

        );
    }
}


function conversionExperimentType2Data(mockData) {
    // кол-во репетишинов и партов должно быть одинаковым и совподать по названию в каждом левеле!!!!!!!!
    let partNames, repetitionNames = [];
    let objLevels = [...mockData.experimentType2Data.table[0].cells]
        .reduce((acc, item) => {
            if (!acc[item.level]) {
                acc[item.level] = [];
            }

            acc[item.level].push(item);
            return acc;
        }, {});

    const levelNames = Object.keys(objLevels)
        .sort(getCompareByKeyFn(null, true));

    const sortedLevels = levelNames.map(levelName => {
            const objParts =  objLevels[levelName]
                .reduce((acc, item) => {
                    if (!acc[item.part]) {
                        acc[item.part] = [];
                    }

                    acc[item.part].push(item);
                    return acc;
                }, {});

            if(!partNames) {
                partNames = Object.keys(objParts)
                    .sort((a, b) => {
                        if(+a < +b) return -1;
                        if(+a > +b) return 1;
                        return 0;
                    });
            }

            const parts =  partNames.map(part => {
                    const result = {
                        tickName: `${part}${levelName}`
                    };

                    const repetitions =  objParts[part].sort((a, b) => {
                        if(a.repetition < b.repetition) return -1;
                        if(a.repetition > b.repetition) return 1;
                        return 0;
                    });

                    repetitions.forEach(r => {
                        const repetitionName = `repetition-${r.repetition}`;

                        if(repetitionNames.indexOf(repetitionName) === -1) {
                            repetitionNames.push(repetitionName);
                        }

                        result[repetitionName] = r.value;
                    });

                    return result;
                });

            // add level separator
            parts.push({
                tickName: `separator ${levelName}`
            });

            return parts;
        });


    const sortedMeasurements = sortedLevels.reduce((acc, level) => {
        level.forEach(part => {
            acc.push(part);
        });

        return acc;
    }, [{tickName: 'separator empty'}]); // пропуст в начале графика без разделительной линии.

    return {
        data: sortedMeasurements,
        repetitionNames,
        partNames,
        levelNames
    }
}


function conversionExperimentType2DataOptimized(mockData) {
    // кол-во репетишинов и партов должно быть одинаковым и совподать по названию в каждом левеле!!!!!!!!
    let partNames, repetitionNames = [];
    let objLevels = getLevelsObj([...mockData.experimentType2Data.table[0].cells])


    const levelNames = Object.keys(objLevels)
        .sort(getCompareByKeyFn(null, true));

    const sortedLevels = levelNames.map(levelName => {
        const objParts =  arrayToObjByPropName(objLevels[levelName], 'part');

        if(!partNames) {
            partNames = Object.keys(objParts).sort(getCompareByKeyFn());
        }

        const parts =  partNames.map(part => {
            const result = {
                tickName: `${part}${levelName}`
            };

            const repetitions =  objParts[part].sort(getCompareByKeyFn('repetition', true));

            repetitions.forEach(r => {
                const repetitionName = `repetition-${r.repetition}`;

                if(repetitionNames.indexOf(repetitionName) === -1) {
                    repetitionNames.push(repetitionName);
                }

                result[repetitionName] = r.value;
            });

            return result;
        });

        // add level separator
        parts.push({
            tickName: `separator ${levelName}`
        });

        return parts;
    });


    const sortedMeasurements = sortedLevels.reduce((acc, level) => {
        level.forEach(part => {
            acc.push(part);
        });

        return acc;
    }, [{tickName: 'separator empty'}]); // пропуст в начале графика без разделительной линии.

    return {
        data: sortedMeasurements,
        repetitionNames,
        partNames,
        levelNames
    }
}

const getLevelsObj = (measurements) => {
    return arrayToObjByPropName(measurements, 'level');
};

const arrayToObjByPropName = (arr, propName) => {
    return arr.reduce((acc, item) => {
        const propertyValue = item[propName];

        if(!acc[propertyValue]) {
            acc[propertyValue] = [];
        }

        acc[propertyValue].push(item);

        return acc;
    }, {});
};

/**
 * return compare function for sort method of array
 * @param key {String}- compare objects by key (don't recursively) if equals null compare as simply values
 * @param isStringCompare {Boolean} - if true then values are compare as string
 * @returns {Function}
 */
const getCompareByKeyFn = (key = null, isStringCompare = false) => (a, b) => {
    if (!isStringCompare) {
        a = +a;
        b = +b;
    }

    if(key == null) {
        if(a < b) return -1;
        if(a > b) return 1;
        return 0;
    }

    if(a[key] < b[key]) return -1;
    if(a[key] > b[key]) return 1;
    return 0;
};
