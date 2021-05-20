
viva-tools 产品 - 工单管理 功能组件
====

 [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://airbnb.io/javascript/react/)

## 简介
viva-tools 工单系统一级菜单,包含反馈列表,标签列表的功能

### 访问

新版本访问地址: 
```http
http://vcm-vivavideo.xiaoying.co/issue/#/issue_manage/issue_report_list
```

### 路由

旧版本路由为: 
```
issue_manage/issue_report_list
```

新版本路由: 
```
issue/#/**
```

### Api
代理配置由nginx统一处理, 将api开头的请求代理到后端服务
```
^api/* => http://vcm.api.xiaoying.co/*
```

### 当前快速使用

* 1. clone 代码

```bash
git clone git@gitlab.quvideo.com:WEB/vcm-viva-tools-issue.git
```

* 2. 打包vendors

```bash
make vendors
```


* 3. make 即可开始

```bash
make start
```