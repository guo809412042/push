import React from 'react';
import intl from 'react-intl-universal';
import { Popconfirm, Spin, message } from 'antd';

import { userWhiteCreate } from '../../services/user';

export default class AddUserWhite extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      spinning: false,
    };
  }

  handleConfirm = async () => {
    try {
      this.setState({ spinning: true });
      await userWhiteCreate({ auiddigest: this.props.auiddigest });
      message.success(intl.get('common.operate_success').defaultMessage('操作成功'));
    } catch (error) {
      console.error(error);
      message.error(
        `${intl.get('common.operate_fail').defaultMessage('操作失败')},${error.message}`,
      );
    } finally {
      this.setState({ spinning: false });
    }
  };

  render() {
    const { children } = this.props;
    const { spinning } = this.state;
    return (
      <Spin spinning={spinning}>
        <Popconfirm
          onConfirm={this.handleConfirm}
          title={intl
            .get('vivaplus.user.user_detail.add_user_white')
            .defaultMessage('确认将该用户加入白名单？')}
        >
          {children}
        </Popconfirm>
      </Spin>
    );
  }
}
