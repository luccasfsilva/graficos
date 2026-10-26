var C=['#6c5ce7','#a66cff','#00b8a9','#3b9cff','#7bd88f','#ff6b8b','#ffb84d'];
var P=[['Sabonete líquido',500],['Sabonete líquido Clorex',1000],['Álcool em gel',700],['Álcool pump',250],['Álcool espuma',1000],['Álcool Purell',1200],['Álcool espuma pump',475]];
var S=['9º ANDAR - INTERNAÇÃO','8º ANDAR - INTERNAÇÃO','7º ANDAR - INTERNAÇÃO','6º ANDAR - INTERNAÇÃO','6º ANDAR - MATERNIDADE','5º ANDAR - INTERNAÇÃO','5º ANDAR - ONCOLOGIA','4º ANDAR - CEMED','3º ANDAR - PEDIATRIA INTERNAÇÃO','3º ANDAR - UTI PEDIATRICA','3º ANDAR - UTI NEONATAL','2º ANDAR CENTRO CIRURGICO','2º ANDAR CENTRO OBSTÉTRICO','2º ANDAR - HOSPITAL DIA','1º ANDAR ADULTO DML 01 – UTI','TÉRREO DML SADT','TÉRREO DML PSA','TÉRREO DML PSI'];
var B=[1.5,1.5,1.5,1.5,1.6,1.5,1.8,.8,1.7,2.2,2.3,2,1.9,1,2.4,1.2,1.6,1.6],PW=[1.2,.8,1.5,1,.7,.4,.6];
var R,metric='L',ch=[];
function seed(){var x=7,r=function(){x=x*16807%2147483647;return x/2147483647};R=[];
  for(var w=1;w<=6;w++)S.forEach(function(_,s){P.forEach(function(_,p){var q=Math.round(B[s]*PW[p]*(2+r()*4));if(q>0)R.push({w:'Sem '+w,s:s,p:p,q:q})})})}
function g(id){return document.getElementById(id)}
function css(v){return getComputedStyle(document.documentElement).getPropertyValue(v).trim()}
function fmt(n,d){return n.toLocaleString('pt-BR',{maximumFractionDigits:d===undefined?1:d})}
function val(q,p){return metric==='L'?q*P[p][1]/1000:q}
function un(){return metric==='L'?'litros':'frascos'}
function weeks(){var o=[];R.forEach(function(r){if(o.indexOf(r.w)<0)o.push(r.w)});return o}
function arg(a){return a.indexOf(Math.max.apply(null,a))}
function z(n){var a=[];for(var i=0;i<n;i++)a.push(0);return a}
function draw(){
  ch.forEach(function(c){c.destroy()});ch=[];
  var fs=g('f').value,ws=weeks(),m=css('--muted'),ln=css('--line'),cd=css('--card'),u=un();
  var lw=z(ws.length),lp=z(P.length),fp=z(P.length),lpL=z(P.length),ls=z(S.length),lsL=z(S.length),fl={},F=0;
  R.forEach(function(r){var v=val(r.q,r.p),l=r.q*P[r.p][1]/1000;ls[r.s]+=v;lsL[r.s]+=l;
    if(fs===''||+fs===r.s){lw[ws.indexOf(r.w)]+=v;lp[r.p]+=v;fp[r.p]+=r.q;lpL[r.p]+=l;F+=r.q;
      var k=S[r.s].match(/^(\d)º/);k=k?k[1]+'º andar':'Térreo';fl[k]=(fl[k]||0)+v}});
  var sum=lpL.reduce(function(a,b){return a+b},0),tv=lp.reduce(function(a,b){return a+b},0);
  g('k1').textContent=fmt(sum)+' L';g('k2').textContent=fmt(F,0);
  g('k3').textContent=sum?P[arg(lpL)][0]:'-';g('k4').textContent=lsL.some(Boolean)?S[arg(lsL)]:'-';
  var suf=fs===''?'':' - '+S[+fs];
  g('t1').textContent='Consumo semanal ('+u+') e meta'+suf;
  g('t2').textContent='Setores que mais consomem ('+u+')';
  g('t3').textContent='Consumo por dia da semana ('+u+')'+suf;
  Chart.defaults.color=m;Chart.defaults.font.size=11;
  var leg={position:'bottom',labels:{usePointStyle:true,boxWidth:8}},sl={position:'bottom',labels:{usePointStyle:true,boxWidth:7,font:{size:10}}};
  var base={responsive:true,maintainAspectRatio:false},sc={x:{grid:{display:false}},y:{beginAtZero:true,grid:{color:ln}}};
  function mk(id,cfg){ch.push(new Chart(g(id),cfg))}
  var avg=ws.length?tv/ws.length:0,r0=function(v){return Math.round(v*10)/10};
  mk('mixed',{data:{labels:ws,datasets:[
    {type:'bar',label:'Consumo',data:lw.map(r0),borderRadius:8,backgroundColor:function(c){var a=c.chart.chartArea;if(!a)return C[0];var gr=c.chart.ctx.createLinearGradient(0,a.top,0,a.bottom);gr.addColorStop(0,C[0]);gr.addColorStop(1,C[0]+'33');return gr}},
    {type:'line',label:'Meta (95% da média)',data:ws.map(function(){return r0(avg*.95)}),borderColor:C[5],backgroundColor:C[5],tension:.4,pointRadius:4}]},
    options:Object.assign({},base,{scales:sc,plugins:{legend:leg}})});
  mk('doughnut',{type:'doughnut',data:{labels:P.map(function(p){return p[0]}),datasets:[{data:lp.map(r0),backgroundColor:C,borderColor:cd,borderWidth:3}]},
    options:Object.assign({},base,{cutout:'66%',plugins:{legend:sl}})});
  var ord=S.map(function(_,i){return i}).sort(function(a,b){return ls[b]-ls[a]}).slice(0,8);
  mk('hbar',{type:'bar',data:{labels:ord.map(function(i){return S[i]}),datasets:[{label:u,data:ord.map(function(i){return r0(ls[i])}),backgroundColor:ord.map(function(_,i){return C[i%7]}),borderRadius:6}]},
    options:Object.assign({},base,{indexAxis:'y',scales:{x:{beginAtZero:true,grid:{color:ln}},y:{grid:{display:false},ticks:{callback:function(v){var l=this.getLabelForValue(v);return l.length>24?l.slice(0,23)+'…':l}}}},plugins:{legend:{display:false}}})});
  var dw=[1.1,1.05,1,1,1.1,.85,.9],ds=7.1;
  mk('line',{type:'line',data:{labels:['Seg','Ter','Qua','Qui','Sex','Sáb','Dom'],datasets:[{label:u+' por dia',data:dw.map(function(v){return r0(avg/ds*v)}),borderColor:C[3],backgroundColor:C[3]+'33',fill:true,tension:.4,pointRadius:3}]},
    options:Object.assign({},base,{scales:sc,plugins:{legend:{display:false}}})});
  var fk=Object.keys(fl).sort(function(a,b){return a==='Térreo'?-1:b==='Térreo'?1:parseInt(a)-parseInt(b)});
  mk('polar',{type:'polarArea',data:{labels:fk,datasets:[{data:fk.map(function(k){return r0(fl[k])}),backgroundColor:fk.map(function(_,i){return C[i%7]+'cc'}),borderColor:cd}]},
    options:Object.assign({},base,{scales:{r:{grid:{color:ln},ticks:{display:false}}},plugins:{legend:sl}})});
  mk('pie',{type:'pie',data:{labels:['Sabonete','Álcool'],datasets:[{data:[r0(lp[0]+lp[1]),r0(tv-lp[0]-lp[1])],backgroundColor:[C[1],C[2]],borderColor:cd,borderWidth:3}]},
    options:Object.assign({},base,{plugins:{legend:leg}})});
  mk('bubble',{type:'bubble',data:{datasets:[{label:'Produtos',data:P.map(function(p,i){return{x:p[1],y:fp[i],r:Math.max(7,4+Math.sqrt(lpL[i])*.45)}}),backgroundColor:C.map(function(c){return c+'cc'})}]},
    options:Object.assign({},base,{scales:{x:{grid:{color:ln},title:{display:true,text:'ml do frasco'},min:0,max:1400},y:{grid:{color:ln},beginAtZero:true,title:{display:true,text:'frascos'}}},
    plugins:{legend:{display:false},tooltip:{callbacks:{label:function(c){var i=c.dataIndex;return P[i][0]+': '+fmt(fp[i],0)+' frascos, '+fmt(lpL[i])+' L'}}}}})});
}
function opts(ph,a,fn){return '<option value="">'+ph+'</option>'+a.map(function(x,i){return '<option value="'+i+'">'+fn(x)+'</option>'}).join('')}
g('f').innerHTML=opts('Todos os setores',S,function(x){return x});
g('s').innerHTML=opts('Selecione um setor',S,function(x){return x});
g('p').innerHTML=opts('Selecione um produto',P,function(x){return x[0]+' ('+x[1]+' ml)'});
g('f').onchange=draw;
g('add').onclick=function(){
  var s=g('s'),p=g('p'),q=g('q'),n=parseInt(q.value,10);
  if(s.value===''){s.focus();return}if(p.value===''){p.focus();return}if(!(n>0)){q.focus();return}
  var w=g('w').value.trim()||'Sem '+(weeks().length+1),f=null;
  R.forEach(function(r){if(r.w===w&&r.s===+s.value&&r.p===+p.value)f=r});
  if(f)f.q+=n;else R.push({w:w,s:+s.value,p:+p.value,q:n});
  g('w').value='';q.value='';draw();
};
g('rm').onclick=function(){var ws=weeks(),l=ws[ws.length-1];R=R.filter(function(r){return r.w!==l});draw()};
g('reset').onclick=function(){seed();draw()};
function setM(k){metric=k;g('mL').classList.toggle('on',k==='L');g('mF').classList.toggle('on',k==='F');draw()}
g('mL').onclick=function(){setM('L')};g('mF').onclick=function(){setM('F')};
try{matchMedia('(prefers-color-scheme: dark)').addEventListener('change',draw)}catch(e){}
seed();draw();
