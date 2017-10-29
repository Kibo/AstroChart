// ## Transit chart ###################################
(function( astrology ) {
		
	var context;
    
	/**
	 * Aspects calculator
	 * 
	 * @class
	 * @public
	 * @constructor 	 
	 * @param {Object} points; {"Sun":[0], "Moon":[90], "Neptune":[120], "As":[30]}
	 * @param {Object | null } settings
	 */
	astrology.AspectCalculator = function( toPoints, settings ){
		
		this.settings = settings || {}; 		
		this.settings.aspects = settings && settings.aspects || astrology.ASPECTS;
							
		this.toPoints = toPoints;
																																												
		context = this; 
												 
		return this;
	};
	
	/**
	 * Getter for this.toPoints
	 * @see constructor
	 * 
	 * @return {Object} 
	 */
	astrology.AspectCalculator.prototype.getToPoints = function(){
		return this.this.toPoints;
	};
	
	/**
	 * Radix aspects
	 * 
	 * In radix calculation is the param "points" the same as param "toPoints" in constructor 
	 * , but without special points such as: As,Ds, Mc, Ic, ...
	 * 
	 * @param {Object} points; {"Sun":[0], "Moon":[90]}
	 * 
	 * @return {Array<Object>} [{"aspect":"conjunction", "point":"Sun", "toPoint":"Moon", "precision":0.5}]]
	 */
	astrology.AspectCalculator.prototype.radix = function( points ){
		if(!points){
			return []; 
		}
							
		var aspects = [];			
		
		for (var point in points) {
 		   if (points.hasOwnProperty( point )) {
 		   	 		   	 		   
 		   	for (var toPoint in this.toPoints) {
 		   		if (this.toPoints.hasOwnProperty( toPoint )) { 		   			 		   			 		   		
 		   			
 		   			if( point != toPoint){ 		   				 		   			 		   			 		   
	 		   			for(var aspect in this.settings.aspects){ 		   				
	 		   				if(hasAspect( points[point][0], this.toPoints[toPoint][0], this.settings.aspects[aspect])){
	 		   						
	 		   					aspects.push(
	 		   								{
	 		   								"name":aspect, 
	 		   								"precision":calcPrecision(points[point][0], this.toPoints[toPoint][0], this.settings.aspects[aspect]["degree"]), 
	 		   								"point":point, 
	 		   								"toPoint":toPoint
	 		   								}
	 		   							)
	 		   				}
	 		   				
	 		   			}
 		   			} 		   		 		   						 
 		   		} 		   		
 		   	} 		   	 		   	 		  
 		   } 		
 		}
		 
		return aspects;
	}; 
			
	/**
	 * Transit aspects
	 *
	 * @param {Object} points - transiting points; {"Sun":[0, 1], "Uranus":[90, -1], "NAME":[ANGLE, SPEED]}; 
	 * @return {Array<Object>} [{"aspect":"conjunction", "point":"Sun", "toPoint":"Moon", "precision":0.5}]]
	 */
	astrology.AspectCalculator.prototype.transit = function( points ){	
		if(!points){
			return []; 
		}
		
		var aspects = [];
		
		for (var point in points) {
 		   if (points.hasOwnProperty( point )) { 		   	
 		   		for (var toPoint in this.toPoints) {
 		   			if (this.toPoints.hasOwnProperty( toPoint )) {
 		   		
 		   				for(var aspect in this.settings.aspects){ 		   				
	 		   				if(hasAspect( points[point][0], this.toPoints[toPoint][0], this.settings.aspects[aspect])){	 
	 		   					
	 		   					var precision = calcPrecision(points[point][0], this.toPoints[toPoint][0], this.settings.aspects[aspect]["degree"]);	 		   						 		   							   					
	 		   					aspects.push(
	 		   								{
	 		   								"name":aspect, 
	 		   								"precision":calcDirection( this.settings.aspects[aspect]["degree"], this.toPoints[toPoint][0], points[point][0], points[point][1]) * precision,
	 		   								"point":point, 
	 		   								"toPoint":toPoint
	 		   								}
	 		   							)
	 		   				}	 		   				
	 		   			} 		   		 		   		 		   	
 		   			}
 		   		} 		   	
 		   } 		
 		}
 		 		   						
		return aspects;
	};
	
	/*
	* @private
 	* @param {double} point
 	* @param {double} toPoint
 	* @param {Array} aspects; [DEGREE, ORBIT]
	 */
	function hasAspect(point, toPoint, aspect){
		var result = false;
		
		var gap = Math.abs( point - toPoint );
		
		if( gap > astrology.utils.radiansToDegree( Math.PI)){
			gap = astrology.utils.radiansToDegree( 2 * Math.PI) - gap;
		}
		
		var orbitMin = aspect["degree"] - (aspect["orbit"] / 2);
		var orbitMax = aspect["degree"] + (aspect["orbit"] / 2);
		
		if(orbitMin <= gap && gap <= orbitMax){											
			result = true;
		}
								
		return result;	
	}
	
	/*
	* @private 
 	* @param {Object} pointAngle
 	* @param {Object} toPointAngle
 	* @param {double} aspectDegree;
	 */
	function calcPrecision(point, toPoint, aspect){
		var gap = Math.abs( point - toPoint );
		
		if( gap > astrology.utils.radiansToDegree( Math.PI)){
			gap = astrology.utils.radiansToDegree( 2 * Math.PI) - gap;
		}			
		return Math.abs( gap - aspect);
	}
	
	/*
	 * Calculate direction of aspect
	 * whether the transiting planet is approaching or is falling
	 * @private
	 * 
	 * //TODO
	 * This method is tested, and for tests gives the right results. 
	 * But the code is totally unclear. It needs to be rewritten.
	 * *
	 * @param {Integer} aspect - aspect angle, for example 90
	 * @param {double} toPoint - angle of radix standing point
	 * @param {double} point - angle of transiting planet
	 * @param {double | undefined} speed - speed of transiting planet
	 * 
	 * @return {+1 | -1}
	 * -1 transit planet is approaching the radix point.
	 * +1 transit planet is falling the radix point.
	 */
	function calcDirection(aspect, toPoint, point, pointSpeed){
		
		if( (point - toPoint) > 0 ){
			
			if((point - toPoint) > astrology.utils.radiansToDegree( Math.PI)){
				point = (point + aspect) % astrology.utils.radiansToDegree( 2 * Math.PI);
			}else{
				toPoint = (toPoint + aspect) % astrology.utils.radiansToDegree( 2 * Math.PI);
			}			
		}else{
			
			if((toPoint - point) > astrology.utils.radiansToDegree( Math.PI)){
				toPoint = (toPoint + aspect) % astrology.utils.radiansToDegree( 2 * Math.PI);
			}else{
				point = (point + aspect) % astrology.utils.radiansToDegree( 2 * Math.PI);
			}										
		}
		
		var _point = point;
		var _toPoint = toPoint;
		
		var difference = _point - _toPoint;
		
		if( Math.abs( difference ) > astrology.utils.radiansToDegree( Math.PI)){			
			_point = toPoint;
			_toPoint = point;
		}
							
		return (_point - _toPoint < 0) ? -1 : 1;				
	}
		
}( window.astrology = window.astrology || {}));
