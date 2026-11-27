// m365.fm Infografik-Vorlagen im Stil "Dark Glass" (Gestaltung nach EpicInfographics, MIT, github.com/OrRon/EpicInfographics): JSON rein, HTML raus.
// Fuenf Vorlagen: flow (Ablauf), compare (Vergleich), ladder (Treppe), bigfact (grosse Zahl, auch Kopfbild), hub (Nabe). Schriften: assets/fonts/ig/.
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
const F=pathToFileURL(path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../assets/fonts/ig')).href+'/';
const esc=s=>String(s??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
export const SIZES={flow:[1920,1080],compare:[1200,1040],ladder:[1200,1800],bigfact:[1200,630],hub:[1200,1200]};
const CH=['#2B8CC4','#12A379','#BF7A20','#8B6CF0','#E05590'];
const LAT='U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD';
const EXT='U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF';
const face=(fam,w,base)=>`@font-face{font-family:${fam};font-weight:${w};src:url(${F}${base}-latin-${w}-normal.woff2);unicode-range:${LAT}}@font-face{font-family:${fam};font-weight:${w};src:url(${F}${base}-latin-ext-${w}-normal.woff2);unicode-range:${EXT}}`;
const FACES=[['Sora',600,'sora'],['Sora',800,'sora'],["'Albert Sans'",400,'albert-sans'],["'Albert Sans'",500,'albert-sans'],["'Albert Sans'",700,'albert-sans'],["'IBM Plex Mono'",500,'ibm-plex-mono']].map(x=>face(...x)).join('\n');
const CSS=`${FACES}
*{box-sizing:border-box;margin:0;padding:0}
:root{--bg:#0B0E17;--bg2:#10141F;--glass:rgb(255 255 255/.05);--gb:1px solid rgb(255 255 255/.12);--ink:#EDF1FA;--mute:#8B93A7;--ac:#2B8CC4;--c1:#2B8CC4;--c2:#12A379;--c3:#BF7A20;--c4:#8B6CF0;--c5:#E05590;--dim:#3A4157;
--fd:Sora,'Noto Sans','Noto Sans Arabic','Noto Sans Hebrew','Noto Sans CJK JP','Noto Sans CJK KR',sans-serif;--fb:'Albert Sans','Noto Sans','Noto Sans Arabic','Noto Sans Hebrew','Noto Sans CJK JP','Noto Sans CJK KR',sans-serif;--fm:'IBM Plex Mono','Noto Sans Mono','Noto Sans','Noto Sans Arabic','Noto Sans Hebrew','Noto Sans CJK JP',monospace}
html,body{background:var(--bg)}body{font-family:var(--fb);color:var(--ink)}
.cv{position:relative;overflow:hidden;background:var(--bg)}
.cv>*{position:absolute}
.aur{border-radius:50%;filter:blur(2px)}
.dots{inset:0;background-image:radial-gradient(rgb(255 255 255/.10) 1px,transparent 1.4px);background-size:28px 28px}
.k{font:500 17px/1 var(--fm);letter-spacing:.2em;text-transform:uppercase;color:var(--ac)}
.h{font-family:var(--fd);font-weight:800;letter-spacing:-.03em;line-height:1.04;text-wrap:balance}
.s{font:400 26px/1.4 var(--fb);color:var(--mute);text-wrap:pretty}
.p{background:var(--glass);border:var(--gb);border-radius:16px;backdrop-filter:blur(14px)}
.scan{background-image:repeating-linear-gradient(0deg,rgb(255 255 255/.04) 0 1px,transparent 1px 4px)}
.t{font:600 30px/1.15 var(--fd);letter-spacing:-.01em}
.n{font:400 23px/1.35 var(--fb);color:var(--mute)}
.m{font:500 18px/1 var(--fm);letter-spacing:.12em;color:var(--mute)}
[dir=rtl] .k,[dir=rtl] .m{letter-spacing:0}.ft{direction:ltr;unicode-bidi:isolate}
.gr{background:linear-gradient(135deg,#2B8CC4,#8B6CF0);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 0 12px rgba(43,140,196,.55)) drop-shadow(0 0 40px rgba(139,108,240,.4))}
.ft{font:500 16px/1 var(--fm);color:var(--mute);letter-spacing:.04em}`;
const ANIM=`@keyframes rise{from{opacity:0;transform:translateY(26px)}to{opacity:1;transform:none}}@keyframes pop{from{opacity:0;transform:scale(.85)}to{opacity:1;transform:none}}
.p,svg{animation:rise .8s cubic-bezier(.2,.7,.2,1) backwards;animation-delay:var(--d,0s)}[data-hero]{animation:pop 1s cubic-bezier(.2,.7,.2,1) backwards}.k,.h,.s{animation:rise .8s ease-out backwards}`;
const aur=(W,H)=>`<div class="aur" style="left:${W*.55}px;top:${-H*.25}px;width:${W*.5}px;height:${W*.5}px;background:radial-gradient(circle,rgba(43,140,196,.22),transparent 68%)"></div>
<div class="aur" style="left:${-W*.15}px;top:${H*.55}px;width:${W*.45}px;height:${W*.45}px;background:radial-gradient(circle,rgba(139,108,240,.18),transparent 68%)"></div>
<div class="aur" style="left:${W*.62}px;top:${H*.7}px;width:${W*.4}px;height:${W*.4}px;background:radial-gradient(circle,rgba(18,163,121,.14),transparent 68%)"></div><div class="dots"></div>`;
function shell(d,name,body){const [W,H]=SIZES[name];
 return `<!doctype html><html lang="${d.lang||'en'}" dir="${d.rtl?'rtl':'ltr'}"><meta charset="utf-8"><title>${esc(d.title)}</title><style>${CSS}body{width:${W}px}.cv{width:${W}px;height:${H}px}${d.anim?ANIM:''}</style><body><div class="cv">${aur(W,H)}${body}</div></body></html>`;}
const foot=(d,x,y)=>`<div class="ft" style="left:${x}px;top:${y}px">// ${esc(d.src||'m365.fm')}${(d.tags||[]).length?' · '+d.tags.map(esc).join(' · '):''}</div>`;
const glow=c=>`filter:drop-shadow(0 0 10px ${c}99)`;

export function flow(d){
 const W=1920,n=d.steps.length,pad=80,gap=70,bw=(W-2*pad-(n-1)*gap)/n,y=470,hi=d.hi??-1;
 const nodes=d.steps.map((s,i)=>{const x=pad+i*(bw+gap),c=CH[i%5];return `<div class="p ${i===hi?'scan':''}" style="left:${x}px;top:${y}px;width:${bw}px;height:250px;padding:30px 30px;display:flex;flex-direction:column;gap:14px;${i===hi?`border-color:${c};box-shadow:0 0 40px ${c}44`:''}">
 <div style="width:46px;height:6px;border-radius:3px;background:${c};${glow(c)}"></div><div class="m" style="color:${c}">${String(i+1).padStart(2,'0')}</div><div class="t" style="font-size:32px">${esc(s.t)}</div><div class="n">${esc(s.n)}</div></div>
 ${i<n-1?`<svg style="left:${x+bw+10}px;top:${y+117}px" width="${gap-20}" height="20"><path d="M0 10H${gap-34}" stroke="${c}" stroke-width="2.5" style="${glow(c)}"/><circle cx="${gap-28}" cy="10" r="5" fill="${c}"/></svg>`:''}`}).join('');
 return shell(d,'flow',`
 <div class="k" style="left:80px;top:70px">${esc(d.kicker)}</div>
 <div class="h" style="left:80px;top:112px;width:960px;font-size:${d.title.length>20?68:84}px">${esc(d.title)}</div>
 <div class="s" style="left:80px;top:${d.title.length>20?330:250}px;width:780px">${esc(d.sub)}</div>
 <div data-hero style="left:1100px;top:40px;width:740px;display:flex;align-items:center;gap:30px"><div class="gr" style="font:800 330px/.9 var(--fd);letter-spacing:-.04em">${esc(d.hero.value)}</div><div><div class="t" style="font-size:36px">${esc(d.hero.label)}</div><div class="n" style="margin-top:10px;font-size:24px">${esc(d.hero.sub||'')}</div></div></div>
 ${nodes}
 <div class="p scan" style="left:${pad}px;top:790px;width:${W-2*pad}px;height:90px;display:flex;align-items:center;padding:0 34px;font:600 28px var(--fd);letter-spacing:-.01em">${esc(d.note)}</div>
 ${foot(d,80,960)}`);
}
export function compare(d){
 const row=(items,mark,col)=>items.map(t=>`<div style="display:flex;gap:18px;align-items:flex-start"><div style="flex:none;width:38px;height:38px;border-radius:10px;border:1.5px solid ${col};color:${col};font:600 22px/35px var(--fd);text-align:center">${mark}</div><div style="font:400 31px/1.28 var(--fb)">${esc(t)}</div></div>`).join('');
 return shell(d,'compare',`
 <div class="k" style="left:64px;top:60px">${esc(d.kicker)}</div>
 <div class="h" style="left:64px;top:100px;width:1070px;font-size:64px">${esc(d.title)}</div>
 <div class="p" style="left:64px;top:300px;width:500px;height:520px;padding:36px;display:flex;flex-direction:column;gap:28px;opacity:.85"><div class="t" style="color:var(--mute);font-size:32px">${esc(d.left.head)}</div><div style="height:1px;background:rgb(255 255 255/.12)"></div>${row(d.left.items,'✕','var(--c5)')}</div>
 <div class="p scan" style="left:636px;top:300px;width:500px;height:520px;padding:36px;display:flex;flex-direction:column;gap:28px;border-color:var(--c2);box-shadow:0 0 44px rgba(18,163,121,.25)"><div class="t" style="font-size:32px">${esc(d.right.head)}</div><div style="height:1px;background:var(--c2)"></div>${row(d.right.items,'✓','var(--c2)')}</div>
 <div style="left:546px;top:510px;width:108px;height:108px;border-radius:54px;background:var(--bg);border:var(--gb);display:grid;place-items:center;font:800 34px var(--fd)">VS</div>
 <div data-hero class="p" style="left:64px;top:850px;width:1072px;padding:26px 32px;border-color:var(--ac);box-shadow:0 0 40px rgba(43,140,196,.3), 0 0 12px rgba(43,140,196,.5);font:800 30px/1.2 var(--fd);letter-spacing:-.02em">${esc(d.verdict)}</div>
 ${foot(d,64,980)}`);
}
export function ladder(d){
 const n=d.tiers.length,x0=64,step=Math.min(80,(1072-800)/(n-1)),y0=420,h=(1480-y0)/n;
 const rows=d.tiers.map((s,i)=>{const x=x0+i*step,y=y0+i*h,c=CH[i%5];return `<div class="p ${i===0?'scan':''}" style="left:${x}px;top:${y}px;width:800px;height:${h-24}px;padding:18px 32px;display:flex;gap:28px;align-items:center;border-left:4px solid ${c}">
 <div class="gr" style="font:800 96px/1 var(--fd);${i?'background:none;color:'+c+';filter:drop-shadow(0 0 10px '+c+'88)':''}">${i+1}</div><div><div class="t" style="font-size:40px">${esc(s.t)}</div><div class="n" style="margin-top:8px;font-size:27px">${esc(s.n)}</div></div></div>
 <div style="left:${x+800}px;top:${y+(h-24)/2}px;width:${Math.max(0,1136-(x+800))}px;height:1px;background:rgb(255 255 255/.12)"></div>`}).join('');
 return shell(d,'ladder',`
 <div class="k" style="left:64px;top:62px">${esc(d.kicker)}</div>
 <div class="h" style="left:64px;top:104px;width:1070px;font-size:66px">${esc(d.title)}</div>
 <div class="s" style="left:64px;top:300px;width:900px">${esc(d.sub)}</div>
 ${rows}
 <div data-hero class="p" style="left:64px;top:1540px;width:1072px;padding:26px 32px;border-color:var(--ac);box-shadow:0 0 40px rgba(43,140,196,.3), 0 0 12px rgba(43,140,196,.5);font:800 30px/1.2 var(--fd);letter-spacing:-.02em">${esc(d.axis)}</div>
 ${foot(d,64,1712)}`);
}
export function bigfact(d){
 return shell(d,'bigfact',`
 <div class="k" style="left:64px;top:56px">${esc(d.kicker)}</div>
 <div data-hero class="gr" style="left:50px;top:70px;font:800 ${String(d.hero.value).length>1?320:400}px/1 var(--fd);letter-spacing:-.05em">${esc(d.hero.value)}</div>
 <div class="t" style="left:64px;top:474px;width:430px;font-size:34px">${esc(d.hero.label)}</div>
 <div class="h" style="left:520px;top:92px;width:620px;font-size:40px">${esc(d.title)}</div>
 <div style="left:520px;top:236px;width:616px;display:flex;flex-direction:column;gap:12px">${d.chips.map((c,i)=>`<div class="p" style="padding:13px 20px;display:flex;gap:16px;align-items:baseline;border-left:4px solid ${CH[i%5]}"><span class="t" style="font-size:26px;white-space:nowrap">${esc(c.t)}</span><span class="n" style="font-size:21px">${esc(c.n||'')}</span></div>`).join('')}</div>
 ${foot(d,64,578)}`);
}
export function hub(d){
 const n=d.nodes.length;
 const P={3:[[64,290],[636,290],[350,850]],4:[[64,290],[636,290],[64,860],[636,860]],5:[[64,290],[636,290],[64,620],[636,620],[350,900]]}[n];
 const cx=600,cy=n===5?640:n===3?640:675;
 const nodes=d.nodes.map((s,i)=>{const [x,y]=P[i],c=CH[i%5];return `<svg style="left:0;top:0" width="1200" height="1200"><path d="M${cx} ${cy}L${x+250} ${y<cy?y+172:y}" stroke="${c}" stroke-width="2.5" stroke-dasharray="3 9" stroke-linecap="round" style="${glow(c)}"/></svg>
 <div class="p" style="left:${x}px;top:${y}px;width:500px;height:172px;padding:24px 28px;display:flex;flex-direction:column;gap:8px;border-top:3px solid ${c}"><div class="t" style="font-size:30px">${esc(s.t)}</div><div class="n" style="font-size:23px">${esc(s.n)}</div></div>`}).join('');
 return shell(d,'hub',`
 <div class="k" style="left:64px;top:60px">${esc(d.kicker)}</div>
 <div class="h" style="left:64px;top:100px;width:1070px;font-size:64px">${esc(d.title)}</div>
 ${nodes}
 <div data-hero style="left:${cx-145}px;top:${cy-145}px;width:290px;height:290px;border-radius:145px;border:2px solid var(--ac);background:var(--bg);box-shadow:0 0 40px rgba(43,140,196,.45),0 0 12px rgba(43,140,196,.7);display:grid;place-items:center;text-align:center;padding:20px"><div><div class="gr" style="font:800 110px/1 var(--fd)">${esc(d.core.value)}</div><div class="t" style="font-size:21px;margin-top:6px;line-height:1.15">${esc(d.core.label)}</div></div></div>
 ${foot(d,64,1140)}`);
}
export const T={flow,compare,ladder,bigfact,hub};
export function render(spec){const f=T[spec.template];if(!f)throw new Error('Vorlage unbekannt: '+spec.template);return f(spec);}
