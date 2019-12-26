import { configure, shallow } from 'enzyme';
import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import Inputs from '../Inputs';
import Filters, { isFinite } from './Filters';

configure({ adapter: new Adapter() });

describe('isFinite', () => {
  it('infinite String', () => {
    expect.assertions(1);
    const number = '1.7976931348623157E+10308';
    const result = isFinite(number);
    expect(result).toBe(false);
  });
  it('finite String', () => {
    expect.assertions(1);
    const number = '4548.578412e-12';
    const result = isFinite(number);
    expect(result).toBe(true);
  });
  it('infinite Number', () => {
    expect.assertions(1);
    const number = 1 / 3;
    const result = isFinite(number);
    expect(result).toBe(true);
  });
  it('finite Number', () => {
    expect.assertions(1);
    const number = 4548.578412;
    const result = isFinite(number);
    expect(result).toBe(true);
  });
});
describe('filters', () => {
  it('renders', () => {
    expect.hasAssertions();
    const wrapper = shallow(
      <Filters
        inputs={[
          {
            label: 'integer',
            type: 'int',
          },
        ]}
      />,
    );
    expect(wrapper.find(Inputs).map((inp) => inp.prop('type'))).toStrictEqual(['int', 'int']);
  });
  it('events function well', () => {
    expect.hasAssertions();
    const wrapper = shallow(
      <Filters
        inputs={[
          {
            label: 'integer',
            type: 'int',
          },
        ]}
      />,
    );
    wrapper
      .find(Inputs)
      .at(0)
      .simulate('change', {
        value: 45,
      });
    expect(
      wrapper
        .find(Inputs)
        .at(0)
        .prop('value'),
    ).toBe(45);
  });
  it.todo('updates on updating props');
});
