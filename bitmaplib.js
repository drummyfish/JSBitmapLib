/**
 *  Creates a new Image.
 *  @class
 *
 *  @param width image width in pixels
 *  @param height image height in pixels
 */

/**
 * Wraps given value into interval <0,maximum>.
 * @private
 *
 * @param value value to be wrapped
 * @param maximum maximum allowed value
 * @return wrapped value
 */
 
function wrap(value, maximum)
  {  
    maximum += 1;
  
	if (value < 0)
	  {
		value *= -1;
        value %= maximum;
        value = maximum - value;
	  }
	  
	if (value != 0)
	  value = value % maximum;
  
    return value;
  }
 
function Image(width, height)
  { 
    // constants:
  
    /** Treat pixels outside the image area as black. */
    this.BORDER_BEHAVIOR_BLACK = 0;
    /** Treat pixels outside the image area as white. */
	this.BORDER_BEHAVIOR_WHITE = 1;
    /** Treat pixels outside the image with modular arithmetic, i.e. as if there was the same image. */
    this.BORDER_BEHAVIOR_WRAP = 2;
    /** Treat pixels outside the image as if there was the same image mirrored. */
    this.BORDER_BEHAVIOR_MIRROR = 3;
    /** If a pixel outside the image area is accessed, the closest one is used. */
    this.BORDER_BEHAVIOR_CLOSEST = 4;
    
	/** If a pixel is set to a value wxceeding minimum/maximum value, saturation is used (e.g. 257 => 255). */
    this.OVERFLOW_BEHAVIOR_SATURATE = 10;
	/** If a pixel is set to a value wxceeding minimum/maximum value, wrapping is used (modulo, e.g. 257 => 1). */
    this.OVERFLOW_BEHAVIOR_WRAP = 11;
	
	/**
	 *  Applies the current overflow behavior to given value.
	 *  @private
	 *
	 *  @param value value to apply the bahavior to
	 *  @return the value after the behavior has been applied
	 */
	
	this.applyOverflowBehavior = function(value)
	  {  
		switch(this.overflowBehavior)
		  {
			case this.OVERFLOW_BEHAVIOR_SATURATE:
			  if (value < 0)
				value = 0;
		      else if (value > 255)
				value = 255;
			  break;
			  
			case this.OVERFLOW_BEHAVIOR_WRAP: 
			  value = wrap(value,255);
			  break;
			  
			default:
			  break;
		  }
		  
		return value;
	  }

	/**
	 *  Applies the current border behavior to given value.
	 *  @private
	 *
	 *  @param value value to apply the bahavior to
	 *  @param maximum maximum value allowed
	 *  @return the value after the behavior has been applied or
	 *    -1 which means the value cannot be converted and should
	 *    not be used
	 */
	
	this.applyBorderBehavior = function(value, maximum)
	  {  
		switch(this.borderBehavior)
		  {
			default:
			case this.BORDER_BEHAVIOR_BLACK:
			case this.BORDER_BEHAVIOR_WHITE:
			  if (value < 0)
				value = -1;
		      else if (value > maximum)
				value = -1;
			  break;
			  
			case this.BORDER_BEHAVIOR_CLOSEST: 
			  if (value < 0)
				value = 0;
			  else if (value > maximum)
			    value = maximum;
			  break;
			  
			case this.BORDER_BEHAVIOR_WRAP:
			  value = wrap(value,maximum);
			  break;
			
            case this.BORDER_BEHAVIOR_MIRROR:
			  even_part = value >= 0 ?
			    Math.floor(value / (maximum + 1)) % 2 == 0 :
				Math.floor(-1 * (value + 1) / (maximum + 1)) % 2 != 0;
				
			  value = wrap(value,maximum);
			  
			  if (!even_part)
				value = maximum - value;
			  break;
		  }
		  
		return value;
	  }
	  
	/**
	 *  Sets the border behavior for the image, i.e. the rules
     *  that say which pixel is used when a pixel outside the
     *  image are is accessed.
     *
     *  @param behavior new behavior to be set, see the class
	 *         constants starting with BORDER_BEHAVIOR_	 
	 */
	
	this.setBorderBehavior = function(behavior)
	  {
		this.borderBehavior = behavior;
	  }
	  
	/**
	 *  Sets the overflow behavior for the image, i.e. the rules
     *  that say how a pixel value should be converted to the
	 *  minimum/maximum	range if it exceeds it.
	 *
     *  @param behavior new behavior to be set, see the class
	 *         constants starting with OVERFLOW_BEHAVIOR_
	 */
	
	this.setOverflowBehavior = function(behavior)
	  {
		this.overflowBehavior = behavior;
	  }
	
    /**
	 *  Gets the image width.
	 *
	 *  @return image width in pixels
	 */
  
	this.getWidth = function()
	  {
		return this.imageData.length;
	  }
			
	/**
	 *  Gets the image height.
	 *
	 *  @return image height in pixels
	 */
			
    this.getHeight = function()
	  {
		return this.imageData[0].length;
	  }
			
	/**
	 *  Gets a pixel RGB value.
	 *
	 *  @param x x position
	 *  @param y y position
	 *  @return array of color RGB components
	 */
			
	this.getPixel = function(x, y)
	  {
		x = this.applyBorderBehavior(x,this.getWidth() - 1);
		y = this.applyBorderBehavior(y,this.getHeight() - 1);
		
        if (x < 0 || y < 0)   // unusable values
		  {
			if (this.borderBehavior == this.BORDER_BEHAVIOR_WHITE)
 		  	  return [255,255,255];
		    else
			  return [0,0,0];
		  }
		  
		return this.imageData[x][y].slice();
	  }
	
    /**
	 *  Sets a pixel at given position to given RGB value.
	 *
	 *  @param x x position
	 *  @param y y position
	 *  @param red new red value (0 - 255)
	 *  @param green new green value (0 - 255)
	 *  @param blue new blue value (0 - 255)
	 */
	
    this.setPixel = function(x, y, red, green, blue)
	  {
		x = this.applyBorderBehavior(x,this.getWidth() - 1);
		y = this.applyBorderBehavior(y,this.getHeight() - 1);

        if (x < 0 || y < 0)   // unusable values
		  return;
		  
	    this.imageData[x][y][0] = this.applyOverflowBehavior(red);
		this.imageData[x][y][1] = this.applyOverflowBehavior(green);
		this.imageData[x][y][2] = this.applyOverflowBehavior(blue);
	  }
			
	/**
	 *  Performs given operation represented by a function
	 *  on every image pixel.
	 *
	 *  @param functionToApply function to be applied,
	 *         its parameters must be x, y, r, g, b and it
	 *         must return an array of RGB components
	 */
			
	this.forEachPixel = function(functionToApply)
	  {
	    for (var i = 0; i < this.getWidth(); i++)
		  for (var j = 0; j < this.getHeight(); j++)
		    {
		      var color = this.getPixel(i,j);
			  color = functionToApply(i,j,color[0],color[1],color[2]);
			  
			  this.setPixel(i,j,color[0],color[1],color[2]);
		    }
	  }
			
	/**
	 *  Draws the image to given canvas element.
	 *
	 *  @param canvas canvas element to draw the image to
	 */
			
    this.drawToCanvas = function(canvas)
	  {
	    var context = canvas.getContext("2d");
		var id = context.createImageData(1,1);
        var data  = id.data;                        
                
		for (var i = 0; i < this.getWidth(); i++)
		  for (var j = 0; j < this.getHeight(); j++)
		    {
		      var color = this.getPixel(i,j);
			  data[0]   = color[0];
              data[1]   = color[1];
              data[2]   = color[2];
              data[3]   = 255;      // alpha
				  
			  context.putImageData(id,i,j);
		    }
	  }
			
	/**
	 *  Fills the whole image with given color.
	 *
	 *  @param red amount of red (0 - 255)
	 *  @param green amount of green (0 - 255)
	 *  @param blue amount of blue (0 - 255)
	 */
			
	this.fill = function(red, green, blue)
	  {
	    this.forEachPixel(
		  function(x,y,r,g,b)
		    {
		      return [red,green,blue];
		    }
	      );
	  }
			
	// init the image:
			
	this.imageData = new Array(width);
		  
	for (var i = 0; i < width; i++)
	  {
	    this.imageData[i] = new Array(height);
			  
	    for (var j = 0; j < height; j++)
		  this.imageData[i][j] = new Array(3);  // rgb
	  }
			
	this.setBorderBehavior(this.BORDER_BEHAVIOR_WHITE);
	this.setOverflowBehavior(this.OVERFLOW_BEHAVIOR_SATURATE);
	this.fill(255,255,255);
  };