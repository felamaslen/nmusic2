import { Map as map } from 'immutable';
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export default function EditInfoFormRow({ label, field, values, onChange }) {
    const className = classNames({
        'field-outer': true,
        [`field-${field}`]: true
    });

    return <div className={className}>
        <div className="field-label">{label}</div>
        <div className="field-input-outer">
            <input className="field-input" value={values.get(field)}
                onChange={onChange(field)} />
        </div>
    </div>;
}

EditInfoFormRow.propTypes = {
    label: PropTypes.string.isRequired,
    field: PropTypes.string.isRequired,
    values: PropTypes.instanceOf(map).isRequired,
    onChange: PropTypes.func.isRequired
};

