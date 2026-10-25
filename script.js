var C=['#6c5ce7','#00b8a9','#ff6b8b','#ffb84d','#3b9cff','#a66cff','#7bd88f'];
var DATA=[
 {k:[['Receita','R$ 84,2 mil','+12%'],['Pedidos','1.284','+8%'],['Ticket médio','R$ 65,60','+3%'],['Devoluções','2,1%','-0,4%']],
  rev:[18,12,9,11,8,4,2],meta:[20,19,18,14,12,15,10],bar:[30,25,20,15,11,4,2],ch:[11,30,20],pol:[10,20,30],pie:[40,80],ln:[10,15,20,10,25,5,10]},
 {k:[['Receita','R$ 96,7 mil','+15%'],['Pedidos','1.410','+10%'],['Ticket médio','R$ 68,60','+5%'],['Devoluções','1,8%','-0,3%']],
  rev:[22,14,11,13,9,6,3],meta:[20,19,18,14,12,15,10],bar:[34,27,22,16,12,6,3],ch:[16,34,24],pol:[14,26,32],pie:[55,85],ln:[14,18,26,15,30,9,14]},
 {k:[['Receita','R$ 110,3 mil','+14%'],['Pedidos','1.552','+10%'],['Ticket médio','R$ 71,10','+4%'],['Devoluções','1,9%','+0,1%']],
  rev:[25,17,12,15,11,7,4],meta:[22,21,20,16,14,16,12],bar:[38,31,24,18,14,7,4],ch:[20,38,27],pol:[18,30,36],pie:[62,90],ln:[18,24,30,20,34,12,18]}
];
var L7=['Camisetas','Tênis','Bonés','Mochilas','Relógios','Meias','Óculos'];
var D7=['Seg','Ter','Qua','Qui','Sex','Sáb','Dom'];
var charts={};
function css(v){return getComputedStyle(document.documentElement).getPropertyValue(v).trim()}
function grad(ctx,c){var g=ctx.createLinearGradient(0,0,0,260);g.addColorStop(0,c);g.addColorStop(1,c+'22');return g}
function build(){
  var tx=css('--muted'),ln=css('--line'),card=css('--card');
  Chart.defaults.color=tx;Chart.defaults.font.family='Inter';
  Chart.defaults.animation.duration=900;
  var sc={x:{grid:{display:false}},y:{grid:{color:ln},beginAtZero:true}};
  var base={responsive:true,maintainAspectRatio:false};
  var leg={plugins:{legend:{position:'bottom',labels:{usePointStyle:true,boxWidth:8}}}};
  var d=DATA[0];
  function ctx(id){return document.getElementById(id).getContext('2d')}
  charts.mixed=new Chart(ctx('mixed'),{data:{labels:L7,datasets:[
    {type:'bar',label:'Receita (mil)',data:d.rev,backgroundColor:grad(ctx('mixed'),C[0]),borderRadius:8},
    {type:'line',label:'Meta',data:d.meta,borderColor:C[2],backgroundColor:C[2],tension:.4,pointRadius:4}]},
    options:Object.assign({},base,{scales:sc,plugins:{legend:{position:'bottom',labels:{usePointStyle:true,boxWidth:8}}}})});
  charts.doughnut=new Chart(ctx('doughnut'),{type:'doughnut',data:{labels:['Loja','Site','App'],datasets:[{data:d.ch,backgroundColor:[C[1],C[3],C[2]],borderColor:card,borderWidth:3}]},
    options:Object.assign({},base,{cutout:'68%'},leg)});
  charts.bar=new Chart(ctx('bar'),{type:'bar',data:{labels:L7,datasets:[{label:'Unidades',data:d.bar,backgroundColor:C,borderRadius:6}]},
    options:Object.assign({},base,{indexAxis:'y',scales:{x:{grid:{color:ln},beginAtZero:true},y:{grid:{display:false}}},plugins:{legend:{display:false}}})});
  charts.line=new Chart(ctx('line'),{type:'line',data:{labels:D7,datasets:[{label:'Visitantes (mil)',data:d.ln,borderColor:C[4],backgroundColor:C[4]+'33',fill:true,tension:.4,pointRadius:3}]},
    options:Object.assign({},base,{scales:sc,plugins:{legend:{display:false}}})});
  charts.polar=new Chart(ctx('polar'),{type:'polarArea',data:{labels:['Sul','Sudeste','Nordeste'],datasets:[{data:d.pol,backgroundColor:[C[1]+'cc',C[3]+'cc',C[2]+'cc'],borderColor:card}]},
    options:Object.assign({},base,{scales:{r:{grid:{color:ln},ticks:{display:false}}}},leg)});
  charts.pie=new Chart(ctx('pie'),{type:'pie',data:{labels:['Novos','Recorrentes'],datasets:[{data:d.pie,backgroundColor:[C[4],C[2]],borderColor:card,borderWidth:3}]},
    options:Object.assign({},base,leg)});
  charts.bubble=new Chart(ctx('bubble'),{type:'bubble',data:{datasets:[{label:'Produtos',
    data:[[20,10,10],[15,5,13],[12,4,8],[17,2,10],[10,9,15],[8,8,12],[16,9,8]].map(function(a){return{x:a[0],y:a[1],r:a[2]}}),
    backgroundColor:C.map(function(c){return c+'bb'})}]},
    options:Object.assign({},base,{scales:sc,plugins:{legend:{display:false}}})});
}
function kpis(i){
  document.getElementById('kpis').innerHTML=DATA[i].k.map(function(k,j){
    return '<div class="kpi" style="--c:'+C[j]+'"><span>'+k[0]+'</span><b>'+k[1]+'</b><i class="'+(k[2][0]=='-'&&k[0]!='Devoluções'?'neg':'')+'">'+k[2]+' vs. período anterior</i></div>'}).join('');
}
function setP(i){
  var d=DATA[i];kpis(i);
  charts.mixed.data.datasets[0].data=d.rev;charts.mixed.data.datasets[1].data=d.meta;
  charts.doughnut.data.datasets[0].data=d.ch;charts.bar.data.datasets[0].data=d.bar;
  charts.line.data.datasets[0].data=d.ln;charts.polar.data.datasets[0].data=d.pol;charts.pie.data.datasets[0].data=d.pie;
  Object.keys(charts).forEach(function(k){charts[k].update()});
}
build();kpis(0);
document.querySelectorAll('[data-p]').forEach(function(b){b.onclick=function(){
  document.querySelectorAll('[data-p]').forEach(function(x){x.classList.remove('on')});b.classList.add('on');setP(+b.dataset.p)}});
document.getElementById('theme').onclick=function(){
  var r=document.documentElement,dark=css('--bg')==='#0e1020';
  r.setAttribute('data-theme',dark?'light':'dark');
  var cur=document.querySelector('[data-p].on').dataset.p;
  Object.keys(charts).forEach(function(k){charts[k].destroy()});build();setP(+cur);
};
