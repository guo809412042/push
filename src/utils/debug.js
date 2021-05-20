import debug from 'debug';

const setDebug = (namespace) => {
  const Debug = debug(namespace);
  if (process.env.NODE_ENV !== 'production') {
    Debug.enabled = true;
  }
  return Debug;
};
export default setDebug;
