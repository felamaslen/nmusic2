import { shallow } from 'enzyme';

export default (component, store) =>
    shallow(component, { context: { store } });

