import React from 'react';
import {
  Modal, Table, Pagination, message, Input, Button, Row, Col,
} from 'antd';
import intl from 'react-intl-universal';
import { Image as PopverImg } from '@xy/design';

import { getEventSourceServer } from '../../services/common';

const TemplatePackage = [
  { title: 'code', dataIndex: 'code', key: 'code' },
  {
    title: 'banner',
    dataIndex: 'banner',
    key: 'banner',
    render: text => (text == null || text === '' ? (
      <span>{intl.get('tools.common.no_picture').defaultMessage('无图片')}</span>
    ) : (
      <PopverImg src={text} width="120" />
    )),
  },
  {
    title: intl.get('common.tools.title').defaultMessage('标题'),
    dataIndex: 'title',
    key: 'title',
  },
  {
    title: intl.get('tools.template.description').defaultMessage('描述'),
    dataIndex: 'intro',
    key: 'intro',
  },
];
const TemplateRoll = [
  {
    title: intl.get('tools.template.Template_Roll_ID').defaultMessage('卷编号'),
    dataIndex: 'code',
    key: 'code',
  },
  { title: '卷种类', dataIndex: 'tcid', key: 'tcid' },
  {
    title: intl.get('tools.template.thumbnails').defaultMessage('缩略图'),
    dataIndex: 'icon',
    key: 'icon',
    render: text => (text == null ? (
      <span>{intl.get('tools.common.no_picture').defaultMessage('无图片')}</span>
    ) : (
      <PopverImg src={text} width="120" />
    )),
  },
  {
    title: intl.get('tools.template.Template_Roll_Name').defaultMessage('卷标题'),
    dataIndex: 'title',
    key: 'title',
  },
];
const AppTemplate = [
  {
    title: intl.get('tools.template.template_ID').defaultMessage('素材编号'),
    dataIndex: 'ttid',
    key: 'ttid',
  },
  {
    title: intl.get('tools.template.name').defaultMessage('标题'),
    dataIndex: 'title',
    key: 'title',
  },
  {
    title: intl.get('tools.template.description').defaultMessage('描述'),
    dataIndex: 'intro',
    key: 'intro',
  },
  {
    title: intl.get('tools.template.thumbnails').defaultMessage('缩略图'),
    dataIndex: 'icon',
    key: 'icon',
    render: text => (text == null || text === '' ? (
      <span>{intl.get('tools.common.no_picture').defaultMessage('无图片')}</span>
    ) : (
      <PopverImg src={text} width="120" />
    )),
  },
];
const Keyword = [{ title: '关键字', dataIndex: 'langInfos[0].keyword', key: 'title' }];
const Activity = [
  {
    title: intl.get('tools.common.activity_id').defaultMessage('活动编号'),
    dataIndex: 'ayiddigest',
    key: 'ayiddigest',
  },
  {
    title: intl.get('tools.common.title').defaultMessage('标题'),
    dataIndex: 'langInfos[0].title',
    key: 'title',
  },
  {
    title: intl.get('tools.common.picture').defaultMessage('图片'),
    dataIndex: 'imgs',
    key: 'imgs',
    render: (text, record) => (record.langInfos[0].banner ? (
      <img width="90" alt="" src={record.langInfos[0].banner} />
    ) : (
      <span>{intl.get('tools.common.no_picture').defaultMessage('无图片')}</span>
    )),
  },
];

const select_dict = {
  'template.package.TemplatePackageService': {
    key: 'dataList',
    columns: TemplatePackage,
  },
  'template.templateroll.TemplateRollService': {
    key: 'appTmplRolls',
    columns: TemplateRoll,
  },
  'template.apptemplatemanager.AppTemplateService': {
    key: 'appTmplInfos',
    columns: AppTemplate,
  },
  'keyword_manager.KeywordService': {
    key: 'keywordList',
    columns: Keyword,
  },
  'activity.ActivityService': {
    key: 'keywordList',
    columns: Activity,
  },
};

//  获取素材编码等
function get_cb_param(selectedRows, event_source) {
  let cb_data = '';
  switch (event_source) {
    case 'template.package.TemplatePackageService':
      cb_data = selectedRows[0].code;
      break;
    case 'template.templateroll.TemplateRollService':
      cb_data = selectedRows[0].code;
      break;
    case 'template.apptemplatemanager.AppTemplateService':
      cb_data = selectedRows[0].ttid;
      break;
    case 'keyword_manager.KeywordService':
      cb_data = selectedRows[0].langInfos[0].keyword;
      break;
    case 'activity.ActivityService':
      cb_data = selectedRows[0].ayiddigest;
      break;

    default:
      break;
  }
  return cb_data;
}

class EventSource extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      tableData: [],

      loading: false,
      count: 0,
      page: 1,
      pagesize: 8,
      text: '',
      selectedRowKeys: [],
      selectedRows: [],
    };
  }

  //  提交数据
  submit = async () => {
    const { selectedRows } = this.state;
    const { event_source, cb } = this.props;
    if (selectedRows.length > 0) {
      const cb_data = get_cb_param(selectedRows, event_source);
      console.log(cb_data);
      cb && cb(cb_data);
      this.setState({ visible: false, selectedRows: [], selectedRowKeys: [] });
    } else {
      this.setState({ visible: false });
      message.warning('您没有选择任何数据');
    }
  };

  //  显示modal
  show_modal = () => {
    this.get_list();
    this.setState({ visible: true });
  };

  //  关闭modal
  hide_modal = () => {
    this.setState({ visible: false, selectedRows: [], selectedRowKeys: [] });
  };

  //  获取表格数据
  get_list = async () => {
    this.setState({ loading: true });
    const {
      countrys, platform, channel, event_source,
    } = this.props;
    const { page, pagesize, text } = this.state;
    try {
      const res = await getEventSourceServer({
        countrys,
        platform,
        channel,
        event_source,
        page,
        pagesize,
        text,
      });
      if (res.status) {
        this.setState(
          { tableData: res.data[select_dict[event_source].key], count: res.data.count },
          () => console.log(this.state.tableData),
        );
      }
    } catch (err) {
      console.log(err);
    } finally {
      this.setState({ loading: false });
    }
  };

  //  页码改变
  pageChange = async (page, pagesize) => {
    this.setState({ page, pagesize }, this.get_list);
  };

  //  查询
  input_query = async () => {
    this.setState({ page: 1 }, this.get_list);
  };

  //  输入框改变
  input_change = (e) => {
    this.setState({ text: e.target.value });
  };

  render() {
    const {
      visible, tableData, count, page, pagesize, loading, selectedRowKeys,
    } = this.state;
    const { event_source } = this.props;
    const modalProps = {
      title: '选择数据',
      visible,
      onOk: this.submit,
      onCancel: this.hide_modal,
      width: '800px',
    };
    const rowSelection = {
      selectedRowKeys,
      // eslint-disable-next-line
      onChange: (selectedRowKeys, selectedRows) => {
        if (this.state.selectedRowKeys.length < 1 || selectedRowKeys.length < 1) {
          this.setState({ selectedRowKeys, selectedRows });
        } else {
          message.warning('只能选择一项');
        }
      },
    };
    const tableProps = {
      dataSource: tableData,
      columns: event_source ? select_dict[event_source].columns : [],
      loading,
      pagination: false,
      rowSelection,
      rowKey: 'id',
    };
    return (
      <div>
        <a onClick={this.show_modal}>选择数据</a>
        <Modal {...modalProps}>
          <Row type="flex" align="middle">
            <Col span={2}>
              <label>文本查询</label>
            </Col>
            <Col span={8}>
              <Input type="text" onChange={this.input_change} />
            </Col>
            <Col span={4} offset={1}>
              <Button onClick={this.input_query}>查询</Button>
            </Col>
          </Row>
          <Table {...tableProps} style={{ marginTop: '15px' }} />
          <div style={{ marginTop: 10, display: 'flex', justifyContent: 'flex-end' }}>
            <Pagination
              showQuickJumper
              current={page}
              pageSize={pagesize}
              total={count}
              showTotal={() => `共 ${count} 条`}
              onChange={this.pageChange}
            />
          </div>
        </Modal>
      </div>
    );
  }
}

export default EventSource;
