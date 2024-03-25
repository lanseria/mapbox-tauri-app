# Mapbox Tauri App

`Mapbox Tauri App` 是一个 Mapbox Tauri Demo，可以展现 Map，画点线面并编辑管理

"Mapbox Tauri App" is a Mapbox Tauri demo that can display maps, draw points, lines, and polygons, and provide editing and management capabilities.

<img width="128" alt="app-icon" src="./app-icon.png">

> [!warning]
>
> # NOTICE 注意
>
> 由于暂时没有找到类似 `electron.js` 修改请求头的办法，因此，`mapbox` `access tokens` 中 Urls 需要设置为不限制，也就是任何地址都可以访问，或者直接使用 `Default public token`
>
> Since a solution similar to `electron.js` for modifying request headers hasn't been found temporarily, the URLs in the `mapbox` `access tokens` need to be set to unrestricted, meaning that any address can be accessed, or you can directly use the `Default public token`. If you have any good solutions, please git pull. Thank you. 🙏

## Small tip to upgrade

update major package version

```
pnpm up
```

upgrade deps package version

```
pnpm upgrade
```

upgrade cargo package version

```
cd src-tauri && cargo update
```

## 前言

- 众所周知，如果要做一个桌面端的应用程序，还要适配windows与macos等一众操作系统，那只能只是跨平台的框架进行开发
- 之前比较熟悉与流行的就是 electron 版本，大家熟悉的vscode就是应用的此框架
- 之前做一个 electron 版本的 Gis 地图软件
- 虽然此框架对于前端来说已于上手，但带来了很大的安装体积，也就是熟悉的chrome内核的浏览器
- 然后最近又在重复练习 tauri，一个 rust 语言写的跨端框架，生成体积非常小，原理就是利用了各个操作系统的内核来减少安装体积
- 我这里写了一个简单的 mapbox demo 来演示一下
- 代码也是开源的，有兴趣的同学可以借鉴

## Develop Step

1. 创建 icon
2. 创建 mouseState: default/point/line/polygon
3. 创建 point 首先生成 marker
4. 结束画点, marker 转为 featureCollection 中的 type 为 Point 的数据
5. 同时，将默认点属性赋值在 Point Properties 里，与此同时命名随机
6. 定义 sessionDrawPointList localDrawFeatureCollection
