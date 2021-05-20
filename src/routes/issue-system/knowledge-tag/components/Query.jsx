import React from 'react';
import { Form, Button, Input } from 'antd';

import Create from './Create';

import styles from '../../../../styles/index.css';

const FormItem = Form.Item;

class Query extends React.Component {
  state = {}

  handleSubmit = () => {
    const { onSearch } = this.props;
    this.props.form.validateFields(async (err, values) => {
      if (err) {
        return false;
      }
      onSearch && onSearch(values);
    });
  }

  render() {
    const { form: { getFieldDecorator }, onSearch } = this.props;

    return <div>
      <Form layout="inline">
        <FormItem label="标签" className={styles.marginPxForItem}>
          {getFieldDecorator('tagName', {})(
            <Input allowClear />,
          )}
        </FormItem>
        <FormItem className={styles.marginPxForItem}>
          <Button onClick={this.handleSubmit} type="primary" icon="search">查询</Button>
        </FormItem>
        <FormItem className={styles.marginPxForItem}>
          <Create onSearch={onSearch} />
        </FormItem>
      </Form>
    </div>;
  }
}

export default Form.create()(Query);
