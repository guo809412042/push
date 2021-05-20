export default [
  {
    exact: true,
    path: '/issue_manage/issue_type_list',
    component: () => import('./issue-type-list'),
    models: () => [import('./issue-type-list/models')],
  },
];
