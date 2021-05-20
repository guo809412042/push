import {
  Modal, Table, Select, message, Button, Popover, Checkbox, Row, Col, Tag,
} from 'antd';
import React, { useState } from 'react';

import { edit } from '../../../../services/fapiao';
import {
  ISSUE_SUPPORT_PRODUCT, statusDict, tagColorDict, typeDict, platformDict, PAY_CHANNEL,
} from '../../const';

const Option = Select.Option;


const allColumns = [
  { title: '发票抬头', key: 'title' },
  { title: '抬头类型', key: 'type' },
  { title: '税号', key: 'tax_number' },
  { title: '注册信息', key: 'info' },
  { title: '联系邮箱', key: 'email' },
  { title: '备注', key: 'remark' },
  { title: '会员类型', key: 'order_type' },
  { title: '支付金额（元）', key: 'amount' },
  { title: '状态', key: 'status' },
  { title: '申请时间', key: 'ctime' },
  { title: '支付订单号', key: 'order_id' },
  { title: '支付平台', key: 'order_channel' },
  { title: '订单截图', key: 'order_img' },
  { title: '产品', key: 'product_id' },
  { title: '平台', key: 'platform' },
  { title: '用户ID', key: 'auid' },
];


const List = ({
  dispatch, dataList = [], loading, selectedRowKeys = [],
}) => {
  const [show, setShow] = useState(false);
  const [status, setStatus] = useState(1);
  const [ids, setIds] = useState([]);

  const open = (id, status) => {
    setShow(true);
    setStatus(status);
    setIds([id]);
  };

  const initColumns = [
    {
      title: '发票抬头',
      width: 120,
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '抬头类型',
      width: 80,
      dataIndex: 'type',
      key: 'type',
      render: text => typeDict[text],
    },
    {
      title: '税号',
      width: 200,
      dataIndex: 'tax_number',
      key: 'tax_number',
    },
    {
      title: '注册信息',
      width: 300,
      key: 'info',
      render: (text, row) => (
      <>
        <p>注册地址：{row.address || '无'}</p>
        <p>注册电话：{row.telphone || '无'}</p>
        <p>开户银行：{row.bank_name || '无'}</p>
        <p>银行账号：{row.bank_number || '无'}</p>
      </>
      ),
    },
    {
      title: '联系邮箱',
      width: 200,
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '备注',
      width: 180,
      dataIndex: 'remark',
      key: 'remark',
    },
    {
      title: '会员类型',
      width: 180,
      dataIndex: 'order_type',
      key: 'order_type',
    },
    {
      title: '支付金额（元）',
      width: 180,
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: '状态',
      width: 120,
      dataIndex: 'status',
      key: 'status',
      render: text => <Tag color={tagColorDict[text]}>{statusDict[text]}</Tag>,
    },
    {
      title: '申请时间',
      width: 180,
      dataIndex: 'ctime',
      key: 'ctime',
    },
  ];

  const moreColumns = [
    {
      title: '支付订单号',
      width: 180,
      dataIndex: 'order_id',
      key: 'order_id',
    },
    {
      title: '支付平台',
      width: 120,
      dataIndex: 'order_channel',
      key: 'order_channel',
      render: text => PAY_CHANNEL[text] || text,
    },
    {
      title: '订单截图',
      width: 180,
      dataIndex: 'order_img',
      key: 'order_img',
      render: text => (text && (
        <Popover
          placement="left"
          content={(<img style={{ width: 300 }} src={text} alt="订单截图" />)}
        >
          <img style={{ width: 90 }} src={text} alt="订单截图" />
        </Popover>
      )),
    },
    {
      title: '产品',
      width: 120,
      dataIndex: 'product_id',
      key: 'product_id',
      render: text => ISSUE_SUPPORT_PRODUCT[text],
    },
    {
      title: '平台',
      width: 120,
      dataIndex: 'platform',
      key: 'platform',
      render: text => platformDict[text],
    },
    {
      title: '用户ID',
      width: 120,
      dataIndex: 'auid',
      key: 'auid',
    },
  ];

  const editColumn = [
    {
      title: '操作',
      width: 100,
      key: 'edit',
      render: text => <a onClick={() => open(text.id, text.status)}>修改状态</a>,
    },
  ];

  const [columns, setColumns] = useState([...initColumns, ...editColumn]);

  // 修改状态
  const handleStatusChange = (value) => {
    setStatus(value);
  };

  const handleOk = async () => {
    const { code } = await edit({ ids, status });
    if (code === 20000) {
      message.success('修改成功');
      setShow(false);
      setIds([]);
      dispatch({
        type: 'issue_system_fapiao/initList',
      });
    }
  };

  const changeStatus = () => {
    if (!selectedRowKeys.length) {
      message.info('请选择');
      return;
    }
    setIds(selectedRowKeys);
    setShow(true);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys) => {
      dispatch({
        type: 'issue_system_fapiao/saveRowKeys',
        payload: selectedRowKeys,
      });
      console.log('selectedRowKeys: ', selectedRowKeys);
    },
  };

  const tableProps = {
    rowKey: 'id',
    columns,
    dataSource: dataList,
    loading,
    rowSelection,
    // pagination: {
    //   ...pagination,
    //   onChange: onPageChange,
    // },
    scroll: { x: true },
  };

  const onChange = (value) => {
    const newColumns = [...initColumns, ...moreColumns].filter(item => value.includes(item.key));
    setColumns([...newColumns, ...editColumn]);
  };

  const content = (
    <div style={{ width: 400 }}>
      <Checkbox.Group defaultValue={columns.map(item => item.key)} onChange={onChange}>
        <Row>
          {allColumns.map(item => (
            <Col span={8} style={{ marginBottom: 10 }} key={item.key}>
              <Checkbox value={item.key}>{item.title}</Checkbox>
            </Col>
          ))}
        </Row>
      </Checkbox.Group>
    </div>
  );

  return (
    <>
    <div style={{ margin: 10 }}>
      <Button onClick={changeStatus} style={{ marginRight: 10 }} type="primary">变更状态</Button>
      <Popover title={null} content={content} trigger="click" placement="right">
        <Button>数据筛选</Button>
      </Popover>
    </div>
    <Table {...tableProps} />
    <Modal title="修改状态" visible={show} onCancel={() => setShow(false)} onOk={handleOk} >
      <Select defaultValue={status.toString()} style={{ width: '100%' }} onChange={handleStatusChange}>
        <Option key="1" value="1">未处理</Option>
        <Option key="2" value="2">已核对</Option>
        <Option key="3" value="3">已处理</Option>
      </Select>
    </Modal>
    </>
  );
};

export default List;
