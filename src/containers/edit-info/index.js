import { Map as map } from 'immutable';
import { connect } from 'react-redux';

import {
    editInfoClosed, editInfoValueChanged
} from '../../actions/edit-info.actions';

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

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
                        <div className="field-outer">
                            <div className="field-label">{'Title'}</div>
                            <div className="field-input-outer">
                                <input className="field-input" value={newValues.get('title')}
                                    onChange={onChange('title')} />
                            </div>
                        </div>
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

