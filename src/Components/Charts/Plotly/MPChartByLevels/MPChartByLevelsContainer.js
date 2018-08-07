import React, {Component} from 'react';

import MOCK_DATA from '../../../../mock_data';
import MPChartByLevels from "./MPChartByLevels";

export default class MPChartByLevelsContainer extends Component {

    render() {
        const experimentType2Table = MOCK_DATA.experimentType2Data.table;

        return (
            <div>
                {
                    experimentType2Table.map((characteristic, i) => {
                        return <MPChartByLevels key={i} rowData={characteristic.cells}/>
                    })
                }
            </div>
        );
    }
}
