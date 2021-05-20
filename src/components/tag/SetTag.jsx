import React from 'react';
import intl from 'react-intl-universal';
import {
  Modal, Button, Checkbox, Tag, Row, Col, Icon,
} from 'antd';
import { Text } from '@xy/design';

import { getAllTags } from '../../services/tag';
import styles from './SetTag.less';

const { TextExplain } = Text;

const TextExplainDelay = 1.5; //  延迟时间显示注解  秒
class SetTag extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showAllTag: false,
      allTag: {
        commonlyTag: [], //  常用标签
        hotTag: [], //  最热标签
        remainTag: [], //  不常用标签
      },
      tagDict: {},

      selected: [], //  当前选中的标签的一个二维数组
      cb_selected: [], //  返回值，给父组件的值, 一维数组
      focusIndex: 0, //  选中的一级标签下标
      visible: false,
      uiRewrite: Math.random(),
    };
  }

  componentDidMount() {
    this.init_data();
  }

  //  初始化数据
  init_data = async () => {
    let { allTag } = this.props;
    allTag = allTag || (await this.get_default_tag_list());
    const tagDict = {};
    const tagList = allTag.commonlyTag ? allTag.commonlyTag.concat(allTag.remainTag) : [];
    tagList.map((v) => {
      tagDict[v.tag.id] = v.tag;
      if (v.childTags) {
        v.childTags.map((vv) => {
          tagDict[vv.tag.id] = vv.tag;
        });
      }
    });
    this.setState({ allTag, tagDict });
  };

  //  获取默认数据
  get_default_tag_list = async () => {
    const { data: allTag } = await getAllTags();
    return allTag;
  };

  //  选中最热标签
  select_hot = async (tag) => {
    const { allTag, selected } = this.state;

    let focusIndex = 0;

    let checkedValue = [];
    const tagList = allTag.commonlyTag.concat(allTag.remainTag);
    tagList.map((v, index) => {
      if (v.childTags) {
        v.childTags.map((vv) => {
          if (vv.tag.id === tag.tag.id) {
            focusIndex = index;
          }
        });
      }
    });
    checkedValue = selected[focusIndex] || [];
    !checkedValue.includes(String(tag.tag.id)) && checkedValue.push(String(tag.tag.id));
    this.checked_change(focusIndex, checkedValue);
  };

  //  选中主标签改变
  focus_change = (focusIndex) => {
    this.setState({ focusIndex });
  };

  //  选中子标签改变
  checked_change = (focusIndex, checkedValue) => {
    const { selected } = this.state;
    let cb_selected = [];
    //  先保存复选框选中的二维数组
    selected[focusIndex] = checkedValue;
    this.setState({ selected, uiRewrite: Math.random() }, () => {
      selected.map((item) => {
        cb_selected = cb_selected.concat(item);
      });
      cb_selected = cb_selected.map(item => ({ value: item }));
      this.setState({ cb_selected }, this.triggerChange);
    });
  };

  //  展示选中的标签
  show_selected = () => {
    const { cb_selected, tagDict } = this.state;
    const dom = [];
    cb_selected.map((v) => {
      dom.push(
        <Tag style={{ margin: '3px' }} key={String(v.value)} color="blue">
          {tagDict[parseInt(v.value, 10)].displayName}
          <Icon
            type="close-circle-o"
            style={{ marginLeft: '8px' }}
            onClick={() => this.remove_level2_tag(v.value)}
          />
        </Tag>,
      );
    });
    return dom;
  };

  //  标签颜色
  set_color = (index) => {
    const { selected, focusIndex } = this.state;
    let color = 'blue';
    if (selected[index] && selected[index].length > 0) {
      color = 'red';
    }
    if (index === focusIndex) {
      color = 'green';
    }
    return color;
  };

  //  清空选中标签
  clear = (e) => {
    e && e.stopPropagation();
    this.setState({ selected: [], cb_selected: [] }, this.triggerChange);
  };

  //  删除指定子标签
  remove_level2_tag = (value, e) => {
    e.stopPropagation();
    const { selected } = this.state;

    const cb_selected = [];
    const new_selected = selected.map((v) => {
      v = v.filter(tag_id => tag_id !== value);
      v.map(vv => cb_selected.push({ value: vv }));
      return v;
    });
    this.setState({ selected: new_selected, cb_selected }, this.triggerChange);
  };

  //  展示所有标签
  show_all = () => {
    this.setState(preState => ({ showAllTag: !preState.showAllTag }));
  };

  //  供父组件form表单获取值
  triggerChange() {
    const onChange = this.props.onChange;
    if (onChange) onChange(this.state.cb_selected);
  }

  render_dom = (allTag) => {
    const {
      focusIndex, showAllTag, selected, uiRewrite,
    } = this.state;
    const { commonlyTag, hotTag, remainTag } = allTag;
    const tagList = showAllTag ? commonlyTag.concat(remainTag) : commonlyTag;
    return (
      <div style={{ border: '1px solid #999' }}>
        <div style={{ paddingLeft: '15px' }}>
          <div>
            <Row>
              <Col span={3} className={styles.type_text}>
                最热标签:
              </Col>
              <Col span={21}>
                {hotTag.map(v => (
                  <TextExplain
                    trigger="hover"
                    title={
                      <span>
                        {v.tag.desc ? v.tag.desc : '暂无注解'}
                        {v.tag.video_url ? (
                          <a href={v.tag.video_url} target="_blank">
                            示例视频
                          </a>
                        ) : null}
                      </span>
                    }
                    mouseEnterDelay={TextExplainDelay}
                  >
                    <Tag onClick={() => this.select_hot(v)} style={{ margin: '3px' }}>
                      {v.tag.displayName}
                      <Icon
                        type="close-circle-o"
                        style={{ marginLeft: '8px' }}
                        onClick={() => this.remove_level2_tag(v.tag.id)}
                      />
                    </Tag>
                  </TextExplain>
                ))}
              </Col>
            </Row>
          </div>
          <div>
            <Row>
              <Col span={3} className={styles.type_text}>
                常见标签:
              </Col>
              <Col span={20}>
                {tagList.map((v, index) => (
                  <TextExplain
                    trigger="hover"
                    title={
                      <span>
                        {v.tag.desc ? v.tag.desc : '暂无注解'}
                        {v.tag.video_url ? (
                          <a href={v.tag.video_url} target="_blank">
                            示例视频
                          </a>
                        ) : null}
                      </span>
                    }
                    mouseEnterDelay={TextExplainDelay}
                  >
                    <Tag
                      onClick={() => this.focus_change.bind(index)}
                      color={this.set_color(index)}
                      style={{ margin: '3px' }}
                    >
                      {v.tag.displayName}
                    </Tag>
                  </TextExplain>
                ))}
              </Col>
              <Col span={1}>
                <Icon
                  className={[
                    styles.show_all_icon,
                    showAllTag ? styles.show_all_icon_up : styles.show_all_icon_down,
                  ].join(' ')}
                  type="down-circle"
                  onClick={this.show_all}
                />
              </Col>
            </Row>
          </div>
          <div key={String(uiRewrite)} style={{ width: '100%', minHeight: '160px' }}>
            <Checkbox.Group
              value={selected[focusIndex]}
              onChange={() => this.checked_change(focusIndex)}
            >
              <Row>
                {tagList[focusIndex] && tagList[focusIndex].childTags
                  ? tagList[focusIndex].childTags.map(v => (
                    <TextExplain
                      trigger="hover"
                      title={
                        <span>
                          {v.tag.desc ? v.tag.desc : '暂无注解'}
                          {v.tag.video_url ? (
                            <a href={v.tag.video_url} target="_blank">
                                示例视频
                            </a>
                          ) : null}
                        </span>
                      }
                      mouseEnterDelay={TextExplainDelay}
                    >
                      <Col span={6}>
                        <Checkbox value={String(v.tag.id)} key={String(v.tag.id)}>
                          {v.tag.displayName}
                        </Checkbox>
                      </Col>
                    </TextExplain>
                  ))
                  : null}
              </Row>
            </Checkbox.Group>
          </div>
        </div>
        <div className={styles.clear}>
          {this.show_selected()}
          <Button
            type="danger"
            onClick={this.clear}
            style={{
              position: 'absolute',
              bottom: '5px',
              right: '5px',
            }}
          >
            {intl.get('spider.list.reset').defaultMessage('清空')}
          </Button>
        </div>
      </div>
    );
  };

  render() {
    const { uiType } = this.props;
    const { allTag, visible } = this.state;

    let dom = null;
    switch (uiType) {
      case 'popup':
        //  用于控件较小，放个icon，然后在弹出层显示标签，且点击确定不会立马请求接口，点击返回会清空已选标签
        dom = (
          <span>
            <div>
              {this.show_selected()}
              <a>
                <Icon type="edit" onClick={() => this.setState({ visible: true })} />
              </a>
            </div>
            <Modal
              title="打标签"
              visible={visible}
              onOk={() => this.setState({ visible: false })}
              onCancel={() => {
                this.clear();
                this.setState({ visible: false });
              }}
            >
              {this.render_dom(allTag)}
            </Modal>
          </span>
        );
        break;
      default:
        //  直接渲染
        dom = <div>{this.render_dom(allTag)}</div>;
        break;
    }

    return dom;
  }
}

export default SetTag;
