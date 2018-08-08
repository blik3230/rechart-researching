import React, {Component} from 'react';

import MOCK_DATA from '../../../../mock_data';
import MPChartByRepetition from "./MPChartByRepetitions";

export default class MPChartByRepetitionsContainer extends Component {

    render() {
        const experimentType2Table = MOCK_DATA.experimentType2Data.table;

        return (
            <div>
                {
                    experimentType2Table.map((characteristic, i) => {
                        return <MPChartByRepetition key={i} rawData={characteristic.cells}/>
                    })
                }
            </div>
        );
    }
}

