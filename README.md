# 六级作文训练台

## 本地打开

直接双击打开：

`index.html`

也可以用浏览器打开这个路径：

`D:\5.13\cet6-writing-lab\index.html`

## 怎么和 Codex 互动

网站是纯静态版本，不会在前端放 API key，所以不会直接联网调用 AI。

使用方式：

1. 在“练作文”里写一篇。
2. 去“让 Codex 改”页写你的诉求。
3. 点“复制请求”。
4. 把复制内容发给 Codex。
5. Codex 会直接修改 `D:\5.13\cet6-writing-lab` 里的文件。

这样可以避免把密钥暴露在网页里，也方便持续迭代模板。

## 部署到公网

这是纯静态网站，整个 `cet6-writing-lab` 文件夹可以直接部署。

可选方式：

- GitHub Pages：新建仓库，上传整个文件夹内容，开启 Pages。
- Netlify：把整个文件夹拖到 Netlify Drop。
- Vercel：导入仓库，根目录选择 `cet6-writing-lab`。

部署后，`assets` 里的真题图会一起发布。

## 注意

练习记录保存在浏览器 localStorage 里。换电脑或换浏览器后不会自动同步。
