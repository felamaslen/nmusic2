/* eslint-disable newline-per-chained-call */
import { Map as map } from 'immutable';
import '../../../browser';
import { expect } from 'chai';
import React from 'react';
import { shallow } from 'enzyme';
import EditInfoFormRow from '../../../../src/containers/edit-info/form-row';

describe('<EditInfoFormRow />', () => {
    const changeValue = {};
    const onChange = key => evt => {
        changeValue[key] = evt.target.value;
    };

    const props = {
        label: 'Title',
        field: 'title',
        values: map({
            title: map({ active: true, value: 'foo' })
        }),
        onChange
    };

    it('should render its basic structure', () => {
        const wrapper = shallow(<EditInfoFormRow {...props} />);

        expect(wrapper.is('div.field-outer.field-title')).to.equal(true);
        expect(wrapper.children()).to.have.length(2);
        expect(wrapper.childAt(0).is('div.field-label')).to.equal(true);
        expect(wrapper.childAt(0).text()).to.equal('Title');
        expect(wrapper.childAt(1).is('div.field-input-outer')).to.equal(true);
        expect(wrapper.childAt(1).children()).to.have.length(1);
        expect(wrapper.childAt(1).childAt(0).is('input.field-input')).to.equal(true);
        expect(wrapper.childAt(1).childAt(0).props()).to.have.property('value', 'foo');
    });

    it('should handle change event', () => {
        const wrapper = shallow(<EditInfoFormRow {...props} />);

        expect(changeValue).to.not.have.property('title');

        wrapper.childAt(1).childAt(0).simulate('change', { target: { value: 'bar' } });

        expect(changeValue).to.have.property('title', 'bar');
    });

    it('should render a number input', () => {
        const propsNumber = { ...props, type: 'number', step: 1 };

        const wrapper = shallow(<EditInfoFormRow {...propsNumber} />);

        const input = wrapper.childAt(1).childAt(0);

        expect(input.props()).to.have.property('type', 'number');
        expect(input.props()).to.have.property('step', 1);
    });

    it('should render a disabled field', () => {
        const disabledProps = {
            ...props,
            values: props.values.setIn(['title', 'active'], false)
        };

        const wrapper = shallow(<EditInfoFormRow {...disabledProps} />);

        expect(wrapper.hasClass('disabled')).to.equal(true);
        expect(wrapper.childAt(1).childAt(0).props()).to.have.property('disabled', true);
        expect(wrapper.childAt(1).childAt(0).props()).to.have.property('value', '<multiple values>');
    });
});

