// ## Base InputHandler ###################################
(function( astrology ) {
		
	var context;
    
	/**
	 * Base Input Handler
	 * 
	 * @class
	 * @public
	 * @constructor 	 
	 */
	astrology.InputHandler = function( callBack ){  
		
		this.callback = callBack;
		
		this.elements = null;	
    	this.moving = false;
    	
    	this.moveThreshold = 1;
    	this.stopDomEvents = true;
    	
    	// TODO
    	/*    	     	
    	if( astrology.utils.isTouchDevice() ){
    		astrology.utils.mixin(this, astrology.Touchhandler(), ["hello"]);
    	}else{
    		astrology.utils.mixin(this, astrology.MouseHandler(), ["hello"]);
    	}
    	*/    
    	
    	context = this;	    	    	    	    	    
	};
	
	/**
	 * 
 	 * @param {Object} eventTarget - DOM element
	 */
	astrology.InputHandler.prototype.setTargets = function( elements ){		
		this.elements = elements;
		elements.forEach( function(element){			
			this.attachDomListeners( element );
			
			// TODO
			element.setAttribute( "transform", "matrix(1 0 0 1 0 0)" );
						
		}, this);			
	};
	
	/**
	 * @param {EventTarget} element
	 */
	astrology.InputHandler.prototype.attachDomListeners = function( element ){
		element.addEventListener("mousedown", (this.onDownDomEvent).bind(this), false);
		element.addEventListener("mouseup", (this.onUpDomEvent).bind(this), false);
		element.addEventListener("mousemove", this.onMoveDomEvent, false);
		element.addEventListener("mouseout", (this.onMouseOutDomEvent).bind(this), false);										
	};
	
	/**
	 * @param {Object} e - DOM Event
	 */
	astrology.InputHandler.prototype.onDownDomEvent = function(e){
		
		// We must save this coordinates to support the moveThreshold							
		this.lastMoveCoordinates = this.getInputCoordinates(e);
		this.moving = true;
		console.log("down")			
	};
	
	/**
	 * @param {Object} e - DOM Event
	 */
	astrology.InputHandler.prototype.onUpDomEvent = function(e){	
		this.moving = false;
		console.log("up")				
	};
	
	/**
	 * @param {Object} e - DOM Event
	 */
	astrology.InputHandler.prototype.onMouseOutDomEvent = function(e){	
		this.moving = false;	
		console.log("out")			
	};
		
	/**
	 * Listens to the "move" DOM events: mousemove and touchmove.
	 * @param {Object} e - DOM move event: {posX:100, posY:200, deltaX:1, deltaY:0, target:Object}
	 */
	astrology.InputHandler.prototype.onMoveDomEvent = function( e ){							
		if( context.moving != true){
			return;
		}
										
		var coords = context.getInputCoordinates(e);	   
    	var deltaX = coords.posX - context.lastMoveCoordinates.posX;
    	var deltaY = coords.posY - context.lastMoveCoordinates.posY;
    	                      
    	// Check threshold
    	//if (Math.sqrt(deltaX*deltaX + deltaY*deltaY) > context.moveThreshold) {
    		
    		if( typeof context.callback == 'function'){		
				context.callback( {					
					"posX":coords.posX, 
					"posY":coords.posY,
					"deltaX":deltaX,
					"deltaY":deltaY,
					"target": this
					});
				context.lastMoveCoordinates = coords;
			}	    			        	        	    
    	//}
    															
	};
		
	/**
 	* Input coordinates
 	* @param {Object} e - DOM event
 	* @returns {Object}
 	*/
	astrology.InputHandler.prototype.getInputCoordinates = function(e){						
		var coords = e.targetTouches ? e.targetTouches[0] : e;
						
		return {
			posX: coords.pageX,
			posY: coords.pageY
		};		
	};
			
}( window.astrology = window.astrology || {}));
