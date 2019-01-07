# Taro-canvas-share
基于Taro制作生成带信息图片分享朋友圈
（**Taro** 是一套遵循 [React](https://reactjs.org/) 语法规范的 **多端开发** 解决方案。使用 **Taro**，我们可以只书写一套代码，再通过 **Taro** 的编译工具，将源代码分别编译出可以在不同端（微信/支付宝小程序、H5等）运行的代码。）

### 项目运行

```

git clone git@github.com:EasyTuan/ct-small_shop.git

# 国内镜像加速节点:git@gitee.com:easytuan/ct-small_shop.git

cd ct-small_shop

# 全局安装taro脚手架
npm install -g @tarojs/cli@1.2.4

# 项目依赖为1.2.4版本，如要升级，请同时升级项目依赖
# 如用1.2.4版本，请忽略这句

taro update self //更新cli工具
taro update project //更新项目依赖

# 安装项目依赖
npm install

# 微信小程序
npm run dev:weapp

# 支付宝小程序
npm run dev:alipay

# H5
npm run dev:h5

```

### 目标功能

- [x] 微信小程序生成图片，保存到相册
- [ ] 微信小程序生成响应式图片
- [ ] 微信小程序canvas原生组件如何给画布添加css动画
- [ ] 保存高清分享图方案
- [ ] 微信小程序生成图片实现单屏适应
- [ ] 生成携带信息的小程序二维码