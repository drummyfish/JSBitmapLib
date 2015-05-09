/**
 * CRABBO LIB
 *
 *
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
  
function saturate(value, minimum, maximum)
  {
    if (value < minimum)
      return minimum;

    if (value > maximum)
      return maximum;        
  
    return value;
  }

/**
 *  Loads images from given set of input elements.
 *
 *  @param inputs array of input elements, their images must be
 *    already set (inputs without selected images will return null)
 *  @param completedCallback a function that will be called once
 *    all images have been loaded, it should take one parameter
 *    that will contain an array of images that have been loaded
 */
  
function loadImagesFromInputs(inputs, completedCallback)
  {
    var counter = inputs.length;    // counts how many images have already been loaded
    var result = new Array();
  
    var checkImages = function()
	  {
		counter--;
		
		if (counter == 0)
		  completedCallback();
	  };
  
    for (var i = 0; i < inputs.length; i++)
	  {
		var image = new Image(1,1);
		
		result.push(image);
		
		if (!image.loadFromInput(inputs[i],checkImages))
		  {
			result[result.length - 1] = null;
		    counter--;
		  
            if (counter == 0)
              {
                completedCallback();
                return result;
              }
          }
	  }
	  
	return result;
  }
  
/**
 *  Creates a new matrix. Matrices can be used for image transformations.
 *  @class
 *
 *  @param width matrix width
 *  @param height matrix height
 */
  
function Matrix(width, height)
  {  
    /**
     *  Gets the matrix width.
     *
     *  @return matrix width
     */ 
  
    this.getWidth = function()
	  {
		return this.data.length;
	  }
	  
    /**
     *  Gets the matrix height.
     *
     *  @return matrix height
     */ 
      
	this.getHeight = function()
	  {
		return this.data[0].length;
	  }
  
    /**
     *  Gets the matrix value at given position.
     *
     *  @param x x position
     *  @param y y position
     *  @return value at given position
     */
  
    this.getValue = function(x, y)
	  {  
	    if (x < 0 || x >= this.getWidth() || y < 0 || y >= this.getHeight())
	      return 0;
	  
	    x = Math.round(x);
	    y = Math.round(y);
	  
	    return this.data[x][y];
	  }
	
    /**
     *  Sets the matrix value at given position.
     *
     *  @param x x position
     *  @param y y position
     *  @param value value
     */
    
	this.setValue = function(x, y, value)
	  {
		if (x < 0 || x >= this.getWidth() || y < 0 || y >= this.getHeight())
	      return;
	  
	    x = Math.round(x);
	    y = Math.round(y);
      
	    this.data[x][y] = value;
	  }
	  
	/**
	 *  Sets matrix values from given values. The values will be
	 *  traversed from left and they will be set to matrix which
	 *  will be traversed from top left by lines.
	 */
	  
	this.setValues = function()
	  {
		var position = 0;
		
		for (var j = 0; j < this.getHeight(); j++)
		  for (var i = 0; i < this.getWidth(); i++)
		    {
			  if (position >= arguments.length)
				return;
				
			  this.setValue(i,j,arguments[position]);
				
			  position++;
			}
	  }
	  
	/**
	 *  Multiplies the matrix with another matrix.
	 *
	 *  @param matrix matrix to multiply this matrix with
	 *  @return result of multiplication, i.e. a matrix or null
	 *     if the matrices cannot be multiplied
	 */
	  
	this.multiply = function(matrix)
	  {
		if (this.getWidth() != matrix.getHeight())   
		  return null;          // can't multiply
		  
		var result = new Matrix(this.getWidth(),this.getHeight());
		
		for (var j = 0; j < result.getHeight(); j++)
		  for (var i = 0; i < result.getWidth(); i++)
		    {
			  var value = 0;
			  
			  for (var k = 0; k < this.getWidth() ; k++)
				value += this.getValue(k,j) * matrix.getValue(i,k);
			
			  result.setValue(i,j,value);
		    }
		
		return result;
	  }
	  
	/**
	 *  Makes a transposed matrix.
	 *
	 *  @return transposed matrix
	 */
	  
	this.transposed = function()
	  {
		var result = new Matrix(this.getHeight(),this.getWidth());  
	  
	    for (var j = 0; j < result.getHeight(); j++)
		  for (var i = 0; i < result.getWidth(); i++)
		    result.setValue(i,j,this.getValue(j,i));
	    
		return result;
	  }
	  
    /**
     *  Decomposes the separable filter represented by this matrix
     *  to two vectors - horizontal and vertical.
     *
     *  @return array containing horizontal and vertical vectors as
     *    row matrices or null if the filter cannot be decomposed
     *    because it isn't separable
     */
      
    this.decomposeSeparable = function()
      {
        // TODO
      }
      
    /**
     *  Returns a string representing the matrix.
     *
     *  @return string representing the matrix
     */
      
	this.toString = function()
	  {
		var result = "";
		  
		for (var j = 0; j < this.getHeight(); j++)
		  {  
	        for (var i = 0; i < this.getWidth(); i++)
			  {
		        result += this.getValue(i,j).toString() + " ";	
		      }
		
		    result += "\n";
		  }
		  
		return result;
	  }
	
	// init the matrix:
  
	this.data = new Array(width);
		  
	for (var i = 0; i < width; i++)
	  {
	    this.data[i] = new Array(height);
			  
	    for (var j = 0; j < height; j++)
		  this.data[i][j] = 0;
	  }
  }
  
/**
 *  Creates a new Image.
 *  @class
 *
 *  @param width image width in pixels
 *  @param height image height in pixels
 */
 
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
	
	/** interpolation by nearest neighbour */
	this.INTERPOLATION_METHOD_CLOSEST = 20;
	/** bilinear interpolation */
	this.INTERPOLATION_METHOD_BILINEAR = 21;
	/** bicubic interpolation */
	this.INTERPOLATION_METHOD_BICUBIC = 22;
	/** sine interpolation */
	this.INTERPOLATION_METHOD_SINE = 23;
	
	/** derivative by x axis */
	this.DERIVATIVE_TYPE_X = 30;
	/** derivative by y axis */
	this.DERIVATIVE_TYPE_Y = 31;
	/** derivative by x and y axis */
	this.DERIVATIVE_TYPE_XY = 32;
	
	/** blend by adding */
	this.BLEND_TYPE_ADD = 40;
	/** blend by substracting */
	this.BLEND_TYPE_SUBSTRACT = 41;
	/** blend by multiplying */
	this.BLEND_TYPE_MULTIPLY = 42;
	
    /**
     *  Performs either dilation or erosion.
     *  @private
     *
     *  @param dilation if true, dilation is performed, otherwise erosion
     *  @param sourceImage image to perform the operation with
     *  @param matrix matrix representing the structuring element,
     *    negative values are ignored
     *  @param centerX x center of the structuring element
     *  @param centerY y center of the structuring element
     */
    
    var morphology = function(dilation, sourceImage, matrix, centerX, centerY)
      {
        var value, i, j, c, component, extremes, fromX, fromY, helper, tempCopy;
          
        extremes = new Array(3);    // rgb
        tempCopy = sourceImage.copy();
          
        sourceImage.forEachPixel
          (
            function (x, y, r, g, b)
              { 
                if (dilation)
                  {                    
                    extremes[0] = 0;
                    extremes[1] = 0;
                    extremes[2] = 0;
                  }
                else
                  {
                    extremes[0] = 255;
                    extremes[1] = 255;
                    extremes[2] = 255;
                  }
                
                fromX = x - centerX;
                fromY = y - centerY;
                      
                for (j = 0; j < matrix.getHeight(); j++)
                  for (i = 0; i < matrix.getWidth(); i++)
                    {
                      value = matrix.getValue(i,j);
                          
                      if (value < 0)
                        continue;
                        
                      c = tempCopy.getPixel(fromX + i,fromY + j);
                      
                      for (component = 0; component < 3; component++)
                        {
                          helper = c[component] + value;

                          if (dilation)
                            {    
                              if (helper > extremes[component])
                                extremes[component] = helper;    
                            }
                          else
                            {
                              if (helper < extremes[component])
                                extremes[component] = helper;
                            }
                        }
                    }
                    
                return extremes;
              }
          );  
      }
    
	/**
	 *  Sets the image size to given value. Old content is
     *  either cropped or extended according to current border
	 *  behavior.
	 *
	 *  @param width new image width in pixels
	 *  @param height new image height in pixels
	 */
	
	this.setSize = function(width, height)
	  {
		var newArray = new Array(width);
		  
	    for (var i = 0; i < width; i++)
	      {
	        newArray[i] = new Array(height);
		  
	        for (var j = 0; j < height; j++)
		      newArray[i][j] = new Array(3);  // rgb
	      }
		  
		// copy the data to the new array:
		  
		for (var j = 0; j < height; j++)
	      for (var i = 0; i < width; i++)
		    {
			  var color = this.getPixel(i,j);
				
			  newArray[i][j][0] = color[0];
			  newArray[i][j][1] = color[1];
			  newArray[i][j][2] = color[2];
			}
			
		this.imageData = newArray;
	  }
	
	/** 
	 *  Resizes the image with resampling.
	 *
	 *  @param width new width in pixels
	 *  @param height new height in pixels
	 */
	
	this.resize = function(width, height)
	  {
	    var oldImage = this.copy();
		
		this.setSize(width,height);
	
		this.forEachPixel
		  (
		    function (x, y, r, g, b)
			  {
			    x = (x / (width - 1)) * (oldImage.getWidth() - 1);
			    y = (y / (height - 1)) * (oldImage.getHeight() - 1);
			    return oldImage.getPixel(x,y);
			  }
		  );	
	  }
	
	/**
	 *  Loads the image from input element of HTML5 File API.
	 *  This allows for client local images to be loaded. The loading
	 *  happens asynchronously.
	 *
	 *  @param input input element that must have the image
	 *    file selected (otherwise nothing happens)
	 *  @param completedCallback a function that will be run
	 *    once the loading has been completed
	 *  @return true if the image succesfully started being loaded,
	      false otherwise
	 */
	
	this.loadFromInput = function(input, completedCallback)
	  {
        var file = input.files[0];		
		var reader = new FileReader();
		var selfReference = this;
		
		if (file)    // if file is selected
		  {
		    var imageElement = document.createElement("img");
	    
		    reader.onload = 
		      (
		        function(image)
			      {
			        return function(event)
				     { 
					   image.src = event.target.result;
					   
			           var width = image.width;
			           var height = image.height;
					   
					   selfReference.setSize(width,height);

					   var canvas = document.createElement("canvas");
					   canvas.width = width + 1;
					   canvas.height = height + 1;
		               var context = canvas.getContext("2d");
		               context.drawImage(image,0,0);
			
			           var imageData = context.getImageData(0,0,width,height);
			
			           var column = 0;
					   var row = 0;
					   
			           for (var i = 0; i < imageData.data.length; i+= 4)  // rgba
					     {
						   selfReference.setPixel(column,row,imageData.data[i],imageData.data[i + 1],imageData.data[i + 2]);
							
						   column += 1;
						   
						   if (column >= width)
						     {
							   column = 0;
							   row += 1;
							 }
						 }
						 
					   completedCallback();
				     };
			      }  
		      )(imageElement);
		
		    reader.readAsDataURL(file);
		    return true;
		  }  
		  
		return false;
	  }
	
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
	 *  Gets the current border behavior.
	 *
	 *  @return current border behavior
	 */
	  
	this.getBorderBehavior = function()
	  {
		return this.borderBehavior;
	  }
	  
	/**
	 *  Sets the interpolation method, i.e. how the values will
	 *  be sampled between the pixels.
	 *
	 *  @param method new interpolation method to be set, see the
	 *    class constants starting with INTERPOLATION_METHOD_
	 */
	  
	this.setInterpolationMethod = function(method)
	  {
		this.interpolationMethod = method;
	  }
	  
	/**
	 *  Gets the current interpolation method of the image.
	 *
	 *  @return current interpolation method, see the class constants
	 *    starting with INTERPOLATION_METHOD_
	 */
	  
	this.getInterpolationMethod = function(method)
	  {
		return this.interpolationMethod;
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
	 *  Gets the current border behavior.
	 *
	 *  @return current border behavior
	 */
	
	this.getOverflowBehavior = function()
	  {
		return this.overflowBehavior;
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
	 *  Gets a pixel RGB value. The coordinates may be float in
	 *  which case a sampled value is returned (according to current
	 *  interpolation method set).
	 *
	 *  @param x x position
	 *  @param y y position
	 *  @return array of color RGB components
	 */
			
	this.getPixel = function(x, y)
	  { 
		if (x % 1 != 0 || y % 1 != 0)       // non-integer coordinates => sample
		  {
		    return this.samplePixel(x, y);
		  }
		  
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
	 *  Samples the image at given floating point position, i.e.
	 *  even between its pixels according to the current interpolation
	 *  method.
	 *
	 *  @private
	 *  @param x x position
	 *  @param y y position
	 */
	
	this.samplePixel = function(x, y)
	  {
		switch (this.getInterpolationMethod())
		  {
			default:
			case this.INTERPOLATION_METHOD_CLOSEST:
			  return this.getPixel(Math.round(x),Math.round(y));
			  break;
			  
			case this.INTERPOLATION_METHOD_BILINEAR:
			  var x0 = Math.floor(x);
			  var x1 = Math.ceil(x);
			  var xRatio = x - x0;
			  var xRatio2 = 1 - xRatio;
			  var y0 = Math.floor(y);
			  var y1 = Math.ceil(y);
			  var yRatio = y - y0;
			  var yRatio2 = 1 - yRatio;
			  var c1 = this.getPixel(x0,y0);
			  var c2 = this.getPixel(x1,y0);
			  var c3 = this.getPixel(x0,y1);
			  var c4 = this.getPixel(x1,y1);
			  
			  for (var component = 0; component < 3; component++)
			    {
				  c1[component] = c1[component] * xRatio2 + c2[component] * xRatio;
				  c3[component] = c3[component] * xRatio2 + c4[component] * xRatio;
				  c1[component] = Math.round(c1[component] * yRatio2 + c3[component] * yRatio);
				}
			  
			  return c1;
			  break;
			  
			case this.INTERPOLATION_METHOD_BICUBIC:
              // TODO
			  var result = [0,0,0];
			
	          var x0 = Math.floor(x);
			  var x1 = Math.ceil(x);
			  var xRatio = x - x0;
			  var y0 = Math.floor(y);
			  var y1 = Math.ceil(y);
			  var yRatio = y - y0;
              
			  var c1 = this.getPixel(x0,y0);
			  var c2 = this.getPixel(x1,y0);
			  var c3 = this.getPixel(x0,y1);
			  var c4 = this.getPixel(x1,y1);
			  
			  var dx1 = this.getDerivative(x0,y0,this.DERIVATIVE_TYPE_X);
			  var dx2 = this.getDerivative(x1,y0,this.DERIVATIVE_TYPE_X);
			  var dx3 = this.getDerivative(x0,y1,this.DERIVATIVE_TYPE_X);
			  var dx4 = this.getDerivative(x1,y1,this.DERIVATIVE_TYPE_X);
			  
			  var dy1 = this.getDerivative(x0,y0,this.DERIVATIVE_TYPE_Y);
			  var dy2 = this.getDerivative(x1,y0,this.DERIVATIVE_TYPE_Y);
			  var dy3 = this.getDerivative(x0,y1,this.DERIVATIVE_TYPE_Y);
			  var dy4 = this.getDerivative(x1,y1,this.DERIVATIVE_TYPE_Y);
			  
			  var dxy1 = this.getDerivative(x0,y0,this.DERIVATIVE_TYPE_XY);
			  var dxy2 = this.getDerivative(x1,y0,this.DERIVATIVE_TYPE_XY);
			  var dxy3 = this.getDerivative(x0,y1,this.DERIVATIVE_TYPE_XY);
			  var dxy4 = this.getDerivative(x1,y1,this.DERIVATIVE_TYPE_XY);
			  
			  var matrix = new Matrix(4,4);
			  var matrix1 = new Matrix(4,4);
			  var matrix2 = new Matrix(4,4);
			  
			  matrix1.setValues(
			    1,  0,  0, 0,
				0,  0,  1, 0,
				-3, 3, -2, 1,
				2, -2,  1, 1
				);
				
			  matrix2.setValues(
			    1, 0, -3, 2,
				0, 0, 3, -2,
				0, 1, -2, 1,
				0, 0, 1,  1
				);
			  
			  for (var component = 0; component < 3; component++)
			    {
				  matrix.setValues(
				    c1[component],  c3[component],  dy1[component],  dy3[component], 
                    c2[component],  c4[component],  dy2[component],  dy4[component],				
				    dx1[component], dx3[component], dxy1[component], dxy3[component],
				    dx2[component], dx4[component], dxy2[component], dxy4[component]
				    );
					
				  var coefficients = matrix1.multiply(matrix);
				  coefficients = coefficients.multiply(matrix2);
					
                    
				  for (var j = 0; j < 3; j++)
				    for (var i = 0; i < 3; i++)
				      {
					    result[component] += coefficients.getValue(j,i) * Math.pow(xRatio,i) * Math.pow(yRatio,j);
				      }
					  
				  result[component] = Math.round(result[component]);
				}
			  
			  return result;
			  
			  break;
		  }
		  
		return [0,0,0];
	  }

	/**
	 *  Gets the image derivative in given point computed from their
	 *  neighbour pixels.
	 *
	 *  @param x x coordinate
	 *  @param y y coordinate
	 *  @param type derivative type, see class constants starting with
	 *    DERIVATIVE_TYPE_
	 *  @return three-component array representing derivatives
	 *    for each RGB component
	 */
	  
    this.getDerivative = function(x, y, type)
	  {
	    var result = [0,0,0]
		var c1;
		var c2;
		var c3;
		var c4;
		
		switch (type)
		  {
			default:
			case this.DERIVATIVE_TYPE_X:
			  c1 = this.getPixel(x + 1,y);
			  c2 = this.getPixel(x - 1,y);
			  break;
			 
			case this.DERIVATIVE_TYPE_Y:
			  c1 = this.getPixel(x,y + 1);
			  c2 = this.getPixel(x,y - 1);
			  break;  
			  
			case this.DERIVATIVE_TYPE_XY:
			  c1 = this.getPixel(x + 1,y + 1);
			  c2 = this.getPixel(x - 1,y + 1);
			  c3 = this.getPixel(x + 1,y - 1);
			  c4 = this.getPixel(x - 1,y - 1);
			  break;
		  }
		
		for (component = 0; component < 3; component++)
		  {
			if (type == this.DERIVATIVE_TYPE_XY)
			  {
				var value1 = (c1[component] - c2[component]) / 2.0;
			    var value2 = (c3[component] - c4[component]) / 2.0;
			  
			    result[component] = (value1 - value2) /  2.0;
			  }  
		    else
		      result[component] = (c1[component] - c2[component]) / 2.0;
		  }  
	    
		return result;
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
	 *  @param functionToApply function to be applied, the function must
	 *    return three-component of RGB components, parameters passed to
	 *    it will be: x, y, red, green, blue, imageReference
	 */
			
	this.forEachPixel = function(functionToApply)
	  {
	    for (var i = 0; i < this.getWidth(); i++)
		  for (var j = 0; j < this.getHeight(); j++)
		    {
		      var color = this.getPixel(i,j);
			  color = functionToApply(i,j,color[0],color[1],color[2],this);
			  
			  this.setPixel(i,j,color[0],color[1],color[2]);
		    }
	  }
			
	/**
	 *  Draws the image to given canvas element.
	 *
	 *  @param canvas canvas element to draw the image to
	 *  @param resize bool value, says whether the canvas should be
	 *    resized to the image size (default is true)
	 */
			
    this.drawToCanvas = function(canvas, resize)
	  { 
	    resize = typeof resize !== 'undefined' ? resize : true;
	  
	    if (resize)
		  {
			canvas.width = this.getWidth();
			canvas.height = this.getHeight();
		  }
	  
	    var context = canvas.getContext("2d");
		var id = context.createImageData(this.getWidth(),this.getHeight());
        var data  = id.data;                        
        
		var position = 0;
				
		for (var j = 0; j < this.getHeight(); j++)
		  for (var i = 0; i < this.getWidth(); i++)
		    {
		      var color = this.getPixel(i,j);
			  data[position]     = color[0];
              data[position + 1] = color[1];
              data[position + 2] = color[2];
              data[position + 3] = 255;      // alpha
		    
			  position += 4;
			}
			
		context.putImageData(id,0,0);
	  }
		
    /**
	 *  Inverts the image colors.
	 */
		
    this.invert = function()
	  {
		this.forEachPixel(function(x, y, r, g, b) {return [255 - r, 255 - g, 255 - b]});
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
		
	/**
	 *  Translates the image by given offset.
	 *
	 *  @param horizontal horizontal offset in pixels (can be negative)
	 *  @param vertical vertical offset in pixels (can be negative)
	 */
	 
    this.translate = function(horizontal, vertical)
	  {
	  }
	  
	/**
	 *  Creates a deep copy of the image.
	 *
	 *  @return new image that contains the same data and attributes as
	 *    this image
	 */
	 
	this.copy = function()
	  {
	    var newImage = new Image(this.getWidth(),this.getHeight());	
	    var reference = this;
		
		newImage.setInterpolationMethod(this.getInterpolationMethod());
		newImage.setBorderBehavior(this.getBorderBehavior());
		newImage.setOverflowBehavior(this.getOverflowBehavior());
		
		copyFunction = function(x, y, r, g, b)
		  {
			return reference.getPixel(x,y);
		  };
		
		newImage.forEachPixel(copyFunction);
		
		return newImage;
	  }

	/**
	 *  Generates white noise into the image.
	 */
	 
	this.generateWhiteNoise = function()
	  {
	    this.forEachPixel
		  (
		    function (x, y, r, g, b)
			  {
				return [Math.floor(Math.random() * 256),Math.floor(Math.random() * 256),Math.floor(Math.random() * 256)];
			  }
		  );
	  }
	  
	/**
	 * Converts the image to grayscale.
	 */
	 
	this.toGrayscale = function()
	  {
	    this.forEachPixel
		  (
		    function (x, y, r, g, b)
			  {
				var value = Math.round(0.2126 * r) + Math.round(0.7152 * g) + Math.round(0.0722 * b);
				return [value,value,value];
			  }
		  );		
	  }
	  
    /**
     *  Performs morphology dilation with the image.
     *
     *  @param matrix matrix representing the structuring element,
     *    negative values are ignored
     *  @param centerX x center of the structuring element
     *  @param centerY y center of the structuring element
     */
      
	this.dilate = function(matrix, centerX, centerY)
	  {
        morphology(true,this,matrix,centerX,centerY);
	  }

    /**
     *  Performs morphology erosion with the image.
     *
     *  @param matrix matrix representing the structuring element,
     *    negative values are ignored
     *  @param centerX x center of the structuring element
     *  @param centerY y center of the structuring element
     */
	  
	this.erode = function(matrix, centerX, centerY)
	  {
        morphology(false,this,matrix,centerX,centerY);
	  }
	  
	/**
	 *  Gets a short image description as a string.
	 *
	 *  @return string with object info
	 */
	  
	this.toString = function()
	  {
		return "size: " + this.getWidth().toString() + " x " + this.getHeight().toString();
	  }
	  
	/**
	 *  Blends the image with another image, the result is saved in this image.
	 *
	 *  @param withWhat the image that this image should be blend with
	 *  @param percentage a number in range <0,1>, specifies the blend ratio,
	 *    this is ignored if the mask parameter is used
	 *  @param type blend type, see the class constants starting with
	 *    BLEND_TYPE_
	 *  @param mask specifies an image that should be used as per-pixel
     *    blending mask (each RGB channel is used as a mask for corresponding
	 *    channel)
	 */
	  
	this.blend = function(withWhat, percentage, type, mask)
	  {
        type = typeof type !== 'undefined' ? type : this.BLEND_TYPE_ADD;
          
        percentage = saturate(percentage,0,1);
          
        var makeCoefficients = function(value)
          {
            var c1 = value <= 0.5 ? 1 : 1 - (value - 0.5) * 2.0;
            var c2 = value > 0.5 ? 1 : value * 2.0;  
            return [c1,c2];
          }

        var coefficients = makeCoefficients(percentage);
          
        var helperFunction;
          
        switch (type)
		  {
			default:
			case this.BLEND_TYPE_ADD:
			  helperFunction = function(a, b){ return a + b };
              break;
					  
			case this.BLEND_TYPE_SUBSTRACT:
			  helperFunction = function(a, b){ return a - b };
			  break;
					
			case this.BLEND_TYPE_MULTIPLY:
			  helperFunction = function(a, b){ return a * b };
			  break;
		}
          
		this.forEachPixel
          (
            function(x, y, r, g, b)
              {
                var c = withWhat.getPixel(x,y);               
               
                r *= coefficients[0];
                g *= coefficients[0];
                b *= coefficients[0];
               
                c[0] *= coefficients[1];
                c[1] *= coefficients[1];
                c[2] *= coefficients[1];
               
                r = helperFunction(r,c[0]);
                g = helperFunction(g,c[1]);
                b = helperFunction(b,c[2]);
               
                return [r,g,b];
              }
          );
	  }
	  
    /**
     *  Convolves the image with given matrix.
     *
     *  @param matrix matrix to convolve the image with
     */
      
    this.convolve = function(matrix)
      {
        var tempImage = this.copy();
        
        var middleX = matrix.getWidth() / 2;
        var middleY = matrix.getHeight() / 2;
        
        var widthMinusOne = matrix.getWidth() - 1;
        var heightMinusOne = matrix.getHeight() - 1;
        
        var sumR, sumG, sumB, startX, startY, helperX, helperX2, c, value;
    
        for (var j = 0; j < this.getHeight(); j++)
          {
            startY = j - middleY;
              
            for (var i = 0; i < this.getHeight(); i++)
              {
                sumR = 0;
                sumG = 0;
                sumB = 0;
                
                startX = i - middleX;
                
                for (k = 0; k < matrix.getWidth(); k++)
                  {
                    helperX = startX + k;
                    helperX2 = widthMinusOne - k;               
                
                    for (l = 0; l < matrix.getHeight(); l++)
                      {
                        c = tempImage.getPixel(helperX,startY + l);
                        value = matrix.getValue(helperX2,heightMinusOne - l);
                    
                        sumR += c[0] * value;
                        sumG += c[1] * value;
                        sumB += c[2] * value;
                      }
                  }
                  
              this.setPixel(i,j,sumR,sumG,sumB);
            }
          }
      }
      
	this.dft = function()
	  {  
	  }
	  
	this.idft = function()
	  {  
	  }
	  
	this.dct = function()
	  {	  
	  }
	  
	this.idct = function()
	  {
	  }
	  
	this.drawLine = function()
	  {
	  }
	  
	this.drawCircle = function()
	  {
	  }
	  
	this.generatePerlinNoise = function()
	  {
	  }
	  
	this.threshold = function()
	  {
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
	this.setInterpolationMethod(this.INTERPOLATION_METHOD_BILINEAR);
	this.setOverflowBehavior(this.OVERFLOW_BEHAVIOR_SATURATE);
	this.fill(255,255,255);
  };