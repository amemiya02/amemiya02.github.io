/* ============== app root ============== */
import { useState, useEffect } from 'react';
import { DSC_DATA } from './data.jsx';
import { Nav, Hero, Spec, Demo, Features, Install, Footer } from './sections.jsx';

export default function App() {
  const [lang, setLangState] = useState(() => {
    try { return localStorage.getItem("dsc-lang") || "zh"; } catch (e) { return "zh"; }
  });
  const setLang = (l) => {
    setLangState(l);
    try { localStorage.setItem("dsc-lang", l); } catch (e) {}
  };
  const t = DSC_DATA[lang];

  useEffect(() => {
    document.documentElement.lang = lang === "zh" ? "zh" : "en";
  }, [lang]);

  // reveal on scroll — robust scroll/rAF based check
  useEffect(() => {
    let raf = 0;
    const check = () => {
      raf = 0;
      const vh = window.innerHeight || document.documentElement.clientHeight;
      document.querySelectorAll(".reveal:not(.in)").forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < vh * 0.92 && r.bottom > 0) el.classList.add("in");
      });
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(check); };
    check();
    const t1 = setTimeout(check, 200);
    const t2 = setTimeout(check, 800);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      clearTimeout(t1); clearTimeout(t2); if (raf) cancelAnimationFrame(raf);
    };
  }, [lang]);

  return (
    <>
      <Nav t={t} lang={lang} setLang={setLang} />
      <Hero t={t} />
      <Spec t={t} />
      <Demo t={t} />
      <Features t={t} />
      <Install t={t} />
      <Footer t={t} />
    </>
  );
}
