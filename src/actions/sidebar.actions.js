import buildAction from '../messageBuilder';
import { SIDEBAR_HIDDEN, SIDEBAR_DISPLAY_OVER_TOGGLED } from '../constants/actions';

export const sidebarHiddenToggled = () => buildAction(SIDEBAR_HIDDEN);
export const sidebarDisplayOverToggled = () => buildAction(SIDEBAR_DISPLAY_OVER_TOGGLED);

