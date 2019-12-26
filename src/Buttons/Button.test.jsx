import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Fab from '@material-ui/core/Fab';
import MuiButton from '@material-ui/core/Button';
import Button from './Button';

configure({ adapter: new Adapter() });

describe('functions', () => {
  it('renders a button', () => {
    expect.assertions(1);
    const wrapper = shallow(<Button label="Hello" />);
    expect(wrapper.text()).toBe('Hello');
  });
  it.todo('fires a callback');
});

describe('displays all props', () => {
  it('changes type', () => {
    expect.assertions(2);
    const wrapper = shallow(<Button type="button" />);
    expect(wrapper.find(MuiButton)).toHaveLength(1);
    const wrapper2 = shallow(<Button />);
    expect(wrapper2.find(Fab)).toHaveLength(1);
  });
  it('gets disabled', () => {
    expect.assertions(2);
    const wrapper1 = shallow(<Button disabled={false} />);
    const wrapper2 = shallow(<Button disabled />);
    expect(
      wrapper1
        .find(Fab)
        .at(0)
        .props().disabled,
    ).toBe(false);
    expect(
      wrapper2
        .find(Fab)
        .at(0)
        .props().disabled,
    ).toBe(true);
  });
  it('changes color', () => {
    expect.assertions(2);
    const wrapper1 = shallow(<Button color="secondary" />);
    const wrapper2 = shallow(<Button />);
    expect(
      wrapper1
        .find(Fab)
        .at(0)
        .props().color,
    ).toBe('secondary');
    expect(
      wrapper2
        .find(Fab)
        .at(0)
        .props().color,
    ).toBe('default');
  });
  it('shows label', () => {
    expect.assertions(1);
    const wrapper = shallow(<Button label="Hello world" />);
    expect(wrapper.find('span').text()).toBe('Hello world');
  });
  it('changes size', () => {
    expect.assertions(2);
    const wrapper1 = shallow(<Button size="small" />);
    const wrapper2 = shallow(<Button />);
    expect(
      wrapper1
        .find(Fab)
        .at(0)
        .props().size,
    ).toBe('small');
    expect(
      wrapper2
        .find(Fab)
        .at(0)
        .props().size,
    ).toBe('large');
  });
  it('shows icon', () => {
    expect.assertions(1);
    const wrapper = shallow(<Button icon="small" />);
    expect(wrapper.find('span').text()).toBe('small');
  });
  it('renders children', () => {
    expect.assertions(1);
    const wrapper = shallow(<Button>Hello</Button>);
    expect(wrapper.find('span').text()).toBe('Hello');
  });
});
