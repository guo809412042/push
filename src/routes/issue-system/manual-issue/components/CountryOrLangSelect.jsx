import React from 'react';
import { Cascader } from 'antd';

import { LanguageArray, CountryArray } from '../../../../utils/enum';

const options = [
  {
    key: 'Country',
    value: 'Country',
    children: CountryArray,
  },
  {
    key: 'Language',
    value: 'Language',
    children: LanguageArray,
  },
];

const CountryOrLangSelect = props => (
  <Cascader expandTrigger="hover" options={options} fieldNames={{ label: 'value', value: 'key', children: 'children' }} {...props} />
);

export default CountryOrLangSelect;
