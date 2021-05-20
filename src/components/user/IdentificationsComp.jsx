import React from 'react';
import { getLiveroomIdentifications, getLiveroomPhoneVerify } from '../../services/user';
import { cipherTextDecode } from '../../services/app';

class IdentificationsComp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: '',
      phoneNumber: '',
    };
  }

  componentWillReceiveProps = async (nowProps) => {
    const { userdigest: now } = nowProps;
    const { userdigest: old } = this.props;
    if (now !== old) {
      let data = '';
      let phoneNumber = '';
      try {
        data = await getLiveroomIdentifications(now);
      } catch (error) {
        console.error(error);
      }
      try {
        const phone_data = await getLiveroomPhoneVerify(now);
        // eslint-disable-next-line
        const { data } = await cipherTextDecode({ cipherText: phone_data.phone });
        phoneNumber = data;
      } catch (error) {
        console.error(error);
      }
      this.setState({ data, phoneNumber });
    }
  };

  render() {
    const { data, phoneNumber } = this.state;
    return (
      <div>
        <div style={{ float: 'left' }}>
          <h3>实名状态</h3>
          {data.id_name ? (
            <div>
              <p>
                <strong>姓名:</strong>
                {data.id_name}
              </p>
              <p>
                <strong>身份证:</strong>
                {data.id_number}
              </p>
              <p>
                <strong>电话:</strong>
                {data.tel_number}
              </p>
              <p>
                <strong>认证时间:</strong>
                {data.created_at}
              </p>
              <p>
                <strong>更新时间:</strong>
                {data.updated_at}
              </p>
            </div>
          ) : (
            <div>该用户未进行实名认证</div>
          )}
        </div>
        <div style={{ float: 'left', marginLeft: '20px' }}>
          <h3>手机认证状态</h3>
          {phoneNumber ? (
            <div>
              <p>
                <strong>电话:</strong>
                {phoneNumber}
              </p>
            </div>
          ) : (
            <div>该用户未进行手机认证</div>
          )}
        </div>
      </div>
    );
  }
}

export default IdentificationsComp;
