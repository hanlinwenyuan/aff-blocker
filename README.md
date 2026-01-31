# Aff-Blocker

🛡️ 一个用于检测和提示推广/邀请链接（Affiliate Links）的篡改猴脚本。

## 功能特性

- ✅ **智能检测**：自动识别链接中的推广参数（如 `ref=`, `invite=`, `aff=` 等）和路径（如 `/invite/xxx`, `/ref/xxx`）
- ✅ **外部链接过滤**：仅检测外部链接，不影响站内导航
- ✅ **友好提示**：检测到推广链接时显示美观的警告弹窗
- ✅ **参数清除**：提供一键清除推广参数后访问的选项
- ✅ **高亮显示**：在弹窗中高亮显示检测到的可疑参数

## 安装方法

### 前置要求

首先需要安装浏览器扩展：

- [Tampermonkey](https://www.tampermonkey.net/)（推荐）
- [Violentmonkey](https://violentmonkey.github.io/)
- [Greasemonkey](https://www.greasespot.net/)（仅 Firefox）

### 安装脚本

1. 点击浏览器扩展图标，选择「创建新脚本」
2. 将 `aff-blocker.user.js` 的内容复制粘贴进去
3. 保存脚本（Ctrl+S）

## 使用说明

安装后脚本会自动运行。当你点击包含推广参数的外部链接时，会弹出警告窗口，提供三个选项：

| 选项 | 说明 |
|------|------|
| 🧹 清除参数后访问 | 移除所有检测到的推广参数，然后在新标签页打开 |
| ➡️ 继续访问原链接 | 保留原始链接，在新标签页打开 |
| ✖️ 取消 | 关闭弹窗，不进行任何操作 |

## 检测的参数类型

脚本会检测以下常见的推广参数：

### 邀请/推荐类
- `ref`, `referral`, `referrer`
- `invite`, `invitation`, `invited_by`

### 推广类
- `aff`, `affiliate`
- `partner`, `promo`, `promocode`, `coupon`

### 追踪ID类
- `aid`, `pid`, `cid`, `tid`, `sid`, `uid`

### UTM 追踪参数
- `utm_source`, `utm_medium`, `utm_campaign`
- `utm_content`, `utm_term`

### 其他常见
- `tag`, `clickid`, `subid`, `affid`
- `via`, `from`, `source`, `campaign`, `channel`

## 检测的路径模式

除了查询参数，脚本还会检测 URL 路径中的推广特征：

| 路径模式 | 示例 |
|----------|------|
| `/invite/` | `https://example.com/invite/abc123` |
| `/ref/` | `https://example.com/ref/user456` |
| `/referral/` | `https://example.com/referral/code789` |
| `/aff/` | `https://example.com/aff/partner` |
| `/affiliate/` | `https://example.com/affiliate/link` |
| `/partner/` | `https://example.com/partner/promo` |
| `/promo/` | `https://example.com/promo/summer2024` |
| `/r/` | `https://example.com/r/shortcode` |
| `/go/` | `https://example.com/go/redirect` |
| `/share/` | `https://example.com/share/content` |
| `/i/` | `https://example.com/i/invite` |

> ⚠️ **注意**：路径中的推广码无法自动清除，只能提示用户。

## 自定义配置

如需添加或修改检测的参数，可以编辑脚本中的 `AFF_PARAMS` 数组：

```javascript
const AFF_PARAMS = [
    'ref', 'referral', 'referrer',
    // 在这里添加你想检测的参数...
];

// 路径模式
const AFF_PATH_PATTERNS = [
    /\/invite\//i,
    /\/ref\//i,
    // 在这里添加你想检测的路径模式...
];
```

## 截图预览

当检测到推广链接时，会显示如下弹窗：

```
┌─────────────────────────────────────┐
│         ⚠️ 检测到推广链接            │
├─────────────────────────────────────┤
│  目标链接:                           │
│  https://example.com/?ref=abc123    │
│                                     │
│  🔍 检测到的推广参数：                │
│  [ref=abc123]                       │
│                                     │
│  [🧹 清除参数后访问]                  │
│  [➡️ 继续访问原链接]                  │
│  [✖️ 取消]                           │
└─────────────────────────────────────┘
```

## 快捷键

- `ESC`：关闭弹窗
- 点击弹窗外部区域：关闭弹窗

## 兼容性

- ✅ Chrome / Edge / Brave（Chromium 内核）
- ✅ Firefox
- ✅ Safari（需要 Userscripts 扩展）

## 许可证

MIT License

## 更新日志

### v1.1.0
- ✨ 新增路径检测功能（如 `/invite/xxx`, `/ref/xxx`）
- 🎨 优化弹窗显示，区分参数和路径类型
- 📝 更新文档

### v1.0.0
- 🎉 首次发布
- 实现基础的推广链接检测功能
- 支持参数清除功能
- 美观的警告弹窗 UI# Aff-Blocker

🛡️ 一个用于检测和提示推广/邀请链接（Affiliate Links）的篡改猴脚本。

## 功能特性

- ✅ **智能检测**：自动识别链接中的推广参数（如 `ref=`, `invite=`, `aff=` 等）和路径（如 `/invite/xxx`, `/ref/xxx`）
- ✅ **外部链接过滤**：仅检测外部链接，不影响站内导航
- ✅ **友好提示**：检测到推广链接时显示美观的警告弹窗
- ✅ **参数清除**：提供一键清除推广参数后访问的选项
- ✅ **高亮显示**：在弹窗中高亮显示检测到的可疑参数

## 安装方法

### 前置要求

首先需要安装浏览器扩展：

- [Tampermonkey](https://www.tampermonkey.net/)（推荐）
- [Violentmonkey](https://violentmonkey.github.io/)
- [Greasemonkey](https://www.greasespot.net/)（仅 Firefox）

### 安装脚本

1. 点击浏览器扩展图标，选择「创建新脚本」
2. 将 `aff-blocker.user.js` 的内容复制粘贴进去
3. 保存脚本（Ctrl+S）

## 使用说明

安装后脚本会自动运行。当你点击包含推广参数的外部链接时，会弹出警告窗口，提供三个选项：

| 选项 | 说明 |
|------|------|
| 🧹 清除参数后访问 | 移除所有检测到的推广参数，然后在新标签页打开 |
| ➡️ 继续访问原链接 | 保留原始链接，在新标签页打开 |
| ✖️ 取消 | 关闭弹窗，不进行任何操作 |

## 检测的参数类型

脚本会检测以下常见的推广参数：

### 邀请/推荐类
- `ref`, `referral`, `referrer`
- `invite`, `invitation`, `invited_by`

### 推广类
- `aff`, `affiliate`
- `partner`, `promo`, `promocode`, `coupon`

### 追踪ID类
- `aid`, `pid`, `cid`, `tid`, `sid`, `uid`

### UTM 追踪参数
- `utm_source`, `utm_medium`, `utm_campaign`
- `utm_content`, `utm_term`

### 其他常见
- `tag`, `clickid`, `subid`, `affid`
- `via`, `from`, `source`, `campaign`, `channel`

## 检测的路径模式

除了查询参数，脚本还会检测 URL 路径中的推广特征：

| 路径模式 | 示例 |
|----------|------|
| `/invite/` | `https://example.com/invite/abc123` |
| `/ref/` | `https://example.com/ref/user456` |
| `/referral/` | `https://example.com/referral/code789` |
| `/aff/` | `https://example.com/aff/partner` |
| `/affiliate/` | `https://example.com/affiliate/link` |
| `/partner/` | `https://example.com/partner/promo` |
| `/promo/` | `https://example.com/promo/summer2024` |
| `/r/` | `https://example.com/r/shortcode` |
| `/go/` | `https://example.com/go/redirect` |
| `/share/` | `https://example.com/share/content` |
| `/i/` | `https://example.com/i/invite` |

> ⚠️ **注意**：路径中的推广码无法自动清除，只能提示用户。

## 自定义配置

如需添加或修改检测的参数，可以编辑脚本中的 `AFF_PARAMS` 数组：

```javascript
const AFF_PARAMS = [
    'ref', 'referral', 'referrer',
    // 在这里添加你想检测的参数...
];

// 路径模式
const AFF_PATH_PATTERNS = [
    /\/invite\//i,
    /\/ref\//i,
    // 在这里添加你想检测的路径模式...
];
```

## 截图预览

当检测到推广链接时，会显示如下弹窗：

```
┌─────────────────────────────────────┐
│         ⚠️ 检测到推广链接            │
├─────────────────────────────────────┤
│  目标链接:                           │
│  https://example.com/?ref=abc123    │
│                                     │
│  🔍 检测到的推广参数：                │
│  [ref=abc123]                       │
│                                     │
│  [🧹 清除参数后访问]                  │
│  [➡️ 继续访问原链接]                  │
│  [✖️ 取消]                           │
└─────────────────────────────────────┘
```

## 快捷键

- `ESC`：关闭弹窗
- 点击弹窗外部区域：关闭弹窗

## 许可证

GPL v3

## 更新日志

### v1.1.0
- ✨ 新增路径检测功能（如 `/invite/xxx`, `/ref/xxx`）
- 🎨 优化弹窗显示，区分参数和路径类型
- 📝 更新文档

### v1.0.0
- 🎉 首次发布
- 实现基础的推广链接检测功能
- 支持参数清除功能
- 美观的警告弹窗 UI
