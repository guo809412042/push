import React, { Component } from 'react';
import {
  Form, Button, Input, Modal, Icon, Tooltip, message, Upload,
} from 'antd';
import XLSX from 'xlsx';

import KnowledgeEdit from './KnowledgeEdit';
import TagSelect from './TagSelect';

import {
  createKnowledge, getKnowledgeList, getKnowledgeTags, updateKnowledge,
} from '../../../../services/issue/issue';
import { downloadKnowlegeList } from '../../../../utils/utils';

import styles from '../../../../styles/index.css';

const FormItem = Form.Item;

class Query extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showAddModal: false,
      uploadProgress: 0,
    };
  }

  handleAdd = () => {
    this.knowledgeRef.validateFields(async (error, data) => {
      if (error) {
        return;
      }
      const {
        comment, content, tag, keywords,
      } = data;
      const reqData = {
        ...data,
        tag: tag.toString(),
        keywords: keywords.toString(),
        comment: comment ? comment.toHTML() : '',
        content: content ? content.toHTML() : '',
      };
      const res = await createKnowledge(reqData);
      if (res.code === 20000) {
        message.success('创建成功');
        this.setState({
          showAddModal: false,
        });
        this.handleSubmit();
      } else {
        message.error('创建失败');
      }
    });
  }

  handleSubmit = (e) => {
    e && e.preventDefault();
    const { onSearch } = this.props;
    this.props.form.validateFields(async (error, data) => {
      if (error) {
        return;
      }
      const { tags } = data;
      const reqData = {
        ...data,
        tag: tags ? tags.filter(v => v).toString() : undefined,
      };

      delete reqData.tags;
      onSearch && onSearch(reqData);
    });
  }

  handleReset = () => {
    this.props.form.resetFields();
  }

  isEmptyTag = (tagList, tagMap) => {
    // eslint-disable-next-line no-restricted-syntax
    for (const tag of tagList) {
      if (tag && !tagMap[tag]) {
        message.error(`${tag}标签不存在`);
        return false;
      }
    }
    return true;
  }

  customUploadRequest = async (args) => {
    const {
      file,
    } = args;
    const tagMap = {};
    const { code, data } = await getKnowledgeTags();
    if (code === 20000) {
      data.forEach((tag) => {
        tagMap[tag.name] = tag.id;
      });
    }
    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const dataList = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
      if (!dataList.length) {
        message.error('文件格式有误，请检查上传的文件！');
        return;
      }
      if (dataList.some(v => !v['一级标签'] || !v['关键词'] || !v['问题标题'] || !v['内容'])) {
        message.error('一级标签、关键词、问题标题、内容必填');
        return;
      }
      for (let i = 0; i < dataList.length; i++) {
        const progress = Math.floor(i / dataList.length * 100) || 1;
        this.setState({ uploadProgress: progress });
        const item = dataList[i];
        const id = item.ID;
        const tagOne = item['一级标签'] && item['一级标签'].trim();
        const tagTwo = item['二级标签'] && item['二级标签'].trim();
        const tagThree = item['三级标签'] && item['三级标签'].trim();

        // 将tag拼接成 1,2,3 形式
        let tag = '';
        // 标签填写不存在处理
        const res = this.isEmptyTag([tagOne, tagTwo, tagThree], tagMap);
        if (!res) { continue; }

        if (tagMap[tagOne]) {
          tag += tagMap[tagOne];
          if (tagMap[tagTwo]) {
            tag += `,${tagMap[tagTwo]}`;
            if (tagMap[tagThree]) {
              tag += `,${tagMap[tagThree]}`;
            }
          }
        }

        const reqData = {
          tag,
          keywords: item['关键词'] ? item['关键词'].replace('，', ',') : '',
          comment: item['备注'] || '',
          content: item['内容'] || '',
          title: item['问题标题'] || '',
        };
        // ID 存在更新，不存在添加
        if (id) {
          // eslint-disable-next-line no-await-in-loop
          await updateKnowledge({ ...reqData, id });
        } else {
          // eslint-disable-next-line no-await-in-loop
          await createKnowledge(reqData);
        }
      }
      // message.success('创建完成');
      this.handleSubmit();
      this.setState({ uploadProgress: 0 });
    };
    reader.readAsArrayBuffer(file);
  }

  handleDownloadTemplate = () => {
    const rows = [
      ['ID', '一级标签', '二级标签', '三级标签', '关键词', '问题标题', '内容', '备注'],
      ['', '小影', '退款11', '个人原因', '视频导出,高清', '视频导出', '内容', '备注'],
    ];
    const filename = '知识库上传模板.xlsx';
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(rows);
    XLSX.utils.book_append_sheet(wb, ws);
    XLSX.writeFile(wb, filename);
  }

  handDownload = async () => {
    const { code, data } = await getKnowledgeList({ page: 1, pageSize: 1000 });
    if (code !== 20000) {
      return;
    }
    try {
      await downloadKnowlegeList(data.list);
    } catch (error) {
      message.error('下载出错了~');
    }
  }

  render() {
    const { form: { getFieldDecorator } } = this.props;
    const { uploadProgress } = this.state;

    return (
      <Form layout="inline" onSubmit={this.handleSubmit}>
        <FormItem label="标签" className={styles.marginPxForItem}>
          {getFieldDecorator('tags', {})(
            <TagSelect />,
          )}
        </FormItem>
        <FormItem label={
          <span>
            搜索
            <Tooltip title="支持在关键词、标题中进行搜索">
              <Icon type="question-circle" />
            </Tooltip>
          </span>
        } className={styles.marginPxForItem}>
          {getFieldDecorator('text')(<Input style={{ width: 150 }} />)}
        </FormItem>
        <FormItem className={styles.marginPxForItem}>
          <Button type="primary" htmlType="submit">
            查询
          </Button>
        </FormItem>
        <FormItem className={styles.marginPxForItem}>
          <Button onClick={this.handleReset}>
            重置
          </Button>
        </FormItem>
        <FormItem className={styles.marginPxForItem}>
          <Button type="primary" onClick={() => {
            this.setState({
              showAddModal: true,
            });
          }}>
            添加
          </Button>
        </FormItem>
        <FormItem className={styles.marginPxForItem}>
          <Upload
            showUploadList={false}
            accept=".csv,.xlsx,.xls, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            customRequest={this.customUploadRequest}
          >
            <Button disabled={uploadProgress !== 0}>上传{uploadProgress !== 0 && <span>{uploadProgress}%</span>}</Button>
          </Upload>
        </FormItem>
        <FormItem className={styles.marginPxForItem}>
          <Button onClick={this.handleDownloadTemplate}>
            下载上传模板
          </Button>
        </FormItem>
        <FormItem className={styles.marginPxForItem}>
          <Button
            style={{ marginRight: 10 }}
            icon="cloud-download"
            type="primary"
            onClick={this.handDownload}
          >
            导出
          </Button>
        </FormItem>
        <Modal
          visible={this.state.showAddModal}
          onCancel={() => {
            this.setState({
              showAddModal: false,
            });
          }}
          onOk={this.handleAdd}
          destroyOnClose
        >
          <KnowledgeEdit ref={(ref) => { this.knowledgeRef = ref; }}/>
        </Modal>
      </Form>
    );
  }
}

export default Form.create()(Query);
