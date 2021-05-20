import React, { Component } from 'react';
import intl from 'react-intl-universal';
import { Button, Popconfirm, message } from 'antd';
import { Text } from '@xy/design';

import { addUserPowerServer } from '../../services/user-invitation-examine';

const { WordInexplain } = Text;
class CustomerUser extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async confirm() {
    const { country, auid } = this.props;
    const saveData = {
      insertDataList: JSON.stringify([
        {
          auid,
          country,
          power: 'B',
        },
      ]),
    };
    const res = await addUserPowerServer(saveData);
    if (res.status) {
      //  如果成功
      message.success(intl.get('common.operate_success').defaultMessage('操作成功!'), 3);
      this.props.callback();
    } else {
      message.error(res.msg, 3);
    }
  }

  cancel() {
    message.error(intl.get('common.close_cancel').defaultMessage('点击了取消'));
  }

  render() {
    return (
      <div>
        <Popconfirm
          title={intl.get('common.sure_handle').defaultMessage('确定执行吗？')}
          onConfirm={() => this.confirm()}
          onCancel={this.cancel}
        >
          <Button type="ghost">
            {intl
              .get('vivaplus.user.user_detail.invite_customer_user')
              .defaultMessage('邀请制消费者')}{' '}
            <WordInexplain
              text={intl
                .get('vivaplus.user.user_detail.invite_customer_user_text')
                .defaultMessage('操作成功后用户会成为社区消费者')}
              styleHeight="12"
            />
          </Button>
        </Popconfirm>
      </div>
    );
  }
}

export default CustomerUser;
