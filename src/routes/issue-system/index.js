export default [
  {
    exact: true,
    path: '/issue_system/manual_issue/:duiddigest?',
    component: () => import('./manual-issue'),
    models: () => [import('./manual-issue/models')],
  },
  {
    exact: true,
    path: '/issue_system/assigned_issue',
    component: () => import('./assigned-issue'),
    models: () => [import('./assigned-issue/models')],
  },
  {
    exact: true,
    path: '/issue_system/manual_closed_issue',
    component: () => import('./manual-closed-issue'),
    models: () => [import('./manual-closed-issue/models')],
  },
  {
    exact: true,
    path: '/issue_system/processing_issue',
    component: () => import('./processing-issue'),
    models: () => [import('./processing-issue/models')],
  },
  {
    exact: true,
    path: '/issue_system/automatic_issue',
    component: () => import('./automatic-issue'),
    models: () => [import('./automatic-issue/models')],
  },
  {
    exact: true,
    path: '/issue_system/service_tag',
    component: () => import('./service-tag'),
    models: () => [import('./service-tag/models')],
  },
  {
    exact: true,
    path: '/issue_system/reply_config',
    component: () => import('./reply-config'),
    models: () => [import('./reply-config/models')],
  },
  {
    exact: true,
    path: '/issue_system/issue_statistics',
    component: () => import('./issue-statistics'),
    models: () => [import('./issue-statistics/models')],
  },
  {
    exact: true,
    path: '/issue_system/issue_tag_statistics',
    component: () => import('./issue-tag-statistics'),
    models: () => [import('./issue-tag-statistics/models')],
  },
  {
    exact: true,
    path: '/issue_system/knowledge',
    component: () => import('./knowledge'),
    models: () => [import('./knowledge/models')],
  },
  {
    exact: true,
    path: '/issue_system/knowledge-tag',
    component: () => import('./knowledge-tag'),
    models: () => [import('./knowledge-tag/models')],
  },
  {
    exact: true,
    path: '/issue_system/fapiao',
    component: () => import('./fapiao'),
    models: () => [import('./fapiao/models')],
  },
];
