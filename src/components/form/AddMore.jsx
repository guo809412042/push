import React, { Component } from 'react';
import { Form, Radio, TreeSelect } from 'antd';
import EventTypeCommon from './EventType';
import {
  getConfigCountryServiceMore,
  getConfigLangServiceMore,
  getLangByCountryService,
} from '../../services/common';
import styles from './style.less';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const FormItem = Form.Item;

const AddMoreHoc = Comp => (Options) => {
  const { isEvent } = Options;
  return class AddMore extends Component {
    constructor(props) {
      super(props);
      this.state = {
        configType: '0',
        treeData: [],
        value: [],
      };
    }

    componentDidMount() {
      this.commonInitCountry();
    }

    //  配置方式改变
    configTypeChange = (e) => {
      const value = e.target.value;
      this.setState({ configType: value, country_lang: 'OTHER' });
      if (value === '0') {
        this.commonInitCountry();
      } else if (value === '1') {
        this.vcmGenerateLangOption();
      }
    };

    //  获取国家
    commonInitCountry = async () => {
      const country = await getConfigCountryServiceMore();
      console.log(country);
      const treeData = country.data;
      // country.map((item) => {
      //   treeData.push({
      //     label: item.value,
      //     value: item.key,
      //     key: item.key
      //   })
      // })
      this.setState({ treeData });
    };

    //  获取语言
    vcmGenerateLangOption = async () => {
      const lang = await getConfigLangServiceMore();
      console.log(lang);
      const treeData = lang.data;
      // lang.map((item) => {
      //   treeData.push({
      //     label: item.lang,
      //     value: item.langcode,
      //     key: item.langcode
      //   })
      // })
      this.setState({ treeData });
    };

    //  根据国家获取语言
    getLangByCountry = async (countryCode) => {
      const data = { countrycode: countryCode };
      const res = await getLangByCountryService(data);
      console.log(res);
    };

    //  树形选择框值改变
    onChange = (value) => {
      console.log(value);
      this.setState({ value });
    };

    addEmoji(k, e) {
      const { form } = this.props;
      const text = form.getFieldValue(`${k}`);
      const Params = {};
      Params[`${k}`] = `${!text ? '' : text}${e.native}`;
      form.setFieldsValue(Params);
    }

    render() {
      const { getFieldDecorator } = this.props.form;
      const tProps = {
        treeData: this.state.treeData,
        value: this.state.value,
        onChange: this.onChange,
        multiple: true,
        treeCheckable: true,
        searchPlaceholder: 'Please select',
        style: {
          width: 300,
        },
      };
      const formItemLayout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
      };
      const formItemLayoutTXT = {
        labelCol: { span: 2 },
        wrapperCol: { span: 22 },
      };
      const formItemLayoutMin = {
        labelCol: { span: 10 },
        wrapperCol: { span: 14 },
      };
      const OptionProps = {
        formItemLayout,
        formItemLayoutTXT,
        formItemLayoutMin,
      };
      return (
        <div style={{ marginTop: '15px' }}>
          <FormItem label="配置方式">
            {getFieldDecorator('configType', { initialValue: this.state.configType })(
              <RadioGroup onChange={this.configTypeChange}>
                <RadioButton value="0">国家</RadioButton>
                <RadioButton value="1">语言</RadioButton>
              </RadioGroup>,
            )}
          </FormItem>
          <FormItem label="国家/语言">
            {getFieldDecorator('countryLang')(<TreeSelect {...tProps} />)}
          </FormItem>
          <div>
            <div className={styles.platformlist}>
              <Comp {...this.props} {...OptionProps} />
              {isEvent ? (
                <EventTypeCommon form={this.props.form} eventcontent="" eventtype="0" />
              ) : null}
            </div>
          </div>
        </div>
      );
    }
  };
};

export default AddMoreHoc;
