import React, { useState } from 'react';
import { Modal, Select, message } from 'antd';

import {
  getKnowledgeTags,
  updateKnowledgeTag,
} from '../../../../services/issue/issue';

export default ({ record, reFresh }) => {
  console.log('record: ', record);
  const [visible, setVisible] = useState(false);
  const [tagList, setTagList] = useState([]);
  const [value, setValue] = useState('');

  const getTagOneList = async () => {
    const { code, data } = await getKnowledgeTags({ parentId: 0 });
    if (code !== 20000) return;
    setTagList(data);
  };

  const open = () => {
    setVisible(true);
    getTagOneList();
  };

  const handleOk = async () => {
    if (!value) {
      message.error('请选择标签');
      return;
    }
    const { code, message: msg } = await updateKnowledgeTag({
      id: record.id,
      parentId: value,
    });
    if (code !== 20000) {
      message.error(msg);
      return false;
    }
    message.success('修改成功');
    reFresh && reFresh();
  };

  const onChange = (value) => {
    setValue(value);
  };

  return (
  <>
    <a onClick={open}>修改</a>
    <Modal
      visible={visible}
      title="修改标签关系"
      onOk={handleOk}
      onCancel={() => setVisible(false)}
    >
      <Select style={{ width: 200 }} placeholder="请选择一级标签" value={value} onChange={onChange}>
        {
          tagList.map(v => (
            <Select.Option key={v.id} value={v.id}>{v.name}</Select.Option>
          ))
        }
      </Select>
    </Modal>
  </>
  );
};
