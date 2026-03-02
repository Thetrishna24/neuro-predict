(function(){
  var cv=document.getElementById('neuralCanvas'),ctx=cv.getContext('2d'),nodes=[];
  function resize(){cv.width=window.innerWidth;cv.height=window.innerHeight}
  function init(){nodes=[];var c=Math.floor(cv.width*cv.height/30000);for(var i=0;i<c;i++)nodes.push({x:Math.random()*cv.width,y:Math.random()*cv.height,vx:(Math.random()-.5)*.15,vy:(Math.random()-.5)*.15,r:Math.random()*1.5+.5})}
  function draw(){
    ctx.clearRect(0,0,cv.width,cv.height);
    nodes.forEach(function(n){n.x+=n.vx;n.y+=n.vy;if(n.x<0||n.x>cv.width)n.vx*=-1;if(n.y<0||n.y>cv.height)n.vy*=-1;ctx.beginPath();ctx.arc(n.x,n.y,n.r,0,Math.PI*2);ctx.fillStyle='rgba(0,212,255,.35)';ctx.fill()});
    for(var i=0;i<nodes.length;i++)for(var j=i+1;j<nodes.length;j++){var dx=nodes[i].x-nodes[j].x,dy=nodes[i].y-nodes[j].y,d=Math.sqrt(dx*dx+dy*dy);if(d<100){ctx.beginPath();ctx.moveTo(nodes[i].x,nodes[i].y);ctx.lineTo(nodes[j].x,nodes[j].y);ctx.strokeStyle='rgba(0,212,255,'+(0.12*(1-d/100))+')';ctx.lineWidth=.5;ctx.stroke()}}
    requestAnimationFrame(draw);
  }
  resize();init();draw();window.addEventListener('resize',function(){resize();init()});
})();
