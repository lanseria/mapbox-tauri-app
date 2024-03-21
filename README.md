# Mapbox Tauri App

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

## Develop Step

1. 创建 icon
2. 创建 mouseState: default/point/line/polygon
3. 创建 point 首先生成 marker
4. 结束画点, marker 转为 featureCollection 中的 type 为 Point 的数据
5. 同时，将默认点属性赋值在 Point Properties 里，与此同时命名随机
6. 定义 sessionDrawPointList localDrawFeatureCollection
