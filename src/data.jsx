/* ============== content + icons (bilingual) ============== */

/* ---- minimal geometric icons ---- */
export const I = {
  think: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="12" cy="11" r="6.5" /><circle cx="12" cy="11" r="2.3" />
      <path d="M9 18.2c.7 1.2 1.8 1.9 3 1.9s2.3-.7 3-1.9" strokeLinecap="round" />
    </svg>
  ),
  cache: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="4" y="4.5" width="16" height="5" rx="1.4" /><rect x="4" y="14.5" width="16" height="5" rx="1.4" />
      <path d="M8 9.5v5M16 9.5v5" strokeLinecap="round" />
    </svg>
  ),
  model: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M12 3.5l8 4.7v7.6L12 20.5l-8-4.7V8.2z" strokeLinejoin="round" /><circle cx="12" cy="12" r="2.4" />
    </svg>
  ),
  repo: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8.5 5.5L4 12l4.5 6.5M15.5 5.5L20 12l-4.5 6.5" />
    </svg>
  ),
  session: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
      <rect x="4" y="6" width="16" height="12" rx="2" /><path d="M4 9.5h16" /><circle cx="6.6" cy="7.7" r=".5" fill="currentColor"/>
    </svg>
  ),
  extend: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="6" cy="6" r="2.2" /><circle cx="18" cy="6" r="2.2" /><circle cx="12" cy="18" r="2.2" />
      <path d="M7.6 7.6L11 15.8M16.4 7.6L13 15.8M8 6h8" strokeLinecap="round" />
    </svg>
  ),
  shield: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
      <path d="M12 3.5l7 2.6v5.2c0 4.2-3 7-7 8.7-4-1.7-7-4.5-7-8.7V6.1z" /><path d="M9 12l2.2 2.2L15 10" strokeLinecap="round"/>
    </svg>
  ),
  copy: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round">
      <rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15H4a1 1 0 01-1-1V4a1 1 0 011-1h10a1 1 0 011 1v1" />
    </svg>
  ),
  check: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 6.5"/></svg>),
  github: (<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 1.5a10.5 10.5 0 00-3.32 20.46c.52.1.71-.23.71-.5v-1.76c-2.89.63-3.5-1.4-3.5-1.4-.47-1.2-1.16-1.52-1.16-1.52-.95-.65.07-.64.07-.64 1.05.08 1.6 1.08 1.6 1.08.93 1.6 2.44 1.14 3.04.87.1-.68.36-1.14.66-1.4-2.31-.26-4.74-1.16-4.74-5.14 0-1.13.4-2.06 1.07-2.79-.11-.26-.46-1.32.1-2.75 0 0 .87-.28 2.85 1.06a9.9 9.9 0 015.2 0c1.98-1.34 2.85-1.06 2.85-1.06.56 1.43.21 2.49.1 2.75.67.73 1.07 1.66 1.07 2.79 0 3.99-2.43 4.87-4.75 5.13.37.32.7.95.7 1.92v2.85c0 .28.19.61.72.5A10.5 10.5 0 0012 1.5z"/></svg>),
  arrow: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>),
  star: (<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 18.4 6.1 21l1.2-6.5L2.5 9.9l6.6-.9z"/></svg>),
  bolt: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"><path d="M13 3l-7 9h5l-1 9 7-10h-5z"/></svg>),
  terminal: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8l3.5 3.5L6 15M12.5 15.5H18"/></svg>),
};

export const DSC_LOGO = (
  <svg className="glyph" viewBox="27 30 44 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M33 36 L49 50 L33 64" stroke="#4d6bfe" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M47 36 L63 50 L47 64" stroke="#4d6bfe" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" opacity="0.5"/>
  </svg>
);

export const DSC_DATA = {
  zh: {
    nav: { features: "特性", spec: "DeepSeek 特化", demo: "演示", install: "安装", docs: "文档" },
    hero: {
      eyebrow: "DeepSeek 原生 · 终端编码代理",
      title: ["为 DeepSeek 而生的", "终端编码代理"],
      lead: "deepseekcode 是一个常驻终端的编码代理，深度适配 DeepSeek 模型——内建思考过程、长上下文与前缀缓存计量。单个 Go 二进制 dsc，开箱即用。",
      installCmd: "curl -fsSL https://…/install.sh | sh",
      ctaPrimary: "快速安装",
      ctaSecondary: "在 GitHub 查看",
      trust: ["MIT 开源", "单二进制 · 零依赖", "macOS · Linux · Windows"],
    },
    spec: {
      eyebrow: "深度特化",
      title: "不是又一个通用代理，而是为 DeepSeek 调校",
      lead: "围绕 DeepSeek 的能力做了一等公民级的适配，让每一次会话都更快、更省、更可控。",
      cards: [
        { icon: "think", tag: "thinking", title: "原生思考过程", desc: "默认开启 thinking 与长上下文，模型的推理链路在 TUI 中实时可见——你能看懂它为什么这么改，而非盲信结果。" },
        { icon: "cache", tag: "prefix-cache", title: "前缀缓存省钱", desc: "针对 DeepSeek 前缀缓存优化的对话循环，长会话里重复前缀几乎零成本。命中率、token、花费实时计量。", viz: true },
        { icon: "model", tag: "v4-flash / pro", title: "双模型路由", desc: "deepseek-v4-flash 求快，deepseek-v4-pro 守关键操作；破坏性动作走 Pro 校验，安全与速度兼得。", models: true },
      ],
    },
    demo: {
      eyebrow: "实时演示",
      title: "一行命令，看它把活干完",
      lead: "下面是一段真实风格的 dsc 会话——读取仓库、给出思考、提出 SEARCH/REPLACE 编辑、应用并报告缓存命中。",
    },
    features: {
      eyebrow: "核心能力",
      title: "一个终端，装下完整工作流",
      lead: "交互式 TUI 与可脚本化的一次性模式，配齐仓库工具、持久会话、可扩展性与保守的权限模型。",
      cards: [
        { icon: "repo", title: "仓库工具", desc: "文件读写与补丁、shell 命令、git、grep、LSP 查询、网页抓取/搜索，以及向你提问。", chips: ["edit", "patch", "git", "grep", "lsp", "web"] },
        { icon: "session", title: "持久会话", desc: "基于 SQLite 的项目会话，支持续接、分支、滚动历史导出，以及对最近编辑的 /undo。", chips: ["resume", "branch", "/undo", "export"] },
        { icon: "extend", title: "可扩展", desc: "自定义斜杠命令、SKILL.md 自动发现、MCP 工具、子代理，以及隔离的 git worktree。", chips: ["MCP", "skills", "subagents", "worktrees"] },
        { icon: "shield", title: "安全与权限", desc: "只读模式、工具前询问、自动批准、密钥路径检查、bash 白名单、可选沙箱与 Pro 校验。", chips: ["read-only", "ask", "sandbox", "allowlist"] },
      ],
    },
    install: {
      eyebrow: "开始使用",
      title: "安装 dsc",
      lead: "选择任一方式安装，配置 DEEPSEEK_API_KEY 后即可开始使用。",
      quickstartTitle: "快速上手",
      quickstart: [
        { cmd: "dsc", desc: "打开交互式 TUI" },
        { cmd: 'dsc -p "总结这个仓库"', desc: "跑一条 prompt 后退出" },
        { cmd: "dsc --read-only", desc: "只看不改地探索" },
        { cmd: "dsc init", desc: "生成项目配置" },
        { cmd: "dsc doctor", desc: "检查本地环境" },
      ],
      reqTitle: "环境要求",
      req: ["设置 <code>DEEPSEEK_API_KEY</code>，或在 config.toml 配置其他兼容供应商。", "从源码构建需 Go（版本匹配 go.mod 或更新）。", "Git 与语言服务器可选，但能提供更丰富的仓库上下文。"],
    },
    footer: {
      tagline: "为 DeepSeek 而生的终端编码代理。单个 Go 二进制，MIT 开源。",
      cols: [
        { h: "产品", links: [["特性", "#features"], ["DeepSeek 特化", "#spec"], ["实时演示", "#demo"], ["安装", "#install"]] },
        { h: "文档", links: [["配置", "#"], ["供应商", "#"], ["工具", "#"], ["权限与沙箱", "#"], ["MCP / 技能", "#"]] },
        { h: "社区", links: [["GitHub", "https://github.com/amemiya02/deepseekcode"], ["Releases", "#"], ["Issues", "#"], ["贡献指南", "#"]] },
      ],
      rights: "MIT License · © 2026 deepseekcode",
    },
  },
  en: {
    nav: { features: "Features", spec: "DeepSeek", demo: "Demo", install: "Install", docs: "Docs" },
    hero: {
      eyebrow: "DeepSeek-native · terminal coding agent",
      title: ["The coding agent built", "for DeepSeek"],
      lead: "deepseekcode is a terminal coding agent tuned for DeepSeek models — with built-in thinking, long context, and prefix-cache metering. One Go binary, dsc, ready out of the box.",
      installCmd: "curl -fsSL https://…/install.sh | sh",
      ctaPrimary: "Install now",
      ctaSecondary: "View on GitHub",
      trust: ["MIT licensed", "Single binary · zero deps", "macOS · Linux · Windows"],
    },
    spec: {
      eyebrow: "Deeply specialized",
      title: "Not another generic agent — tuned for DeepSeek",
      lead: "First-class adaptation to DeepSeek's strengths, so every session is faster, cheaper, and more controllable.",
      cards: [
        { icon: "think", tag: "thinking", title: "Native thinking", desc: "Thinking is on by default — the model's reasoning streams live in the TUI, so you see why it edits, not just what." },
        { icon: "cache", tag: "prefix-cache", title: "Prefix-cache savings", desc: "A loop tuned for DeepSeek's prefix cache makes repeated context nearly free over long sessions. Hit rate, tokens, and cost are metered live.", viz: true },
        { icon: "model", tag: "v4-flash / pro", title: "Dual-model routing", desc: "deepseek-v4-flash for speed, deepseek-v4-pro to guard critical work. Destructive actions run Pro validation — safe and fast.", models: true },
      ],
    },
    demo: {
      eyebrow: "Live demo",
      title: "One command, watch it ship",
      lead: "A realistic dsc session — read the repo, show its thinking, propose a SEARCH/REPLACE edit, apply it, and report the cache hit.",
    },
    features: {
      eyebrow: "Core capabilities",
      title: "One terminal, the whole workflow",
      lead: "An interactive TUI and a scriptable one-shot mode, with repository tools, persistent sessions, extensibility, and a conservative permission model.",
      cards: [
        { icon: "repo", title: "Repository tools", desc: "File reads/edits and patches, shell commands, git, grep, LSP queries, web fetch/search, and asking you questions.", chips: ["edit", "patch", "git", "grep", "lsp", "web"] },
        { icon: "session", title: "Persistent sessions", desc: "SQLite-backed project sessions with resume, branching, scrollback export, and /undo for recent edits.", chips: ["resume", "branch", "/undo", "export"] },
        { icon: "extend", title: "Extensible", desc: "Custom slash commands, SKILL.md discovery, MCP tools, subagents, and isolated git worktrees.", chips: ["MCP", "skills", "subagents", "worktrees"] },
        { icon: "shield", title: "Safety & permissions", desc: "Read-only mode, ask-before-tool, auto-approve, secret path checks, bash allowlists, optional sandboxing, and Pro validation.", chips: ["read-only", "ask", "sandbox", "allowlist"] },
      ],
    },
    install: {
      eyebrow: "Get started",
      title: "Install dsc",
      lead: "Choose any method below, set DEEPSEEK_API_KEY, and start using it.",
      quickstartTitle: "Quick start",
      quickstart: [
        { cmd: "dsc", desc: "open the TUI" },
        { cmd: 'dsc -p "summarize this repo"', desc: "run one prompt and exit" },
        { cmd: "dsc --read-only", desc: "inspect without writing" },
        { cmd: "dsc init", desc: "create project config" },
        { cmd: "dsc doctor", desc: "check local setup" },
      ],
      reqTitle: "Requirements",
      req: ["Set <code>DEEPSEEK_API_KEY</code>, or configure another compatible provider in config.toml.", "Building from source needs Go (matching go.mod or newer).", "Git and language servers are optional but enable richer repository context."],
    },
    footer: {
      tagline: "The terminal coding agent built for DeepSeek. One Go binary, MIT licensed.",
      cols: [
        { h: "Product", links: [["Features", "#features"], ["DeepSeek", "#spec"], ["Live demo", "#demo"], ["Install", "#install"]] },
        { h: "Docs", links: [["Configuration", "#"], ["Providers", "#"], ["Tools", "#"], ["Permissions & sandbox", "#"], ["MCP / Skills", "#"]] },
        { h: "Community", links: [["GitHub", "https://github.com/amemiya02/deepseekcode"], ["Releases", "#"], ["Issues", "#"], ["Contributing", "#"]] },
      ],
      rights: "MIT License · © 2026 deepseekcode",
    },
  },
};

export const INSTALL_METHODS = [
  { id: "curl", name: "curl", lines: [["c", "# macOS / Linux"], ["p", "curl -fsSL https://raw.githubusercontent.com/\\\n  amemiya02/deepseekcode/main/install.sh | sh"]] },
  { id: "brew", name: "Homebrew", lines: [["p", "brew install amemiya02/deepseekcode/deepseekcode"]] },
  { id: "scoop", name: "Scoop", lines: [["p", "scoop bucket add deepseekcode \\\n  https://github.com/amemiya02/deepseekcode-scoop"], ["p", "scoop install deepseekcode"]] },
  { id: "go", name: "Go", lines: [["p", "go install github.com/amemiya02/\\\n  deepseekcode/cmd/dsc@latest"]] },
  { id: "src", name: "源码 / Source", lines: [["p", "git clone https://github.com/amemiya02/deepseekcode"], ["p", "cd deepseekcode && make build"], ["p", "./bin/dsc -version"]] },
];
