const pk = require('../package.json');

const reg = new RegExp(/[a-z0-9-]+/, 'g');
const pkname = pk.name.match(reg);
const config = {
  target: `/vcm/${pkname[0]}/${pkname[1]}/dist/`,
};
module.exports = config;
