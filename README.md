### BbgShop商城（服务端）

本项目需要配合微信小程序端使用，GitHub: [https://gitee.com/cyh1231wp/bbgshop-xcx](https://gitee.com/cyh1231wp/bbgshop-xcx)


### 本地开发环境配置
+ 克隆项目到本地
```
git clone https://gitee.com/cyh1231wp/bbgshop-node
```
> 注意数据库字符编码为utf8mb4
+ 更改数据库配置
  src/common/config/database.js
  
```
const mysql = require('think-model-mysql');

module.exports = {
    handle: mysql,
    database: 'bbgshop',
    prefix: 'bbgshop_',
    encoding: 'utf8mb4',
    host: '127.0.0.1',
    port: '3306',
    user: 'root',
    password: '你的密码',
    dateStrings: true
};
```

+ 填写微信登录和微信支付配置
src/common/config/config.js
```
// default config
module.exports = {
  default_module: 'api',
  weixin: {
    appid: '', // 小程序 appid
    secret: '', // 小程序密钥
    mch_id: '', // 商户帐号ID
    partner_key: '', // 微信支付密钥
    notify_url: '' // 微信异步通知
  }
};
```

+ 安装依赖并启动
```
npm install
npm start
```
访问http://127.0.0.1:8360/

### 线上部署

+ 没有域名部署参考文档：[不用买域名、不用备案、不用配置https快速部署Node.js微信小程序商城（基于Node.js+MySQL+ThinkJS）](http://www.jianshu.com/p/78a0f5f424e1)

+ 如有域名且已备案，可参考：
  + [阿里云 Ubuntu 16.04 下部署 Node.js + MySQL 微信小程序商城](http://www.jianshu.com/p/38d13a7c1b78)
  + [阿里云 CentOS 7.3 下部署基于 Node.js + MySQL 的微信小程序商城](http://www.jianshu.com/p/5d5497697b0a)


### 功能列表
+ 首页
+ 分类首页、分类商品、新品首发、人气推荐商品页面
+ 商品详情页面，包含加入购物车、收藏商品、商品评论功能
+ 搜索功能
+ 专题功能
+ 品牌功能
+ 完整的购物流程，商品的加入、编辑、删除、批量选择，收货地址的选择，下单支付
+ 会员中心（订单、收藏、足迹、收货地址、意见反馈）
....

### 最后
谢谢大家支持
