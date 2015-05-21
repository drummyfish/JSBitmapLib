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
    var counter = inputs.length; // counts how many images have already been loaded
    var result = new Array();

    var checkImages = function()
      {
        counter--;

        if (counter == 0)
          completedCallback();
      };

    for (var i = 0; i < inputs.length; i++)
      {
        var image = new Image(1, 1);

        result.push(image);

        if (!image.loadFromInput(inputs[i], checkImages))
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
 * Matrix class prototype, contains its functions and constants.
 */
  
matrixPrototype =
  {  
    /**
    *  Gets the matrix width.
    *
    *  @return matrix width
    */

    getWidth: function()
      {
        return this.data.length;
      },

    /**
    *  Gets the matrix height.
    *
    *  @return matrix height
    */

    getHeight: function()
      {
        return this.data[0].length;
      }, 

    /**
    *  Creates a deep copy of the matrix. 
    *
    *  @return new matrix with the same size and values
    *    as this matrix
    */

    copy: function()
      {
        var result = new Matrix(this.getWidth(), this.getHeight());

        var i, j;

        for (j = 0; j < this.getHeight(); j++)
          for (i = 0; i < this.getWidth(); i++)
            result.setValue(i, j, this.getValue(i, j));

        return result;
      },

    /**
    *  Gets the matrix value at given position.
    *
    *  @param x x position
    *  @param y y position
    *  @return value at given position
    */

    getValue: function(x, y)
      {
        if (x < 0 || x >= this.getWidth() || y < 0 || y >= this.getHeight())
          return 0;

        x = Math.round(x);
        y = Math.round(y);

        return this.data[x][y];
      },


    /**
    *  Sets the matrix value at given position.
    *
    *  @param x x position
    *  @param y y position
    *  @param value value
    */

    setValue: function(x, y, value)
      {
        if (x < 0 || x >= this.getWidth() || y < 0 || y >= this.getHeight())
          return;

        x = Math.round(x);
        y = Math.round(y);

        this.data[x][y] = value;
      },

    /**
    *  Sets matrix values from given values. The values will be
    *  traversed from left and they will be set to matrix which
    *  will be traversed from top left by lines.
    */

    setValues: function()
      {
        var position = 0;

        for (var j = 0; j < this.getHeight(); j++)
          for (var i = 0; i < this.getWidth(); i++)
            {
              if (position >= arguments.length)
                return;

              this.setValue(i, j, arguments[position]);

              position++;
            }
      },

    /**
    *  Multiplies the matrix with another matrix.
    *
    *  @param matrix matrix to multiply this matrix with
    *  @return result of multiplication, i.e. a matrix or null
    *     if the matrices cannot be multiplied
    */

    multiply: function(matrix)
      {
        if (this.getWidth() != matrix.getHeight())
          return null; // can't multiply

        var result = new Matrix(this.getWidth(), this.getHeight());

        for (var j = 0; j < result.getHeight(); j++)
          for (var i = 0; i < result.getWidth(); i++)
            {
              var value = 0;

              for (var k = 0; k < this.getWidth(); k++)
                value += this.getValue(k, j) * matrix.getValue(i, k);

              result.setValue(i, j, value);
            }

        return result;
      },

    /**
    *  Makes a transposed matrix.
    *
    *  @return transposed matrix
    */

    transposed: function()
      {
        var result = new Matrix(this.getHeight(), this.getWidth());

        for (var j = 0; j < result.getHeight(); j++)
          for (var i = 0; i < result.getWidth(); i++)
            result.setValue(i, j, this.getValue(j, i));

        return result;
      },

    /**
    *  Decomposes the separable filter represented by this matrix
    *  to two vectors - horizontal and vertical.
    *
    *  @return array containing horizontal and vertical vectors as
    *    row matrices or null if the filter cannot be decomposed
    *    because it isn't separable
    */

    decomposeSeparable: function()
      {
        // TODO
      },

    /**
    *  Returns a string representing the matrix.
    *
    *  @return string representing the matrix
    */

    toString: function()
      {
        var result = "";

        for (var j = 0; j < this.getHeight(); j++)
          {
            for (var i = 0; i < this.getWidth(); i++)
              {
                result += this.getValue(i, j).toString() + " ";
              }

            result += "\n";
          }

        return result;
      },

    /**
    *  Creates a grayscale image from the matrix values. The
    *  values are floored to integers and saturated to <0,255>.
    *
    *  @return newly created image
    */

    toImage: function()
      {
        var result = new Image(this.getWidth(), this.getHeight());
        var selfReference = this;

        result.forEachPixel
          (
            function(x, y, r, g, b)
              {
                var value = saturate(Math.floor(selfReference.getValue(x, y)), 0, 255);
                return [value, value, value];
              }
          );

        return result;
      }
  }; 
  
/**
 *  Creates a new matrix. Matrices can be used for image transformations.
 *  @class
 *
 *  @param width matrix width
 *  @param height matrix height
 */

function Matrix(width, height)
  {
    // init the matrix:

    this.data = new Array(width);

    for (var i = 0; i < width; i++)
      {
        this.data[i] = new Array(height);

        for (var j = 0; j < height; j++)
          this.data[i][j] = 0;
      }
  }

Matrix.prototype = matrixPrototype;
  
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

    extremes = new Array(3); // rgb
    tempCopy = sourceImage.copy();

    sourceImage.forEachPixel(
      function(x, y, r, g, b)
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
                value = matrix.getValue(i, j);

                if (value < 0)
                  continue;

                c = tempCopy.getPixel(fromX + i, fromY + j);

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
  };
  
/**
 * Prototype for the Image class, it holds its function and constants.
 */
  
imagePrototype =
  {
    // constants:

    /** Treat pixels outside the image area as black. */
    BORDER_BEHAVIOR_BLACK: 0,
    /** Treat pixels outside the image area as white. */
    BORDER_BEHAVIOR_WHITE: 1,
    /** Treat pixels outside the image with modular arithmetic, i.e. as if there was the same image. */
    BORDER_BEHAVIOR_WRAP: 2,
    /** Treat pixels outside the image as if there was the same image mirrored. */
    BORDER_BEHAVIOR_MIRROR: 3,
    /** If a pixel outside the image area is accessed, the closest one is used. */
    BORDER_BEHAVIOR_CLOSEST: 4,

    /** If a pixel is set to a value wxceeding minimum/maximum value, saturation is used (e.g. 257 :> 255). */
    OVERFLOW_BEHAVIOR_SATURATE: 10,
    /** If a pixel is set to a value wxceeding minimum/maximum value, wrapping is used (modulo, e.g. 257 :> 1). */
    OVERFLOW_BEHAVIOR_WRAP: 11,

    /** interpolation by nearest neighbour */
    INTERPOLATION_METHOD_CLOSEST: 20,
    /** bilinear interpolation */
    INTERPOLATION_METHOD_BILINEAR: 21,
    /** bicubic interpolation */
    INTERPOLATION_METHOD_BICUBIC: 22,
    /** sine interpolation */
    INTERPOLATION_METHOD_SINE: 23,

    /** derivative by x axis */
    DERIVATIVE_TYPE_X: 30,
    /** derivative by y axis */
    DERIVATIVE_TYPE_Y: 31,
    /** derivative by x and y axis */
    DERIVATIVE_TYPE_XY: 32,

    /** blend by adding */
    BLEND_TYPE_ADD: 40,
    /** blend by substracting */
    BLEND_TYPE_SUBSTRACT: 41,
    /** blend by multiplying */
    BLEND_TYPE_MULTIPLY: 42,

    /**
    *  Sets the image size to given value. Old content is
    *  either cropped or extended according to current border
    *  behavior.
    *
    *  @param width new image width in pixels
    *  @param height new image height in pixels
    */

    setSize: function(width, height)
      {
        var newArray = new Array(width);

        for (var i = 0; i < width; i++)
          {
            newArray[i] = new Array(height);

            for (var j = 0; j < height; j++)
              newArray[i][j] = new Array(3); // rgb
          }

        // copy the data to the new array:

        for (var j = 0; j < height; j++)
          for (var i = 0; i < width; i++)
            {
              var color = this.getPixel(i, j);

              newArray[i][j][0] = color[0];
              newArray[i][j][1] = color[1];
              newArray[i][j][2] = color[2];
            }

        this.imageData = newArray;
      },

    /** 
    *  Resizes the image with resampling.
    *
    *  @param width new width in pixels
    *  @param height new height in pixels
    */

    resize: function(width, height)
      {
        var oldImage = this.copy();

        this.setSize(width, height);

        this.forEachPixel(
          function(x, y, r, g, b)
            {
              x = (x / (width - 1)) * (oldImage.getWidth() - 1);
              y = (y / (height - 1)) * (oldImage.getHeight() - 1);
              return oldImage.getPixel(x, y);
            }
        );
      },

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
    *    false otherwise
    */

    loadFromInput: function(input, completedCallback)
      {
        var file = input.files[0];
        var reader = new FileReader();
        var selfReference = this;

        if (file) // if file is selected
          {
            var imageElement = document.createElement("img");

            reader.onload = (
              function(image)
                {
                  return function(event)
                    {
                      image.src = event.target.result;

                      var width = image.width;
                      var height = image.height;

                      selfReference.setSize(width, height);

                      var canvas = document.createElement("canvas");
                      canvas.width = width + 1;
                      canvas.height = height + 1;
                      var context = canvas.getContext("2d");
                      context.drawImage(image, 0, 0);

                      var imageData = context.getImageData(0, 0, width, height);

                      var column = 0;
                      var row = 0;

                      for (var i = 0; i < imageData.data.length; i += 4) // rgba
                        {
                          selfReference.setPixel(column, row, imageData.data[i], imageData.data[i + 1], imageData.data[i + 2]);

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
      },

    /**
    *  Applies the current overflow behavior to given value.
    *  @private
    *
    *  @param value value to apply the bahavior to
    *  @return the value after the behavior has been applied
    */

    applyOverflowBehavior: function(value)
      {
        switch (this.overflowBehavior)
          {
            case this.OVERFLOW_BEHAVIOR_SATURATE:
              if (value < 0)
                value = 0;
              else if (value > 255)
                value = 255;
              break;

            case this.OVERFLOW_BEHAVIOR_WRAP:
              value = wrap(value, 255);
              break;

            default:
              break;
          }

        return value;
      },

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

    applyBorderBehavior: function(value, maximum)
      {
        switch (this.borderBehavior)
          {
            default:
            case this.BORDER_BEHAVIOR_BLACK:
            case this.BORDER_BEHAVIOR_WHITE:
              if (value < 0)
                value = -1;
              else if(value > maximum)
                value = -1;
              break;

            case this.BORDER_BEHAVIOR_CLOSEST:
              if (value < 0)
                value = 0;
              else if(value > maximum)
                value = maximum;
              break;

            case this.BORDER_BEHAVIOR_WRAP:
              value = wrap(value, maximum);
              break;

            case this.BORDER_BEHAVIOR_MIRROR:
              even_part = value >= 0 ?
              Math.floor(value / (maximum + 1)) % 2 == 0 : Math.floor(-1 * (value + 1) / (maximum + 1)) % 2 != 0;

              value = wrap(value, maximum);

              if (!even_part)
                value = maximum - value;
              break;
          }
        return value;
      },

    /**
    *  Sets the border behavior for the image, i.e. the rules
    *  that say which pixel is used when a pixel outside the
    *  image are is accessed.
    *
    *  @param behavior new behavior to be set, see the class
    *         constants starting with BORDER_BEHAVIOR_         
    */

    setBorderBehavior: function(behavior)
      {
        this.borderBehavior = behavior;
      },

    /**
    *  Gets the current border behavior.
    *
    *  @return current border behavior
    */

    getBorderBehavior: function()
      {
        return this.borderBehavior;
      },

    /**
    *  Sets the interpolation method, i.e. how the values will
    *  be sampled between the pixels.
    *
    *  @param method new interpolation method to be set, see the
    *    class constants starting with INTERPOLATION_METHOD_
    */

    setInterpolationMethod: function(method)
      {
        this.interpolationMethod = method;
      },

    /**
    *  Gets the current interpolation method of the image.
    *
    *  @return current interpolation method, see the class constants
    *    starting with INTERPOLATION_METHOD_
    */

    getInterpolationMethod: function(method)
      {
        return this.interpolationMethod;
      },

    /**
    *  Sets the overflow behavior for the image, i.e. the rules
    *  that say how a pixel value should be converted to the
    *  minimum/maximum        range if it exceeds it.
    *
    *  @param behavior new behavior to be set, see the class
    *         constants starting with OVERFLOW_BEHAVIOR_
    */

    setOverflowBehavior: function(behavior)
      {
        this.overflowBehavior = behavior;
      },

    /**
    *  Gets the current border behavior.
    *
    *  @return current border behavior
    */

    getOverflowBehavior: function()
      {
        return this.overflowBehavior;
      },

    /**
    *  Gets the image width.
    *
    *  @return image width in pixels
    */

    getWidth: function()
      {
        return this.imageData.length;
      },

    /**
    *  Gets the image height.
    *
    *  @return image height in pixels
    */

    getHeight: function()
      {
        return this.imageData[0].length;
      },

    /**
    *  Gets a pixel RGB value. The coordinates may be float in
    *  which case a sampled value is returned (according to current
    *  interpolation method set).
    *
    *  @param x x position
    *  @param y y position
    *  @return array of color RGB components
    */

    getPixel: function(x, y)
      {
        if (x % 1 != 0 || y % 1 != 0) // non-integer coordinates => sample
          {
            return this.samplePixel(x, y);
          }

        x = this.applyBorderBehavior(x, this.getWidth() - 1);
        y = this.applyBorderBehavior(y, this.getHeight() - 1);

        if (x < 0 || y < 0) // unusable values
          {
            if (this.borderBehavior == this.BORDER_BEHAVIOR_WHITE)
              return [255, 255, 255];
            else
              return [0, 0, 0];
          }

        return this.imageData[x][y].slice();
      },

    /**
    *  Samples the image at given floating point position, i.e.
    *  even between its pixels according to the current interpolation
    *  method.
    *
    *  @private
    *  @param x x position
    *  @param y y position
    */

    samplePixel: function(x, y)
      {
        switch (this.getInterpolationMethod())
          {
            default:
            case this.INTERPOLATION_METHOD_CLOSEST:
              return this.getPixel(Math.round(x), Math.round(y));
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
              var c1 = this.getPixel(x0, y0);
              var c2 = this.getPixel(x1, y0);
              var c3 = this.getPixel(x0, y1);
              var c4 = this.getPixel(x1, y1);

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
              var result = [0, 0, 0];

              var x0 = Math.floor(x);
              var x1 = Math.ceil(x);
              var xRatio = x - x0;
              var y0 = Math.floor(y);
              var y1 = Math.ceil(y);
              var yRatio = y - y0;

              var c1 = this.getPixel(x0, y0);
              var c2 = this.getPixel(x1, y0);
              var c3 = this.getPixel(x0, y1);
              var c4 = this.getPixel(x1, y1);

              var dx1 = this.getDerivative(x0, y0, this.DERIVATIVE_TYPE_X);
              var dx2 = this.getDerivative(x1, y0, this.DERIVATIVE_TYPE_X);
              var dx3 = this.getDerivative(x0, y1, this.DERIVATIVE_TYPE_X);
              var dx4 = this.getDerivative(x1, y1, this.DERIVATIVE_TYPE_X);

              var dy1 = this.getDerivative(x0, y0, this.DERIVATIVE_TYPE_Y);
              var dy2 = this.getDerivative(x1, y0, this.DERIVATIVE_TYPE_Y);
              var dy3 = this.getDerivative(x0, y1, this.DERIVATIVE_TYPE_Y);
              var dy4 = this.getDerivative(x1, y1, this.DERIVATIVE_TYPE_Y);

              var dxy1 = this.getDerivative(x0, y0, this.DERIVATIVE_TYPE_XY);
              var dxy2 = this.getDerivative(x1, y0, this.DERIVATIVE_TYPE_XY);
              var dxy3 = this.getDerivative(x0, y1, this.DERIVATIVE_TYPE_XY);
              var dxy4 = this.getDerivative(x1, y1, this.DERIVATIVE_TYPE_XY);

              var matrix = new Matrix(4, 4);
              var matrix1 = new Matrix(4, 4);
              var matrix2 = new Matrix(4, 4);

              matrix1.setValues(
                1, 0, 0, 0,
                0, 0, 1, 0, -3, 3, -2, 1,
                2, -2, 1, 1
              );

              matrix2.setValues(
                1, 0, -3, 2,
                0, 0, 3, -2,
                0, 1, -2, 1,
                0, 0, 1, 1
              );
        
              for (var component = 0; component < 3; component++)
                {
                  matrix.setValues(
                    c1[component], c3[component], dy1[component], dy3[component],
                    c2[component], c4[component], dy2[component], dy4[component],
                    dx1[component], dx3[component], dxy1[component], dxy3[component],
                    dx2[component], dx4[component], dxy2[component], dxy4[component]
                    );

                  var coefficients = matrix1.multiply(matrix);
                  coefficients = coefficients.multiply(matrix2);


                  for (var j = 0; j < 3; j++)
                    for (var i = 0; i < 3; i++)
                      {
                        result[component] += coefficients.getValue(j, i) * Math.pow(xRatio, i) * Math.pow(yRatio, j);
                      }

                  result[component] = Math.round(result[component]);
                }

            return result;
            break;
          }
        return [0, 0, 0];
      },

    /**
    *  Sets a pixel at given position to given RGB value.
    *
    *  @param x x position
    *  @param y y position
    *  @param red new red value (0 - 255)
    *  @param green new green value (0 - 255)
    *  @param blue new blue value (0 - 255)
    */

    setPixel: function(x, y, red, green, blue)
      {
        x = this.applyBorderBehavior(x, this.getWidth() - 1);
        y = this.applyBorderBehavior(y, this.getHeight() - 1);

        if (x < 0 || y < 0) // unusable values
          return;

        red = Math.floor(red);
        green = Math.floor(green);
        blue = Math.floor(blue);

        this.imageData[x][y][0] = this.applyOverflowBehavior(red);
        this.imageData[x][y][1] = this.applyOverflowBehavior(green);
        this.imageData[x][y][2] = this.applyOverflowBehavior(blue);
      },

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

    getDerivative: function(x, y, type)
      {
        var result = [0, 0, 0]
        var c1;
        var c2;
        var c3;
        var c4;

        switch (type)
          {
            default:
            case this.DERIVATIVE_TYPE_X:
              c1 = this.getPixel(x + 1, y);
              c2 = this.getPixel(x - 1, y);
              break;

            case this.DERIVATIVE_TYPE_Y:
              c1 = this.getPixel(x, y + 1);
              c2 = this.getPixel(x, y - 1);
              break;

            case this.DERIVATIVE_TYPE_XY:
              c1 = this.getPixel(x + 1, y + 1);
              c2 = this.getPixel(x - 1, y + 1);
              c3 = this.getPixel(x + 1, y - 1);
              c4 = this.getPixel(x - 1, y - 1);
              break;
          }

        for (component = 0; component < 3; component++)
          {
            if (type == this.DERIVATIVE_TYPE_XY)
              {
                var value1 = (c1[component] - c2[component]) / 2.0;
                var value2 = (c3[component] - c4[component]) / 2.0;

                result[component] = (value1 - value2) / 2.0;
              }
            else
              result[component] = (c1[component] - c2[component]) / 2.0;
          }

        return result;
      },
      
    /**
    *  Applies threshold to the image.
    *
    *  @param levels number of levels, defaults to 2
    *  @param optional shift value to add to each pixel before thresholding
    */

    threshold: function(levels, shift)
      {
        levels = typeof levels !== 'undefined' ? levels : 2;
        shift = typeof shift !== 'undefined' ? shift : 0;

        var helper = levels - 1;

        this.forEachPixel
          (
            function(x, y, r, g, b)
              {
                r += shift;
                g += shift;
                b += shift;

                r = Math.floor(r / 255 * (levels)) / helper * 255;
                g = Math.floor(g / 255 * (levels)) / helper * 255;
                b = Math.floor(b / 255 * (levels)) / helper * 255;
                return [r, g, b];
              }
          );
      },

    /**
    *  Performs given operation represented by a function
    *  on every image pixel.
    *
    *  @param functionToApply function to be applied, the function must
    *    return either three-component of RGB components or null or,
    *    undefined parameters passed to it will be: x, y, red, green,
    *    blue, imageReference
    */

    forEachPixel: function(functionToApply)
      {
        for (var j = 0; j < this.getHeight(); j++)
          for (var i = 0; i < this.getWidth(); i++)
            {
              var color = this.getPixel(i, j);
              color = functionToApply(i, j, color[0], color[1], color[2], this);

              if (color != null && color != undefined)
                this.setPixel(i, j, color[0], color[1], color[2]);
            }
      },

    /**
    *  Inverts the image colors.
    */

    invert: function()
      {
        this.forEachPixel
          (
            function(x, y, r, g, b)
              {
                return [255 - r, 255 - g, 255 - b]
              }
          );
      },

    /**
    *  Fills the whole image with given color.
    *
    *  @param red amount of red (0 - 255)
    *  @param green amount of green (0 - 255)
    *  @param blue amount of blue (0 - 255)
    */

    fill: function(red, green, blue)
      {
        this.forEachPixel(
          function(x, y, r, g, b)
            {
              return [red, green, blue];
            }
        );
      },

    /**
    *  Translates the image by given offset.
    *
    *  @param horizontal horizontal offset in pixels (can be negative)
    *  @param vertical vertical offset in pixels (can be negative)
    */

    translate: function(horizontal, vertical)
      {
        // TODO
      },

    /**
    *  Draws the image to given canvas element.
    *
    *  @param canvas canvas element to draw the image to
    *  @param resize bool value, says whether the canvas should be
    *    resized to the image size (default is true)
    */

    drawToCanvas: function(canvas, resize)
      {
        resize = typeof resize !== 'undefined' ? resize : true;

        if (resize)
          {
            canvas.width = this.getWidth();
            canvas.height = this.getHeight();
          }

        var context = canvas.getContext("2d");
        var id = context.createImageData(this.getWidth(), this.getHeight());
        var data = id.data;

        var position = 0;

        for (var j = 0; j < this.getHeight(); j++)
          for (var i = 0; i < this.getWidth(); i++)
            {
              var color = this.getPixel(i, j);
              data[position] = color[0];
              data[position + 1] = color[1];
              data[position + 2] = color[2];
              data[position + 3] = 255; // alpha

              position += 4;
            }

        context.putImageData(id, 0, 0);
      },
      
    /**
    *  Creates a deep copy of the image.
    *
    *  @return new image that contains the same data and attributes as
    *    this image
    */

    copy: function()
      {
        var newImage = new Image(this.getWidth(), this.getHeight());
        var reference = this;

        newImage.setInterpolationMethod(this.getInterpolationMethod());
        newImage.setBorderBehavior(this.getBorderBehavior());
        newImage.setOverflowBehavior(this.getOverflowBehavior());

        copyFunction = function(x, y, r, g, b)
          {
            return reference.getPixel(x, y);
          };

        newImage.forEachPixel(copyFunction);

        return newImage;
      },

    /**
    *  Generates white noise into the image.
    */

    generateWhiteNoise: function()
      {
        this.forEachPixel
          (
            function(x, y, r, g, b)
              {
                return [Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256)];
              }
          );
      },

    /**
    * Converts the image to grayscale.
    */

    toGrayscale: function()
      {
        this.forEachPixel
          (
            function(x, y, r, g, b)
              {
                var value = Math.round(0.2126 * r) + Math.round(0.7152 * g) + Math.round(0.0722 * b);
                return [value, value, value];
              }
          );
      },

    /**
    *  Performs morphology dilation with the image.
    *
    *  @param matrix matrix representing the structuring element,
    *    negative values are ignored
    *  @param centerX x center of the structuring element
    *  @param centerY y center of the structuring element
    */

    dilate: function(matrix, centerX, centerY)
      {
        morphology(true, this, matrix, centerX, centerY);
      },

    /**
    *  Performs morphology erosion with the image.
    *
    *  @param matrix matrix representing the structuring element,
    *    negative values are ignored
    *  @param centerX x center of the structuring element
    *  @param centerY y center of the structuring element
    */

    erode: function(matrix, centerX, centerY)
      {
        morphology(false, this, matrix, centerX, centerY);
      },

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

    blend: function(withWhat, percentage, type, mask)
      {
        type = typeof type !== 'undefined' ? type : this.BLEND_TYPE_ADD;

        percentage = saturate(percentage, 0, 1);

        var makeCoefficients = function(value)
          {
            var c1 = value <= 0.5 ? 1 : 1 - (value - 0.5) * 2.0;
            var c2 = value > 0.5 ? 1 : value * 2.0;
            return [c1, c2];
          }

        var coefficients = makeCoefficients(percentage);

        var helperFunction;

        switch (type)
          {
            default:
            case this.BLEND_TYPE_ADD:
              helperFunction = function(a, b) { return a + b };
              break;

            case this.BLEND_TYPE_SUBSTRACT:
              helperFunction = function(a, b) { return a - b };
              break;

            case this.BLEND_TYPE_MULTIPLY: helperFunction = function(a, b) { return a * b };
              break;
          }

        this.forEachPixel
          (
            function(x, y, r, g, b)
              {
                var c = withWhat.getPixel(x, y);

                r *= coefficients[0];
                g *= coefficients[0];
                b *= coefficients[0];

                c[0] *= coefficients[1];
                c[1] *= coefficients[1];
                c[2] *= coefficients[1];

                r = helperFunction(r, c[0]);
                g = helperFunction(g, c[1]);
                b = helperFunction(b, c[2]);

                return [r, g, b];
              }
          );
      },

    /**
    *  Convolves the image with given matrix.
    *
    *  @param matrix matrix to convolve the image with
    */

    convolve: function(matrix)
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
                        c = tempImage.getPixel(helperX, startY + l);
                        value = matrix.getValue(helperX2, heightMinusOne - l);

                        sumR += c[0] * value;
                        sumG += c[1] * value;
                        sumB += c[2] * value;
                      }
                  }

                this.setPixel(i, j, sumR, sumG, sumB);
              }
          }
      },

    /**
    *  Splits the image channels into three separate grayscale
    *  images.
    *
    *  @return three-item array with images representing the three channels
    */

    splitChannels: function()
      {
        var w = this.getWidth();
        var h = this.getHeight();

        result = [new Image(w, h), new Image(w, h), new Image(w, h)];

        this.forEachPixel
          (
            function(x, y, r, g, b)
              {
                result[0].setPixel(x, y, r, r, r);
                result[1].setPixel(x, y, g, g, g);
                result[2].setPixel(x, y, b, b, b);
              }
          );

        return result;
      },

    /**
    *  Merges three images, each representing one RGB channel, into a new
    *  RGB image. Only red channel of each image is taken. The result is
    *  overwrites the current image content.
    *
    *  @param imageR image representing the red channel
    *  @param imageG image representing the green channel
    *  @param imageB image representing the blue channel
    */

    mergeChannels: function(imageR, imageG, imageB)
      {
        this.setSize(imageR.getWidth(), imageR.getHeight());

        var i, j, c1, c2, c3;

        for (j = 0; j < this.getHeight(); j++)
          for (i = 0; i < this.getHeight(); i++)
            {
              c1 = imageR.getPixel(i, j);
              c2 = imageG.getPixel(i, j);
              c3 = imageB.getPixel(i, j);

              this.setPixel(i, j, c1[0], c2[0], c3[0]);
            }
      },

    /**
    *  Same as mergeChannels except that the arguments are matrices
    *  instead of images.
    *
    *  @param matrixR matrix representing the red channel
    *  @param matrixG matrix representing the green channel
    *  @param matrixB matrix representing the blue channel
    */

    mergeChannelsFromMatrices: function(matrixR, matrixG, matrixB)
      {
        var imageR = matrixR.toImage();
        var imageG = matrixG.toImage();
        var imageB = matrixB.toImage();

        this.mergeChannels(imageR, imageG, imageB);
      },

    /**
    *  Creates matrices of each image channel values and
    *  returns them.
    *
    *  @return three-item array holding the R, G and B
    *    channel values matrices
    */

    toMatrices: function()
      {
        var result = [
          new Matrix(this.getWidth(), this.getHeight()),
          new Matrix(this.getWidth(), this.getHeight()),
          new Matrix(this.getWidth(), this.getHeight())
        ];

        this.forEachPixel
          (
            function(x, y, r, g, b)
              {
                result[0].setValue(x, y, r);
                result[1].setValue(x, y, g);
                result[2].setValue(x, y, b);
              }
          );

        return result;
      },

    toString: function()
      {
        var result = "";
        var rStr, gStr, bStr, str, c;

        for (var j = 0; j < this.getHeight(); j++)
          {
            for (var i = 0; i < this.getWidth(); i++)
              {
                c = this.getPixel(i, j);

                rStr = c[0].toString();
                gStr = c[1].toString();
                bStr = c[2].toString();

                str = "[" + rStr + "," + gStr + "," + bStr + "]";

                result += str;

                for (k = 0; k < 14 - str.length; k++)
                  result += " ";
              }

            result += "\n";
          }

        return result;
      },

    /**
    *  Performes either 2D DCT or IDCT.
    *  @private
    *
    *  @param dct if true, DCT is performed, otherwise IDCT
    *  @param matrixR red channel matrix for IDCT
    *  @param matrixG green channel matrix for IDCT
    *  @param matrixB blue channel matrix for IDCT
    *  @return if dct is true, three-index matrix representing the
    *    DCT transformation of each RGB channel of the image
    */

    dctOrIdct: function(dct, matrixR, matrixG, matrixB)
      {
        if (!dct)
          this.setSize(matrixR.getWidth(), matrixR.getHeight());

        var sum = [0, 0, 0];
        var v;
        var coeff, coeff1, coeff2;
        var helper;
        var x, y, i, j;
        var byLines;
        var limit;
        var coord;

        var matricesSource;

        if (dct)
          matricesSource = this.toMatrices();
        else
          matricesSource = [matrixR, matrixG, matrixB];

        var matricesDest = this.toMatrices();

        /* make the transformation separable, first by rows, then
          by columns, this only has a complexity of O(n^3) */

        byLines = true;
        v = [0, 0, 0];

        for (j = 0; j < 2; j++) // by rows, then by columns
          {
            limit = byLines ? this.getWidth() : this.getHeight();
            coeff1 = Math.sqrt(1.0 / limit);
            coeff2 = Math.sqrt(2.0 / limit);

            for (y = 0; y < this.getHeight(); y++)
              {
                for (x = 0; x < this.getWidth(); x++)
                  {
                    sum = [0, 0, 0];

                    coord = (byLines ? x : y);

                    for (i = 0; i < limit; i++) // sum the whole line or column
                      {
                        if (byLines)
                          v = [matricesSource[0].getValue(i, y), matricesSource[1].getValue(i, y), matricesSource[2].getValue(i, y)];
                        else
                          v = [matricesSource[0].getValue(x, i), matricesSource[1].getValue(x, i), matricesSource[2].getValue(x, i)];

                        if (dct)
                          {
                            helper = Math.cos(Math.PI * (2 * i + 1) * coord / (2 * limit));
                            sum[0] += v[0] * helper;
                            sum[1] += v[1] * helper;
                            sum[2] += v[2] * helper;
                          }
                        else
                          {
                            coeff = i == 0 ? coeff1 : coeff2;
                            helper = Math.cos(Math.PI * (2 * coord + 1) * i / (2 * limit));
                            sum[0] += coeff * v[0] * helper;
                            sum[1] += coeff * v[1] * helper;
                            sum[2] += coeff * v[2] * helper;
                          }
                      }

                      if (dct)
                        {
                          coeff = coord == 0 ? coeff1 : coeff2;
                          sum[0] *= coeff;
                          sum[1] *= coeff;
                          sum[2] *= coeff;
                        }

                      matricesDest[0].setValue(x, y, sum[0]);
                      matricesDest[1].setValue(x, y, sum[1]);
                      matricesDest[2].setValue(x, y, sum[2]);
                    }
              }

            matricesSource[0] = matricesDest[0].copy();
            matricesSource[1] = matricesDest[1].copy();
            matricesSource[2] = matricesDest[2].copy();
            byLines = false;
          }

        if (dct)
          return matricesDest;
        else
          this.mergeChannelsFromMatrices(matricesDest[0], matricesDest[1], matricesDest[2]);
      },

    /**
    *  Performs 2D discrete cosine transform on the image.
    *
    *  @return three-index matrix representing the DCT transformation
    *    of each RGB channel of the image
    */

    dct: function()
      {
        return this.dctOrIdct(true);
      },

    /**
    *  Performs 2D inverse discrete cosine transform on given matrices and
    *  stores the result in this image.
    *
    *  @param matrixR matrix containing red channel DCT coefficients
    *  @param matrixG matrix containing green channel DCT coefficients
    *  @param matrixB matrix containing blue channel DCT coefficients
    *  @return new reconstructed image
    *
    */

    idct: function(matrixR, matrixG, matrixB)
      {
        this.dctOrIdct(false, matrixR, matrixG, matrixB);
      },
      
    drawLine: function()
      {
      }
  };
  
/**
 *  Creates a new Image.
 *  @class
 *
 *  @param width image width in pixels
 *  @param height image height in pixels
 */

function Image(width, height)
  {
    // init the image:
    
    this.imageData = new Array(width);

    for (var i = 0; i < width; i++)
      {
        this.imageData[i] = new Array(height);

        for (var j = 0; j < height; j++)
          this.imageData[i][j] = [0,0,0]; // rgb
      }

    this.borderBehavior = imagePrototype.BORDER_BEHAVIOR_WHITE;
    this.interpolationMethod = imagePrototype.INTERPOLATION_METHOD_BILINEAR;
    this.overflowBehavior = imagePrototype.OVERFLOW_BEHAVIOR_SATURATE; 
  };
  
Image.prototype = imagePrototype;