import React from 'react';
import { LocaleProvider } from 'antd';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { renderRoutes } from 'dva-router-config';
import { IntlProvider, addLocaleData } from 'react-intl';
import locale from '@xy/design/es/locales/index';
import en from 'react-intl/locale-data/en';
import zh from 'react-intl/locale-data/zh';
import { getLang } from '../utils/utils';
import { appLocaleMap } from '../locales';

const appLocale = appLocaleMap[getLang()];
function setLang() {
  const lang = getLang();
  switch (lang) {
    case 'en-US':
      return locale.en;
    default:
      return locale.zh;
  }
}

addLocaleData([...en, ...zh]);

const App = ({ route = {} }) => (
  <LocaleProvider locale={appLocale.antd}>
    <IntlProvider locale={getLang()} messages={setLang()}>
      {renderRoutes(route.routes)}
    </IntlProvider>
  </LocaleProvider>
);
App.contextTypes = {
  router: PropTypes.object.isRequired,
};

App.propTypes = {
  route: () => {},
};

App.defaultProps = {
  route: PropTypes.object,
};

export default connect(({ app }) => ({ app }))(App);
