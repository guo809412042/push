import React, { Component } from 'react';
import Viewer from 'react-viewer';

import styles from './CommentView.less';

class CommentView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showImages: [],
    };
  }

  componentDidMount() {
    this.viewRef.addEventListener('click', this.handleClick);
  }


  componentWillUnmount() {
    this.viewRef.removeEventListener('click', this.handleClick);
  }


  handleClick = (e) => {
    console.log(e);
    if (e.target.tagName === 'IMG') {
      this.setState({
        showImages: [{
          src: e.target.src,
          alt: e.target.alt,
        }],
      });
    }
  }

  render() {
    const { html = '' } = this.props;
    const { showImages } = this.state;
    return (
      <div className={styles.root}>
        <div
          ref={(ref) => { this.viewRef = ref; }}
          dangerouslySetInnerHTML={{
            __html: html,
          }}
        />
        <Viewer
          visible={showImages.length > 0}
          onClose={() => {
            this.setState({
              showImages: [],
            });
          } }
          images={showImages}
        />
      </div>
    );
  }
}

export default CommentView;
