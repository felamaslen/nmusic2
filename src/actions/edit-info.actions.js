import buildAction from '../messageBuilder';
import {
    EDIT_INFO_OPENED, EDIT_INFO_CLOSED, EDIT_INFO_VALUE_CHANGED, EDIT_INFO_VALUES_UPDATED
} from '../constants/actions';

export const editInfoOpened = () => buildAction(EDIT_INFO_OPENED);

export const editInfoClosed = cancel => buildAction(EDIT_INFO_CLOSED, { cancel });

export const editInfoValueChanged = (key, value) => buildAction(EDIT_INFO_VALUE_CHANGED, { key, value });

export const editInfoValuesUpdated = res => buildAction(EDIT_INFO_VALUES_UPDATED, res);

