// ==UserScript==
// @name         Aff-Blocker
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  检测并提示推广/邀请链接（Affiliate Links），保护你的点击
// @author       hanlinwenyuan
// @match        *://*/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    // ==================== 配置区域 ====================
    
    // 常见的 affiliate 参数模式（用于查询参数检测）
    const AFF_PARAMS = [
        // 邀请/推荐类
        'ref', 'referral', 'referrer', 'invite', 'invitation', 'invited_by',
        // 推广类
        'aff', 'affiliate', 'partner', 'promo', 'promocode', 'coupon',
        // 追踪ID类
        'aid', 'pid', 'cid', 'tid', 'sid', 'uid',
        // UTM 追踪参数
        'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term',
        // 平台特定
        'tag', 'clickid', 'subid', 'affid', 'aff_id', 'ref_id',
        // 其他常见
        'via', 'from', 'source', 'campaign', 'channel'
    ];

    // 路径中的 affiliate 关键词模式（用于路径检测，如 /invite/xxx）
    const AFF_PATH_PATTERNS = [
        /\/invite\//i,
        /\/ref\//i,
        /\/referral\//i,
        /\/aff\//i,
        /\/affiliate\//i,
        /\/partner\//i,
        /\/promo\//i,
        /\/r\//i,           // 短链接形式，如 /r/abc123
        /\/go\//i,          // 跳转链接，如 /go/abc123
        /\/share\//i,       // 分享链接
        /\/i\//i,           // 邀请短链接
    ];

    // ==================== 样式定义 ====================
    
    const STYLES = `
        .aff-blocker-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.6);
            z-index: 2147483647;
            display: flex;
            justify-content: center;
            align-items: center;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        }
        
        .aff-blocker-modal {
            background: #fff;
            border-radius: 12px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            overflow: hidden;
            animation: aff-blocker-slide-in 0.3s ease;
        }
        
        @keyframes aff-blocker-slide-in {
            from {
                opacity: 0;
                transform: translateY(-20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .aff-blocker-header {
            background: linear-gradient(135deg, #ff6b6b, #ee5a5a);
            color: white;
            padding: 20px;
            text-align: center;
        }
        
        .aff-blocker-header h2 {
            margin: 0;
            font-size: 20px;
            font-weight: 600;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
        }
        
        .aff-blocker-header .icon {
            font-size: 28px;
        }
        
        .aff-blocker-body {
            padding: 20px;
        }
        
        .aff-blocker-info {
            background: #f8f9fa;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 15px;
        }
        
        .aff-blocker-info-label {
            font-size: 12px;
            color: #6c757d;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 5px;
        }
        
        .aff-blocker-url {
            word-break: break-all;
            font-size: 14px;
            color: #333;
            line-height: 1.5;
        }
        
        .aff-blocker-param {
            background: #fff3cd;
            color: #856404;
            padding: 2px 6px;
            border-radius: 4px;
            font-weight: 600;
        }
        
        .aff-blocker-detected {
            margin-top: 15px;
        }
        
        .aff-blocker-detected-title {
            font-size: 14px;
            color: #dc3545;
            font-weight: 600;
            margin-bottom: 8px;
        }
        
        .aff-blocker-detected-list {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
        }
        
        .aff-blocker-detected-item {
            background: #ffe5e5;
            color: #dc3545;
            padding: 4px 10px;
            border-radius: 20px;
            font-size: 13px;
            font-weight: 500;
        }
        
        .aff-blocker-footer {
            padding: 15px 20px 20px;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        
        .aff-blocker-btn {
            padding: 12px 20px;
            border: none;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
            text-align: center;
        }
        
        .aff-blocker-btn:hover {
            transform: translateY(-1px);
        }
        
        .aff-blocker-btn:active {
            transform: translateY(0);
        }
        
        .aff-blocker-btn-primary {
            background: #28a745;
            color: white;
        }
        
        .aff-blocker-btn-primary:hover {
            background: #218838;
        }
        
        .aff-blocker-btn-secondary {
            background: #007bff;
            color: white;
        }
        
        .aff-blocker-btn-secondary:hover {
            background: #0056b3;
        }
        
        .aff-blocker-btn-cancel {
            background: #f8f9fa;
            color: #6c757d;
            border: 1px solid #dee2e6;
        }
        
        .aff-blocker-btn-cancel:hover {
            background: #e9ecef;
        }
    `;

    // ==================== 工具函数 ====================
    
    /**
     * 判断是否为外部链接
     */
    function isExternalLink(url) {
        try {
            const linkUrl = new URL(url, window.location.href);
            return linkUrl.hostname !== window.location.hostname;
        } catch (e) {
            return false;
        }
    }

    /**
     * 检测URL中的affiliate参数（查询参数）
     * @returns {Array} 检测到的参数列表
     */
    function detectAffParams(url) {
        try {
            const urlObj = new URL(url, window.location.href);
            const params = urlObj.searchParams;
            const detected = [];
            
            for (const [key, value] of params.entries()) {
                const lowerKey = key.toLowerCase();
                if (AFF_PARAMS.some(pattern => lowerKey === pattern || lowerKey.includes(pattern))) {
                    detected.push({ key, value, type: 'param' });
                }
            }
            
            return detected;
        } catch (e) {
            return [];
        }
    }

    /**
     * 检测URL路径中的affiliate关键词
     * @returns {Array} 检测到的路径模式列表
     */
    function detectAffPath(url) {
        try {
            const urlObj = new URL(url, window.location.href);
            const pathname = urlObj.pathname;
            const detected = [];
            
            for (const pattern of AFF_PATH_PATTERNS) {
                const match = pathname.match(pattern);
                if (match) {
                    // 提取匹配的路径部分和后面的值
                    const matchedPath = match[0];
                    // 获取匹配路径后面的内容作为值
                    const afterMatch = pathname.substring(pathname.indexOf(matchedPath) + matchedPath.length);
                    const value = afterMatch.split('/')[0] || '';
                    detected.push({
                        key: matchedPath.replace(/\//g, ''),
                        value: value,
                        type: 'path',
                        fullMatch: matchedPath + value
                    });
                }
            }
            
            return detected;
        } catch (e) {
            return [];
        }
    }

    /**
     * 综合检测URL中的所有affiliate特征
     * @returns {Object} { params: [], paths: [], hasAff: boolean }
     */
    function detectAllAff(url) {
        const params = detectAffParams(url);
        const paths = detectAffPath(url);
        return {
            params,
            paths,
            all: [...params, ...paths],
            hasAff: params.length > 0 || paths.length > 0
        };
    }

    /**
     * 清除URL中的affiliate参数
     */
    function cleanUrl(url, paramsToRemove) {
        try {
            const urlObj = new URL(url, window.location.href);
            paramsToRemove.forEach(param => {
                urlObj.searchParams.delete(param.key);
            });
            return urlObj.toString();
        } catch (e) {
            return url;
        }
    }

    /**
     * 高亮URL中的参数和路径
     */
    function highlightUrl(url, detectedItems) {
        let highlighted = escapeHtml(url);
        
        detectedItems.forEach(item => {
            if (item.type === 'param') {
                // 高亮查询参数
                const pattern = new RegExp(`([?&])(${escapeRegex(item.key)}=)([^&]*)`, 'gi');
                highlighted = highlighted.replace(pattern, (match, prefix, key, value) => {
                    return `${prefix}<span class="aff-blocker-param">${key}${value}</span>`;
                });
            } else if (item.type === 'path') {
                // 高亮路径部分
                const pathPattern = new RegExp(`(/${escapeRegex(item.key)}/)([^/?#]*)`, 'gi');
                highlighted = highlighted.replace(pathPattern, (match, pathPart, value) => {
                    return `<span class="aff-blocker-param">${pathPart}${value}</span>`;
                });
            }
        });
        
        return highlighted;
    }

    /**
     * 转义HTML特殊字符
     */
    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    /**
     * 转义正则表达式特殊字符
     */
    function escapeRegex(str) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    // ==================== UI 组件 ====================
    
    /**
     * 注入样式
     */
    function injectStyles() {
        if (document.getElementById('aff-blocker-styles')) return;
        
        const styleEl = document.createElement('style');
        styleEl.id = 'aff-blocker-styles';
        styleEl.textContent = STYLES;
        document.head.appendChild(styleEl);
    }

    /**
     * 显示警告弹窗
     */
    function showWarningModal(originalUrl, detection) {
        injectStyles();
        
        const { params, paths, all } = detection;
        const cleanedUrl = cleanUrl(originalUrl, params); // 只能清除查询参数
        const highlightedUrl = highlightUrl(originalUrl, all);
        const canClean = params.length > 0; // 只有查询参数可以清除
        
        const overlay = document.createElement('div');
        overlay.className = 'aff-blocker-overlay';
        
        // 生成检测项显示
        const detectedItemsHtml = all.map(item => {
            const icon = item.type === 'path' ? '📁' : '🔗';
            const label = item.type === 'path' ? `路径: /${item.key}/` : `${item.key}=`;
            return `<span class="aff-blocker-detected-item">${icon} ${escapeHtml(label)}${escapeHtml(item.value)}</span>`;
        }).join('');
        
        // 清除按钮：如果有路径类型的推广链接，显示不同的提示
        const cleanBtnHtml = canClean
            ? `<button class="aff-blocker-btn aff-blocker-btn-primary" data-action="clean">
                    🧹 清除参数后访问
               </button>`
            : `<button class="aff-blocker-btn aff-blocker-btn-primary" data-action="clean" disabled style="opacity: 0.5; cursor: not-allowed;">
                    🧹 无法清除路径中的推广码
               </button>`;
        
        overlay.innerHTML = `
            <div class="aff-blocker-modal">
                <div class="aff-blocker-header">
                    <h2>
                        <span class="icon">⚠️</span>
                        检测到推广链接
                    </h2>
                </div>
                <div class="aff-blocker-body">
                    <div class="aff-blocker-info">
                        <div class="aff-blocker-info-label">目标链接</div>
                        <div class="aff-blocker-url">${highlightedUrl}</div>
                    </div>
                    <div class="aff-blocker-detected">
                        <div class="aff-blocker-detected-title">🔍 检测到的推广特征：</div>
                        <div class="aff-blocker-detected-list">
                            ${detectedItemsHtml}
                        </div>
                    </div>
                </div>
                <div class="aff-blocker-footer">
                    ${cleanBtnHtml}
                    <button class="aff-blocker-btn aff-blocker-btn-secondary" data-action="continue">
                        ➡️ 继续访问原链接
                    </button>
                    <button class="aff-blocker-btn aff-blocker-btn-cancel" data-action="cancel">
                        ✖️ 取消
                    </button>
                </div>
            </div>
        `;
        
        // 绑定事件
        overlay.addEventListener('click', (e) => {
            const action = e.target.dataset.action;
            const isDisabled = e.target.hasAttribute('disabled');
            
            if (action === 'clean' && !isDisabled && canClean) {
                window.open(cleanedUrl, '_blank');
                overlay.remove();
            } else if (action === 'continue') {
                window.open(originalUrl, '_blank');
                overlay.remove();
            } else if (action === 'cancel' || e.target === overlay) {
                overlay.remove();
            }
        });
        
        // 按 ESC 关闭
        const handleEsc = (e) => {
            if (e.key === 'Escape') {
                overlay.remove();
                document.removeEventListener('keydown', handleEsc);
            }
        };
        document.addEventListener('keydown', handleEsc);
        
        document.body.appendChild(overlay);
    }

    // ==================== 主逻辑 ====================
    
    /**
     * 处理链接点击
     */
    function handleLinkClick(e) {
        // 查找被点击的链接元素
        let target = e.target;
        while (target && target.tagName !== 'A') {
            target = target.parentElement;
        }
        
        if (!target || !target.href) return;
        
        const url = target.href;
        
        // 只检测外部链接
        if (!isExternalLink(url)) return;
        
        // 综合检测affiliate特征（参数和路径）
        const detection = detectAllAff(url);
        
        if (detection.hasAff) {
            e.preventDefault();
            e.stopPropagation();
            showWarningModal(url, detection);
        }
    }

    /**
     * 初始化脚本
     */
    function init() {
        // 使用捕获阶段以确保优先处理
        document.addEventListener('click', handleLinkClick, true);
        
        console.log('[Aff-Blocker] 已启动，正在监控推广链接...');
    }

    // 启动脚本
    init();

})();