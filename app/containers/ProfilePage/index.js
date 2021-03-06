/*
 *
 * ProfilePage
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import Helmet from 'react-helmet';

import ProfileForm from '../../components/ProfileForm';
import { selectChangePasswordResult, selectOtherUser, selectProfileFormValues } from '../../containers/ProfilePage/selectors';
import { selectCurrentUser, selectUserRoleType } from '../../containers/App/selectors';
import { changePassword, changeImage, fetchOtherUser } from '../../containers/ProfilePage/actions';
import { changeUsersTimezone } from '../../containers/App/actions';

export class ProfilePage extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    changePasswordResult: PropTypes.object,
    changePassword: PropTypes.func,
    changeImage: PropTypes.func,
    fetchOtherUser: PropTypes.func,
    currentUser: PropTypes.any,
    otherUser: PropTypes.any,
    params: PropTypes.object,
    formValues: PropTypes.object,
    userRoleType: PropTypes.string,
    changeUsersTimezone: React.PropTypes.func,
  }

  constructor(props) {
    super(props);

    this.changePassword = this.props.changePassword.bind(this);
    this.changeImage = this.props.changeImage.bind(this);
  }

  componentDidMount() {
    const { userId } = this.props.params;
    if (userId !== 'me') {
      this.props.fetchOtherUser({ userId });
    }
  }

  render() {
    const me = this.props.params.userId === 'me';

    return (
      <div className="container-fluid">
        <Helmet title="Profile - StudyKIK" />
        <section>
          <h2 className="main-heading">PROFILE</h2>
          <div className="row profile form-study">

            <div className="col-xs-6 form-holder">
              {(() => {
                const initialValues = {
                  initialValues: {
                    ...(me ? this.props.currentUser : this.props.otherUser.info),
                  },
                };

                return (me || this.props.otherUser.info) && <ProfileForm
                  {...initialValues}
                  changePasswordResult={this.props.changePasswordResult}
                  changePassword={this.changePassword}
                  changeImage={this.changeImage}
                  currentUser={me ? this.props.currentUser : this.props.otherUser.info}
                  userRoleType={this.props.userRoleType}
                  me={me}
                  formValues={this.props.formValues}
                  changeUsersTimezone={this.props.changeUsersTimezone}
                />;
              })()}
            </div>
          </div>
        </section>
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  changePasswordResult: selectChangePasswordResult(),
  currentUser: selectCurrentUser(),
  userRoleType: selectUserRoleType(),
  otherUser: selectOtherUser(),
  formValues: selectProfileFormValues(),
});

function mapDispatchToProps(dispatch) {
  return {
    changePassword: (values) => dispatch(changePassword(values)),
    changeImage: (values) => dispatch(changeImage(values)),
    fetchOtherUser: (userId) => dispatch(fetchOtherUser(userId)),
    changeUsersTimezone: (userId, timezone) => dispatch(changeUsersTimezone(userId, timezone)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePage);
