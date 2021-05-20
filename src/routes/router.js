import issueManageRoutes from './issue-manage';
import issueSystemRoutes from './issue-system';

export default [
  {
    path: '/',
    component: () => import('./index'),
    routes: [...issueManageRoutes, ...issueSystemRoutes],
  },
];
