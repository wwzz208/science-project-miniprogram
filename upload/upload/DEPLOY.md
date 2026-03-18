# 一键部署指南

## 第一次部署（必须执行）

### 1. 初始化 Git
```bash
git init
```

### 2. 添加所有文件
```bash
git add .
```

### 3. 提交代码
```bash
git commit -m "初始化项目"
```

### 4. 连接到你的 GitHub 仓库（替换下面的 URL）
```bash
# 把这个 URL 替换成你刚才创建的仓库地址
git remote add origin https://github.com/你的用户名/science-project-miniprogram.git
```

### 5. 推送代码
```bash
git branch -M main
git push -u origin main
```

## 后续更新代码
```bash
git add .
git commit -m "更新功能"
git push
```
