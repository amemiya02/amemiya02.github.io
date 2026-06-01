/* ============== page sections ============== */
import { useState, useEffect } from 'react';
import { I, DSC_LOGO, INSTALL_METHODS } from './data.jsx';
import { TuiDemo } from './TuiDemo.jsx';

/* wrap every "DeepSeek" in a blue brand span */
function hlDS(text) {
  if (typeof text !== "string" || text.indexOf("DeepSeek") === -1) return text;
  const out = [];
  text.split("DeepSeek").forEach((p, i) => {
    if (i) out.push(<span className="ds" key={"d" + i}>DeepSeek</span>);
    if (p) out.push(p);
  });
  return out;
}

const Wordmark = () => <span className="wm">deepseek<i className="wm-code">code</i></span>;

function CopyBtn({ text, variant }) {
  const [done, setDone] = useState(false);
  const onCopy = () => {
    try {navigator.clipboard.writeText(text);} catch (e) {}
    setDone(true);setTimeout(() => setDone(false), 1500);
  };
  if (variant === "cb") {
    return (
      <button className={"cb-copy" + (done ? " done" : "")} onClick={onCopy}>
        {done ? I.check : I.copy}{done ? "copied" : "copy"}
      </button>);

  }
  return (
    <button className={"copy-btn" + (done ? " done" : "")} onClick={onCopy} aria-label="copy">
      {done ? I.check : I.copy}
    </button>);

}

/* ---------- NAV ---------- */
export function Nav({ t, lang, setLang }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <nav className={"nav" + (scrolled ? " scrolled" : "")}>
      <div className="wrap nav-inner">
        <a href="#top" className="brand">{DSC_LOGO}<Wordmark /><span className="dsc">dsc</span></a>
        <div className="nav-links">
          <a href="#spec">{t.nav.spec}</a>
          <a href="#demo">{t.nav.demo}</a>
          <a href="#features">{t.nav.features}</a>
          <a href="#install">{t.nav.install}</a>
        </div>
        <div className="nav-right">
          <div className="lang-toggle">
            <button className={lang === "zh" ? "on" : ""} onClick={() => setLang("zh")} style={{ fontFamily: "\"JetBrains Mono\"" }}>中</button>
            <button className={lang === "en" ? "on" : ""} onClick={() => setLang("en")}>EN</button>
          </div>
          <a className="gh-link" href="https://github.com/amemiya02/deepseekcode" target="_blank" rel="noopener">
            {I.github}<span>GitHub</span>
          </a>
        </div>
      </div>
    </nav>);

}

/* ---------- HERO ---------- */
export function Hero({ t }) {
  return (
    <header className="hero" id="top">
      <div className="hero-bg"><div className="dots"></div><div className="glow"></div></div>
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <span className="eyebrow"><span className="dot"></span>{t.hero.eyebrow}</span>
          <h1 className="h-display">{hlDS(t.hero.title[0])}<br />{hlDS(t.hero.title[1])}</h1>
          <p className="lead">{hlDS(t.hero.lead)}</p>
          <div className="install-line">
            <span className="prompt">$</span>
            <code>{t.hero.installCmd}</code>
            <CopyBtn text="curl -fsSL https://raw.githubusercontent.com/amemiya02/deepseekcode/main/install.sh | sh" />
          </div>
          <div className="hero-cta">
            <a className="btn btn-primary" href="#install">{t.hero.ctaPrimary}{I.arrow}</a>
            <a className="btn btn-ghost" href="https://github.com/amemiya02/deepseekcode" target="_blank" rel="noopener">{I.github}{t.hero.ctaSecondary}</a>
          </div>
          <div className="trust-row">
            {t.hero.trust.map((x, i) => <span className="ti" key={i}>{I.check}{x}</span>)}
          </div>
        </div>
        <div className="hero-term"><TuiDemo /></div>
      </div>
    </header>);

}

/* ---------- SPEC (DeepSeek specialization) ---------- */
export function Spec({ t }) {
  return (
    <section className="section band" id="spec">
      <div className="wrap">
        <div className="reveal">
          <span className="eyebrow"><span className="dot"></span>{t.spec.eyebrow}</span>
          <h2 className="h-section" style={{ marginTop: 18 }}>{hlDS(t.spec.title)}</h2>
          <p className="lead" style={{ marginTop: 16, maxWidth: 820 }}>{hlDS(t.spec.lead)}</p>
        </div>
        <div className="spec-grid">
          {t.spec.cards.map((c, i) =>
          <div className="spec-card reveal" key={i} style={{ transitionDelay: i * 70 + "ms" }}>
              <span className="tag">{c.tag}</span>
              <div className="ic">{I[c.icon]}</div>
              <h3>{c.title}</h3>
              <p>{hlDS(c.desc)}</p>
              {c.viz &&
            <div className="cache-viz">
                  <div className="bar"><span className="fresh" style={{ width: "5%" }}></span><span className="cached" style={{ width: "95%" }}></span></div>
                  <div className="legend"><span>fresh tokens</span><span><b>95%</b> cache hit</span></div>
                </div>
            }
              {c.models &&
            <div className="model-pills">
                  <span className="model-pill"><span className="led flash"></span>deepseek-v4-flash</span>
                  <span className="model-pill"><span className="led pro"></span>deepseek-v4-pro</span>
                </div>
            }
              {c.icon === "think" &&
            <div className="think-line"><span className="pulse"></span>reasoning streamed live</div>
            }
            </div>
          )}
        </div>
      </div>
    </section>);

}

/* ---------- DEMO ---------- */
export function Demo({ t }) {
  return (
    <section className="section" id="demo">
      <div className="wrap">
        <div className="reveal" style={{ textAlign: "center", maxWidth: 640, margin: "0 auto" }}>
          <span className="eyebrow"><span className="dot"></span>{t.demo.eyebrow}</span>
          <h2 className="h-section" style={{ marginTop: 18 }}>{t.demo.title}</h2>
          <p className="lead" style={{ marginTop: 16, marginInline: "auto" }}>{t.demo.lead}</p>
        </div>
        <div className="reveal" style={{ maxWidth: 820, margin: "44px auto 0" }}>
          <TuiDemo />
        </div>
      </div>
    </section>);

}

/* ---------- FEATURES ---------- */
export function Features({ t }) {
  return (
    <section className="section band" id="features">
      <div className="wrap">
        <div className="feat-head reveal">
          <span className="eyebrow"><span className="dot"></span>{t.features.eyebrow}</span>
          <h2 className="h-section" style={{ marginTop: 18 }}>{t.features.title}</h2>
          <p className="lead" style={{ marginTop: 16, maxWidth: 820 }}>{hlDS(t.features.lead)}</p>
        </div>
        <div className="feat-grid">
          {t.features.cards.map((c, i) =>
          <div className="feat reveal" key={i} style={{ transitionDelay: i % 2 * 80 + "ms" }}>
              <div className="ic">{I[c.icon]}</div>
              <h3>{c.title}</h3>
              <p>{hlDS(c.desc)}</p>
              <div className="chips">{c.chips.map((ch, j) => <span key={j}>{ch}</span>)}</div>
            </div>
          )}
        </div>
      </div>
    </section>);

}

/* ---------- INSTALL ---------- */
export function Install({ t }) {
  const [tab, setTab] = useState("curl");
  const method = INSTALL_METHODS.find((m) => m.id === tab);
  const plain = method.lines.map((l) => l[1].replace(/\\\n\s*/g, " ")).join("\n");
  return (
    <section className="section" id="install">
      <div className="wrap">
        <div className="reveal" style={{ maxWidth: 620 }}>
          <span className="eyebrow"><span className="dot"></span>{t.install.eyebrow}</span>
          <h2 className="h-section" style={{ marginTop: 18 }}>{t.install.title}</h2>
          <p className="lead" style={{ marginTop: 16 }}>{hlDS(t.install.lead)}</p>
        </div>
        <div className="install-wrap">
          <div className="reveal">
            <div className="tabs">
              {INSTALL_METHODS.map((m) =>
              <button key={m.id} className={tab === m.id ? "on" : ""} onClick={() => setTab(m.id)}>{m.name}</button>
              )}
            </div>
            <div className="code-block">
              <div className="cb-head"><span className="name">{method.name}</span><CopyBtn text={plain} variant="cb" /></div>
              <div className="cb-body">{method.lines.map((l, i) =>
                <div key={i} className={l[0] === "c" ? "c" : ""}>{l[0] === "p" ? <span className="p">$ </span> : null}{l[1]}</div>
                )}</div>
            </div>
            <div className="req">
              <span className="kicker">{t.install.reqTitle}</span>
              <ul>{t.install.req.map((r, i) => <li key={i} dangerouslySetInnerHTML={{ __html: r }} />)}</ul>
            </div>
          </div>
          <div className="quickstart reveal" style={{ transitionDelay: "90ms" }}>
            <h3>{t.install.quickstartTitle}</h3>
            <div className="qs-list">
              {t.install.quickstart.map((q, i) =>
              <div className="qs-item" key={i}><code>{q.cmd}</code><span className="desc">{q.desc}</span></div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>);

}

/* ---------- FOOTER ---------- */
export function Footer({ t }) {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="foot-grid">
          <div className="foot-brand">
            <span className="brand">{DSC_LOGO}<Wordmark /></span>
            <p>{hlDS(t.footer.tagline)}</p>
          </div>
          {t.footer.cols.map((col, i) =>
          <div className="foot-col" key={i}>
              <h4>{col.h}</h4>
              {col.links.map((lk, j) => <a key={j} href={lk[1]} target={lk[1].startsWith("http") ? "_blank" : undefined} rel="noopener">{lk[0]}</a>)}
            </div>
          )}
        </div>
        <div className="foot-bottom">
          <span className="mono">{t.footer.rights}</span>
          <span className="mono">made for DeepSeek · dsc</span>
        </div>
      </div>
    </footer>);

}
