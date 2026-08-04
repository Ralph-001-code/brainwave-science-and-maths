import{c as b,u as w,r as c,s as x,o as j,j as e,p as m,T as z,L as f,A as S,k,B as N,S as C}from"./index-ChejWAXo.js";import{T as B}from"./target-i-sLw0lG.js";import{S as L}from"./star-YnLqJK6N.js";/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const D=b("Download",[["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}],["polyline",{points:"7 10 12 15 17 10",key:"2ggqvy"}],["line",{x1:"12",x2:"12",y1:"15",y2:"3",key:"1vk2je"}]]);function W(){const{user:a,profile:r}=w(),[d,s]=c.useState([]),[T,h]=c.useState({}),[u,y]=c.useState(!0);c.useEffect(()=>{a&&(async()=>{const{data:i}=await x.from("certificates").select("*").eq("user_id",a.id).order("issued_at",{ascending:!1});s(i??[]);const{data:n}=await x.from("pathway_progress").select("*").eq("user_id",a.id),o={};n==null||n.forEach(t=>{o[`${t.programme}:${t.stage??""}:${t.topic_id}`]=t}),h(o),y(!1)})()},[a]);const p=j(r);new Date().toLocaleDateString("en-GB",{year:"numeric",month:"long",day:"numeric"});const v=i=>{const n=g(i.student_name||p,i.title,i.score,new Date(i.issued_at).toLocaleDateString("en-GB",{year:"numeric",month:"long",day:"numeric"})),o=new Blob([n],{type:"text/html"}),t=URL.createObjectURL(o),l=document.createElement("a");l.href=t,l.download=`certificate-${i.title.replace(/[^a-z0-9]/gi,"-").toLowerCase()}.html`,l.click(),URL.revokeObjectURL(t)};return e.jsxs("div",{className:"container",style:{paddingTop:32,paddingBottom:80,maxWidth:920},children:[e.jsxs("div",{className:"fade-up",style:{marginBottom:28},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:10,marginBottom:8},children:[e.jsx(m,{size:26,className:"text-gold"}),e.jsx("h1",{style:{fontSize:"clamp(24px, 4vw, 32px)",margin:0},children:"Certificates"})]}),e.jsx("p",{className:"text-muted",style:{fontSize:16,maxWidth:620},children:"Complete all topics in a course pathway to earn a certificate of achievement. Download and print your certificates to celebrate your success!"})]}),u?e.jsx("div",{className:"spinner",style:{margin:"40px auto"}}):d.length===0?e.jsxs("div",{className:"card fade-up",style:{textAlign:"center",padding:48},children:[e.jsx("div",{style:{width:72,height:72,borderRadius:20,background:"rgba(245,200,66,0.12)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px"},children:e.jsx(z,{size:36,className:"text-gold"})}),e.jsx("h2",{style:{fontSize:22,marginBottom:10},children:"No certificates yet"}),e.jsx("p",{className:"text-muted",style:{fontSize:15,marginBottom:24,maxWidth:420,margin:"0 auto 24px"},children:"Complete all topics in a course pathway to earn your first certificate. Start by following your learning pathway."}),e.jsxs(f,{to:"/pathway",className:"btn btn-primary",children:[e.jsx(B,{size:16})," Go to your pathway ",e.jsx(S,{size:16})]})]}):e.jsxs(e.Fragment,{children:[e.jsx("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(320px, 1fr))",gap:20},children:d.map((i,n)=>{const o=k.find(l=>l.id===i.programme),t=(o==null?void 0:o.color)??"var(--gold)";return e.jsxs("div",{className:"card fade-up cert-card",style:{padding:0,overflow:"hidden",animationDelay:`${n*80}ms`,border:`2px solid ${t}40`},children:[e.jsxs("div",{style:{padding:28,textAlign:"center",background:`linear-gradient(135deg, ${t}0a, ${t}15)`,borderBottom:`1px solid ${t}30`},children:[e.jsx("div",{style:{width:56,height:56,borderRadius:16,background:`${t}1f`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px"},children:e.jsx(m,{size:28,style:{color:t}})}),e.jsx("div",{className:"text-muted",style:{fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:1.5,marginBottom:8},children:"Certificate of Achievement"}),e.jsx("div",{style:{fontSize:18,fontWeight:800,marginBottom:6,fontFamily:"Lexend"},children:i.title}),e.jsx("div",{style:{fontSize:15,color:"var(--text)"},children:"Awarded to"}),e.jsx("div",{style:{fontSize:22,fontWeight:800,fontFamily:"Lexend",color:t,margin:"4px 0 12px"},children:i.student_name||p}),e.jsxs("div",{style:{display:"flex",justifyContent:"center",gap:16,marginBottom:12},children:[e.jsxs("div",{children:[e.jsxs("div",{style:{fontSize:24,fontWeight:800,fontFamily:"Lexend",color:"var(--success)"},children:[i.score,"%"]}),e.jsx("div",{className:"text-muted",style:{fontSize:11},children:"Average Score"})]}),e.jsxs("div",{children:[e.jsx("div",{style:{fontSize:14,fontWeight:700,paddingTop:8},children:new Date(i.issued_at).toLocaleDateString("en-GB",{year:"numeric",month:"short",day:"numeric"})}),e.jsx("div",{className:"text-muted",style:{fontSize:11},children:"Date Issued"})]})]}),e.jsx("div",{style:{width:50,height:50,borderRadius:"50%",border:`2px solid ${t}`,display:"flex",alignItems:"center",justifyContent:"center",margin:"12px auto 0"},children:e.jsx(L,{size:22,style:{color:t,fill:t}})})]}),e.jsxs("div",{style:{padding:16,display:"flex",gap:10},children:[e.jsxs("button",{onClick:()=>v(i),className:"btn btn-ghost",style:{flex:1,fontSize:13},children:[e.jsx(D,{size:15})," Download"]}),e.jsxs("button",{onClick:()=>$(i,p),className:"btn btn-ghost",style:{flex:1,fontSize:13},children:[e.jsx(N,{size:15})," Print"]})]})]},i.id)})}),e.jsxs("div",{className:"card fade-up",style:{marginTop:24,display:"flex",alignItems:"center",gap:14},children:[e.jsx(C,{size:22,className:"text-gold"}),e.jsxs("p",{className:"text-muted",style:{fontSize:14,margin:0},children:["Earn more certificates by completing all topics in other programmes. Visit your ",e.jsx(f,{to:"/pathway",style:{color:"var(--primary-light)",fontWeight:600},children:"learning pathway"})," to continue."]})]})]})]})}function $(a,r){const d=g(a.student_name||r,a.title,a.score,new Date(a.issued_at).toLocaleDateString("en-GB",{year:"numeric",month:"long",day:"numeric"})),s=window.open("","_blank");s&&(s.document.write(d),s.document.close(),s.focus(),setTimeout(()=>s.print(),300))}function g(a,r,d,s){return`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Certificate - ${r}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: Georgia, 'Times New Roman', serif; background: #f4f0fa; display: flex; justify-content: center; align-items: center; min-height: 100vh; padding: 20px; }
  .cert { width: 800px; max-width: 100%; background: #fff; border: 3px solid #a855f7; border-radius: 16px; padding: 60px 50px; position: relative; box-shadow: 0 20px 60px rgba(0,0,0,0.1); }
  .cert::before { content: ""; position: absolute; inset: 12px; border: 1px solid #a855f740; border-radius: 10px; pointer-events: none; }
  .corner { position: absolute; width: 60px; height: 60px; }
  .corner-tl { top: 20px; left: 20px; border-top: 2px solid #f5c842; border-left: 2px solid #f5c842; border-radius: 8px 0 0 0; }
  .corner-tr { top: 20px; right: 20px; border-top: 2px solid #f5c842; border-right: 2px solid #f5c842; border-radius: 0 8px 0 0; }
  .corner-bl { bottom: 20px; left: 20px; border-bottom: 2px solid #f5c842; border-left: 2px solid #f5c842; border-radius: 0 0 0 8px; }
  .corner-br { bottom: 20px; right: 20px; border-bottom: 2px solid #f5c842; border-right: 2px solid #f5c842; border-radius: 0 0 8px 0; }
  .logo { text-align: center; margin-bottom: 30px; }
  .logo .brand { font-size: 28px; font-weight: 700; color: #a855f7; letter-spacing: -0.5px; }
  .logo .brand span { color: #f5c842; }
  .label { text-align: center; font-size: 13px; letter-spacing: 3px; text-transform: uppercase; color: #888; margin-bottom: 8px; }
  .title { text-align: center; font-size: 36px; color: #1a1a2e; margin-bottom: 30px; }
  .awarded { text-align: center; font-size: 16px; color: #666; }
  .name { text-align: center; font-size: 42px; font-weight: 700; color: #a855f7; margin: 10px 0 30px; border-bottom: 2px solid #f5c84240; display: inline-block; padding: 0 40px 8px; }
  .name-wrap { text-align: center; }
  .desc { text-align: center; font-size: 17px; color: #444; max-width: 500px; margin: 0 auto 30px; line-height: 1.6; }
  .stats { display: flex; justify-content: center; gap: 50px; margin-bottom: 40px; }
  .stat { text-align: center; }
  .stat .val { font-size: 32px; font-weight: 700; color: #34d399; }
  .stat .lbl { font-size: 12px; color: #888; text-transform: uppercase; letter-spacing: 1px; }
  .seal { width: 80px; height: 80px; border: 3px solid #f5c842; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; font-size: 32px; }
  .footer { display: flex; justify-content: space-between; padding-top: 20px; border-top: 1px solid #eee; }
  .footer .field { font-size: 13px; color: #666; }
  .footer .field strong { display: block; font-size: 15px; color: #1a1a2e; margin-top: 4px; }
  @media print { body { background: #fff; padding: 0; } .cert { box-shadow: none; } }
</style>
</head>
<body>
  <div class="cert">
    <div class="corner corner-tl"></div>
    <div class="corner corner-tr"></div>
    <div class="corner corner-bl"></div>
    <div class="corner corner-br"></div>
    <div class="logo"><div class="brand">Brainwave <span>Science &amp; Maths</span></div></div>
    <div class="label">Certificate of Achievement</div>
    <div class="title">${r}</div>
    <div class="awarded">This certificate is proudly presented to</div>
    <div class="name-wrap"><div class="name">${a}</div></div>
    <div class="desc">For successfully completing all topics in the course pathway with dedication and excellence.</div>
    <div class="stats">
      <div class="stat"><div class="val">${d}%</div><div class="lbl">Average Score</div></div>
      <div class="stat"><div class="val">${s}</div><div class="lbl">Date Issued</div></div>
    </div>
    <div class="seal">&#11088;</div>
    <div class="footer">
      <div class="field">Issued by<strong>Brainwave Science &amp; Maths</strong></div>
      <div class="field">Verify at<strong>brainwave.science</strong></div>
    </div>
  </div>
</body>
</html>`}export{W as default};
