import React from 'react';
import intl from 'react-intl-universal';
import { TreeSelect, Form } from 'antd';
import { getCountryAndLang } from '../../services/country-config';

const SHOW_PARENT = TreeSelect.SHOW_PARENT;

const FormItem = Form.Item;
class LazySelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      CountryAndLang: [],
    };
  }

  componentDidMount = async () => {
    const { data: CountryAndLang } = await getCountryAndLang();
    this.setState({
      CountryAndLang,
    });
  };

  componentWillReceiveProps(nextProps) {
    // Should be a controlled component.
    if ('value' in nextProps) {
      // const value = nextProps.value;
      // this.setState({ value });
    }
  }

  render() {
    const {
      className,
      form: { getFieldDecorator },
      width,
      labelCol,
      // wrapperCol,
    } = this.props;
    const { CountryAndLang } = this.state;
    const tProps = {
      treeData: CountryAndLang,
      multiple: true,
      treeCheckable: true,
      showCheckedStrategy: SHOW_PARENT,
      searchPlaceholder: 'Please select',
      style: {
        width: width || 300,
      },
    };
    return (
      <FormItem
        labelCol={labelCol}
        wrapperCol={labelCol}
        label={intl.get('common.country&lang').defaultMessage('国家/语言')}
        className={className}
      >
        {getFieldDecorator('country', {
          initialValue: null,
        })(<TreeSelect {...tProps} />)}
      </FormItem>
    );
  }
}

export default LazySelect;
