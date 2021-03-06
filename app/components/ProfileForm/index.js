/**
*
* ProfileForm
*
*/

import 'blueimp-canvas-to-blob';
import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { Modal } from 'react-bootstrap';
import _ from 'lodash';
import moment from 'moment-timezone';
import Input from '../../components/Input';
import ChangePasswordForm from '../../components/ChangePasswordForm';
import ReactSelect from '../../components/Input/ReactSelect';
import ProfileImageForm from '../../components/ProfileImageForm';
import defaultImage from '../../assets/images/Default-User-Img-Dr-Full.png';
import CenteredModal from '../../components/CenteredModal/index';
import { formatTimezone } from '../../utils/time';

@reduxForm({ form: 'profile' })
class ProfileForm extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    currentUser: React.PropTypes.object,
    userRoleType: React.PropTypes.string,
    changePassword: React.PropTypes.func,
    changeImage: React.PropTypes.func,
    changePasswordResult: React.PropTypes.object,
    me: React.PropTypes.bool,
    formValues: React.PropTypes.object,
    changeUsersTimezone: React.PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.openResetPasswordModal = this.openResetPasswordModal.bind(this);
    this.closeResetPasswordModal = this.closeResetPasswordModal.bind(this);
    this.openProfileImageModal = this.openProfileImageModal.bind(this);
    this.closeProfileImageModal = this.closeProfileImageModal.bind(this);
    this.uploadImage = this.uploadImage.bind(this);
    this.onChangeTimezone = this.onChangeTimezone.bind(this);

    this.state = {
      passwordResetModalOpen: false,
      profileImageModalOpen: false,
    };
  }

  componentWillReceiveProps(newProps) {
    if (!newProps.changePasswordResult.passwordChanging && this.props.changePasswordResult.passwordChanging) {
      this.closeResetPasswordModal();
    }
  }

  onChangeTimezone(value) {
    this.props.changeUsersTimezone(this.props.currentUser.id, value);
  }

  openResetPasswordModal() {
    this.setState({ passwordResetModalOpen: true });
  }

  closeResetPasswordModal() {
    this.setState({ passwordResetModalOpen: false });
  }

  openProfileImageModal() {
    this.setState({ profileImageModalOpen: true });
  }

  closeProfileImageModal() {
    this.setState({ profileImageModalOpen: false });
  }

  uploadImage(e) {
    e.toBlob((blob) => {
      this.props.changeImage({ file: blob, user_id: this.props.currentUser.id });
      this.closeProfileImageModal();
    });
  }

  render() {
    const { me, userRoleType, currentUser } = this.props;
    const initialValues = {
      initialValues: {
        user_id: currentUser.id,
      },
    };
    const timezoneOptions = _.map(_.filter(moment.tz.names(), (t => t.split('/').length === 2)), t => {
      const timezone = formatTimezone(t);
      return { label: timezone, value: t };
    });

    return (
      <form>
        <div className="field-row label-top file-img active">
          <strong className="label"><label htmlFor="profile-img">PROFILE IMAGE</label></strong>
          <div className="field">
            <div className="profile-image">
              <label htmlFor="profile-img" className="image">
                <span>
                  <img src={currentUser.profileImageURL || defaultImage} alt="" /><br />
                </span>
              </label>
            </div>
          </div>
        </div>

        <div className="field-row">
          <strong className="label" />
          <div className="field">
            <a className="btn btn-gray upload-btn" onClick={this.openProfileImageModal}>Update Profile Image</a>
          </div>
        </div>

        <div className="field-row">
          <strong className="label"><label>NAME</label></strong>
          <div className="field">
            <div className="row">
              <Field
                name="firstName"
                component={Input}
                type="text"
                className="col pull-left"
                isDisabled
              />
              <Field
                name="lastName"
                component={Input}
                type="text"
                placeholder="Last Name"
                className="col pull-right"
                isDisabled
              />
            </div>
          </div>
        </div>

        <div className="field-row fs-hide">
          <strong className="label"><label>Email</label></strong>
          <Field
            name="email"
            component={Input}
            disabled="true"
            type="text"
            placeholder="Email"
            className="field"
            isDisabled
          />
        </div>
        {
          !(userRoleType === 'dashboard' || (currentUser.roleForClient && currentUser.roleForClient.site_id != null)) &&
            <div className="field-row">
              <strong className="label"><label>Time Zone</label></strong>
              <Field
                name="timezone"
                component={ReactSelect}
                placeholder="Select Timezone"
                options={timezoneOptions}
                className="field"
                onChange={this.onChangeTimezone}
                clearable={false}
              />
            </div>
        }
        <div className="field-row">
          <strong className="label"><label>PASSWORD</label></strong>
          <a className="btn btn-primary" onClick={this.openResetPasswordModal} disabled={!me}>EDIT</a>
        </div>
        <Modal
          className="profile-page-modal"
          dialogComponentClass={CenteredModal}
          show={this.state.passwordResetModalOpen}
          onHide={this.closeResetPasswordModal}
          backdrop
          keyboard
        >
          <Modal.Header>
            <Modal.Title>CHANGE PASSWORD</Modal.Title>
            <a className="lightbox-close close" onClick={this.closeResetPasswordModal}>
              <i className="icomoon-icon_close" />
            </a>
          </Modal.Header>
          <Modal.Body>
            <ChangePasswordForm {...initialValues} onSubmit={this.props.changePassword} />
          </Modal.Body>
        </Modal>
        <Modal
          className="profile-page-modal avatar-modal"
          dialogComponentClass={CenteredModal}
          show={this.state.profileImageModalOpen}
          onHide={this.closeProfileImageModal}
          backdrop
          keyboard
        >
          <Modal.Header>
            <Modal.Title>UPDATE PROFILE IMAGE</Modal.Title>
            <a className="lightbox-close close" onClick={this.closeProfileImageModal}>
              <i className="icomoon-icon_close" />
            </a>
          </Modal.Header>
          <Modal.Body>
            <ProfileImageForm {...initialValues} handleSubmit={this.uploadImage} />
          </Modal.Body>
        </Modal>

      </form>
    );
  }
}

export default ProfileForm;
