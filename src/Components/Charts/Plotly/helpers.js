// todo: add jsdoc
export function getStructuredSortedData(data, mapProps, props) {
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

export function getSortedMapPropertiesByNames(rowData, arrNames) {
    return arrNames.reduce((acc, propName) => {
        acc[propName] = getSortedPropertyValues(rowData, propName);
        return acc;
    }, {});
}

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
export const getCompareByKeyFn = (key = null, isStringCompare = false) => (a, b) => {
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