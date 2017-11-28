import { Map as map } from 'immutable';
import { connect } from 'react-redux';

import {
    editInfoClosed, editInfoValueChanged
} from '../../actions/edit-info.actions';

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import EditInfoFormRow from './form-row';

export function EditInfo({ newValues, active, hidden, onClose, onChange }) {
    if (!active) {
        return null;
    }

    const className = classNames({
        'edit-info-outer': true,
        hidden
    });

    return <div className={className}>
        <div className="edit-info">
            <div className="inner">
                <div className="info-outer">
                    <div className="artwork-outer">
                    </div>
                    <div className="info">
                        <EditInfoFormRow label="Title" field="title" values={newValues} onChange={onChange} />
                        <EditInfoFormRow label="Artist" field="artist" values={newValues} onChange={onChange} />
                        <EditInfoFormRow label="Album" field="album" values={newValues} onChange={onChange} />
                    </div>
                </div>
                <div className="buttons">
                    <button className="button-cancel" onClick={() => onClose(true)}>{'Cancel'}</button>
                    <button className="button-ok" onClick={() => onClose(false)}>{'OK'}</button>
                </div>
            </div>
        </div>
    </div>;
}

EditInfo.propTypes = {
    song: PropTypes.instanceOf(map),
    active: PropTypes.bool.isRequired,
    hidden: PropTypes.bool.isRequired,
    newValues: PropTypes.instanceOf(map),
    onClose: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
    song: state.getIn(['editInfo', 'song']),
    active: Boolean(state.getIn(['editInfo', 'song'])),
    hidden: state.getIn(['editInfo', 'hidden']),
    newValues: state.getIn(['editInfo', 'newValues'])
});

const mapDispatchToProps = dispatch => ({
    onClose: cancel => dispatch(editInfoClosed(cancel)),
    onChange: key => evt => dispatch(editInfoValueChanged(key, evt.target.value))
});

export default connect(mapStateToProps, mapDispatchToProps)(EditInfo);

