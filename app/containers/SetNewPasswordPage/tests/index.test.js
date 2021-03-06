// import SetNewPasswordPage from '../index';

import expect from 'expect';
import { shallow } from 'enzyme';
import React from 'react';
import { ReduxForm } from 'redux-form';
import SetNewPasswordPage from '../index';

describe('<SetNewPasswordPage />', () => {
  let setup;

  beforeEach(() => {
    setup = () => {
      const props = {
        onSubmitForm: expect.createSpy(),
      };

      const shallowWrapper = shallow(<SetNewPasswordPage {...props} />);

      return {
        props,
        shallowWrapper,
      };
    };
  });

  it('should render the set new password form', () => {
    const { shallowWrapper } = setup();

    expect(shallowWrapper.contains(<ReduxForm />)).toEqual(true);
  });

  it('should pass correct props to reset password form', () => {
    const { shallowWrapper } = setup();

    const formProps = shallowWrapper.find('ReduxForm').props();
    expect(formProps.onSubmit).toBeA('function');
  });
});
