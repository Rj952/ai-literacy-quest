"use client";
import { useState, useEffect, useCallback, useRef } from "react";

/* ═══════════════════════════════════════════════════════════════
   AI LITERACY QUEST — WCAG 2.1 AA Accessible Board Game
   Dr. Rohan Jowallah, Ed.D., FHEA
   Frameworks: CARE · CRAFT · ACRE
   v2 — Desktop-friendly, Mobile-responsive, Animated pieces
   ═══════════════════════════════════════════════════════════════ */

const CARE_QS = [
  { fw:"CARE", ph:"Consider", q:"Before using an AI tool, what is the MOST important thing to consider?", opts:["The AI's speed","The purpose and potential impact of using AI","The cost of the AI tool","The AI's popularity"], ans:1, tok:15 },
  { fw:"CARE", ph:"Analyze", q:"When analyzing AI-generated content, which approach best demonstrates critical thinking?", opts:["Accept it immediately","Cross-reference with credible sources and check for bias","Share it without reading fully","Ignore it entirely"], ans:1, tok:15 },
  { fw:"CARE", ph:"Reflect", q:"Reflection in AI literacy means:", opts:["Using AI to write reflections for you","Evaluating your own assumptions and biases when working with AI","Memorizing AI outputs","Avoiding AI altogether"], ans:1, tok:15 },
  { fw:"CARE", ph:"Evaluate", q:"Which criteria should you use to evaluate an AI-generated response?", opts:["Length and formatting only","Whether it confirms your beliefs","Accuracy, relevance, completeness, and equity","Speed of generation"], ans:2, tok:20 },
  { fw:"CARE", ph:"Consider", q:"In the Caribbean education context, what should educators CONSIDER before deploying AI tools?", opts:["Only cost","Digital equity, internet access, and cultural relevance","Whether other countries use it","Student age only"], ans:1, tok:20 },
  { fw:"CARE", ph:"Analyze", q:"Analyzing AI bias requires you to:", opts:["Trust developers removed all bias","Examine training data, outputs, and societal impact","Use AI more frequently","Ignore edge cases"], ans:1, tok:15 },
  { fw:"CARE", ph:"Reflect", q:"When reflecting on AI use in your classroom, you should ask:", opts:["Did AI save me time?","How did AI influence student learning and equity?","Is AI popular with students?","Did the AI make errors?"], ans:1, tok:15 },
  { fw:"CARE", ph:"Evaluate", q:"Evaluating AI tools for Caribbean classrooms should include:", opts:["Checking if it works in English only","Assessing cultural relevance, accessibility, and digital equity","User ratings online","Checking price only"], ans:1, tok:20 },
];
const CRAFT_QS = [
  { fw:"CRAFT", ph:"Context", q:"In the CRAFT framework, 'Context' refers to:", opts:["The color scheme of your prompt","Background information that helps AI understand your situation","The word count of your prompt","The AI model version"], ans:1, tok:15 },
  { fw:"CRAFT", ph:"Role", q:"When you assign a 'Role' in a CRAFT prompt, you are:", opts:["Telling the AI what expert perspective to adopt","Naming your AI tool","Choosing a font for output","Selecting the AI's language"], ans:0, tok:15 },
  { fw:"CRAFT", ph:"Action", q:"The 'Action' element of CRAFT specifies:", opts:["How fast the AI should respond","Exactly what task you want the AI to perform","The AI's training data","Your login credentials"], ans:1, tok:15 },
  { fw:"CRAFT", ph:"Format", q:"Specifying 'Format' in your prompt helps AI to:", opts:["Respond in any style it chooses","Structure its output in a specific, useful way","Generate images","Run faster"], ans:1, tok:15 },
  { fw:"CRAFT", ph:"Threshold", q:"The 'Threshold' in CRAFT prompting refers to:", opts:["The minimum acceptable quality or specificity of the AI response","How loud your speaker is","The AI's power usage","The time limit for your session"], ans:0, tok:20 },
  { fw:"CRAFT", ph:"Context", q:"A well-crafted AI prompt using CRAFT would:", opts:["Be as short as possible","Provide clear context, define role, specify action, format, and quality threshold","Use emojis only","Avoid mentioning the purpose"], ans:1, tok:20 },
  { fw:"CRAFT", ph:"Role", q:"Which is the best 'Role' for a Caribbean education prompt?", opts:["Act as a random person","Act as an experienced Caribbean education specialist","Act as a robot","Act as my friend"], ans:1, tok:15 },
  { fw:"CRAFT", ph:"Action", q:"A strong 'Action' in CRAFT would be:", opts:["Do something","Create a 500-word lesson plan with Bloom's-aligned outcomes","Help me","Write stuff"], ans:1, tok:20 },
];
const ACRE_QS = [
  { fw:"ACRE", ph:"Accuracy", q:"When evaluating AI output for ACCURACY, you should:", opts:["Assume it is correct because AI is a computer","Verify claims against reliable, independent sources","Check only grammar and spelling","Ask another AI to confirm"], ans:1, tok:15 },
  { fw:"ACRE", ph:"Completeness", q:"COMPLETENESS in AI evaluation means checking whether:", opts:["The response is the longest possible","All necessary information is present and nothing crucial is omitted","The AI used complex vocabulary","The output has images"], ans:1, tok:15 },
  { fw:"ACRE", ph:"Relevance", q:"RELEVANCE in the ACRE framework asks:", opts:["Does the response directly address the specific question?","Is the response popular on social media?","Is the output formatted nicely?","Is the AI the newest version?"], ans:0, tok:15 },
  { fw:"ACRE", ph:"Equity", q:"The EQUITY dimension of ACRE requires examining:", opts:["Whether the AI output is free","Whether the response reflects fair representation and avoids systemic biases","Whether the AI was made in a specific country","How quickly it responds"], ans:1, tok:20 },
  { fw:"ACRE", ph:"Accuracy", q:"An AI 'hallucination' is:", opts:["When AI generates creative imagery","When AI produces confident but factually incorrect information","When AI is slow to respond","When AI uses poetic language"], ans:1, tok:20 },
  { fw:"ACRE", ph:"Equity", q:"To ensure equity when using AI in Caribbean classrooms, educators should:", opts:["Assume all students have equal internet access","Consider connectivity gaps, language diversity, and culturally relevant content","Only use AI for advanced students","Replace all teachers with AI"], ans:1, tok:20 },
  { fw:"ACRE", ph:"Completeness", q:"When checking completeness of AI lesson plans, verify:", opts:["That it has a title","That outcomes, activities, assessments, and accommodations are included","That it looks professional","That it is long enough"], ans:1, tok:15 },
  { fw:"ACRE", ph:"Relevance", q:"An AI response is RELEVANT when:", opts:["It mentions many topics","It directly addresses the Caribbean educational context specified","It uses academic jargon","It is generated quickly"], ans:1, tok:15 },
];

const BOARD = [
  { id:0, type:"start", label:"START", sub:"Collect 20 Tokens", color:"#10b981", icon:"\u{1F680}" },
  { id:1, type:"care", label:"CONSIDER", sub:"CARE", color:"#818cf8", icon:"\u{1F914}" },
  { id:2, type:"domain", label:"AI Basics", sub:"Claim Domain", color:"#d97706", icon:"\u{1F9E0}" },
  { id:3, type:"craft", label:"CONTEXT", sub:"CRAFT", color:"#f472b6", icon:"\u{270F}\u{FE0F}" },
  { id:4, type:"acre", label:"ACCURACY", sub:"ACRE", color:"#2dd4bf", icon:"\u{2705}" },
  { id:5, type:"event", label:"Breakthrough", sub:"Advance 3", color:"#10b981", icon:"\u{26A1}", fx:"advance3" },
  { id:6, type:"domain", label:"Prompt Eng.", sub:"Claim Domain", color:"#d97706", icon:"\u{1F4AC}" },
  { id:7, type:"care", label:"ANALYZE", sub:"CARE", color:"#818cf8", icon:"\u{1F50D}" },
  { id:8, type:"event", label:"Digital Divide", sub:"Miss 1 turn", color:"#ef4444", icon:"\u{1F4F5}", fx:"missturn" },
  { id:9, type:"craft", label:"ROLE", sub:"CRAFT", color:"#f472b6", icon:"\u{1F3AD}" },
  { id:10, type:"domain", label:"AI Ethics", sub:"Claim Domain", color:"#d97706", icon:"\u{2696}\u{FE0F}" },
  { id:11, type:"corner", label:"ETHICS LAB", sub:"Free Thinking", color:"#7c3aed", icon:"\u{1F52C}" },
  { id:12, type:"acre", label:"COMPLETE", sub:"ACRE", color:"#2dd4bf", icon:"\u{1F4CB}" },
  { id:13, type:"event", label:"Hallucination!", sub:"Lose 10 Tokens", color:"#ef4444", icon:"\u{1F47B}", fx:"lose10" },
  { id:14, type:"craft", label:"ACTION", sub:"CRAFT", color:"#f472b6", icon:"\u{26A1}" },
  { id:15, type:"domain", label:"Data Literacy", sub:"Claim Domain", color:"#d97706", icon:"\u{1F4CA}" },
  { id:16, type:"care", label:"REFLECT", sub:"CARE", color:"#818cf8", icon:"\u{1F4AD}" },
  { id:17, type:"event", label:"Bias Trap!", sub:"Go back 2", color:"#ef4444", icon:"\u{26A0}\u{FE0F}", fx:"back2" },
  { id:18, type:"domain", label:"AI & Society", sub:"Claim Domain", color:"#d97706", icon:"\u{1F30D}" },
  { id:19, type:"acre", label:"RELEVANCE", sub:"ACRE", color:"#2dd4bf", icon:"\u{1F3AF}" },
  { id:20, type:"event", label:"Innovation Hub", sub:"+15 Tokens", color:"#10b981", icon:"\u{1F3C6}", fx:"bonus15" },
  { id:21, type:"corner", label:"DIGITAL EQUITY", sub:"Collect 10", color:"#7c3aed", icon:"\u{1F310}" },
  { id:22, type:"craft", label:"FORMAT", sub:"CRAFT", color:"#f472b6", icon:"\u{1F4DD}" },
  { id:23, type:"domain", label:"Creative AI", sub:"Claim Domain", color:"#d97706", icon:"\u{1F3A8}" },
  { id:24, type:"care", label:"EVALUATE", sub:"CARE", color:"#818cf8", icon:"\u{1F4CF}" },
  { id:25, type:"event", label:"Deepfake Alert!", sub:"Lose 15 Tokens", color:"#ef4444", icon:"\u{1F6A8}", fx:"lose15" },
  { id:26, type:"domain", label:"AI Governance", sub:"Claim Domain", color:"#d97706", icon:"\u{1F4DC}" },
  { id:27, type:"acre", label:"EQUITY", sub:"ACRE", color:"#2dd4bf", icon:"\u{2696}\u{FE0F}" },
  { id:28, type:"craft", label:"THRESHOLD", sub:"CRAFT", color:"#f472b6", icon:"\u{1F39A}\u{FE0F}" },
  { id:29, type:"event", label:"AI Literacy Win!", sub:"+20 Tokens", color:"#10b981", icon:"\u{1F31F}", fx:"bonus20" },
  { id:30, type:"domain", label:"Future of Work", sub:"Claim Domain", color:"#d97706", icon:"\u{1F52E}" },
  { id:31, type:"corner", label:"SUMMIT", sub:"Double Next Roll", color:"#7c3aed", icon:"\u{26F0}\u{FE0F}" },
];

const BADGES = [
  { id:"care", name:"CARE Master", desc:"Mastered Consider, Analyze, Reflect, Evaluate", icon:"\u{1F9E0}", color:"#818cf8" },
  { id:"craft", name:"CRAFT Expert", desc:"Expert in Context, Role, Action, Format, Threshold", icon:"\u{270F}\u{FE0F}", color:"#f472b6" },
  { id:"acre", name:"ACRE Evaluator", desc:"Proficient in Accuracy, Completeness, Relevance, Equity", icon:"\u{2705}", color:"#2dd4bf" },
  { id:"domains", name:"Domain Champion", desc:"Claimed 4+ AI literacy domains", icon:"\u{1F3C6}", color:"#fbbf24" },
  { id:"champion", name:"AI Literacy Champion", desc:"Certified by Dr. Rohan Jowallah, Ed.D., FHEA", icon:"\u{1F31F}", color:"#10b981" },
];

/* Board position -> CSS grid placement for a 10x10 grid ring */
function pos(idx) {
  const n = 8, g = 10;
  const s = Math.floor(idx / n), p = idx % n;
  if (s === 0) return { c: p + 1, r: g };
  if (s === 1) return { c: g, r: g - p };
  if (s === 2) return { c: g - p, r: 1 };
  return { c: 1, r: p + 1 };
}

/* Get pixel position for a piece on the board */
function pieceXY(idx, cellSize, gap) {
  const p = pos(idx);
  const x = (p.c - 1) * (cellSize + gap);
  const y = (p.r - 1) * (cellSize + gap);
  return { x, y };
}

const CSS = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
:focus-visible{outline:3px solid #f472b6!important;outline-offset:3px!important;border-radius:4px;}
.skip{position:absolute;top:-120px;left:1rem;padding:.6rem 1.2rem;background:#f472b6;color:#fff;font-weight:700;border-radius:6px;text-decoration:none;z-index:9999;}
.skip:focus{top:1rem;}
button{font-family:inherit;cursor:pointer;}
button:disabled{opacity:.55;cursor:not-allowed;}
@keyframes fadeIn{from{opacity:0;transform:translateX(-6px)}to{opacity:1;transform:translateX(0)}}
@keyframes spin{0%,100%{transform:scale(1)}50%{transform:scale(1.2) rotate(8deg)}}
@keyframes pop{from{opacity:0;transform:scale(.5)}to{opacity:1;transform:scale(1)}}
@keyframes modalIn{from{opacity:0;transform:scale(.95)}to{opacity:1;transform:scale(1)}}
@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
@keyframes glow{0%,100%{box-shadow:0 0 8px currentColor}50%{box-shadow:0 0 20px currentColor, 0 0 30px currentColor}}
@media(prefers-reduced-motion:reduce){*{animation-duration:0s!important;transition-duration:0s!important;}}

/* Responsive board cell sizes */
:root{--cell:clamp(52px,7.5vw,90px);--gap:3px;--piece:clamp(28px,3.5vw,42px);--board-font:clamp(0.55rem,1vw,0.85rem);--icon-size:clamp(1rem,2vw,1.8rem);}

@media(max-width:900px){
  :root{--cell:clamp(36px,9vw,52px);--gap:2px;--piece:clamp(22px,5vw,32px);--board-font:clamp(0.45rem,1.5vw,0.65rem);--icon-size:clamp(0.8rem,2.5vw,1.2rem);}
}
@media(max-width:500px){
  :root{--cell:clamp(30px,9vw,42px);--gap:1px;--piece:clamp(18px,5vw,26px);--board-font:clamp(0.38rem,1.8vw,0.55rem);--icon-size:clamp(0.65rem,2.5vw,1rem);}
}

.game-piece{
  position:absolute;
  width:var(--piece);height:var(--piece);
  border-radius:50%;
  display:flex;align-items:center;justify-content:center;
  font-weight:900;font-size:clamp(0.6rem,1.2vw,1rem);
  border:3px solid #fff;
  transition:left 0.6s cubic-bezier(.34,1.56,.64,1), top 0.6s cubic-bezier(.34,1.56,.64,1);
  z-index:10;
  pointer-events:none;
  box-shadow:0 2px 12px rgba(0,0,0,.4);
}
.game-piece.active{
  animation:bounce 1s ease-in-out infinite, glow 2s ease-in-out infinite;
}
`;

const fwC = { CARE: "#818cf8", CRAFT: "#f472b6", ACRE: "#2dd4bf" };
const logC = { success: "#6ee7b7", danger: "#fca5a5", warn: "#fde68a", info: "#e2e8f0", ai: "#c4b5fd", domain: "#fbbf24" };
const dice = ["\u2680", "\u2681", "\u2682", "\u2683", "\u2684", "\u2685"];

export default function Game() {
  const [scr, setScr] = useState("intro");
  const [pPos, setPPos] = useState(0);
  const [aPos, setAPos] = useState(0);
  const [pTok, setPTok] = useState(20);
  const [aTok, setATok] = useState(20);
  const [pPrg, setPPrg] = useState({ care: 0, craft: 0, acre: 0 });
  const [aPrg, setAPrg] = useState({ care: 0, craft: 0, acre: 0 });
  const [pBdg, setPBdg] = useState([]);
  const [aBdg, setABdg] = useState([]);
  const [pDom, setPDom] = useState([]);
  const [aDom, setADom] = useState([]);
  const [turn, setTurn] = useState("player");
  const [dv, setDv] = useState([1, 1]);
  const [rlng, setRlng] = useState(false);
  const [quest, setQuest] = useState(null);
  const [pick, setPick] = useState(null);
  const [ok, setOk] = useState(null);
  const [log, setLog] = useState([]);
  const [evt, setEvt] = useState(null);
  const [laps, setLaps] = useState({ p: 0, a: 0 });
  const [skip, setSkip] = useState(false);
  const [dbl, setDbl] = useState(false);
  const [bdgA, setBdgA] = useState(null);
  const [win, setWin] = useState(null);
  const [nm, setNm] = useState("");
  const [nmV, setNmV] = useState("");
  const [nmE, setNmE] = useState("");
  const [live, setLive] = useState("");
  const [asrt, setAsrt] = useState("");
  const [fOpt, setFOpt] = useState(0);
  const [help, setHelp] = useState(false);
  const [cellSize, setCellSize] = useState(90);
  const [gapSize, setGapSize] = useState(3);

  const rollR = useRef(null);
  const nmR = useRef(null);
  const ansR = useRef([]);
  const boardRef = useRef(null);

  /* Measure actual cell size for piece positioning */
  useEffect(() => {
    function measure() {
      if (!boardRef.current) return;
      const firstCell = boardRef.current.querySelector("[data-cell]");
      if (firstCell) {
        const rect = firstCell.getBoundingClientRect();
        setCellSize(rect.width);
        // gap is trickier; compute from style
        const style = getComputedStyle(boardRef.current);
        const g = parseFloat(style.gap) || 3;
        setGapSize(g);
      }
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [scr]);

  const say = useCallback(m => { setLive(""); setTimeout(() => setLive(m), 40); }, []);
  const shout = useCallback(m => { setAsrt(""); setTimeout(() => setAsrt(m), 40); }, []);
  const addLog = useCallback((m, t = "info") => { setLog(p => [{ m, t, id: Date.now() + Math.random() }, ...p.slice(0, 29)]); say(m); }, [say]);
  const rQ = useCallback(t => { const p = { care: CARE_QS, craft: CRAFT_QS, acre: ACRE_QS }[t] || ACRE_QS; return p[Math.floor(Math.random() * p.length)]; }, []);

  const awBdg = useCallback((prg, bdg, dom, who) => {
    const nb = [...bdg];
    const ck = (id, c) => { if (c && !nb.includes(id)) { nb.push(id); if (who === "p") setBdgA(id); } };
    ck("care", prg.care >= 3); ck("craft", prg.craft >= 3); ck("acre", prg.acre >= 3);
    ck("domains", dom.length >= 4); ck("champion", ["care", "craft", "acre", "domains"].every(b => nb.includes(b)));
    return nb;
  }, []);

  const apFx = useCallback((sp, who, sT, sP) => {
    const isP = who !== "AI Opponent";
    switch (sp.fx) {
      case "advance3": sP(p => (p + 3) % 32); addLog(${who}: Breakthrough \u2014 advanced 3!`, "success"); break;
      case "missturn": if (isP) setSkip(true); addLog(${who}: Digital Divide \u2014 miss turn.`, "warn"); break;
      case "lose10": sT(t => Math.max(0, t - 10)); addLog(${who}: Hallucination \u2014 lost 10 tokens.`, "danger"); break;
      case "lose15": sT(t => Math.max(0, t - 15)); addLog(${who}: Deepfake Alert \u2014 lost 15 tokens.`, "danger"); break;
      case "back2": sP(p => Math.max(0, p - 2)); addLog(${who}: Bias Trap \u2014 back 2 spaces.`, "warn"); break;
      case "bonus15": sT(t => t + 15); addLog(${who}: Innovation Hub \u2014 +15 tokens!`, "success"); break;
      case "bonus20": sT(t => t + 20); addLog(${who}: AI Literacy Win \u2014 +20 tokens!`, "success"); break;
    }
  }, [addLog]);

  // AI auto-play
  useEffect(() => {
    if (turn !== "ai" || scr !== "play") return;
    const tm = setTimeout(() => {
      const d1 = Math.ceil(Math.random() * 6), d2 = Math.ceil(Math.random() * 6), tot = d1 + d2;
      setDv([d1, d2]); addLog(${AI Opponent rolled ${d1}+${d2}=${tot}.`, "ai");
      setAPos(prev => {
        const np = (prev + tot) % 32;
        if (np < prev) { setATok(t => t + 20); addLog("AI passed START \u2014 +20 tokens.", "success"); setLaps(l => ({ ...l, a: l.a + 1 })); }
        const sp = BOARD[np];
        if (["care", "craft", "acre"].includes(sp.type)) {
          const q = rQ(sp.type); const good = Math.random() < 0.7;
          if (good) { setATok(t => t + q.tok); setAPrg(p => { const np2 = { ...p, [sp.type]: p[sp.type] + 1 }; setABdg(b => awBdg(np2, b, aDom, "ai")); return np2; }); addLog(${AI answered ${q.ph} correctly \u2014 +${q.tok} tokens.`, "ai"); }
          else addLog(${AI answered ${q.ph} incorrectly.`, "warn");
        } else if (sp.type === "domain") {
          setADom(d => { if (!d.includes(sp.label)) { setATok(t => t + 10); addLog(${AI claimed "${sp.label}" domain.`, "ai"); const nd = [...d, sp.label]; setABdg(b => awBdg(aPrg, b, nd, "ai")); return nd; } return d; });
        } else if (sp.type === "event") { apFx(sp, "AI Opponent", setATok, setAPos); }
        else if (sp.type === "corner" && np === 21) { setATok(t => t + 10); addLog("AI reached Digital Equity \u2014 +10 tokens.", "success"); }
        return np;
      });
      setTimeout(() => { setTurn("player"); say(${Your turn, ${nm}!`); setTimeout(() => rollR.current?.focus(), 200); }, 1000);
    }, 700);
    return () => clearTimeout(tm);
  }, [turn, scr, addLog, rQ, awBdg, apFx, aDom, aPrg, nm, say]);

  // Win check
  useEffect(() => {
    if (scr !== "play") return;
    if (pBdg.includes("champion")) { setWin("p"); setScr("end"); return; }
    if (aBdg.includes("champion")) { setWin("ai"); setScr("end"); return; }
    if (laps.p >= 3 && laps.a >= 3) { setWin(pTok > aTok ? "p" : aTok > pTok ? "ai" : "tie"); setScr("end"); }
  }, [pBdg, aBdg, laps, pTok, aTok, scr]);

  // Escape to close modals
  useEffect(() => {
    const h = e => { if (e.key === "Escape") { if (bdgA) setBdgA(null); if (help) setHelp(false); } };
    window.addEventListener("keydown", h); return () => window.removeEventListener("keydown", h);
  }, [bdgA, help]);

  // Roll dice
  const roll = useCallback(() => {
    if (rlng || turn !== "player" || scr !== "play") return;
    if (skip) { setSkip(false); addLog(${nm} skipped turn (Digital Divide).`, "warn"); setTurn("ai"); return; }
    setRlng(true); let cnt = 0;
    const iv = setInterval(() => {
      setDv([Math.ceil(Math.random() * 6), Math.ceil(Math.random() * 6)]); cnt++;
      if (cnt >= 8) {
        clearInterval(iv);
        const d1 = Math.ceil(Math.random() * 6), d2 = Math.ceil(Math.random() * 6);
        let tot = d1 + d2; const wasD = dbl; if (wasD) { tot *= 2; setDbl(false); }
        setDv([d1, d2]); setRlng(false);
        addLog(${nm} rolled ${d1}+${d2}${wasD ? " (doubled)" : ""}=${tot}.`, "info");
        setPPos(prev => {
          const np = (prev + tot) % 32;
          if (np < prev) { setPTok(t => t + 20); addLog(${nm} passed START \u2014 +20 tokens!`, "success"); setLaps(l => ({ ...l, p: l.p + 1 })); }
          const sp = BOARD[np];
          if (["care", "craft", "acre"].includes(sp.type)) {
            setTimeout(() => { setQuest({ ...rQ(sp.type), key: sp.type }); setFOpt(0); setScr("question"); }, 400);
          } else if (sp.type === "domain") {
            setPDom(d => {
              if (!d.includes(sp.label)) { setPTok(t => t + 10); addLog(${nm} claimed "${sp.label}" \u2014 +10 tokens!`, "domain"); const nd = [...d, sp.label]; setPBdg(b => awBdg(pPrg, b, nd, "p")); return nd; }
              addLog(${nm} visited "${sp.label}" \u2014 already claimed.`, "info"); setTimeout(() => setTurn("ai"), 300); return d;
            });
          } else if (sp.type === "event") { setTimeout(() => { setEvt({ ...sp, who: nm }); setScr("event"); }, 400); }
          else if (sp.type === "corner") {
            if (np === 21) { setPTok(t => t + 10); addLog(${nm} reached Digital Equity \u2014 +10 tokens!`, "success"); }
            if (np === 31) { setDbl(true); addLog(${nm} reached Summit \u2014 next roll doubled!`, "info"); }
            setTimeout(() => setTurn("ai"), 300);
          } else setTimeout(() => setTurn("ai"), 300);
          return np;
        });
      }
    }, 80);
  }, [rlng, turn, scr, skip, dbl, addLog, nm, rQ, awBdg, pPrg]);

  // Answer selection
  const selAns = useCallback(idx => {
    if (pick !== null || !quest) return; setPick(idx);
    const isOk = idx === quest.ans; setOk(isOk);
    if (isOk) { setPTok(t => t + quest.tok); setPPrg(p => { const np = { ...p, [quest.key]: p[quest.key] + 1 }; setPBdg(b => awBdg(np, b, pDom, "p")); return np; }); addLog(${Correct! +${quest.tok} tokens \u2014 ${quest.fw} ${quest.ph}.`, "success"); shout(${Correct! +${quest.tok} tokens.`); }
    else { addLog(${Incorrect. Answer: ${quest.opts[quest.ans]}`, "danger"); shout(${Incorrect. Answer: ${quest.opts[quest.ans]}`); }
    setTimeout(() => { setQuest(null); setPick(null); setOk(null); setScr("play"); setTurn("ai"); setTimeout(() => rollR.current?.focus(), 300); }, 2400);
  }, [pick, quest, addLog, shout, awBdg, pDom]);

  const contEvt = useCallback(() => {
    if (!evt) return; apFx(evt, evt.who, setPTok, setPPos); setEvt(null); setScr("play"); setTurn("ai"); setTimeout(() => rollR.current?.focus(), 300);
  }, [evt, apFx]);

  const reset = () => { setScr("intro"); setPPos(0); setAPos(0); setPTok(20); setATok(20); setPPrg({ care: 0, craft: 0, acre: 0 }); setAPrg({ care: 0, craft: 0, acre: 0 }); setPBdg([]); setABdg([]); setPDom([]); setADom([]); setTurn("player"); setDv([1, 1]); setLog([]); setLaps({ p: 0, a: 0 }); setWin(null); setDbl(false); setSkip(false); setNmV(nm); };

  function start() { const n = nmV.trim(); if (!n) { setNmE("Please enter your name."); nmR.current?.focus(); return; } setNm(n); setNmE(""); setScr("play"); addLog(${Welcome, ${n}! AI Literacy Quest begins.`, "success"); setTimeout(() => rollR.current?.focus(), 300); }

  // Arrow keys in question modal
  useEffect(() => { if (scr === "question") ansR.current[fOpt]?.focus(); }, [fOpt, scr]);

  const optKey = (e, idx) => {
    if (!quest) return;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") { e.preventDefault(); setFOpt(i => Math.min(i + 1, quest.opts.length - 1)); }
    else if (e.key === "ArrowUp" || e.key === "ArrowLeft") { e.preventDefault(); setFOpt(i => Math.max(i - 1, 0)); }
    else if (e.key === "Enter" || e.key === " ") { e.preventDefault(); selAns(idx); }
  };

  const B = (bg) => ({ background: bg, color: "#fff", border: "2px solid transparent", borderRadius: 12, padding: "1rem 2.5rem", fontSize: "clamp(1rem,1.8vw,1.15rem)", fontWeight: 700, minHeight: 52, fontFamily: "inherit" });
  const OV = { position: "fixed", inset: 0, background: "rgba(0,0,0,.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: "1rem" };
  const MB = { background: "#1a1333", border: "1px solid rgba(129,140,248,.3)", borderRadius: 16, padding: "clamp(1.5rem,3vw,2.5rem)", maxWidth: 620, width: "100%", animation: "modalIn .22s ease" };

  // ── INTRO ────────────────────────────────────────────
  if (scr === "intro") return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#080612,#0f0c29,#180a36)", display: "flex", alignItems: "center", justifyContent: "center", padding: "clamp(1rem,4vw,3rem)" }}>
      <style>{CSS}</style>
      <a href="#intro-main" className="skip">Skip to main content</a>
      <main id="intro-main" style={{ maxWidth: 720, width: "100%" }}>
        <header style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div aria-hidden="true" style={{ fontSize: "clamp(3rem,8vw,5rem)", lineHeight: 1, marginBottom: ".5rem" }}>{"\u{1F393}"}</div>
          <h1 style={{ fontSize: "clamp(2rem,6vw,3.5rem)", fontWeight: 900, background: "linear-gradient(135deg,#a78bfa,#f472b6,#2dd4bf)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", margin: "0 0 .5rem" }}>AI Literacy Quest</h1>
          <p style={{ color: "#c4b5fd", fontSize: "clamp(1rem,2.5vw,1.3rem)", margin: "0 0 .3rem" }}>The Board Game of Frameworks, Badges & AI Mastery</p>
          <p style={{ color: "#7c3aed", fontSize: "clamp(.75rem,1.5vw,.95rem)", letterSpacing: "2px", margin: 0 }}>CARE \u00B7 CRAFT \u00B7 ACRE \u2014 Dr. Rohan Jowallah, Ed.D., FHEA</p>
        </header>
        <section aria-labelledby="fw-h" style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(129,140,248,.3)", borderRadius: 14, padding: "clamp(1rem,3vw,2rem)", marginBottom: "1.5rem" }}>
          <h2 id="fw-h" style={{ color: "#e2e8f0", fontSize: "clamp(1.1rem,2vw,1.3rem)", fontWeight: 700, marginBottom: "1rem" }}>Three Frameworks to Master</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: "1rem" }}>
            {[{ n: "CARE", c: "#818cf8", items: ["Consider", "Analyze", "Reflect", "Evaluate"] }, { n: "CRAFT", c: "#f472b6", items: ["Context", "Role", "Action", "Format", "Threshold"] }, { n: "ACRE", c: "#2dd4bf", items: ["Accuracy", "Completeness", "Relevance", "Equity"] }].map(f => (
              <div key={f.n} style={{ background: ${f.c}12`, border: ${1px solid ${f.c}40`, borderRadius: 10, padding: "1rem" }}>
                <h3 style={{ color: f.c, fontWeight: 800, fontSize: "clamp(1rem,2vw,1.2rem)", margin: "0 0 .5rem" }}>{f.n}</h3>
                <ul style={{ margin: 0, padding: "0 0 0 1.2rem", listStyle: "disc" }}>{f.items.map(i => <li key={i} style={{ color: "#d1d5db", fontSize: "clamp(.85rem,1.5vw,1rem)", lineHeight: 1.7 }}>{i}</li>)}</ul>
              </div>
            ))}
          </div>
          <p style={{ color: "#94a3b8", fontSize: "clamp(.9rem,1.5vw,1.05rem)", lineHeight: 1.7, marginTop: "1rem", marginBottom: 0 }}>
            Move around a 32-space board, answer framework challenges, claim AI literacy domains, and earn all 5 badges to become the <strong style={{ color: "#fbbf24" }}>AI Literacy Champion</strong>. You play against an AI opponent that auto-plays after your turn.
          </p>
        </section>
        <section aria-labelledby="rules-h" style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 14, padding: "clamp(1rem,3vw,2rem)", marginBottom: "1.5rem" }}>
          <h2 id="rules-h" style={{ color: "#e2e8f0", fontSize: "clamp(1.1rem,2vw,1.3rem)", fontWeight: 700, marginBottom: ".8rem" }}>How to Play</h2>
          <ol style={{ margin: 0, padding: "0 0 0 1.5rem", color: "#94a3b8", fontSize: "clamp(.9rem,1.5vw,1.05rem)", lineHeight: 2 }}>
            <li>Enter your name and press Begin Quest.</li>
            <li>Roll two dice. Move around the 32-space board.</li>
            <li>Land on CARE/CRAFT/ACRE spaces to answer framework questions.</li>
            <li>Claim AI literacy domains by landing on domain spaces.</li>
            <li>Watch for event spaces: Hallucinations, Bias Traps, Deepfakes!</li>
            <li>Earn badges: 3 correct = framework badge, 4+ domains = Domain Champion.</li>
            <li>Earn all 4 badges to unlock AI Literacy Champion and win!</li>
            <li>Alternative win: after 3 laps each, most tokens wins.</li>
          </ol>
        </section>
        <section aria-labelledby="setup-h" style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 14, padding: "clamp(1rem,3vw,2rem)", marginBottom: "1.5rem" }}>
          <h2 id="setup-h" style={{ color: "#e2e8f0", fontSize: "clamp(1.1rem,2vw,1.3rem)", fontWeight: 700, marginBottom: "1rem" }}>Player Setup</h2>
          <div style={{ marginBottom: "1rem" }}>
            <label htmlFor="pname" style={{ display: "block", color: "#c4b5fd", fontWeight: 600, marginBottom: ".5rem", fontSize: "clamp(1rem,1.8vw,1.1rem)" }}>Your name</label>
            <input id="pname" ref={nmR} type="text" value={nmV} maxLength={30} onChange={e => { setNmV(e.target.value); setNmE(""); }} onKeyDown={e => { if (e.key === "Enter") start(); }} aria-describedby={nmE ? "pname-err" : "pname-hint"} aria-invalid={!!nmE} autoComplete="given-name" style={{ background: "rgba(255,255,255,.08)", border: ${1px solid ${nmE ? "#f87171" : "rgba(129,140,248,.5)"}`, borderRadius: 10, padding: "clamp(.7rem,1.5vw,1rem) 1rem", color: "#fff", fontSize: "clamp(1rem,1.8vw,1.15rem)", width: "100%", fontFamily: "inherit" }} />
            {nmE && <p id="pname-err" role="alert" style={{ color: "#fca5a5", fontSize: ".9rem", marginTop: ".4rem" }}>{nmE}</p>}
            <p id="pname-hint" style={{ color: "#64748b", fontSize: ".85rem", marginTop: ".3rem" }}>Up to 30 characters. Press Enter or click below.</p>
          </div>
          <button onClick={start} style={{ ...B("linear-gradient(135deg,#6366f1,#8b5cf6)"), width: "100%" }}><span aria-hidden="true">{"\u{1F3B2}"} </span>Begin Quest</button>
        </section>
        <p style={{ color: "#475569", fontSize: "clamp(.75rem,1.3vw,.9rem)", textAlign: "center" }}>Keyboard accessible. Screen reader support. Reduced motion respected.</p>
      </main>
    </div>
  );

  // ── GAME OVER ────────────────────────────────────────
  if (scr === "end") {
    const pw = win === "p", tie = win === "tie";
    return (
      <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#080612,#0f0c29)", display: "flex", alignItems: "center", justifyContent: "center", padding: "clamp(1rem,4vw,3rem)" }}>
        <style>{CSS}</style>
        <main style={{ maxWidth: 700, width: "100%", textAlign: "center" }}>
          <div aria-hidden="true" style={{ fontSize: "clamp(4rem,10vw,6rem)", marginBottom: "1rem" }}>{tie ? "\u{1F91D}" : pw ? "\u{1F3C6}" : "\u{1F916}"}</div>
          <h1 style={{ fontSize: "clamp(2rem,6vw,3rem)", fontWeight: 900, background: pw ? "linear-gradient(135deg,#fbbf24,#f59e0b)" : "linear-gradient(135deg,#94a3b8,#64748b)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: ".5rem" }}>{tie ? "It\u2019s a Tie!" : pw ? ${nm} Wins!` : "AI Opponent Wins!"}</h1>
          <p style={{ color: "#c4b5fd", fontSize: "clamp(1rem,2vw,1.2rem)", marginBottom: "2rem" }}>{pw ? "Outstanding AI Literacy mastery!" : tie ? "An incredible battle." : "Ready for a rematch?"}</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))", gap: "1rem", marginBottom: "2rem" }}>
            {[{ n: nm, tok: pTok, bdg: pBdg, dom: pDom, c: "#818cf8" }, { n: "AI Opponent", tok: aTok, bdg: aBdg, dom: aDom, c: "#f472b6" }].map(p => (
              <section key={p.n} aria-label={${p.n} score`} style={{ background: "rgba(255,255,255,.04)", border: ${1px solid ${p.c}40`, borderRadius: 12, padding: "clamp(1rem,2vw,1.5rem)" }}>
                <h2 style={{ color: p.c, fontWeight: 700, fontSize: "clamp(1.1rem,2vw,1.3rem)", marginBottom: ".7rem" }}>{p.n}</h2>
                <p style={{ color: "#fbbf24", fontSize: "clamp(1.5rem,3vw,2rem)", fontWeight: 700, margin: "0 0 .8rem" }}><span aria-label={${p.tok} tokens`}>{p.tok}</span><span aria-hidden="true"> {"\u{1FA99}"}</span></p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: ".4rem", justifyContent: "center" }}>
                  {BADGES.filter(b => p.bdg.includes(b.id)).map(b => <span key={b.id} style={{ background: ${b.color}20`, border: ${1px solid ${b.color}60`, borderRadius: 20, padding: ".3rem .7rem", fontSize: "clamp(.75rem,1.3vw,.9rem)", color: b.color }}><span aria-hidden="true">{b.icon} </span>{b.name}</span>)}
                  {p.bdg.length === 0 && <span style={{ color: "#475569", fontSize: ".9rem" }}>No badges</span>}
                </div>
              </section>
            ))}
          </div>
          {pw && pBdg.includes("champion") && (
            <section aria-label="Certificate" style={{ background: "rgba(251,191,36,.08)", border: "2px solid #fbbf24", borderRadius: 14, padding: "clamp(1.2rem,3vw,2rem)", marginBottom: "2rem" }}>
              <div aria-hidden="true" style={{ fontSize: "2.5rem", marginBottom: ".5rem" }}>{"\u{1F31F}"} {"\u{1F4DC}"}</div>
              <h2 style={{ color: "#fbbf24", fontSize: "clamp(1.2rem,2.5vw,1.5rem)", fontWeight: 700 }}>Certificate of AI Literacy</h2>
              <p style={{ color: "#e2e8f0", fontSize: "clamp(1rem,1.8vw,1.15rem)", margin: ".5rem 0" }}>This certifies that <strong>{nm}</strong> has mastered the CARE, CRAFT, and ACRE frameworks</p>
              <p style={{ color: "#10b981", fontWeight: 900, fontSize: "clamp(1.2rem,2.5vw,1.5rem)", margin: ".5rem 0" }}>AI Literacy Champion</p>
              <p style={{ color: "#94a3b8", fontSize: "clamp(.8rem,1.3vw,.95rem)" }}>Awarded by Dr. Rohan Jowallah, Ed.D., FHEA \u00B7 AI, Pedagogy and Inclusion</p>
            </section>
          )}
          <button onClick={reset} style={B("linear-gradient(135deg,#6366f1,#8b5cf6)")}><span aria-hidden="true">{"\u{1F504}"} </span>Play Again</button>
        </main>
      </div>
    );
  }

  // ── PLAYING ──────────────────────────────────────────
  const pXY = pieceXY(pPos, cellSize, gapSize);
  const aXY = pieceXY(aPos, cellSize, gapSize);

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#080612,#0f0c29,#180a36)", color: "#e2e8f0" }}>
      <style>{CSS}</style>
      <div role="status" aria-live="polite" aria-atomic="true" style={{ position: "absolute", left: "-9999px", width: "1px", height: "1px", overflow: "hidden" }}>{live}</div>
      <div role="alert" aria-live="assertive" aria-atomic="true" style={{ position: "absolute", left: "-9999px", width: "1px", height: "1px", overflow: "hidden" }}>{asrt}</div>
      <a href="#board" className="skip">Skip to game board</a>

      {/* Header */}
      <header style={{ textAlign: "center", padding: "clamp(.6rem,1.5vw,1rem) 1rem clamp(.4rem,1vw,.6rem)", borderBottom: "1px solid rgba(99,102,241,.15)" }}>
        <h1 style={{ fontSize: "clamp(1.2rem,3vw,1.8rem)", fontWeight: 900, background: "linear-gradient(135deg,#a78bfa,#f472b6,#2dd4bf)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", margin: 0 }}>AI Literacy Quest</h1>
        <p style={{ color: "#7c3aed", fontSize: "clamp(.6rem,1.2vw,.85rem)", letterSpacing: "1.5px", margin: 0 }}>CARE \u00B7 CRAFT \u00B7 ACRE \u2014 Dr. Rohan Jowallah</p>
      </header>

      {/* Score Bar */}
      <nav aria-label="Scores" style={{ display: "flex", justifyContent: "center", gap: "clamp(.5rem,1.5vw,1rem)", padding: "clamp(.4rem,1vw,.8rem) 1rem", flexWrap: "wrap", borderBottom: "1px solid rgba(255,255,255,.05)" }}>
        {[{ l: nm, t: pTok, b: pBdg, c: "#818cf8", lp: laps.p, pc: "P" }, { l: "AI Opponent", t: aTok, b: aBdg, c: "#f472b6", lp: laps.a, pc: "AI" }].map(p => (
          <div key={p.l} aria-label={${p.l}: ${p.t} tokens, ${p.b.length} badges, lap ${p.lp}`} style={{ display: "flex", alignItems: "center", gap: "clamp(.3rem,1vw,.6rem)", background: "rgba(255,255,255,.04)", borderRadius: 10, padding: "clamp(.3rem,.8vw,.5rem) clamp(.5rem,1.2vw,.9rem)", border: ${2px solid ${p.c}40` }}>
            <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "clamp(24px,3vw,32px)", height: "clamp(24px,3vw,32px)", borderRadius: "50%", background: p.c, color: "#fff", fontWeight: 900, fontSize: "clamp(.6rem,1.2vw,.85rem)", flexShrink: 0 }}>{p.pc}</span>
            <span style={{ color: p.c, fontWeight: 700, fontSize: "clamp(.85rem,1.5vw,1.1rem)" }}>{p.l}</span>
            <span style={{ color: "#fbbf24", fontWeight: 700, fontSize: "clamp(.85rem,1.5vw,1.1rem)" }}>{p.t}<span aria-hidden="true"> {"\u{1FA99}"}</span></span>
            <span style={{ color: "#94a3b8", fontSize: "clamp(.65rem,1.2vw,.85rem)" }}>Lap {p.lp}/3</span>
            <span style={{ color: "#94a3b8", fontSize: "clamp(.65rem,1.2vw,.85rem)" }}>{p.b.length}<span aria-hidden="true"> {"\u{1F3C5}"}</span></span>
          </div>
        ))}
        <button onClick={() => setHelp(true)} aria-label="Help and rules" style={{ background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.2)", borderRadius: 10, padding: "clamp(.3rem,.8vw,.5rem) clamp(.6rem,1.2vw,1rem)", color: "#e2e8f0", fontSize: "clamp(.8rem,1.3vw,1rem)", fontFamily: "inherit", minHeight: 40, fontWeight: 600 }}>{"\u2753"} Help</button>
      </nav>

      {/* Main Layout: Board + Sidebar (responsive) */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr clamp(240px,25vw,340px)", gap: "clamp(.5rem,1.5vw,1.2rem)", padding: "clamp(.5rem,1.5vw,1.2rem)", maxWidth: 1400, margin: "0 auto" }} className="game-layout">
        <style>{${@media(max-width:900px){.game-layout{grid-template-columns:1fr!important;}}`}</style>

        <main id="board" aria-label="Game board">
          {/* Board Grid with Animated Pieces */}
          <div style={{ position: "relative", display: "inline-block" }}>
            <div ref={boardRef} style={{ display: "grid", gridTemplateColumns: "repeat(10,var(--cell))", gridTemplateRows: "repeat(10,var(--cell))", gap: "var(--gap)", justifyContent: "center" }}>
              {BOARD.map(sp => {
                const p = pos(sp.id);
                const hasP = pPos === sp.id;
                const hasA = aPos === sp.id;
                return (
                  <div key={sp.id} data-cell={sp.id} aria-label={${Space ${sp.id}: ${sp.label}${hasP ? ${ - ${nm} here` : ""}${hasA ? " - AI here" : ""}`} style={{ gridColumn: p.c, gridRow: p.r, background: ${sp.color}18`, border: ${2px solid ${hasP || hasA ? "#fff" : sp.color + "50"}`, borderRadius: 8, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", fontSize: "var(--board-font)", padding: "2px", textAlign: "center", transition: "border-color 0.3s" }}>
                    <span aria-hidden="true" style={{ fontSize: "var(--icon-size)", lineHeight: 1 }}>{sp.icon}</span>
                    <span style={{ color: sp.color, fontWeight: 700, lineHeight: 1.2, marginTop: 2, fontSize: "var(--board-font)" }}>{sp.label}</span>
                    <span style={{ color: "#64748b", fontSize: "calc(var(--board-font) * 0.8)", lineHeight: 1 }}>{sp.sub}</span>
                  </div>
                );
              })}

              {/* Center area with controls */}
              <div style={{ gridColumn: "3/9", gridRow: "3/9", background: "rgba(99,102,241,.06)", borderRadius: 16, border: "1px solid rgba(99,102,241,.15)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "clamp(.5rem,2vw,1.5rem)", zIndex: 5 }}>
                {/* Dice */}
                <div aria-label={${Dice: ${dv[0]} and ${dv[1]}`} style={{ display: "flex", gap: "clamp(.5rem,2vw,1rem)", marginBottom: "clamp(.5rem,1.5vw,1rem)" }}>
                  {dv.map((d, i) => <span key={i} aria-hidden="true" style={{ fontSize: "clamp(2rem,5vw,4rem)", lineHeight: 1, animation: rlng ? "spin .12s infinite" : "none" }}>{dice[d - 1]}</span>)}
                </div>
                <button ref={rollR} onClick={roll} disabled={turn !== "player" || rlng} aria-label={turn === "player" ? "Roll dice" : "Waiting for AI"} style={{ ...B(turn === "player" ? "linear-gradient(135deg,#6366f1,#8b5cf6)" : "#374151"), padding: "clamp(.6rem,1.5vw,.9rem) clamp(1.2rem,3vw,2rem)", fontSize: "clamp(.9rem,1.8vw,1.15rem)", minWidth: "clamp(140px,20vw,200px)" }}>
                  {rlng ? "Rolling..." : turn === "player" ? "\u{1F3B2} Roll Dice" : "\u{23F3} AI Turn..."}
                </button>
                {dbl && <p style={{ color: "#fbbf24", fontSize: "clamp(.75rem,1.3vw,.95rem)", marginTop: ".5rem", fontWeight: 700 }}>Next roll doubled!</p>}

                {/* Progress Bars */}
                <div style={{ marginTop: "clamp(.5rem,1.5vw,1rem)", width: "100%", maxWidth: 320 }}>
                  {[{ l: "CARE", v: pPrg.care, c: "#818cf8" }, { l: "CRAFT", v: pPrg.craft, c: "#f472b6" }, { l: "ACRE", v: pPrg.acre, c: "#2dd4bf" }].map(p => (
                    <div key={p.l} style={{ display: "flex", alignItems: "center", gap: ".5rem", marginBottom: ".4rem" }}>
                      <span style={{ color: p.c, fontSize: "clamp(.65rem,1.2vw,.85rem)", fontWeight: 700, width: "clamp(36px,5vw,50px)", textAlign: "right" }}>{p.l}</span>
                      <div role="progressbar" aria-valuenow={p.v} aria-valuemin={0} aria-valuemax={3} aria-label={${p.l}: ${p.v}/3`} style={{ flex: 1, height: "clamp(8px,1.2vw,12px)", background: "rgba(255,255,255,.08)", borderRadius: 6, overflow: "hidden" }}>
                        <div style={{ width: ${${p.v / 3) * 100}%`, height: "100%", background: p.c, borderRadius: 6, transition: "width .3s" }} />
                      </div>
                      <span style={{ color: "#94a3b8", fontSize: "clamp(.6rem,1vw,.85rem)", width: 30 }}>{p.v}/3</span>
                    </div>
                  ))}
                </div>

                {/* Badges */}
                <div style={{ display: "flex", gap: ".4rem", marginTop: "clamp(.4rem,1vw,.7rem)", flexWrap: "wrap", justifyContent: "center" }}>
                  {BADGES.map(b => <span key={b.id} aria-label={${b.name}: ${pBdg.includes(b.id) ? "earned" : "not earned"}`} style={{ fontSize: "clamp(1.2rem,2.5vw,1.8rem)", opacity: pBdg.includes(b.id) ? 1 : .2, filter: pBdg.includes(b.id) ? "none" : "grayscale(1)" }}>{b.icon}</span>)}
                </div>

                {/* Domains */}
                {pDom.length > 0 && <div style={{ display: "flex", gap: ".3rem", marginTop: ".4rem", flexWrap: "wrap", justifyContent: "center" }}>{pDom.map(d => <span key={d} style={{ background: "#d9770620", border: "1px solid #d9770640", borderRadius: 10, padding: ".2rem .5rem", fontSize: "clamp(.6rem,1vw,.8rem)", color: "#fbbf24" }}>{d}</span>)}</div>}
              </div>
            </div>

            {/* Animated Game Pieces (positioned absolutely over the board) */}
            <div className={${game-piece${turn === "player" ? " active" : ""}`} aria-label={${nm} at space ${pPos}`} style={{ background: "#818cf8", color: "#fff", left: pXY.x + cellSize * 0.08, top: pXY.y + cellSize * 0.08 }}>
              {(nm || "P").charAt(0).toUpperCase()}
            </div>
            <div className={${game-piece${turn === "ai" ? " active" : ""}`} aria-label={${AI at space ${aPos}`} style={{ background: "#f472b6", color: "#fff", left: aXY.x + cellSize * 0.55, top: aXY.y + cellSize * 0.55 }}>
              AI
            </div>
          </div>

          {/* Legend */}
          <div aria-label="Legend" style={{ display: "flex", gap: "clamp(.4rem,1vw,.8rem)", justifyContent: "center", marginTop: "clamp(.5rem,1vw,.8rem)", flexWrap: "wrap" }}>
            {[{ c: "#818cf8", l: "Player", shape: "circle" }, { c: "#f472b6", l: "AI", shape: "circle" }, { c: "#818cf8", l: "CARE" }, { c: "#f472b6", l: "CRAFT" }, { c: "#2dd4bf", l: "ACRE" }, { c: "#d97706", l: "Domain" }, { c: "#6b7280", l: "Event" }, { c: "#7c3aed", l: "Corner" }].map(x => <span key={x.l} style={{ display: "flex", alignItems: "center", gap: ".3rem", fontSize: "clamp(.65rem,1.1vw,.85rem)", color: "#94a3b8" }}><span style={{ width: x.shape === "circle" ? 14 : 12, height: x.shape === "circle" ? 14 : 12, background: x.c, borderRadius: x.shape === "circle" ? "50%" : 2, display: "inline-block", border: x.shape === "circle" ? "2px solid #fff" : "none" }} />{x.l}</span>)}
          </div>
        </main>

        {/* Activity Log Sidebar */}
        <aside aria-label="Activity log" style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.06)", borderRadius: 14, padding: "clamp(.6rem,1.5vw,1rem)", maxHeight: "calc(100vh - 160px)", overflowY: "auto" }}>
          <h2 style={{ fontSize: "clamp(.9rem,1.5vw,1.1rem)", fontWeight: 700, color: "#e2e8f0", marginBottom: ".7rem" }}>Activity Log</h2>
          {log.length === 0 && <p style={{ color: "#475569", fontSize: "clamp(.8rem,1.3vw,.95rem)" }}>Roll the dice to begin.</p>}
          {log.map(e => <div key={e.id} style={{ padding: "clamp(.3rem,.8vw,.5rem) clamp(.4rem,1vw,.6rem)", marginBottom: ".3rem", borderRadius: 8, background: ${logC[e.t] || "#e2e8f0"}10`, borderLeft: ${4px solid ${logC[e.t] || "#e2e8f0"}`, fontSize: "clamp(.75rem,1.2vw,.9rem)", color: logC[e.t] || "#e2e8f0", lineHeight: 1.5, animation: "fadeIn .25s ease" }}>{e.m}</div>)}
        </aside>
      </div>

      {/* Question Modal */}
      {scr === "question" && quest && (
        <div style={OV} role="dialog" aria-modal="true" aria-labelledby="q-t">
          <div style={{ ...MB, borderColor: (fwC[quest.fw] || "#818cf8") + "60" }}>
            <div style={{ display: "flex", alignItems: "center", gap: ".5rem", marginBottom: "1rem", flexWrap: "wrap" }}>
              <span style={{ background: ${fwC[quest.fw]}20`, border: ${1px solid ${fwC[quest.fw]}60`, borderRadius: 8, padding: ".3rem .8rem", fontSize: "clamp(.8rem,1.3vw,.95rem)", color: fwC[quest.fw], fontWeight: 700 }}>{quest.fw}</span>
              <span style={{ color: "#94a3b8", fontSize: "clamp(.8rem,1.3vw,.95rem)" }}>{quest.ph}</span>
              <span style={{ marginLeft: "auto", color: "#fbbf24", fontSize: "clamp(.8rem,1.3vw,.95rem)", fontWeight: 700 }}>+{quest.tok}</span>
            </div>
            <h2 id="q-t" style={{ color: "#e2e8f0", fontSize: "clamp(1rem,2vw,1.2rem)", fontWeight: 700, lineHeight: 1.6, marginBottom: "1.2rem" }}>{quest.q}</h2>
            <div role="radiogroup" aria-label="Answers">
              {quest.opts.map((o, i) => {
                const isP = pick === i; const isC = pick !== null && i === quest.ans;
                let bg = "rgba(255,255,255,.06)", bor = "rgba(255,255,255,.1)";
                if (isP && ok) { bg = "#10b98130"; bor = "#10b981"; } else if (isP && !ok) { bg = "#ef444430"; bor = "#ef4444"; } else if (isC && pick !== null) { bg = "#10b98120"; bor = "#10b981"; }
                return (
                  <button key={i} ref={el => { ansR.current[i] = el; }} role="radio" aria-checked={isP} tabIndex={fOpt === i ? 0 : -1} onClick={() => selAns(i)} onKeyDown={e => optKey(e, i)} disabled={pick !== null} style={{ display: "block", width: "100%", textAlign: "left", padding: "clamp(.65rem,1.5vw,1rem) clamp(.8rem,1.5vw,1.2rem)", marginBottom: ".6rem", background: bg, border: ${2px solid ${bor}`, borderRadius: 12, color: "#e2e8f0", fontSize: "clamp(.9rem,1.5vw,1.05rem)", minHeight: 52, fontFamily: "inherit", lineHeight: 1.5, cursor: pick !== null ? "default" : "pointer" }}>
                    <span style={{ fontWeight: 700, color: fwC[quest.fw], marginRight: ".5rem" }}>{String.fromCharCode(65 + i)}.</span>{o}
                  </button>
                );
              })}
            </div>
            {pick !== null && <div role="alert" style={{ marginTop: ".8rem", padding: "clamp(.5rem,1.2vw,.8rem)", borderRadius: 10, background: ok ? "#10b98118" : "#ef444418", border: ${1px solid ${ok ? "#10b981" : "#ef4444"}40`, color: ok ? "#6ee7b7" : "#fca5a5", fontSize: "clamp(.85rem,1.5vw,1rem)", fontWeight: 600 }}>{ok ? ${Correct! +${quest.tok} tokens.` : ${Incorrect. Answer: ${quest.opts[quest.ans]}`}</div>}
          </div>
        </div>
      )}

      {/* Event Modal */}
      {scr === "event" && evt && (
        <div style={OV} role="dialog" aria-modal="true" aria-labelledby="ev-t">
          <div style={{ ...MB, borderColor: evt.color + "60" }}>
            <div aria-hidden="true" style={{ fontSize: "clamp(2.5rem,6vw,4rem)", textAlign: "center", marginBottom: ".5rem" }}>{evt.icon}</div>
            <h2 id="ev-t" style={{ color: evt.color, fontSize: "clamp(1.2rem,2.5vw,1.6rem)", fontWeight: 900, textAlign: "center", marginBottom: ".3rem" }}>{evt.label}</h2>
            <p style={{ color: "#94a3b8", textAlign: "center", fontSize: "clamp(.9rem,1.5vw,1.1rem)", marginBottom: "1.5rem" }}>{evt.sub}</p>
            <button onClick={contEvt} autoFocus style={{ ...B("linear-gradient(135deg,#6366f1,#8b5cf6)"), width: "100%" }}>Continue</button>
          </div>
        </div>
      )}



      {/* Badge Alert */}
      {bdgA && (() => {
        const b = BADGES.find(x => x.id === bdgA); if (!b) return null;
        return (
          <div style={OV} role="dialog" aria-modal="true" aria-label={`${b.name}`}>
            <div style={{ ...MB, borderColor: b.color + "60", textAlign: "center", animation: "pop .4s cubic-bezier(.175,.885,.32,1.275)" }}>
              <div aria-hidden="true" style={{ fontSize: "clamp(3rem,8vw,5rem)", marginBottom: ".5rem" }}>{b.icon}</div>
              <h2 style={{ color: b.color, fontSize: "clamp(1.3rem,2.5vw,1.7rem)", fontWeight: 900, marginBottom: ".3rem" }}>Badge Earned!</h2>
              <p style={{ color: "#fbbf24", fontSize: "clamp(1.1rem,2vw,1.3rem)", fontWeight: 700, marginBottom: ".3rem" }}>{b.name}</p>
              <p style={{ color: "#94a3b8", fontSize: "clamp(.85rem,1.5vw,1rem)", marginBottom: "1.5rem" }}>{b.desc}</p>
              <button onClick={() => { setBdgA(null); setTimeout(() => rollR.current?.focus(), 100); }} autoFocus style={B(`linear-gradient(135deg,${b.color},${b.color}cc)`)}>Continue</button>
            </div>
          </div>
        );
      })()}

      {/* Help Modal */}
      {help && (
        <div style={OV} role="dialog" aria-modal="true" aria-labelledby="help-t">
          <div style={{ ...MB, maxHeight: "85vh", overflowY: "auto" }}>
            <h2 id="help-t" style={{ color: "#e2e8f0", fontSize: "clamp(1.2rem,2.5vw,1.5rem)", fontWeight: 700, marginBottom: "1rem" }}>How to Play</h2>
            <div style={{ color: "#94a3b8", fontSize: "clamp(.9rem,1.5vw,1.05rem)", lineHeight: 1.8 }}>
              <p style={{ marginBottom: ".8rem" }}><strong style={{ color: "#e2e8f0" }}>Objective:</strong> Earn all 5 badges or have the most tokens after 3 laps.</p>
              <p style={{ marginBottom: ".8rem" }}><strong style={{ color: "#818cf8" }}>CARE spaces:</strong> Consider, Analyze, Reflect, Evaluate. 3 correct = CARE Master.</p>
              <p style={{ marginBottom: ".8rem" }}><strong style={{ color: "#f472b6" }}>CRAFT spaces:</strong> Context, Role, Action, Format, Threshold. 3 correct = CRAFT Expert.</p>
              <p style={{ marginBottom: ".8rem" }}><strong style={{ color: "#2dd4bf" }}>ACRE spaces:</strong> Accuracy, Completeness, Relevance, Equity. 3 correct = ACRE Evaluator.</p>
              <p style={{ marginBottom: ".8rem" }}><strong style={{ color: "#fbbf24" }}>Domains:</strong> Land on domain spaces to claim them. 4+ = Domain Champion.</p>
              <p style={{ marginBottom: ".8rem" }}><strong style={{ color: "#ef4444" }}>Events:</strong> Breakthroughs, Hallucinations, Bias Traps, Deepfakes, Innovation Hubs.</p>
              <p style={{ marginBottom: ".8rem" }}><strong style={{ color: "#818cf8" }}>Player piece</strong> = purple circle with your initial. <strong style={{ color: "#f472b6" }}>AI piece</strong> = pink circle. Both pieces animate when moving!</p>
              <p style={{ marginBottom: ".8rem" }}><strong style={{ color: "#e2e8f0" }}>Keyboard:</strong> Tab to navigate, Enter/Space to select, Arrow keys for answers, Escape to close.</p>
            </div>
            <button onClick={() => setHelp(false)} autoFocus style={{ ...B("linear-gradient(135deg,#6366f1,#8b5cf6)"), width: "100%", marginTop: "1rem" }}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
                    }
