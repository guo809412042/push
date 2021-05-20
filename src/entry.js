/* eslint-disable global-require */
import dva from 'dva';
import ReactDOM from 'react-dom';

export async function bootstrap() {
  console.log('react app bootstraped');
}

export async function mount(props) {
  const app = dva({
    onError(e) {
      // message.error('不好意思，出错了。');
      console.error(e);
    },
  });

  app.model(require('./models/app').default);

  app.router(require('./router').default);

  app.start('#root');

  console.log('props from main framework', props);
}

export async function unmount() {
  ReactDOM.unmountComponentAtNode(document.getElementById('root'));
}

if (!process.env.BUILD_ENV) {
  document.cookie = 'productList=2%2C5%2C3%2C6;';
  document.cookie = 'email=yangyang.zhang@quvideo.com;';
  document.cookie = 'username=yangyang.zhang;';
  document.cookie = 'groupIdList=1%2C9;';
  document.cookie = 'role_id=11;';
  document.cookie = 'country_code=CN;';
  document.cookie = 'project_type=2;';
  document.cookie = 'group_id=1;';
  document.cookie = 'openid=2c38b673a61e4f8cb64af7f8b7152eb4;';
  document.cookie = 'user_leader_department=;';
  document.cookie = 'user={"user":{"username":"yangyang.zhang@quvideo.com","id":3160,"email":"yangyang.zhang@quvideo.com"},"isLogin":true,"product_list":"2,5,3,6","group_list":"1,9","role_id":11,"app_channel":"","user_leader_department":null};';
  document.cookie = 'PRODUCT_ID=2';
  document.cookie = 'userid=3160';
  const _VCM_ = {
    menu: [],
  };
  window._VCM_ = _VCM_;

  // let url = changeURLArg(window.location.href, 'pt', 2);
  // url = changeURLArg(url, 'p', 2);
  // url = changeURLArg(url, 'g', 1);
  // window.history.replaceState(null, null, url + window.location.hash);
  mount();
}
