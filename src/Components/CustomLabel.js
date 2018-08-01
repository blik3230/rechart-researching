import React from 'react';

function CustomLabel(props) {
    if (props.payload.value.includes("separator")) {
        return null;
    }

    return (
        <text {...props} y={props.y + 16}>
            {props.payload.value}
        </text>
    );
}

export default CustomLabel;