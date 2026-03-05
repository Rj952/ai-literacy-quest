"use client";
import { useState, useEffect, useCallback, useRef } from "react";

/* ═══════════════════════════════════════════════════════════════
   AI LITERACY QUEST — WCAG 2.1 AA Accessible Board Game
   Dr. Rohan Jowallah, Ed.D., FHEA
   Frameworks: CARE · CRAFT · ACRE
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
  { id:0, type:"start", label:"START", sub:"Collect 20 Tokens", color:"#10b981", icon:"🚀" },
  { id:1, type:"care", label:"CONSIDER", sub:"CARE", color:"#818cf8", icon:"🤔" },
  { id:2, type:"domain", label:"AI Basics", sub:"Claim Domain", color:"#d97706", icon:"🧠" },
  { id:3, type:"craft", label:"CONTEXT", sub:"CRAFT", color:"#f472b6", icon:"✏️" },
  { id:4, type:"acre", label:"ACCURACY", sub:"ACRE", color:"#2dd4bf", icon:"✅" },
  { id:5, type:"event", label:"Breakthrough", sub:"Advance 3", color:"#10b981", icon:"⚡", fx:"advance3" },
  { id:6, type:"domain", label:"Prompt Eng.", sub:"Claim Domain", color:"#d97706", icon:"💬" },
  { id:7, type:"care", label:"ANALYZE", sub:"CARE", color:"#818cf8", icon:"🔍" },
  { id:8, type:"event", label:"Digital Divide", sub:"Miss 1 turn", color:"#ef4444", icon:"📵", fx:"missturn" },
  { id:9, type:"craft", label:"ROLE", sub:"CRAFT", color:"#f472b6", icon:"🎭" },
  { id:10, type:"domain", label:"AI Ethics", sub:"Claim Domain", color:"#d97706", icon:"⚖️" },
  { id:11, type:"corner", label:"ETHICS LAB", sub:"Free Thinking", color:"#7c3aed", icon:"🔬" },
  { id:12, type:"acre", label:"COMPLETENESS", sub:"ACRE", color:"#2dd4bf", icon:"📋" },
  { id:13, type:"event", label:"Hallucination!", sub:"Lose 10 Tokens", color:"#ef4444", icon:"👻", fx:"lose10" },
  { id:14, type:"craft", label:"ACTION", sub:"CRAFT", color:"#f472b6", icon:"⚡" },
  { id:15, type:"domain", label:"Data Literacy", sub:"Claim Domain", color:"#d97706", icon:"📊" },
  { id:16, type:"care", label:"REFLECT", sub:"CARE", color:"#818cf8", icon:"💭" },
  { id:17, type:"event", label:"Bias Trap!", sub:"Go back 2", color:"#ef4444", icon:"⚠️", fx:"back2" },
  { id:18, type:"domain", label:"AI & Society", sub:"Claim Domain", color:"#d97706", icon:"🌍" },
  { id:19, type:"acre", label:"RELEVANCE", sub:"ACRE", color:"#2dd4bf", icon:"🎯" },
  { id:20, type:"event", label:"Innovation Hub", sub:"+15 Tokens", color:"#10b981", icon:"🏆", fx:"bonus15" },
  { id:21, type:"corner", label:"DIGITAL EQUITY", sub:"Collect 10", color:"#7c3aed", icon:"🌐" },
  { id:22, type:"craft", label:"FORMAT", sub:"CRAFT", color:"#f472b6", icon:"📝" },
  { id:23, type:"domain", label:"Creative AI", sub:"Claim Domain", color:"#d97706", icon:"🎨" },
  { id:24, type:"care", label:"EVALUATE", sub:"CARE", color:"#818cf8", icon:"📏" },
  { id:25, type:"event", label:"Deepfake Alert!", sub:"Lose 15 Tokens", color:"#ef4444", icon:"🚨", fx:"lose15" },
  { id:26, type:"domain", label:"AI Governance", sub:"Claim Domain", color:"#d97706", icon:"📜" },
  { id:27, type:"acre", label:"EQUITY", sub:"ACRE", color:"#2dd4bf", icon:"⚖️" },
  { id:28, type:"craft", label:"THRESHOLD", sub:"CRAFT", color:"#f472b6", icon:"🎚️" },
  { id:29, type:"event", label:"AI Literacy Win!", sub:"+20 Tokens", color:"#10b981", icon:"🌟", fx:"bonus20" },
  { id:30, type:"domain", label:"Future of Work", sub:"Claim Domain", color:"#d97706", icon:"🔮" },
  { id:31, type:"corner", label:"SUMMIT", sub:"Double Next Roll", color:"#7c3aed", icon:"⛰️" },
];

const BADGES = [
  { id:"care", name:"CARE Master", desc:"Mastered Consider, Analyze, Reflect, Evaluate", icon:"🧠", color:"#818cf8" },
  { id:"craft", name:"CRAFT Expert", desc:"Expert in Context, Role, Action, Format, Threshold", icon:"✏️", color:"#f472b6" },
  { id:"acre", name:"ACRE Evaluator", desc:"Proficient in Accuracy, Completeness, Relevance, Equity", icon:"✅", color:"#2dd4bf" },
  { id:"domains", name:"Domain Champion", desc:"Claimed 4+ AI literacy domains", icon:"🏆", color:"#fbbf24" },
  { id:"champion", name:"AI Literacy Champion", desc:"Certified by Dr. Rohan Jowallah, Ed.D., FHEA", icon:"🌟", color:"#10b981" },
];

function pos(idx){const n=8,g=10,s=Math.floor(idx/n),p=idx%n;if(s===0)return{c:p+1,r:g};if(s===1)return{c:g,r:g-p};if(s===2)return{c:g-p,r:1};return{c:1,r:p+1};}

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
@media(prefers-reduced-motion:reduce){*{animation-duration:0s!important;transition-duration:0s!important;}}
`;

const fwC = {CARE:"#818cf8",CRAFT:"#f472b6",ACRE:"#2dd4bf"};
const logC = {success:"#6ee7b7",danger:"#fca5a5",warn:"#fde68a",info:"#e2e8f0",ai:"#c4b5fd",domain:"#fbbf24"};
const dice = ["⚀","⚁","⚂","⚃","⚄","⚅"];

export default function Game() {
  const [scr, setScr] = useState("intro");
  const [pPos, setPPos] = useState(0);
  const [aPos, setAPos] = useState(0);
  const [pTok, setPTok] = useState(20);
  const [aTok, setATok] = useState(20);
  const [pPrg, setPPrg] = useState({care:0,craft:0,acre:0});
  const [aPrg, setAPrg] = useState({care:0,craft:0,acre:0});
  const [pBdg, setPBdg] = useState([]);
  const [aBdg, setABdg] = useState([]);
  const [pDom, setPDom] = useState([]);
  const [aDom, setADom] = useState([]);
  const [turn, setTurn] = useState("player");
  const [dv, setDv] = useState([1,1]);
  const [rlng, setRlng] = useState(false);
  const [quest, setQuest] = useState(null);
  const [pick, setPick] = useState(null);
  const [ok, setOk] = useState(null);
  const [log, setLog] = useState([]);
  const [evt, setEvt] = useState(null);
  const [laps, setLaps] = useState({p:0,a:0});
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

  const rollR = useRef(null);
  const nmR = useRef(null);
  const ansR = useRef([]);

  const say = useCallback(m=>{setLive("");setTimeout(()=>setLive(m),40);},[]);
  const shout = useCallback(m=>{setAsrt("");setTimeout(()=>setAsrt(m),40);},[]);
  const addLog = useCallback((m,t="info")=>{setLog(p=>[{m,t,id:Date.now()+Math.random()},...p.slice(0,29)]);say(m);},[say]);
  const rQ = useCallback(t=>{const p={care:CARE_QS,craft:CRAFT_QS,acre:ACRE_QS}[t]||ACRE_QS;return p[Math.floor(Math.random()*p.length)];},[]);

  const awBdg = useCallback((prg,bdg,dom,who)=>{
    const nb=[...bdg];
    const ck=(id,c)=>{if(c&&!nb.includes(id)){nb.push(id);if(who==="p")setBdgA(id);}};
    ck("care",prg.care>=3);ck("craft",prg.craft>=3);ck("acre",prg.acre>=3);
    ck("domains",dom.length>=4);ck("champion",["care","craft","acre","domains"].every(b=>nb.includes(b)));
    return nb;
  },[]);

  const apFx = useCallback((sp,who,sT,sP)=>{
    const isP=who!=="AI Opponent";
    switch(sp.fx){
      case"advance3":sP(p=>(p+3)%32);addLog(`${who}: Breakthrough — advanced 3!`,"success");break;
      case"missturn":if(isP)setSkip(true);addLog(`${who}: Digital Divide — miss turn.`,"warn");break;
      case"lose10":sT(t=>Math.max(0,t-10));addLog(`${who}: Hallucination — lost 10 tokens.`,"danger");break;
      case"lose15":sT(t=>Math.max(0,t-15));addLog(`${who}: Deepfake Alert — lost 15 tokens.`,"danger");break;
      case"back2":sP(p=>Math.max(0,p-2));addLog(`${who}: Bias Trap — back 2 spaces.`,"warn");break;
      case"bonus15":sT(t=>t+15);addLog(`${who}: Innovation Hub — +15 tokens!`,"success");break;
      case"bonus20":sT(t=>t+20);addLog(`${who}: AI Literacy Win — +20 tokens!`,"success");break;
    }
  },[addLog]);

  // AI auto-play
  useEffect(()=>{
    if(turn!=="ai"||scr!=="play")return;
    const tm=setTimeout(()=>{
      const d1=Math.ceil(Math.random()*6),d2=Math.ceil(Math.random()*6),tot=d1+d2;
      setDv([d1,d2]);addLog(`AI Opponent rolled ${d1}+${d2}=${tot}.`,"ai");
      setAPos(prev=>{
        const np=(prev+tot)%32;
        if(np<prev){setATok(t=>t+20);addLog("AI passed START — +20 tokens.","success");setLaps(l=>({...l,a:l.a+1}));}
        const sp=BOARD[np];
        if(["care","craft","acre"].includes(sp.type)){
          const q=rQ(sp.type);const good=Math.random()<0.7;
          if(good){setATok(t=>t+q.tok);setAPrg(p=>{const np2={...p,[sp.type]:p[sp.type]+1};setABdg(b=>awBdg(np2,b,aDom,"ai"));return np2;});addLog(`AI answered ${q.ph} correctly — +${q.tok} tokens.`,"ai");}
          else addLog(`AI answered ${q.ph} incorrectly.`,"warn");
        }else if(sp.type==="domain"){
          setADom(d=>{if(!d.includes(sp.label)){setATok(t=>t+10);addLog(`AI claimed "${sp.label}" domain.`,"ai");const nd=[...d,sp.label];setABdg(b=>awBdg(aPrg,b,nd,"ai"));return nd;}return d;});
        }else if(sp.type==="event"){apFx(sp,"AI Opponent",setATok,setAPos);}
        else if(sp.type==="corner"&&np===21){setATok(t=>t+10);addLog("AI reached Digital Equity — +10 tokens.","success");}
        return np;
      });
      setTimeout(()=>{setTurn("player");say(`Your turn, ${nm}!`);setTimeout(()=>rollR.current?.focus(),200);},1000);
    },700);
    return()=>clearTimeout(tm);
  },[turn,scr,addLog,rQ,awBdg,apFx,aDom,aPrg,nm,say]);

  // Win check
  useEffect(()=>{
    if(scr!=="play")return;
    if(pBdg.includes("champion")){setWin("p");setScr("end");return;}
    if(aBdg.includes("champion")){setWin("ai");setScr("end");return;}
    if(laps.p>=3&&laps.a>=3){setWin(pTok>aTok?"p":aTok>pTok?"ai":"tie");setScr("end");}
  },[pBdg,aBdg,laps,pTok,aTok,scr]);

  // Escape to close modals
  useEffect(()=>{
    const h=e=>{if(e.key==="Escape"){if(bdgA)setBdgA(null);if(help)setHelp(false);}};
    window.addEventListener("keydown",h);return()=>window.removeEventListener("keydown",h);
  },[bdgA,help]);

  // Roll dice
  const roll = useCallback(()=>{
    if(rlng||turn!=="player"||scr!=="play")return;
    if(skip){setSkip(false);addLog(`${nm} skipped turn (Digital Divide).`,"warn");setTurn("ai");return;}
    setRlng(true);let cnt=0;
    const iv=setInterval(()=>{setDv([Math.ceil(Math.random()*6),Math.ceil(Math.random()*6)]);cnt++;
      if(cnt>=8){clearInterval(iv);
        const d1=Math.ceil(Math.random()*6),d2=Math.ceil(Math.random()*6);
        let tot=d1+d2;const wasD=dbl;if(wasD){tot*=2;setDbl(false);}
        setDv([d1,d2]);setRlng(false);
        addLog(`${nm} rolled ${d1}+${d2}${wasD?" (doubled)":""}=${tot}.`,"info");
        setPPos(prev=>{
          const np=(prev+tot)%32;
          if(np<prev){setPTok(t=>t+20);addLog(`${nm} passed START — +20 tokens!`,"success");setLaps(l=>({...l,p:l.p+1}));}
          const sp=BOARD[np];
          if(["care","craft","acre"].includes(sp.type)){
            setTimeout(()=>{setQuest({...rQ(sp.type),key:sp.type});setFOpt(0);setScr("question");},400);
          }else if(sp.type==="domain"){
            setPDom(d=>{
              if(!d.includes(sp.label)){setPTok(t=>t+10);addLog(`${nm} claimed "${sp.label}" — +10 tokens!`,"domain");const nd=[...d,sp.label];setPBdg(b=>awBdg(pPrg,b,nd,"p"));return nd;}
              addLog(`${nm} visited "${sp.label}" — already claimed.`,"info");setTimeout(()=>setTurn("ai"),300);return d;
            });
          }else if(sp.type==="event"){setTimeout(()=>{setEvt({...sp,who:nm});setScr("event");},400);}
          else if(sp.type==="corner"){
            if(np===21){setPTok(t=>t+10);addLog(`${nm} reached Digital Equity — +10 tokens!`,"success");}
            if(np===31){setDbl(true);addLog(`${nm} reached Summit — next roll doubled!`,"info");}
            setTimeout(()=>setTurn("ai"),300);
          }else setTimeout(()=>setTurn("ai"),300);
          return np;
        });
      }
    },80);
  },[rlng,turn,scr,skip,dbl,addLog,nm,rQ,awBdg,pPrg]);

  // Answer selection
  const selAns = useCallback(idx=>{
    if(pick!==null||!quest)return;setPick(idx);
    const isOk=idx===quest.ans;setOk(isOk);
    if(isOk){setPTok(t=>t+quest.tok);setPPrg(p=>{const np={...p,[quest.key]:p[quest.key]+1};setPBdg(b=>awBdg(np,b,pDom,"p"));return np;});addLog(`Correct! +${quest.tok} tokens — ${quest.fw} ${quest.ph}.`,"success");shout(`Correct! +${quest.tok} tokens.`);}
    else{addLog(`Incorrect. Answer: ${quest.opts[quest.ans]}`,"danger");shout(`Incorrect. Answer: ${quest.opts[quest.ans]}`);}
    setTimeout(()=>{setQuest(null);setPick(null);setOk(null);setScr("play");setTurn("ai");setTimeout(()=>rollR.current?.focus(),300);},2400);
  },[pick,quest,addLog,shout,awBdg,pDom]);

  const contEvt = useCallback(()=>{
    if(!evt)return;apFx(evt,evt.who,setPTok,setPPos);setEvt(null);setScr("play");setTurn("ai");setTimeout(()=>rollR.current?.focus(),300);
  },[evt,apFx]);

  const reset=()=>{setScr("intro");setPPos(0);setAPos(0);setPTok(20);setATok(20);setPPrg({care:0,craft:0,acre:0});setAPrg({care:0,craft:0,acre:0});setPBdg([]);setABdg([]);setPDom([]);setADom([]);setTurn("player");setDv([1,1]);setLog([]);setLaps({p:0,a:0});setWin(null);setDbl(false);setSkip(false);setNmV(nm);};

  function start(){const n=nmV.trim();if(!n){setNmE("Please enter your name.");nmR.current?.focus();return;}setNm(n);setNmE("");setScr("play");addLog(`Welcome, ${n}! AI Literacy Quest begins.`,"success");setTimeout(()=>rollR.current?.focus(),300);}

  // Arrow keys in question modal
  useEffect(()=>{if(scr==="question")ansR.current[fOpt]?.focus();},[fOpt,scr]);

  const optKey=(e,idx)=>{
    if(!quest)return;
    if(e.key==="ArrowDown"||e.key==="ArrowRight"){e.preventDefault();setFOpt(i=>Math.min(i+1,quest.opts.length-1));}
    else if(e.key==="ArrowUp"||e.key==="ArrowLeft"){e.preventDefault();setFOpt(i=>Math.max(i-1,0));}
    else if(e.key==="Enter"||e.key===" "){e.preventDefault();selAns(idx);}
  };

  const B=(bg)=>({background:bg,color:"#fff",border:"2px solid transparent",borderRadius:10,padding:".85rem 2rem",fontSize:"1rem",fontWeight:700,minHeight:48,fontFamily:"inherit"});
  const OV={position:"fixed",inset:0,background:"rgba(0,0,0,.7)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:100,padding:"1rem"};
  const MB={background:"#1a1333",border:"1px solid rgba(129,140,248,.3)",borderRadius:16,padding:"2rem",maxWidth:560,width:"100%",animation:"modalIn .22s ease"};

  // ── INTRO ────────────────────────────────────────────────────
  if(scr==="intro")return(
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#080612,#0f0c29,#180a36)",display:"flex",alignItems:"center",justifyContent:"center",padding:"2rem"}}>
      <style>{CSS}</style>
      <a href="#intro-main" className="skip">Skip to main content</a>
      <main id="intro-main" style={{maxWidth:660,width:"100%"}}>
        <header style={{textAlign:"center",marginBottom:"2rem"}}>
          <div aria-hidden="true" style={{fontSize:"3.5rem",lineHeight:1,marginBottom:".5rem"}}>🎓</div>
          <h1 style={{fontSize:"clamp(1.8rem,5vw,3rem)",fontWeight:900,background:"linear-gradient(135deg,#a78bfa,#f472b6,#2dd4bf)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",margin:"0 0 .4rem"}}>AI Literacy Quest</h1>
          <p style={{color:"#c4b5fd",fontSize:"1.05rem",margin:"0 0 .2rem"}}>The Board Game of Frameworks, Badges & AI Mastery</p>
          <p style={{color:"#7c3aed",fontSize:".78rem",letterSpacing:"2px",margin:0}}>CARE · CRAFT · ACRE — Dr. Rohan Jowallah, Ed.D., FHEA</p>
        </header>
        <section aria-labelledby="fw-h" style={{background:"rgba(255,255,255,.04)",border:"1px solid rgba(129,140,248,.3)",borderRadius:14,padding:"1.5rem",marginBottom:"1.4rem"}}>
          <h2 id="fw-h" style={{color:"#e2e8f0",fontSize:"1rem",fontWeight:700,marginBottom:"1rem"}}>Three Frameworks to Master</h2>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(155px,1fr))",gap:".8rem"}}>
            {[{n:"CARE",c:"#818cf8",items:["Consider","Analyze","Reflect","Evaluate"]},{n:"CRAFT",c:"#f472b6",items:["Context","Role","Action","Format","Threshold"]},{n:"ACRE",c:"#2dd4bf",items:["Accuracy","Completeness","Relevance","Equity"]}].map(f=>(
              <div key={f.n} style={{background:`${f.c}12`,border:`1px solid ${f.c}40`,borderRadius:10,padding:".9rem"}}>
                <h3 style={{color:f.c,fontWeight:800,fontSize:"1rem",margin:"0 0 .5rem"}}>{f.n}</h3>
                <ul style={{margin:0,padding:"0 0 0 1rem",listStyle:"disc"}}>{f.items.map(i=><li key={i} style={{color:"#d1d5db",fontSize:".8rem",lineHeight:1.6}}>{i}</li>)}</ul>
              </div>
            ))}
          </div>
          <p style={{color:"#94a3b8",fontSize:".85rem",lineHeight:1.7,marginTop:"1rem",marginBottom:0}}>
            Move around a 32-space board, answer framework challenges, claim AI literacy domains, and earn all 5 badges to become the <strong style={{color:"#fbbf24"}}>AI Literacy Champion</strong>. You play against an AI opponent that auto-plays after your turn.
          </p>
        </section>
        <section aria-labelledby="rules-h" style={{background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.08)",borderRadius:14,padding:"1.5rem",marginBottom:"1.4rem"}}>
          <h2 id="rules-h" style={{color:"#e2e8f0",fontSize:"1rem",fontWeight:700,marginBottom:".8rem"}}>How to Play</h2>
          <ol style={{margin:0,padding:"0 0 0 1.4rem",color:"#94a3b8",fontSize:".85rem",lineHeight:1.8}}>
            <li>Enter your name and press Begin Quest.</li>
            <li>Roll two dice. Move around the 32-space board.</li>
            <li>Land on CARE/CRAFT/ACRE spaces to answer framework questions for tokens.</li>
            <li>Claim AI literacy domains by landing on domain spaces.</li>
            <li>Watch for event spaces: Hallucinations, Bias Traps, Deepfakes!</li>
            <li>Earn badges: 3 correct CARE = CARE Master, 3 CRAFT = CRAFT Expert, 3 ACRE = ACRE Evaluator, 4+ domains = Domain Champion.</li>
            <li>Earn all 4 badges to unlock AI Literacy Champion and win!</li>
            <li>Alternative win: after 3 laps each, most tokens wins.</li>
          </ol>
        </section>
        <section aria-labelledby="setup-h" style={{background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.1)",borderRadius:14,padding:"1.5rem",marginBottom:"1.2rem"}}>
          <h2 id="setup-h" style={{color:"#e2e8f0",fontSize:"1rem",fontWeight:700,marginBottom:"1rem"}}>Player Setup</h2>
          <div style={{marginBottom:"1rem"}}>
            <label htmlFor="pname" style={{display:"block",color:"#c4b5fd",fontWeight:600,marginBottom:".4rem",fontSize:".95rem"}}>Your name</label>
            <input id="pname" ref={nmR} type="text" value={nmV} maxLength={30} onChange={e=>{setNmV(e.target.value);setNmE("");}} onKeyDown={e=>{if(e.key==="Enter")start();}} aria-describedby={nmE?"pname-err":"pname-hint"} aria-invalid={!!nmE} autoComplete="given-name" style={{background:"rgba(255,255,255,.08)",border:`1px solid ${nmE?"#f87171":"rgba(129,140,248,.5)"}`,borderRadius:8,padding:".75rem 1rem",color:"#fff",fontSize:"1rem",width:"100%",fontFamily:"inherit"}} />
            {nmE&&<p id="pname-err" role="alert" style={{color:"#fca5a5",fontSize:".8rem",marginTop:".3rem"}}>{nmE}</p>}
            <p id="pname-hint" style={{color:"#64748b",fontSize:".75rem",marginTop:".3rem"}}>Up to 30 characters. Press Enter or click below.</p>
          </div>
          <button onClick={start} style={{...B("linear-gradient(135deg,#6366f1,#8b5cf6)"),width:"100%"}}><span aria-hidden="true">🎲 </span>Begin Quest</button>
        </section>
        <p style={{color:"#475569",fontSize:".75rem",textAlign:"center"}}>Keyboard accessible. Screen reader support. Reduced motion respected.</p>
      </main>
    </div>
  );

  // ── GAME OVER ────────────────────────────────────────────────
  if(scr==="end"){
    const pw=win==="p",tie=win==="tie";
    return(
      <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#080612,#0f0c29)",display:"flex",alignItems:"center",justifyContent:"center",padding:"2rem"}}>
        <style>{CSS}</style>
        <main style={{maxWidth:640,width:"100%",textAlign:"center"}}>
          <div aria-hidden="true" style={{fontSize:"5rem",marginBottom:".8rem"}}>{tie?"🤝":pw?"🏆":"🤖"}</div>
          <h1 style={{fontSize:"clamp(2rem,5vw,2.8rem)",fontWeight:900,background:pw?"linear-gradient(135deg,#fbbf24,#f59e0b)":"linear-gradient(135deg,#94a3b8,#64748b)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",marginBottom:".5rem"}}>{tie?"It\'s a Tie!":pw?`${nm} Wins!`:"AI Opponent Wins!"}</h1>
          <p style={{color:"#c4b5fd",fontSize:"1rem",marginBottom:"2rem"}}>{pw?"Outstanding AI Literacy mastery!":tie?"An incredible battle.":"Ready for a rematch?"}</p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem",marginBottom:"2rem"}}>
            {[{n:nm,tok:pTok,bdg:pBdg,dom:pDom,c:"#818cf8"},{n:"AI Opponent",tok:aTok,bdg:aBdg,dom:aDom,c:"#f472b6"}].map(p=>(
              <section key={p.n} aria-label={`${p.n} score`} style={{background:"rgba(255,255,255,.04)",border:`1px solid ${p.c}40`,borderRadius:12,padding:"1.2rem"}}>
                <h2 style={{color:p.c,fontWeight:700,fontSize:"1rem",marginBottom:".7rem"}}>{p.n}</h2>
                <p style={{color:"#fbbf24",fontSize:"1.5rem",fontWeight:700,margin:"0 0 .8rem"}}><span aria-label={`${p.tok} tokens`}>{p.tok}</span><span aria-hidden="true"> 🪙</span></p>
                <div style={{display:"flex",flexWrap:"wrap",gap:".3rem",justifyContent:"center"}}>
                  {BADGES.filter(b=>p.bdg.includes(b.id)).map(b=><span key={b.id} style={{background:`${b.color}20`,border:`1px solid ${b.color}60`,borderRadius:20,padding:".2rem .6rem",fontSize:".7rem",color:b.color}}><span aria-hidden="true">{b.icon} </span>{b.name}</span>)}
                  {p.bdg.length===0&&<span style={{color:"#475569",fontSize:".75rem"}}>No badges</span>}
                </div>
              </section>
            ))}
          </div>
          {pw&&pBdg.includes("champion")&&(
            <section aria-label="Certificate" style={{background:"rgba(251,191,36,.08)",border:"2px solid #fbbf24",borderRadius:14,padding:"1.5rem",marginBottom:"2rem"}}>
              <div aria-hidden="true" style={{fontSize:"2rem",marginBottom:".5rem"}}>🌟 📜</div>
              <h2 style={{color:"#fbbf24",fontSize:"1.2rem",fontWeight:700}}>Certificate of AI Literacy</h2>
              <p style={{color:"#e2e8f0",fontSize:".9rem",margin:".5rem 0"}}>This certifies that <strong>{nm}</strong> has mastered the CARE, CRAFT, and ACRE frameworks</p>
              <p style={{color:"#10b981",fontWeight:900,fontSize:"1.3rem",margin:".5rem 0"}}>AI Literacy Champion</p>
              <p style={{color:"#94a3b8",fontSize:".75rem"}}>Awarded by Dr. Rohan Jowallah, Ed.D., FHEA · AI, Pedagogy and Inclusion</p>
            </section>
          )}
          <button onClick={reset} style={B("linear-gradient(135deg,#6366f1,#8b5cf6)")}><span aria-hidden="true">🔄 </span>Play Again</button>
        </main>
      </div>
    );
  }

  // ── PLAYING ──────────────────────────────────────────────────
  const CZ=58;
  return(
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#080612,#0f0c29,#180a36)",color:"#e2e8f0"}}>
      <style>{CSS}</style>
      <div role="status" aria-live="polite" aria-atomic="true" style={{position:"absolute",left:"-9999px",width:"1px",height:"1px",overflow:"hidden"}}>{live}</div>
      <div role="alert" aria-live="assertive" aria-atomic="true" style={{position:"absolute",left:"-9999px",width:"1px",height:"1px",overflow:"hidden"}}>{asrt}</div>
      <a href="#board" className="skip">Skip to game board</a>

      <header style={{textAlign:"center",padding:".7rem 1rem .4rem",borderBottom:"1px solid rgba(99,102,241,.15)"}}>
        <h1 style={{fontSize:"clamp(1rem,3vw,1.4rem)",fontWeight:900,background:"linear-gradient(135deg,#a78bfa,#f472b6,#2dd4bf)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",margin:0}}>AI Literacy Quest</h1>
        <p style={{color:"#7c3aed",fontSize:".65rem",letterSpacing:"1.5px",margin:0}}>CARE · CRAFT · ACRE — Dr. Rohan Jowallah</p>
      </header>

      <nav aria-label="Scores" style={{display:"flex",justifyContent:"center",gap:"1rem",padding:".6rem 1rem",flexWrap:"wrap",borderBottom:"1px solid rgba(255,255,255,.05)"}}>
        {[{l:nm,t:pTok,b:pBdg,c:"#818cf8",lp:laps.p},{l:"AI Opponent",t:aTok,b:aBdg,c:"#f472b6",lp:laps.a}].map(p=>(
          <div key={p.l} aria-label={`${p.l}: ${p.t} tokens, ${p.b.length} badges, lap ${p.lp}`} style={{display:"flex",alignItems:"center",gap:".5rem",background:"rgba(255,255,255,.04)",borderRadius:8,padding:".4rem .8rem",border:`1px solid ${p.c}30`}}>
            <span style={{color:p.c,fontWeight:700,fontSize:".85rem"}}>{p.l}</span>
            <span style={{color:"#fbbf24",fontWeight:700,fontSize:".85rem"}}>{p.t}<span aria-hidden="true"> 🪙</span></span>
            <span style={{color:"#94a3b8",fontSize:".7rem"}}>Lap {p.lp}/3</span>
            <span style={{color:"#94a3b8",fontSize:".7rem"}}>{p.b.length}<span aria-hidden="true"> 🏅</span></span>
          </div>
        ))}
        <button onClick={()=>setHelp(true)} aria-label="Help" style={{background:"rgba(255,255,255,.08)",border:"1px solid rgba(255,255,255,.15)",borderRadius:8,padding:".4rem .8rem",color:"#e2e8f0",fontSize:".8rem",fontFamily:"inherit",minHeight:36}}><span aria-hidden="true">❓ </span>Help</button>
      </nav>

      <div style={{display:"grid",gridTemplateColumns:"1fr 300px",gap:"1rem",padding:"1rem",maxWidth:1200,margin:"0 auto"}}>
        <main id="board" aria-label="Game board">
          <div style={{display:"grid",gridTemplateColumns:`repeat(10,${CZ}px)`,gridTemplateRows:`repeat(10,${CZ}px)`,gap:2,justifyContent:"center"}}>
            {BOARD.map(sp=>{
              const p=pos(sp.id);const hasP=pPos===sp.id;const hasA=aPos===sp.id;
              return(
                <div key={sp.id} aria-label={`Space ${sp.id}: ${sp.label}${hasP?` - ${nm} here`:""}${hasA?" - AI here":""}`} style={{gridColumn:p.c,gridRow:p.r,background:`${sp.color}18`,border:`2px solid ${sp.color}50`,borderRadius:6,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",position:"relative",fontSize:".55rem",padding:"2px",textAlign:"center"}}>
                  <span aria-hidden="true" style={{fontSize:"1rem",lineHeight:1}}>{sp.icon}</span>
                  <span style={{color:sp.color,fontWeight:700,lineHeight:1.1,marginTop:1}}>{sp.label}</span>
                  {hasP&&<div aria-hidden="true" style={{position:"absolute",top:-4,left:-4,width:16,height:16,background:"#818cf8",borderRadius:"50%",border:"2px solid #fff",boxShadow:"0 0 6px #818cf8"}}/>}
                  {hasA&&<div aria-hidden="true" style={{position:"absolute",top:-4,right:-4,width:16,height:16,background:"#f472b6",borderRadius:"50%",border:"2px solid #fff",boxShadow:"0 0 6px #f472b6"}}/>}
                </div>
              );
            })}
            {/* Center area */}
            <div style={{gridColumn:"3/9",gridRow:"3/9",background:"rgba(99,102,241,.06)",borderRadius:14,border:"1px solid rgba(99,102,241,.15)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"1rem"}}>
              <div aria-label={`Dice: ${dv[0]} and ${dv[1]}`} style={{display:"flex",gap:".8rem",marginBottom:".8rem"}}>
                {dv.map((d,i)=><span key={i} aria-hidden="true" style={{fontSize:"2.5rem",lineHeight:1,animation:rlng?"spin .12s infinite":"none"}}>{dice[d-1]}</span>)}
              </div>
              <button ref={rollR} onClick={roll} disabled={turn!=="player"||rlng} aria-label={turn==="player"?"Roll dice":"Waiting for AI"} style={{...B(turn==="player"?"linear-gradient(135deg,#6366f1,#8b5cf6)":"#374151"),padding:".7rem 1.5rem",fontSize:".95rem",minWidth:160}}>
                {rlng?"Rolling...":turn==="player"?"🎲 Roll Dice":"⏳ AI Turn..."}
              </button>
              {dbl&&<p style={{color:"#fbbf24",fontSize:".75rem",marginTop:".5rem",fontWeight:700}}>Next roll doubled!</p>}
              <div style={{marginTop:".8rem",width:"100%",maxWidth:280}}>
                {[{l:"CARE",v:pPrg.care,c:"#818cf8"},{l:"CRAFT",v:pPrg.craft,c:"#f472b6"},{l:"ACRE",v:pPrg.acre,c:"#2dd4bf"}].map(p=>(
                  <div key={p.l} style={{display:"flex",alignItems:"center",gap:".4rem",marginBottom:".3rem"}}>
                    <span style={{color:p.c,fontSize:".6rem",fontWeight:700,width:40,textAlign:"right"}}>{p.l}</span>
                    <div role="progressbar" aria-valuenow={p.v} aria-valuemin={0} aria-valuemax={3} aria-label={`${p.l}: ${p.v}/3`} style={{flex:1,height:8,background:"rgba(255,255,255,.08)",borderRadius:4,overflow:"hidden"}}>
                      <div style={{width:`${(p.v/3)*100}%`,height:"100%",background:p.c,borderRadius:4,transition:"width .3s"}}/>
                    </div>
                    <span style={{color:"#94a3b8",fontSize:".6rem",width:24}}>{p.v}/3</span>
                  </div>
                ))}
              </div>
              <div style={{display:"flex",gap:".3rem",marginTop:".6rem",flexWrap:"wrap",justifyContent:"center"}}>
                {BADGES.map(b=><span key={b.id} aria-label={`${b.name}: ${pBdg.includes(b.id)?"earned":"not earned"}`} style={{fontSize:"1.2rem",opacity:pBdg.includes(b.id)?1:.2,filter:pBdg.includes(b.id)?"none":"grayscale(1)"}}>{b.icon}</span>)}
              </div>
              {pDom.length>0&&<div style={{display:"flex",gap:".2rem",marginTop:".4rem",flexWrap:"wrap",justifyContent:"center"}}>{pDom.map(d=><span key={d} style={{background:"#d9770620",border:"1px solid #d9770640",borderRadius:10,padding:".1rem .4rem",fontSize:".55rem",color:"#fbbf24"}}>{d}</span>)}</div>}
            </div>
          </div>
          <div aria-label="Legend" style={{display:"flex",gap:".6rem",justifyContent:"center",marginTop:".8rem",flexWrap:"wrap"}}>
            {[{c:"#818cf8",l:"CARE"},{c:"#f472b6",l:"CRAFT"},{c:"#2dd4bf",l:"ACRE"},{c:"#d97706",l:"Domain"},{c:"#6b7280",l:"Event"},{c:"#7c3aed",l:"Corner"}].map(x=><span key={x.l} style={{display:"flex",alignItems:"center",gap:".3rem",fontSize:".65rem",color:"#94a3b8"}}><span style={{width:10,height:10,background:x.c,borderRadius:2,display:"inline-block"}}/>{x.l}</span>)}
          </div>
        </main>

        <aside aria-label="Activity log" style={{background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.06)",borderRadius:12,padding:".8rem",maxHeight:"calc(100vh - 140px)",overflowY:"auto"}}>
          <h2 style={{fontSize:".85rem",fontWeight:700,color:"#e2e8f0",marginBottom:".6rem"}}>Activity Log</h2>
          {log.length===0&&<p style={{color:"#475569",fontSize:".75rem"}}>Roll the dice to begin.</p>}
          {log.map(e=><div key={e.id} style={{padding:".35rem .5rem",marginBottom:".2rem",borderRadius:6,background:`${logC[e.t]||"#e2e8f0"}10`,borderLeft:`3px solid ${logC[e.t]||"#e2e8f0"}`,fontSize:".72rem",color:logC[e.t]||"#e2e8f0",lineHeight:1.4,animation:"fadeIn .25s ease"}}>{e.m}</div>)}
        </aside>
      </div>

      {/* Question Modal */}
      {scr==="question"&&quest&&(
        <div style={OV} role="dialog" aria-modal="true" aria-labelledby="q-t">
          <div style={{...MB,borderColor:(fwC[quest.fw]||"#818cf8")+"60"}}>
            <div style={{display:"flex",alignItems:"center",gap:".5rem",marginBottom:"1rem"}}>
              <span style={{background:`${fwC[quest.fw]}20`,border:`1px solid ${fwC[quest.fw]}60`,borderRadius:6,padding:".2rem .6rem",fontSize:".75rem",color:fwC[quest.fw],fontWeight:700}}>{quest.fw}</span>
              <span style={{color:"#94a3b8",fontSize:".75rem"}}>{quest.ph}</span>
              <span style={{marginLeft:"auto",color:"#fbbf24",fontSize:".75rem",fontWeight:700}}>+{quest.tok}</span>
            </div>
            <h2 id="q-t" style={{color:"#e2e8f0",fontSize:"1.05rem",fontWeight:700,lineHeight:1.5,marginBottom:"1.2rem"}}>{quest.q}</h2>
            <div role="radiogroup" aria-label="Answers">
              {quest.opts.map((o,i)=>{
                const isP=pick===i;const isC=pick!==null&&i===quest.ans;
                let bg="rgba(255,255,255,.06)",bor="rgba(255,255,255,.1)";
                if(isP&&ok){bg="#10b98130";bor="#10b981";}else if(isP&&!ok){bg="#ef444430";bor="#ef4444";}else if(isC&&pick!==null){bg="#10b98120";bor="#10b981";}
                return(
                  <button key={i} ref={el=>{ansR.current[i]=el;}} role="radio" aria-checked={isP} tabIndex={fOpt===i?0:-1} onClick={()=>selAns(i)} onKeyDown={e=>optKey(e,i)} disabled={pick!==null} style={{display:"block",width:"100%",textAlign:"left",padding:".75rem 1rem",marginBottom:".5rem",background:bg,border:`2px solid ${bor}`,borderRadius:10,color:"#e2e8f0",fontSize:".9rem",minHeight:48,fontFamily:"inherit",lineHeight:1.4,cursor:pick!==null?"default":"pointer"}}>
                    <span style={{fontWeight:700,color:fwC[quest.fw],marginRight:".5rem"}}>{String.fromCharCode(65+i)}.</span>{o}
                  </button>
                );
              })}
            </div>
            {pick!==null&&<div role="alert" style={{marginTop:".8rem",padding:".6rem .8rem",borderRadius:8,background:ok?"#10b98118":"#ef444418",border:`1px solid ${ok?"#10b981":"#ef4444"}40`,color:ok?"#6ee7b7":"#fca5a5",fontSize:".85rem",fontWeight:600}}>{ok?`Correct! +${quest.tok} tokens.`:`Incorrect. Answer: ${quest.opts[quest.ans]}`}</div>}
          </div>
        </div>
      )}

      {/* Event Modal */}
      {scr==="event"&&evt&&(
        <div style={OV} role="dialog" aria-modal="true" aria-labelledby="ev-t">
          <div style={{...MB,borderColor:evt.color+"60"}}>
            <div aria-hidden="true" style={{fontSize:"3rem",textAlign:"center",marginBottom:".5rem"}}>{evt.icon}</div>
            <h2 id="ev-t" style={{color:evt.color,fontSize:"1.3rem",fontWeight:900,textAlign:"center",marginBottom:".3rem"}}>{evt.label}</h2>
            <p style={{color:"#94a3b8",textAlign:"center",fontSize:".9rem",marginBottom:"1.5rem"}}>{evt.sub}</p>
            <button onClick={contEvt} autoFocus style={{...B("linear-gradient(135deg,#6366f1,#8b5cf6)"),width:"100%"}}>Continue</button>
          </div>
        </div>
      )}

      {/* Badge Alert */}
      {bdgA&&(()=>{
        const b=BADGES.find(x=>x.id===bdgA);if(!b)return null;
        return(
          <div style={OV} role="dialog" aria-modal="true" aria-label={`Badge earned: ${b.name}`}>
            <div style={{...MB,borderColor:b.color+"60",textAlign:"center",animation:"pop .4s cubic-bezier(.175,.885,.32,1.275)"}}>
              <div aria-hidden="true" style={{fontSize:"4rem",marginBottom:".5rem"}}>{b.icon}</div>
              <h2 style={{color:b.color,fontSize:"1.4rem",fontWeight:900,marginBottom:".3rem"}}>Badge Earned!</h2>
              <p style={{color:"#fbbf24",fontSize:"1.1rem",fontWeight:700,marginBottom:".3rem"}}>{b.name}</p>
              <p style={{color:"#94a3b8",fontSize:".85rem",marginBottom:"1.5rem"}}>{b.desc}</p>
              <button onClick={()=>{setBdgA(null);setTimeout(()=>rollR.current?.focus(),100);}} autoFocus style={B(`linear-gradient(135deg,${b.color},${b.color}cc)`)}>Continue</button>
            </div>
          </div>
        );
      })()}

      {/* Help Modal */}
      {help&&(
        <div style={OV} role="dialog" aria-modal="true" aria-labelledby="help-t">
          <div style={{...MB,maxHeight:"80vh",overflowY:"auto"}}>
            <h2 id="help-t" style={{color:"#e2e8f0",fontSize:"1.2rem",fontWeight:700,marginBottom:"1rem"}}>How to Play</h2>
            <div style={{color:"#94a3b8",fontSize:".85rem",lineHeight:1.7}}>
              <p style={{marginBottom:".8rem"}}><strong style={{color:"#e2e8f0"}}>Objective:</strong> Earn all 5 badges or have the most tokens after 3 laps.</p>
              <p style={{marginBottom:".8rem"}}><strong style={{color:"#818cf8"}}>CARE spaces:</strong> Consider, Analyze, Reflect, Evaluate. 3 correct = CARE Master.</p>
              <p style={{marginBottom:".8rem"}}><strong style={{color:"#f472b6"}}>CRAFT spaces:</strong> Context, Role, Action, Format, Threshold. 3 correct = CRAFT Expert.</p>
              <p style={{marginBottom:".8rem"}}><strong style={{color:"#2dd4bf"}}>ACRE spaces:</strong> Accuracy, Completeness, Relevance, Equity. 3 correct = ACRE Evaluator.</p>
              <p style={{marginBottom:".8rem"}}><strong style={{color:"#fbbf24"}}>Domains:</strong> Land on domain spaces to claim them. 4+ = Domain Champion.</p>
              <p style={{marginBottom:".8rem"}}><strong style={{color:"#ef4444"}}>Events:</strong> Breakthroughs, Hallucinations, Bias Traps, Deepfakes, Innovation Hubs.</p>
              <p style={{marginBottom:".8rem"}}><strong style={{color:"#e2e8f0"}}>Keyboard:</strong> Tab to navigate, Enter/Space to select, Arrow keys for answers, Escape to close.</p>
            </div>
            <button onClick={()=>setHelp(false)} autoFocus style={{...B("linear-gradient(135deg,#6366f1,#8b5cf6)"),width:"100%",marginTop:"1rem"}}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
