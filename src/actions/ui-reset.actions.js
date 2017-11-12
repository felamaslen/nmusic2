import buildAction from '../messageBuilder';
import { UI_RESET, SETTINGS_LOADED, SETTINGS_INSERTED } from '../constants/actions';

export const uiReset = () => buildAction(UI_RESET);
export const settingsLoaded = () => buildAction(SETTINGS_LOADED);
export const settingsInserted = settings => buildAction(SETTINGS_INSERTED, settings);

