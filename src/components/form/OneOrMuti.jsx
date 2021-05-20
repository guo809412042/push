import React from 'react';
import {
  Form, Radio, Row, Col, Select, Icon, Button, message,
} from 'antd';
import {
  getConfigCountryService,
  getConfigLangService,
  getLangByCountryService,
  getCountryByLangService,
} from '../../services/common';

import AddMore from './AddMore';
import EventType from './AddEventType';
import styles from './style.less';

let uuid = 0;
const countryOrLang = [];
const configType = [];
const country_lang = [];
const childrenSelect = [];

const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const Option = Select.Option;

const OneOrMutiHoc = Comp => (Options) => {
  const { isEvent, callback } = Options;
  const AddMoreComp = AddMore(Comp)(Options);

  return class OneEventType extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        visible: false,
        counrtyAndLangtreeData: [],
        target: '0',
        addType: 'one',
        configType: [], //  配置方式
        country_lang: [], //  国家或语言编码
        countryOrLang: [], //  国家或语言下拉列表
        childrenSelect: [], //  根据语言 --》 国家、   根据国家 --》 语言
      };
    }

    componentDidMount() {
      this.add();
      // this.commonInitCountry()
    }

    onChangeAddType(e) {
      this.setState({
        addType: e.target.value,
      });
      this.props.changeAddType(e.target.value);
      this.props.form.resetFields();
      if (e.target.value === 'one') {
        this.add();
      }
    }

    configTypeChange = (k, e) => {
      configType[k] = e.target.value;
      this.setState({ configType, country_lang: 'OTHER' });
      if (configType[k] === '0') {
        this.commonInitCountry(k);
      } else if (configType[k] === '1') {
        this.vcmGenerateLangOption(k);
      }
    };

    //  获取国家
    commonInitCountry = async (k) => {
      const res = await getConfigCountryService();
      countryOrLang[k] = res.map(item => (
        <Option value={item.key} key={item.key}>
          {' '}
          {item.value}{' '}
        </Option>
      ));
      this.countryOrLangCodeChange(k, res[0].key);
      this.props.form.setFieldsValue({
        [`countryOrLangCode-${k}`]: res[0].key,
      });
      childrenSelect[k] = [];
      this.setState({ countryOrLang, childrenSelect });
    };

    //  获取语言
    vcmGenerateLangOption = async (k) => {
      const res = await getConfigLangService();
      countryOrLang[k] = res.map(item => (
        // <Option value={item.value} key={item.value}> { item.lang } </Option>
        <Option value={item.langcode} key={item.langcode}>
          {' '}
          {item.lang}{' '}
        </Option>
      ));
      this.props.form.setFieldsValue({
        [`countryOrLangCode-${k}`]: res[0].langcode,
        // [`childSelect-${k}`]: '',
      });
      this.countryOrLangCodeChange(k, res[0].langcode);
      childrenSelect[k] = [];
      this.setState({ countryOrLang, childrenSelect });
    };

    //  获取级联下拉框
    countryOrLangCodeChange = (k, value) => {
      country_lang[k] = value;
      this.setState({ country_lang });
      if (this.state.configType[k] === '0') {
        this.getLangByCountry(value, k);
      } else if (this.state.configType[k] === '1') {
        this.getCountryByLang(value, k);
      }
    };

    //  根据国家获取语言
    getLangByCountry = async (countryCode, k) => {
      const data = { countrycode: countryCode };
      const res = await getLangByCountryService(data);
      childrenSelect[k] = res.map(item => (
        // <Option value={item.langcode} key={item.langcode}> { `${item.langname}-${item.lang}` } </Option>
        <Option value={item.value} key={item.value}>
          {' '}
          {`${item.langname}-${item.lang}`}{' '}
        </Option>
      ));
      this.props.form.setFieldsValue({
        [`childSelect-${k}`]: res[0].value,
      });
      this.setState({ childrenSelect });
    };

    //  根据语言获取国家
    getCountryByLang = async (langCode, k) => {
      const data = { lang: langCode };
      const res = await getCountryByLangService(data);
      childrenSelect[k] = res.map(item => (
        // <Option value={item.countrycode} key={item.countrycode}> { `${item.countryname}-${item.countrycode}` } </Option>
        <Option value={item.value} key={item.value}>
          {' '}
          {`${item.countryname}-${item.countrycode}`}{' '}
        </Option>
      ));
      this.props.form.setFieldsValue({
        [`childSelect-${k}`]: res[0].value,
      });
      this.setState({ childrenSelect });
    };

    add = () => {
      const { form } = this.props;
      // can use data-binding to get
      const keys2 = form.getFieldValue('keys2');
      const nextKeys = keys2.concat(uuid);
      console.log(nextKeys);
      // can use data-binding to set
      // important! notify form to detect changes
      form.setFieldsValue({
        keys2: nextKeys,
      });
      //  每新增一个就插入
      countryOrLang[uuid] = [];
      configType[uuid] = '0';
      country_lang[uuid] = 'OTHER';
      childrenSelect[uuid] = [];
      this.setState({
        countryOrLang,
        configType,
        country_lang,
        childrenSelect,
      });
      //  每新增一条数据 --》 初始化国家、主副标签
      this.commonInitCountry(uuid);
      uuid++;
      callback && callback(nextKeys[nextKeys.length - 1]);
    };

    remove = (k) => {
      const { form } = this.props;
      // can use data-binding to get
      const keys2 = form.getFieldValue('keys2');
      // We need at least one passenger
      if (keys2.length === 1) {
        message.error('不能再少了');
        return;
      }
      // can use data-binding to set
      form.setFieldsValue({
        keys2: keys2.filter(key => key !== k),
      });
      countryOrLang.splice(k, 1, 0);
      configType.splice(k, 1, 0);
      country_lang.splice(k, 1, 0);
      childrenSelect.splice(k, 1, 0);
      this.setState({
        countryOrLang,
        configType,
        country_lang,
        childrenSelect,
      });
    };

    render() {
      const { getFieldDecorator, getFieldValue } = this.props.form;
      const { addType } = this.state;
      const formItemLayout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
      };
      const formItemLayoutTXT = {
        labelCol: { span: 2 },
        wrapperCol: { span: 22 },
      };
      getFieldDecorator('keys2', { initialValue: [] });
      const keys2 = getFieldValue('keys2');
      const formItems = keys2.map(k => (
        <div key={k}>
          <div className={styles.platformlist}>
            <Row gutter={1}>
              <Col span={8}>
                <FormItem label="配置方式" {...formItemLayout}>
                  {getFieldDecorator(`configType-${k}`, { initialValue: '0' })(
                    <RadioGroup onChange={value => this.configTypeChange(k, value)}>
                      <RadioButton value="0">国家</RadioButton>
                      <RadioButton value="1">语言</RadioButton>
                    </RadioGroup>,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={1}>
              <Col span={8}>
                <FormItem
                  label={this.state.configType[k] === '0' ? '国家' : '语言'}
                  {...formItemLayout}
                >
                  {getFieldDecorator(`countryOrLangCode-${k}`, { initialValue: 'OTHER' })(
                    <Select
                      style={{ width: '140px' }}
                      onChange={value => this.countryOrLangCodeChange(k, value)}
                    >
                      {this.state.countryOrLang[k]}
                    </Select>,
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  label={this.state.configType[k] === '0' ? '语言' : '国家'}
                  {...formItemLayout}
                >
                  {getFieldDecorator(`childSelect-${k}`, { initialValue: '' })(
                    <Select style={{ width: '140px' }}>{this.state.childrenSelect[k]}</Select>,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Comp
              {...this.props}
              k={k}
              formItemLayout={formItemLayout}
              formItemLayoutTXT={formItemLayoutTXT}
            />
            {isEvent ? (
              <EventType
                form={this.props.form}
                eventcontent=""
                key={k.toString()}
                eventtype="0"
                keynum={k}
              />
            ) : null}
            <Icon
              className={styles.dynamicButton}
              type="minus-circle-o"
              onClick={() => this.remove(k)}
            />
          </div>
        </div>
      ));
      return (
        <div style={{ marginRight: 10 }}>
          <div style={{ marginBottom: 8, marginTop: 8 }}>
            <RadioGroup onChange={value => this.onChangeAddType(value)} defaultValue="one">
              <RadioButton value="one">逐条配置</RadioButton>
              <RadioButton value="two">批量配置</RadioButton>
            </RadioGroup>
          </div>
          {addType === 'one' ? (
            <div>
              {formItems}
              <div style={{ textAlign: 'center' }}>
                <Button type="dashed" onClick={this.add} style={{ width: '60%' }}>
                  <Icon type="plus" /> Add
                </Button>
              </div>
            </div>
          ) : (
            <AddMoreComp form={this.props.form} faq_type_list={this.props.faq_type_list} />
          )}
        </div>
      );
    }
  };
};

export default OneOrMutiHoc;
