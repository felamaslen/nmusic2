import { Map as map } from 'immutable';
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export default function EditInfoFormRow({ label, field, values, onChange, type, ...inputProps }) {
    const active = values.getIn([field, 'active']);
    const disabled = !active;
    const className = classNames('field-outer', `field-${field}`, { disabled });

    let inputValue = values.getIn([field, 'value']);
    let inputType = type || 'text';

    if (disabled) {
        inputValue = '<multiple values>';
        inputType = 'text';
    }

    return <div className={className}>
        <div className="field-label">{label}</div>
        <div className="field-input-outer">
            <input className="field-input" disabled={disabled} value={inputValue}
                onChange={onChange(field)} type={inputType} {...inputProps} />
        </div>
    </div>;
}

EditInfoFormRow.propTypes = {
    label: PropTypes.string.isRequired,
    field: PropTypes.string.isRequired,
    type: PropTypes.string,
    values: PropTypes.instanceOf(map).isRequired,
    onChange: PropTypes.func.isRequired
};

