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
    	
    	this.moveThreshold = 2;
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
		}, this);			
	};
	
	/**
	 * @param {EventTarget} element
	 */
	astrology.InputHandler.prototype.attachDomListeners = function( element ){
		element.addEventListener("mousedown", (this.onDownDomEvent).bind(this), false);
		element.addEventListener("mouseup", (this.onUpDomEvent).bind(this), false);
		element.addEventListener("mousemove", this.onMoveDomEvent, false);
		element.addEventListener("mouseout", (function(){console.log("mouse out")}).bind(this), false);						
	};
	
	/**
	 * @param {Object} e - DOM Event
	 */
	astrology.InputHandler.prototype.onDownDomEvent = function(e){
		
		// We must save this coordinates to support the moveThreshold							
		this.lastMoveCoordinates = this.getInputCoordinates(e);
		this.moving = true;
	};
	
	/**
	 * @param {Object} e - DOM Event
	 */
	astrology.InputHandler.prototype.onUpDomEvent = function(e){	
		this.moving = false;		
	};
	
	
	/**
	 * Listens to the "move" DOM events: mousemove and touchmove.
	 * @param {Object} e - DOM move event
	 */
	astrology.InputHandler.prototype.onMoveDomEvent = function(e){				
		if( context.moving != true){
			return;
		}
										
		var coords = context.getInputCoordinates(e);	   
    	var deltaX = coords.posX - context.lastMoveCoordinates.posX;
    	var deltaY = coords.posY - context.lastMoveCoordinates.posY;
    	                      
    	// Check threshold
    	if (Math.sqrt(deltaX*deltaX + deltaY*deltaY) > context.moveThreshold) {
    		
    		if( typeof context.callback == 'function'){		
				context.callback( {
					"elementId":this.id, 
					"posX":context.getInputCoordinates(e).posX, 
					"posY":context.getInputCoordinates(e).posY
					});
				context.lastMoveCoordinates = coords;
			}	    			        	        	    
    	}
    															
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
