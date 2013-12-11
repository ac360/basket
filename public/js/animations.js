

mZoomIn = function(e){
var moveBack = move(e).scale(1)
move(e)
  .set('opacity', 1)
  .scale(1.1)
  .then(moveBack)
  .duration('0.4s')
  .end();
};