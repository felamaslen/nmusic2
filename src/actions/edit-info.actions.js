import buildAction from '../messageBuilder';
import * as actions from '../constants/actions';

export const editInfoOpened = () => buildAction(actions.EDIT_INFO_OPENED);

export const editInfoClosed = cancel => buildAction(actions.EDIT_INFO_CLOSED, { cancel });

export const editInfoNavigated = direction => buildAction(actions.EDIT_INFO_NAVIGATED, { direction });

export const editInfoValueChanged = (key, value) => buildAction(actions.EDIT_INFO_VALUE_CHANGED, { key, value });

export const editInfoValuesUpdated = res => buildAction(actions.EDIT_INFO_VALUES_UPDATED, res);

