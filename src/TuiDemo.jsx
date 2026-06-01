/* ============== typewriter TUI demo ============== */
import { useState, useEffect, useRef } from 'react';

// a scripted, realistic dsc session
const SCRIPT = [
  { t: "line", cls: "t-dim",   x: "~/projects/api   ⎇ main" },
  { t: "type", cls: "t-prompt",pre: "❯ ", x: 'dsc -p "add retry to fetchUser"', sp: 38 },
  { t: "gap", ms: 360 },
  { t: "line", x: "" },
  { t: "line", cls: "t-blue",  x: "deepseek-v4-pro", suffix: "  · thinking", thinking: true },
  { t: "line", cls: "t-dim",   x: "  ⟢ reading internal/client/user.go", ms: 240 },
  { t: "line", cls: "t-dim",   x: "  ⟢ found fetchUser at line 42", ms: 240 },
  { t: "line", cls: "t-dim",   x: "  ⟢ planning a 3-attempt backoff", ms: 300 },
  { t: "line", x: "" },
  { t: "line", cls: "t-white", x: "  edit  internal/client/user.go", ms: 200 },
  { t: "line", cls: "t-rule",  x: "  ────────────────────────────────" },
  { t: "line", cls: "t-del",   x: "  - func fetchUser(id string) (*User, error) {", ms: 90 },
  { t: "line", cls: "t-del",   x: "  -   return get(id)", ms: 90 },
  { t: "line", cls: "t-add",   x: "  + func fetchUser(id string) (*User, error) {", ms: 90 },
  { t: "line", cls: "t-add",   x: "  +   return retry(3, func() (*User, error) {", ms: 90 },
  { t: "line", cls: "t-add",   x: "  +     return get(id) })", ms: 90 },
  { t: "line", x: "" },
  { t: "line", cls: "t-green", x: "  ✓ applied · 1 file changed", ms: 220 },
  { t: "meter", ms: 260 },
  { t: "gap", ms: 4200 },
];

export function TuiDemo() {
  const [blocks, setBlocks] = useState([]);   // {key, cls, text, suffix, thinking}
  const [typing, setTyping] = useState(null); // {cls, pre, text}
  const [meter, setMeter] = useState(false);
  const aliveRef = useRef(true);
  const keyRef = useRef(0);

  useEffect(() => {
    aliveRef.current = true;
    const sleep = (ms) => new Promise((res) => {
      const id = setTimeout(res, ms);
      // store so we can clear on unmount via aliveRef check
      return id;
    });

    async function run() {
      while (aliveRef.current) {
        // reset
        setBlocks([]); setTyping(null); setMeter(false);
        await sleep(500);
        for (const step of SCRIPT) {
          if (!aliveRef.current) return;
          if (step.t === "gap") { await sleep(step.ms); continue; }
          if (step.t === "meter") { setMeter(true); await sleep(step.ms || 200); continue; }
          if (step.t === "line") {
            const k = keyRef.current++;
            setBlocks((b) => [...b, { key: k, cls: step.cls || "", text: step.x, suffix: step.suffix, thinking: step.thinking }]);
            await sleep(step.ms != null ? step.ms : 60);
            continue;
          }
          if (step.t === "type") {
            const full = step.x;
            for (let i = 0; i <= full.length; i++) {
              if (!aliveRef.current) return;
              setTyping({ cls: step.cls, pre: step.pre || "", text: full.slice(0, i) });
              await sleep(step.sp || 38);
            }
            // commit typed line into blocks
            const k = keyRef.current++;
            setBlocks((b) => [...b, { key: k, cls: step.cls, text: (step.pre || "") + full }]);
            setTyping(null);
            continue;
          }
        }
      }
    }
    run();
    return () => { aliveRef.current = false; };
  }, []);

  return (
    <div className="term" id="tui">
      <div className="term-bar">
        <span className="dots"><i></i><i></i><i></i></span>
        <span className="title">dsc — deepseekcode</span>
        <span className="badge">● live</span>
      </div>
      <div className="term-body">
        {blocks.map((b) => (
          <div className={"t-line " + (b.cls || "")} key={b.key}>
            {b.text}
            {b.suffix && <span className="t-dim">{b.suffix}</span>}
            {b.thinking && <span className="cursor" style={{ background: "var(--term-blue)", width: 7, height: 7, borderRadius: "50%", marginLeft: 8, transform: "translateY(0)" }}></span>}
          </div>
        ))}
        {typing && (
          <div className={"t-line " + (typing.cls || "")}>
            {typing.pre}{typing.text}<span className="cursor"></span>
          </div>
        )}
        {meter && (
          <div className="term-meter">
            <div className="m"><span className="k">prefix-cache</span><span className="v hi">95% hit</span></div>
            <div className="m"><span className="k">tokens</span><span className="v">3.2k</span></div>
            <div className="m"><span className="k">est. cost</span><span className="v hi">¥0.004</span></div>
            <div className="m"><span className="k">latency</span><span className="v">1.8s</span></div>
          </div>
        )}
      </div>
    </div>
  );
}
