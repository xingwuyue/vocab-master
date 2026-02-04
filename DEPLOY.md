# VocabMaster - 英语词汇学习网站

## 🚀 快速部署到 GitHub Pages

### 方式一：使用 GitHub CLI（推荐）

```bash
# 安装 GitHub CLI（如果未安装）
# macOS: brew install gh
# Ubuntu: sudo apt install gh
# Windows: winget install --id GitHub.cli

# 登录 GitHub
gh auth login

# 创建仓库并推送
cd vocab-master
gh repo create vocab-master --public --source=. --push

# 启用 GitHub Pages
gh api repos/YOUR_USERNAME/vocab-master/pages \
  --method PUT \
  --input '{"source":{"branch":"gh-pages","path":"/"}}'
```

### 方式二：手动部署

1. **创建 GitHub 仓库**
   - 访问 https://github.com/new
   - 仓库名称: `vocab-master`
   - 选择 "Public"
   - 点击 "Create repository"

2. **推送代码**
   ```bash
   cd vocab-master
   git remote add origin https://github.com/YOUR_USERNAME/vocab-master.git
   git branch -M main
   git push -u origin main
   ```

3. **启用 GitHub Pages**
   - 进入仓库的 Settings → Pages
   - Source 选择 "GitHub Actions"
   - 等待自动部署完成

4. **访问网站**
   - 部署完成后访问: `https://YOUR_USERNAME.github.io/vocab-master/`

## 📝 项目说明

### 功能特性

- **5个学习阶段**：从高频1000词到精通30000词
- **智能复习系统**：标记难词，自动安排复习
- **发音功能**：点击播放单词发音
- **进度追踪**：学习进度自动保存到本地
- **键盘快捷键**：Space显示释义，←标记难词，→标记已掌握
- **精美界面**：深色主题，流畅动画，响应式设计

### 本地使用

直接用浏览器打开 `index.html` 即可使用！

数据保存在浏览器 localStorage 中，无需服务器。

### 词汇量说明

目前演示版本每个阶段包含示例词汇：
- 阶段1：约100个高频词
- 阶段2：约20个常用词
- 阶段3：约10个进阶词
- 阶段4：约10个中高级词
- 阶段5：约10个精通级词

**完整词汇扩展**：可以导入标准的COCA高频词表或其他词汇库。

## 🎨 自定义

### 修改每日学习目标
编辑 `app.js` 中的 `dailyGoal` 变量（默认20个）

### 导入完整词汇表
替换 `vocabulary-data.js` 中的数据即可。

推荐词表：
- COCA 60000词频表
- NGSL (New General Service List)
- Academic Word List (学术词汇)

## 📱 使用技巧

1. **桌面端**：使用键盘快捷键提高学习效率
2. **移动端**：完美适配手机浏览器
3. **离线使用**：添加为书签，无需网络
4. **定期复习**：点击"智能复习"巩固难词

## 🔒 隐私说明

所有学习数据仅存储在您的浏览器中，不会上传到任何服务器。
