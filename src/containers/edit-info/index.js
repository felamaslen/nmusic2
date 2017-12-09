import { Map as map } from 'immutable';
import { connect } from 'react-redux';

import * as actions from '../../actions/edit-info.actions';

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import EditInfoFormRow from './form-row';
import { Artwork } from '../artwork';

export function EditInfo({ active, ...props }) {
    if (!active) {
        return null;
    }

    const {
        newValues,
        hidden,
        artworkSrc,
        nextAvailable,
        prevAvailable,
        onNavigate,
        onClose,
        onChange,
        onChangeNumber
    } = props;

    const className = classNames('edit-info-outer', { hidden });

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
                    <button className="button-previous" onClick={() => onNavigate(-1)}
                        disabled={!prevAvailable}>{'Previous'}</button>
                    <button className="button-next" onClick={() => onNavigate(1)}
                        disabled={!nextAvailable}>{'Next'}</button>
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
    nextAvailable: PropTypes.bool.isRequired,
    prevAvailable: PropTypes.bool.isRequired,
    onNavigate: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onChangeNumber: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
    artworkSrc: state.getIn(['editInfo', 'artwork']),
    active: Boolean(state.getIn(['editInfo', 'songs'])),
    hidden: state.getIn(['editInfo', 'hidden']),
    newValues: state.getIn(['editInfo', 'newValues']),
    nextAvailable: state.getIn(['editInfo', 'nextAvailable']),
    prevAvailable: state.getIn(['editInfo', 'prevAvailable'])
});

const mapDispatchToProps = dispatch => ({
    onNavigate: direction => dispatch(actions.editInfoNavigated(direction)),
    onClose: cancel => dispatch(actions.editInfoClosed(cancel)),
    onChange: key => evt => dispatch(actions.editInfoValueChanged(key, evt.target.value)),
    onChangeNumber: key => evt => dispatch(actions.editInfoValueChanged(key, Number(evt.target.value)))
});

export default connect(mapStateToProps, mapDispatchToProps)(EditInfo);

