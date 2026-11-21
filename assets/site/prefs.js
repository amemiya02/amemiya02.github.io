/* Language (en / zh) and theme (dark / light) switches for the home page.
   The theme and language are first set by the inline script in <head> (no flash); this file runs at the end of
   <body>, before the module scripts, so the text is already in the chosen language when motion.js and the
   moments read it.
   Markup:  data-i18n="key"                 the element's innerHTML
            data-i18n-attr="attr=key;..."   attributes (aria-label, alt, title)
   English is read from the page itself; only Chinese is listed here. */
(function () {
  'use strict';
  var root = document.documentElement;

  var ZH = {
    'meta.title': 'Ame：适用于桌面、Android 和 iPhone 的开源应用',
    'meta.desc': 'Hayaki、OpenDict、MINT、NimGet 和 SSH Astra：适用于 Android 和 iPhone 的 Anki 记忆卡，以及适用于 Windows、macOS 和 Linux 的 MDict 阅读器、Markdown 编辑器、下载管理器和 SSH 客户端。',

    'prefs.lang': '切换到英文',
    'prefs.langShort': 'EN',
    'prefs.toLight': '切换到亮色主题',
    'prefs.toDark': '切换到暗色主题',

    'nav.skip': '跳到正文',
    'nav.main': '主导航',
    'nav.menu': '菜单',
    'nav.projects': '项目',
    'cta.repos': '查看全部仓库',

    'icon.hayaki': 'Hayaki 应用图标',
    'icon.opendict': 'OpenDict 应用图标',
    'icon.mint': 'MINT 应用图标',
    'icon.nimget': 'NimGet 应用图标',
    'icon.astra': 'SSH Astra 应用图标',
    'menu.hayaki': '适用于 Android 和 iPhone 的 Anki 记忆卡',
    'menu.opendict': 'MDict 词典阅读器',
    'menu.mint': '带实时预览的 Markdown 编辑器',
    'menu.nimget': '用 Go 编写的下载管理器',
    'menu.astra': 'SSH 与 SFTP 客户端',

    'hero.h': '开源的桌面<br>与手机应用',
    'hero.lead': '适用于 Android 和 iPhone 的 Anki 记忆卡，以及桌面上的词典阅读器、Markdown 编辑器、下载管理器和 SSH 客户端。五款应用的源码都在 GitHub 上。',
    'hero.collage': '五款应用的片段：Android 和 iPhone 上的 Hayaki、在 MINT 中打开的笔记、在 OpenDict 中查到的单词、带终端和文件的 SSH Astra 窗口，以及 NimGet 的下载队列',

    'hy.h': 'Hayaki，离线使用 Anki 牌组的记忆卡应用',
    'hy.p': '没有网络也能学习你的 Anki 卡片集。每张卡片何时再出现由 Anki 自己的调度算法决定，可与 AnkiWeb 或你自己的服务器同步。',
    'hy.a.h': '支持 Android 7.0 及以上版本',
    'hy.a.p': '0.2.0 版本基于 AnkiDroid，界面用 Jetpack Compose 重写，可与 AnkiDroid 同时安装。',
    'hy.a.link': '下载 Android 版 Hayaki',
    'hy.a.aria': 'Android 上的 Hayaki：牌组页面显示今天有 9 张卡片待学习，以及一张带四个评分按钮的地理题答案',
    'hy.i.h': '支持运行 iOS 26 的 iPhone 和 iPad',
    'hy.i.p': '围绕 Anki Rust 内核构建的原生 SwiftUI 应用。用 Xcode 编译后安装到你的设备上。',
    'hy.i.link': '查看 iOS 编译步骤',
    'hy.i.aria': 'iPhone 上的 Hayaki：一张带公式和四个玻璃质感评分按钮的卡片，以及暗色主题下的统计页面',

    'od.h': 'OpenDict，你的 MDict 词典阅读器',
    'od.lead': '输入一次单词，组内每本词典都在同一页给出释义，每个词条保留各自的排版。',
    'od.p': '在其他应用中选中一个词并按下快捷键，迷你窗口就会在旁边显示词条。收藏的单词会存入生词本。',
    'od.li1': '打开你自己的 .mdx 和 .mdd 文件',
    'od.li2': 'Windows、macOS 和 Linux，可在应用内更新',
    'od.li3': 'GPL-3.0，版本 0.1.2',
    'od.link': '在 GitHub 上查看 OpenDict',
    'od.aria': '在 OpenDict 中查询 ephemeral 一词，英语、日语和汉语词典、同义词词典和词源词典的结果显示在同一页',

    'mint.h': 'MINT，带实时预览的 Markdown 编辑器',
    'mint.p': 'Markdown 边写边渲染，光标所在处的语法会还原出来供你编辑。保存时，你没改动的部分逐字节保持原样。0.3.3 版本，内置 24 款主题。',
    'mint.link': '在 GitHub 上查看 MINT',
    'mint.aria': 'MINT 窗口：左侧是笔记文件夹，右侧打开了 quick-start.md，渲染出标题、任务列表和快捷键表格',

    'astra.h': 'SSH Astra，桌面 SSH 与 SFTP 客户端',
    'astra.s1.h': '主机、终端和文件都在一个窗口里',
    'astra.s1.p': '主机按分组排列，可从 SSH 配置导入。文件面板会跟随终端里的 cd 切换目录，并排队处理上传。',
    'astra.s1.alt': 'SSH Astra 中主机分为 Production、Staging 和 Homelab 三组，web-01 的终端里是 git log，右侧是它的文件',
    'astra.s2.h': '终端可拆分为多个窗格',
    'astra.s2.p': '标签页和分屏窗格基于 xterm.js 和 WebGL。断开的连接会自动重连。',
    'astra.s2.alt': 'SSH Astra 的终端拆成两个窗格，左边是 git log，右边是 htop',
    'astra.s3.h': '支持本地、远程和 SOCKS5 转发',
    'astra.s3.p': '转发可以在连接时自动启动。密钥保存在系统钥匙串中，已知主机与 OpenSSH 共用。',
    'astra.s3.alt': 'SSH Astra 的端口转发页面，经由 api-01 运行着一个本地、一个远程和一个 SOCKS5 转发',
    'astra.p': '0.2.0 版本，支持 Windows、macOS 和 Linux，基于 Tauri 和 Rust 构建。',
    'astra.link': '在 GitHub 上查看 SSH Astra',

    'ng.h': 'NimGet，用 Go 编写的下载管理器',
    'ng.p': '每个文件最多 32 个连接，程序崩溃后也能从断开的字节处续传。在项目的本地回环测试中，它下载 512 MiB 用时 1.24 秒，aria2 用时 3.97 秒。1.4.6 版本支持 Windows 和 macOS。',
    'ng.link': '在 GitHub 上查看 NimGet',
    'ng.aria': 'NimGet 下载队列：一个 ISO 通过 32 个连接下载到 64%，一个来自 38 个节点的磁力下载，一个定时的 HLS 课程视频和两个已完成的安装包',
    'ng.f1.h': '按优先级排队下载',
    'ng.f1.p': '按主机限制连接、限速和定时下载。',
    'ng.f2.h': '接管 Chrome 和 Edge 的下载',
    'ng.f2.p': '浏览器扩展会把链接和会话交给应用。',
    'ng.f3.h': '支持磁力链接和 HLS',
    'ng.f3.p': '支持 BitTorrent v1 和 v2；HLS 保存为 MP4。',
    'ng.f4.h': '在 Linux 上以命令行运行',
    'ng.f4.p': '它的命令也能控制桌面应用。',

    'close.h': '每款应用都开源',
    'close.lead': '欢迎提交 Issue 和 Pull Request。',
    'foot.lede': '用 Kotlin、Swift、Rust、Go 和 TypeScript 编写的应用。',
    'foot.apps': '应用',
    'foot.releases': '发布',
    'foot.android': 'Android 源码',
    'foot.ios': 'iOS 源码',
    'foot.profile': '主页',
    'foot.stars': '星标',
    'foot.legal': '&copy; 2026 Ame · 产品名称和标志归各自所有者所有'
  };
  var EN_EXTRA = { 'prefs.toLight': 'Switch to light theme', 'prefs.toDark': 'Switch to dark theme' };

  function store(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

  /* English as written in the page, read once before anything is translated */
  var metaDesc = document.querySelector('meta[name="description"]');
  var EN = { 'meta.title': document.title, 'meta.desc': metaDesc ? metaDesc.content : '' };
  for (var k in EN_EXTRA) EN[k] = EN_EXTRA[k];
  var htmlNodes = [].slice.call(document.querySelectorAll('[data-i18n]'));
  var attrNodes = [].slice.call(document.querySelectorAll('[data-i18n-attr]'));
  function pairs(el) {
    return el.getAttribute('data-i18n-attr').split(';').map(function (s) { var p = s.split('='); return [p[0].trim(), (p[1] || '').trim()]; });
  }
  htmlNodes.forEach(function (el) { var key = el.getAttribute('data-i18n'); if (!(key in EN)) EN[key] = el.innerHTML; });
  attrNodes.forEach(function (el) { pairs(el).forEach(function (p) { if (!(p[1] in EN)) EN[p[1]] = el.getAttribute(p[0]) || ''; }); });

  function lang() { return /^zh/i.test(root.lang) ? 'zh' : 'en'; }
  function t(key) { var d = lang() === 'zh' ? ZH : EN; return key in d ? d[key] : EN[key]; }

  function applyLang() {
    htmlNodes.forEach(function (el) { var v = t(el.getAttribute('data-i18n')); if (v != null && el.innerHTML !== v) el.innerHTML = v; });
    attrNodes.forEach(function (el) { pairs(el).forEach(function (p) { var v = t(p[1]); if (v != null) el.setAttribute(p[0], v); }); });
    document.title = t('meta.title');
    if (metaDesc) metaDesc.content = t('meta.desc');
    /* motion.js splits the h1 into words at spaces for its entrance; Chinese has none, so it rises whole */
    var h1 = document.getElementById('hero-h');
    if (h1) { if (lang() === 'zh') h1.setAttribute('data-enter-whole', ''); else h1.removeAttribute('data-enter-whole'); }
    applyThemeLabel();
  }

  /* ---------------------------------------------------------------- theme */
  var themeBtn = document.querySelector('[data-pref="theme"]');
  var themeMeta = document.querySelector('meta[name="theme-color"]');
  function theme() { return root.dataset.theme === 'light' ? 'light' : 'dark'; }
  function applyThemeLabel() {
    if (!themeBtn) return;
    var label = t(theme() === 'dark' ? 'prefs.toLight' : 'prefs.toDark');
    themeBtn.setAttribute('aria-label', label);
    themeBtn.setAttribute('title', label);
  }
  function applyTheme() {
    root.dataset.tone = theme();   /* system.css keys the dark footer on this; system.js sets it once on load */
    if (themeMeta) themeMeta.content = theme() === 'light' ? '#f6f6f4' : '#18191b';
    applyThemeLabel();
  }

  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-pref]');
    if (!b) return;
    if (b.dataset.pref === 'lang') {
      var next = lang() === 'zh' ? 'en' : 'zh';
      root.lang = next === 'zh' ? 'zh-CN' : 'en';
      store('ame-lang', next);
      applyLang();
    } else if (b.dataset.pref === 'theme') {
      root.dataset.theme = theme() === 'dark' ? 'light' : 'dark';
      store('ame-theme', root.dataset.theme);
      applyTheme();
    }
  });

  applyLang();
  applyTheme();
})();
