import React from 'react';
import { Link } from 'dva/router';

export default (auiddigest, children) => (
  <Link to={`/video_manage/video_list/${auiddigest}`} target="_blank">
    {children}
  </Link>
);
