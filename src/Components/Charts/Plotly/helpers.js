/**
 * Sort and transform raw data array to arrays of arrays by the required sequence of properties.
 * @param data
 * @param dataInfo
 * @param props
 * @returns {*}
 */
export function getStructuredSortedData(data, dataInfo, props) {
    const rootPropName = props[0];

    return dataInfo[rootPropName].reduce((acc, mapPropValue) => {
        const filteredData = data.filter(d => d[rootPropName] === mapPropValue);

        if(props.length > 1) {
            acc.push(getStructuredSortedData(filteredData, dataInfo, props.slice(1)));
        } else {
            acc.push(filteredData[0]);
        }

        return acc;
    }, []);
}



/**
 * the sorted information about chart data entities by the required sequence.
 * @param rawData
 * @param sequenceProps {Array}
 * @returns {*}
 */
export function getSortedChartDataInfo(rawData, sequenceProps) {
    return sequenceProps.reduce((acc, propName) => {
        acc[propName] = getSortedPropertyValues(rawData, propName);
        return acc;
    }, {});
}



/**
 * The filtering and the sorting an array items by property name
 * @param data
 * @param propName
 * @returns {*}
 */
export function getSortedPropertyValues(data, propName) {
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
export function getCompareByKeyFn(key = null, isStringCompare = false) {

    return function (a, b) {
        let valA = a;
        let valB = b;

        if (key) {
            valA = a[key];
            valB = b[key];
        }

        if (!isStringCompare) {

            if (isNaN(+valA) || isNaN(+valB)) {
                valA = valA.toUpperCase();
                valB = valB.toUpperCase();

                if (valA.length === valB.length) {

                    if (valA < valB) return -1;
                    if (valA > valB) return 1;
                    return 0;
                } else {
                    if (valA.length < valB.length) return -1;
                    if (valA.length > valB.length) return 1;
                    return 0;
                }

            } else {
                valA = +valA;
                valB = +valB;
            }
        }

        if (valA < valB) return -1;
        if (valA > valB) return 1;
        return 0;
    };
}



/**
 * Return the layout configuration object for plotly.js
 * @param values
 * @param text
 * @param shapes
 * @param setting
 * @returns {*} of config entities.
 */
export function getLayout(values, text, shapes, setting) {

    return {
        width: setting.width,
        height: setting.height,
        title: setting.title,
        xaxis: {
            type: "category",
            tickvals: values,
            ticktext: text
        },
        shapes: shapes
    }
}


/**
 * Return the separator shapes array for the layout of the plotly.js chart
 * @param count
 * @param interval
 * @returns {{type: string, xref: string, yref: string, x0: number, x1: number, y0: number, y1: number, line: {color: string}}[]}
 */
export function getChartSeparatorShapes(count, interval) {
    const shapes = [...(new Array(count))];

    return shapes.map((level, index) => {
        const xPosition = (index + 1) * interval + index;

        return {
            type: "line",
            xref: "x",
            yref: "paper",
            x0: xPosition,
            x1: xPosition,
            y0: 0,
            y1: 1,
            line: {
                color: "#ccc"
            }
        };
    });
}