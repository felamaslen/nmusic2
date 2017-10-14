import { expect } from 'chai';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
Enzyme.configure({ adapter: new Adapter() });
import React from 'react';
import 'ignore-styles';

import App from '../../../src/components/app';

describe('<App />', () => {
    it('should render a container div', () => {
        const result = shallow(<App />);

        expect(result.find('div.nmusic-app-outer')).to.have.length(1);
    });
});

