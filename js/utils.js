export const $=(s,root=document)=>root.querySelector(s);
export const $$=(s,root=document)=>[...root.querySelectorAll(s)];
export const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let workbook=Object.create(null);
try{const saved=JSON.parse(localStorage.getItem('gm-workbook')||'{}');if(saved&&typeof saved==='object'&&!Array.isArray(saved))Object.assign(workbook,saved)}catch{}
export function read(k,fallback,accept=()=>true){const value=workbook[k]??fallback;return (fallback!==null&&typeof value!==typeof fallback)||!accept(value)?fallback:value}
export function write(k,v){workbook[k]=v;try{localStorage.setItem('gm-workbook',JSON.stringify(workbook))}catch{notify('기록 저장 공간 부족 · 파일로 받아두기')}return v}
let toastTimer;export function notify(t){const n=$('#toast');n.textContent=t;n.style.display='block';clearTimeout(toastTimer);toastTimer=setTimeout(()=>n.style.display='none',2500)}
export async function copyText(text){try{await navigator.clipboard.writeText(text);notify('복사 완료')}catch{const previous=document.activeElement,t=document.createElement('textarea');t.value=text;(document.querySelector('dialog[open]')||document.body).append(t);t.select();let copied=false;try{copied=document.execCommand('copy')}catch{}t.remove();previous?.focus({preventScroll:true});notify(copied?'복사 완료':'복사 권한 확인 · 요청문을 직접 선택해 복사')}}
export function download(name,text,type='text/markdown;charset=utf-8'){const u=URL.createObjectURL(new Blob([text],{type}));const a=document.createElement('a');a.href=u;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(u),1500)}
export function wireNotes(root=document){$$('[data-note]',root).forEach(n=>{const saved=read(n.dataset.note,null);if(saved!==null)n.value=saved;n.addEventListener('input',()=>write(n.dataset.note,n.value))})}
export function modal(html){$('#modalBody').innerHTML=html;$('#modal').showModal()}
