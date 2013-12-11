

mZoomIn = function(e){
var settleBack = move(e)
  .scale(1)
  .x(0)
move(e)
  .set('opacity', 1)
  .scale(1.1)
  .then(settleBack)
  .duration('0.2s')
  .end();
};