import buildMessage from '../messageBuilder';
import { UI_RESET } from '../constants/actions';

export const uiReset = () => buildMessage(UI_RESET);

