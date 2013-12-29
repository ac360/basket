

mZoomIn = function(e, cb){
	var settleBack = move(e)
	  .scale(1)
	  .then(setTimeout(cb,1000))
	move(e)
	  .set('opacity', 1)
	  .scale(1.1)
	  .then(settleBack)
	  .duration('0.2s')
	  .end();
};

mScaleY = function(e, cb){
	move(e)
	  .scaleY(2)
	  .end();
};