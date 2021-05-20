import React from 'react';
import intl from 'react-intl-universal';

import { Form, Cascader } from 'antd';
import { getappinfobyplatformNew } from '../../services/support';

const FormItem = Form.Item;
class VersionSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount = async () => {
    let [appInfoIosMap, appInfoAndroidMap] = await Promise.all([
      getappinfobyplatformNew({ platform: 2 }),
      getappinfobyplatformNew({ platform: 1 }),
    ]);
    appInfoIosMap = appInfoIosMap.map(v => ({ label: v.value, value: v.key }));
    appInfoAndroidMap = appInfoAndroidMap.map(v => ({ label: v.value, value: v.key }));
    this.setState({
      data: [
        {
          value: 'iOS',
          label: 'iOS',
          children: appInfoIosMap,
        },
        {
          value: 'Android',
          label: 'Android',
          children: appInfoAndroidMap,
        },
      ],
    });
  };

  render() {
    const {
      className,
      form: { getFieldDecorator },
      name,
      labelCol,
      width,
    } = this.props;
    const { data } = this.state;
    return (
      <FormItem
        labelCol={labelCol}
        wrapperCol={labelCol}
        label={intl.get('common.version').defaultMessage('版本')}
        className={className}
      >
        {getFieldDecorator(name || 'app_version', {
          initialValue: null,
        })(
          <Cascader
            style={{ width: width || 270 }}
            options={data}
            placeholder="Please select"
            changeOnSelect
          />,
        )}
      </FormItem>
    );
  }
}

export default VersionSelect;
