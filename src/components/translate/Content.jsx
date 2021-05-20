import React from 'react';
import { Row, Col, Button } from 'antd';

const Content = ({
  source, target, onOk, okText,
}) => (
  <div>
    <Row gutter={16} style={{ maxWidth: 900 }}>
      <Col span={12}>
        <div
          style={{
            height: 300,
            padding: '0.5em',
            overflow: 'auto',
            border: '1px solid #ccc',
            borderRadius: '5px',
          }}
          dangerouslySetInnerHTML={{
            __html: source,
          }}
        />
      </Col>
      <Col span={12}>
        <div
          style={{
            height: 300,
            padding: '0.5em',
            overflow: 'auto',
            border: '1px solid #ccc',
            borderRadius: '5px',
          }}
          dangerouslySetInnerHTML={{
            __html: target,
          }}
        />
      </Col>
    </Row>
    <Row type="flex" justify="center" align="middle" style={{ marginTop: '10px' }}>
      <Button type="primary" onClick={onOk}>
        {okText || '确定'}
      </Button>
    </Row>
  </div>
);

export default Content;
