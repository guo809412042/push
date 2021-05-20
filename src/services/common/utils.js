import ossUploader from '@xy/vcm-oss-upload';
import request from '../../utils/request';

export async function getAliOssSts(file, process) {
  return ossUploader({
    fetch: request, // 必填  前端封装的request
    file, // 必填  file object
    process, // 可选 进度回调
  });
}
