import React, { Component } from 'react';
import intl from 'react-intl-universal';
import { Button, Popconfirm, message } from 'antd';
import { delDevice } from '../../services/user-invitation-examine';

class DeviceDel extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async confirm() {
    const { duid } = this.props;
    const res = await delDevice(duid);
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
      <div style={{ marginTop: '10px' }}>
        <Popconfirm
          title={intl.get('common.sure_handle').defaultMessage('确定执行吗？')}
          onConfirm={() => this.confirm()}
          onCancel={this.cancel}
        >
          <Button type="danger">{intl.get('common.tools.delete').defaultMessage('删除')}</Button>
        </Popconfirm>
      </div>
    );
  }
}

export default DeviceDel;
