import { ObjectToArray } from '../../../../utils/utils';

export const IsDelete = {
  正常: 0,
  已删除: 1,
  0: '正常',
  1: '已删除',
};

export const IsDeleteArr = ObjectToArray(IsDelete);
export const IsDeleteList = ObjectToArray(IsDelete, 'value', 'label');
