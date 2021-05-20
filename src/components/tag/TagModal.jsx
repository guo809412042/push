import React from 'react';
import cookie from 'react-cookie';
import moment from 'moment';
import intl from 'react-intl-universal';
import {
  Modal, Button, Form, Tag, message, Spin,
} from 'antd';
import { Hoc } from '@xy/design';
import { connect } from 'dva';

import SetTag from './SetTag';
import {
  getUserExistTags,
  getVideoExistTags,
  getVideoExistEffectTags,
  setTagToUser,
  setTagToVideo,
  saveLogServer,
  getAllTags,
} from '../../services/tag';
import { alterVideo } from '../../services/video';

const { RightHOC } = Hoc;
const FormItem = Form.Item;

const Color = {
  '#f50': 1,
  '#2db7f5': 2,
  '#87d068': 3,
};

function diff(arr1, arr2) {
  arr2 = arr2.map(v => v.value);
  let delete_list = [];
  let add_list = [];
  const ret = [];
  for (const i in arr1) {
    if (arr2.indexOf(arr1[i]) > -1) {
      ret.push(arr1[i]);
    }
  }
  delete_list = arr1.filter(el => ret.indexOf(el) < 0);
  add_list = arr2.filter(el => ret.indexOf(el) < 0);
  return [delete_list, add_list];
}

class CollectModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      confirmVideoLoading: false,
      confirmUserLoading: false,
      confirmVideoAndUserLoading: false,
      // tags: [],
      video_exist_tag: [],
      user_exist_tag: [],
      loading: false,
      // user_tag_object: {},
      // video_tag_object: {},
      // cb_selected: [],
    };
  }

  onCancel = () => {
    this.setState({ visible: false });
  };

  //  获取标签
  // getSubs = (cb_selected) => {
  //   this.setState({ cb_selected });
  // }

  //  视频标签操作记录
  saveVideoTagLog = async (type, tags, data_id) => {
    const log_data = {
      modelname: type,
      opeation: tags.map(x => x.value).join(','),
      operator_id: cookie.load('userid'),
      operator: cookie.load('username'),
      data_id,
      create_time: moment().format('YYYY-MM-DD HH:mm:ss'),
    };
    try {
      const res = await saveLogServer(log_data);
      console.log('resresresres', res);
      if (!res.status) {
        message.error('统计失败，请联系管理员');
      }
    } catch (err) {
      console.log(err);
      message.error('统计失败，请联系管理员');
    }
  };

  getParentsId = (tagids) => {
    const { all_tags } = this.state;
    const parentIds = [];
    for (let index = 0; index < tagids.length; index++) {
      const element = tagids[index];
      for (let n = 0; n < all_tags.length; n++) {
        const pids = all_tags[n];
        if (Number(element) === Number(pids.tag.id)) {
          parentIds.push(pids.tag.id);
        } else if (pids.childTags) {
          for (let j = 0; j < pids.childTags.length; j++) {
            const cids = pids.childTags[j];
            if (Number(element) === Number(cids.tag.id)) {
              parentIds.push(cids.tag.parentId);
            }
          }
        }
      }
    }
    return parentIds;
  };

  onSubmit = async (parmas) => {
    const {
      auid, puid, callback, ver,
    } = this.props;
    try {
      switch (parmas.type) {
        case 'user': {
          const res = diff(this.user_exist_tags, parmas.tagids);
          const parentids = this.getParentsId(res[1]);
          await setTagToUser({
            auid,
            tagids: res[1].join(),
            parentids: parentids.join(),
            quality: parmas.quality,
            type: '1',
          });
          if (parmas.tagids && parmas.tagids.length > 0) {
            this.saveVideoTagLog('user_tag_log', parmas.tagids, auid);
          }
          break;
        }
        case 'video': {
          const res_video = diff(this.video_exist_tags, parmas.tagids);
          const parentids = this.getParentsId(res_video[1]);
          await setTagToVideo({
            puid,
            ver,
            tagids: res_video[1].join(),
            parentids: parentids.join(),
            quality: parmas.quality_video,
            type: '1',
          });
          if (parmas.tagids && parmas.tagids.length > 0) {
            this.save_video_tag_log('video_tag_log', parmas.tagids, `${puid}_${ver}`);
          }
          break;
        }
        case 'videoAndUser': {
          const res = diff(this.user_exist_tags, parmas.tagids);
          const res_video = diff(this.video_exist_tags, parmas.tagids);
          const parentuserids = this.getParentsId(res[1]);
          const parentvideoids = this.getParentsId(res_video[1]);
          await Promise.all([
            setTagToUser({
              auid,
              tagids: res[1].join(),
              parentids: parentuserids.join(),
              quality: parmas.quality,
              type: '1',
            }),
            setTagToVideo({
              puid,
              ver,
              tagids: res_video[1].join(),
              parentids: parentvideoids.join(),
              quality: parmas.quality_video,
              type: '1',
            }),
          ]);
          if (parmas.tagids && parmas.tagids.length > 0) {
            this.save_video_tag_log('user_tag_log', parmas.tagids, auid);
            this.save_video_tag_log('video_tag_log', parmas.tagids, `${puid}_${ver}`);
          }
          break;
        }
        default:
          break;
      }
      message.success(intl.get('common.tools.OperationSuccess').defaultMessage('操作成功'), 3);
    } catch (error) {
      message.error(intl.get('common.tools.OperationFailed').defaultMessage('操作失败'), 3);
    } finally {
      await this.setState({ visible: false });
      callback && callback();
    }
  };

  openModal = async () => {
    if (!this.props.pureDataShow) {
      const {
        data: { data },
      } = await getAllTags();
      console.log('data', data);
      const { auid, puid, ver } = this.props;
      await this.setState({ visible: true, loading: true });
      const list = [getUserExistTags({ auid })];
      puid && list.push(getVideoExistTags({ puid, ver }));
      const results = await Promise.all(list);
      await this.setState({
        loading: false,
        user_exist_tag: results[0].data.data ? results[0].data.data.tags : [],
        video_exist_tag: results[1] && results[1].data.data ? results[1].data.data.tags : [],
        // userTagObject: results[0].data.data ? results[0].data.data : [],
        // videoTagObject: results[1] && results[1].data.data ? results[1].data.data : [],
        all_tags: data,
      });
      this.user_exist_tags = results[0].data.data ? results[0].data.data.tags.map(v => v.id) : [];
      if (results[1]) {
        this.video_exist_tags = results[1].data.data
          ? results[1].data.data.tags.map(v => v.id)
          : [];
      }
    } else {
      if (this.TagTreeSelectComponent) {
        this.TagTreeSelectComponent.setSelected([]);
      }
      const { puid, ver } = this.props;
      await this.setState({ visible: true, loading: true });
      const {
        data: { data },
      } = await getAllTags();
      const res = await getVideoExistEffectTags({
        puid,
        ver,
        is_valid: 1,
        current: 1,
        pageSize: 10000,
      });

      const video_exist_tag = res.data.map(item => this.props.tagDetailMap[item.tag2_id]);
      const tagTreeSelectSelected = [];
      video_exist_tag.forEach((item) => {
        if (!tagTreeSelectSelected[item.parentId]) {
          tagTreeSelectSelected[item.parentId] = [];
        }
        tagTreeSelectSelected[item.parentId].push(`${item.id}`);
      });
      await this.setState({
        all_tags: data,
        loading: false,
        user_exist_tag: [],
        video_exist_tag,
      });
      if (this.TagTreeSelectComponent) {
        this.TagTreeSelectComponent.setSelected(tagTreeSelectSelected);
      }

      if (res.data) {
        this.props.form.setFieldsValue({
          tag: res.data.map(item => ({
            value: item.tag2_id,
          })),
        });
      }
    }
  };

  closeTag = async (tagids, type) => {
    const {
      auid, puid, callback, ver,
    } = this.props;
    await this.setState({ loading: true });
    try {
      switch (type) {
        case 'user': {
          await setTagToUser({ auid, tagids, type: '0' });
          break;
        }
        case 'video': {
          await setTagToVideo({
            puid,
            ver,
            tagids,
            type: '0',
          });
          break;
        }
        default:
          break;
      }
      message.success(intl.get('common.tools.OperationSuccess').defaultMessage('操作成功'), 3);
    } catch (error) {
      message.error(intl.get('common.tools.OperationFailed').defaultMessage('操作失败'), 3);
    } finally {
      callback && callback();
      await this.setState({ loading: false });
    }
  };

  // 修改描述
  changeDescription(value) {
    const { puid, ver } = this.props;
    try {
      alterVideo({ description: value }, puid, ver);
      message.success(intl.get('common.tools.OperationSuccess').defaultMessage('操作成功'), 3);
    } catch (error) {
      console.error(error);
      message.error(intl.get('common.tools.OperationFailed').defaultMessage('操作失败'), 3);
    }
  }

  userExistTags;

  videoExistTags;

  render() {
    const {
      puid,
      form: { validateFields, getFieldDecorator },
      children,
    } = this.props;
    const {
      visible,
      confirmVideoLoading,
      confirmUserLoading,
      confirmVideoAndUserLoading,
      video_exist_tag,
      user_exist_tag,
    } = this.state;
    const onCancel = this.onCancel;
    const onSubmit = this.onSubmit;
    const onOk = ({ type }) => {
      validateFields((err, fieldsValue) => {
        if (err) {
          return false;
        }
        if (!this.props.pureDataShow) {
          const tagids = fieldsValue.tag;
          onSubmit({
            tagids,
            type,
            quality: fieldsValue.quality,
            quality_video: fieldsValue.quality_video,
          });
          if (fieldsValue.description) {
            this.changeDescription(fieldsValue.description);
          }
        } else {
          this.props.onDataSelected && this.props.onDataSelected(fieldsValue);
          onCancel();
        }
      });
    };
    let footer;
    if (!this.props.pureDataShow) {
      if (!puid) {
        footer = [
          <Button key="back" type="ghost" size="large" onClick={onCancel}>
            {intl.get('vivaplus.tag.back').defaultMessage('返回')}
          </Button>,
          <Button
            key="submitUser"
            type="primary"
            size="large"
            onClick={() => onOk({ type: 'user' })}
            loading={confirmUserLoading}
          >
            收藏用户
          </Button>,
        ];
      } else {
        footer = [
          <Button key="back" type="ghost" size="large" onClick={onCancel}>
            {intl.get('vivaplus.tag.back').defaultMessage('返回')}
          </Button>,
          <Button
            key="submitVideo"
            type="primary"
            size="large"
            onClick={() => onOk({ type: 'video' })}
            loading={confirmVideoLoading}
          >
            {intl.get('tag.manage.Tag (video)').defaultMessage('收藏视频')}
          </Button>,
          <Button
            key="submitVideoAndUser"
            type="primary"
            size="large"
            onClick={() => onOk({ type: 'videoAndUser' })}
            loading={confirmVideoAndUserLoading}
          >
            {intl.get('tag.manage.Tag (video & user)').defaultMessage('收藏视频并收藏用户')}
          </Button>,
        ];
      }
    } else {
      footer = [
        <Button key="back" type="ghost" size="large" onClick={onCancel}>
          {intl.get('vivaplus.tag.back').defaultMessage('返回')}
        </Button>,
        <Button
          key="submitUser"
          type="primary"
          size="large"
          onClick={() => onOk({ type: 'user' })}
          loading={confirmUserLoading}
        >
          确定
        </Button>,
      ];
    }

    const ModalOpts = {
      visible,
      title: intl.get('tag.manage.Tag').defaultMessage('收藏'),
      footer,
      onCancel,
    };
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 19 },
    };
    return (
      <span>
        <span onClick={this.openModal}>{children}</span>
        <Modal {...ModalOpts}>
          <Spin spinning={this.state.loading}>
            <Form>
              {puid ? (
                <div>
                  <FormItem
                    label={intl.get('tag.manage.Video Tags').defaultMessage('视频已有标签')}
                    {...formItemLayout}
                  >
                    <div>
                      {video_exist_tag.map(v => (
                        <Tag
                          key={v.id}
                          color={Color[v.type]}
                          closable={!this.props.pureDataShow}
                          onClose={() => this.closeTag(v.id, 'video')}
                        >
                          {v.displayName}
                        </Tag>
                      ))}
                    </div>
                  </FormItem>
                </div>
              ) : (
                ''
              )}
              <FormItem
                label={intl.get('tag.manage.User Tags').defaultMessage('用户已有标签')}
                {...formItemLayout}
              >
                <div>
                  {user_exist_tag.map(v => (
                    <Tag
                      key={v.id}
                      color={Color[v.type]}
                      closable
                      onClose={() => this.closeTag(v.id, 'user')}
                    >
                      {v.displayName}
                    </Tag>
                  ))}
                </div>
              </FormItem>
              <div>
                <span>ps </span>
                <Tag color="#f50">
                  {intl.get('tag.manage.Machine Tag').defaultMessage('机器标签')}
                </Tag>
                <Tag color="#2db7f5">
                  {intl.get('tag.manage.Artificial Tag').defaultMessage('人工标签')}
                </Tag>
                <Tag color="#87d068">
                  {intl.get('tag.manage.Machine＆Artificial Tag').defaultMessage('机器&人工标签')}
                </Tag>
              </div>
              <FormItem
                label={intl.get('vivaplus.candidateactivitylist.tagged').defaultMessage('打标签')}
                style={{ marginTop: '30px' }}
              >
                {getFieldDecorator('tag', {
                  rules: [{ required: true, message: '必填' }],
                })(<SetTag />)}
              </FormItem>
            </Form>
          </Spin>
        </Modal>
      </span>
    );
  }
}

export default connect(({ app }) => ({ app }))(
  RightHOC({ menu: '_right/tag' })(Form.create()(CollectModal)),
);
