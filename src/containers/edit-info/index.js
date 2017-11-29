import { Map as map } from 'immutable';
import { connect } from 'react-redux';

import {
    editInfoClosed, editInfoValueChanged
} from '../../actions/edit-info.actions';

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import EditInfoFormRow from './form-row';
import { Artwork } from '../artwork';

export function EditInfo({ newValues, active, hidden, artworkSrc, onClose, onChange, onChangeNumber }) {
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
                    <Artwork src={artworkSrc} />
                    <div className="info">
                        <EditInfoFormRow label="Track" field="track" type="number"
                            values={newValues} onChange={onChangeNumber} />
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
    artworkSrc: PropTypes.string,
    active: PropTypes.bool.isRequired,
    hidden: PropTypes.bool.isRequired,
    newValues: PropTypes.instanceOf(map),
    onClose: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onChangeNumber: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
    artworkSrc: state.getIn(['editInfo', 'artwork']),
    active: Boolean(state.getIn(['editInfo', 'song'])),
    hidden: state.getIn(['editInfo', 'hidden']),
    newValues: state.getIn(['editInfo', 'newValues'])
});

const mapDispatchToProps = dispatch => ({
    onClose: cancel => dispatch(editInfoClosed(cancel)),
    onChange: key => evt => dispatch(editInfoValueChanged(key, evt.target.value)),
    onChangeNumber: key => evt => dispatch(editInfoValueChanged(key, Number(evt.target.value)))
});

export default connect(mapStateToProps, mapDispatchToProps)(EditInfo);

