# Boyue Xu · 许博约

南京大学 · 个人学术主页。中英文双语，纯静态页面，无需安装依赖。

## GitHub Pages 发布

1. 在账号 `xuboyue1999` 下新建公开仓库 `xuboyue1999.github.io`。如该仓库已存在，请使用现有仓库。
2. 点击 **Add file → Upload files**，上传本文件夹内的文件及 `assets` 文件夹，然后提交到 `main`。`index.html` 应直接位于仓库根目录，不要额外嵌套一层目录，也不要只上传 ZIP 文件。
3. 进入 **Settings → Pages**，在 **Build and deployment → Source** 选择 **Deploy from a branch**；选择 **main** 和 **/(root)**，点击 **Save**。
4. 等待部署完成，再访问 https://xuboyue1999.github.io/ 。部署状态可在 **Actions** 查看。

如果账号或仓库名称不同，请相应修改 `index.html` 内的 `og:url`、`og:image`。

## 更新内容

- `content.js`：中英文个人信息、论文、研究方向、项目及荣誉。
- `app.js`：导航、双语切换、论文状态筛选。
- `styles.css`：页面样式与响应式布局。
- `assets/`：照片、论文原图和图标。
- `.nojekyll`：让 GitHub Pages 直接发布静态文件。

网页不托管 PDF。论文通过外部链接访问；VL-UniTrack 保持 TMM 已录用状态，论文链接待补。更新 `main` 分支的文件后，GitHub Pages 会自动重新发布。引用数是页面注明日期的静态记录。

## 官方说明

- https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site
- https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
