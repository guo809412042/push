import { Remove as PropButton, Hoc } from '@xy/design';
import { connect } from 'dva';

import { createVestUser } from '../../services/vest';

const { RightHOC } = Hoc;

const _props = {
  handleFun: createVestUser,
};

export default connect(({ app }) => ({ app }))(
  RightHOC({ menu: 'vest_manage/vest_user_list', _props })(PropButton),
);
