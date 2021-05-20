import React from 'react';
import intl from 'react-intl-universal';
import { Form, Cascader } from 'antd';
import { ArrayToObject } from '../../utils/utils';
import { getCountryAndLang, getCountryGroup } from '../../services/country-config';
import { LangArray } from '../../utils/const';

const FormItem = Form.Item;
class LazySelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      CountryAndLang: [],
    };
  }

  componentDidMount = async () => {
    const [{ data: CountryAndLang }, data] = await Promise.all([
      getCountryAndLang(),
      getCountryGroup(),
    ]);
    const CountryGroupMap = ArrayToObject(data, 'country_code', 'group_id');
    const CountryAndLangFilter = CountryAndLang.filter(item => Object.prototype.hasOwnProperty.call(CountryGroupMap, item.country_code)).map((v) => {
      v.value = `${v.value}-${CountryGroupMap[v.value]}`;
      v.label = `${v.label}-${v.country_code}`;
      delete v.children;
      return v;
    });
    this.setState({
      CountryAndLang: CountryAndLangFilter,
    });
  };

  componentWillReceiveProps() {
    // Should be a controlled component.
    // if ('value' in nextProps) {
    //   const value = nextProps.value;
    //   this.setState({ value });
    // }
  }

  render() {
    const {
      className,
      form: { getFieldDecorator },
      labelCol,
      initialValue,
      onChange,
    } = this.props;
    const { CountryAndLang } = this.state;
    const options = [
      {
        value: 'country',
        label: 'Country',
        children: CountryAndLang,
      },
      {
        value: 'lang',
        label: 'Lang',
        children: [
          {
            value: '1',
            label: 'China',
            children: LangArray,
          },
          {
            value: '2',
            label: 'Asia-Pacific',
            children: LangArray,
          },
          {
            value: '3',
            label: 'Americas',
            children: LangArray,
          },
          {
            value: '6',
            label: 'Middle East',
            children: LangArray,
          },
        ],
      },
    ];
    return (
      <FormItem
        labelCol={labelCol}
        wrapperCol={labelCol}
        label={intl.get('common.country&lang').defaultMessage('国家&语言')}
        className={className}
      >
        {getFieldDecorator('country_group_id', {
          initialValue: initialValue || null,
        })(<Cascader options={options} expandTrigger="hover" onChange={onChange} />)}
      </FormItem>
    );
  }
}

export default LazySelect;
