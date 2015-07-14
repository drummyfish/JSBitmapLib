# izak-lib

a simple JavaScript library for bitmap image manipulation

This is a KISS, lightweight JavaScript library for basic and advanced bitmap image
manipulation/processing. You can use it to load images from file and work with them
using simple object-oriented API providing access to individual pixels and common
image processing functionality such as filtering, DCT etc. The library is contained
within one file (izaklib.js), but there is also an HTML file containing simple tool
based on the library, but you can ignore the other files and only use the library if
you want. The file contains documentation in form of documentation-system comments.
The goal is to keep everything as simple and clean as possible to be able to use the library
and/or the tool to quickly perform image processing, speed is not primary goal
but everything is reasonably fast.

FAQ
---

**Q: What can it do?**

A: Basic and more advanced bitmap image processing/manipulation. See feature list below.
   Also note that this is work-in progress and only some features are implemented at the
   moment.

**Q: How do I use it?**

A: Just download and include the izaklib.js file. You will want to look at Image class
  first. See the documentation comments or generate yourself a documentation.

**Q: What does the name mean?**

A: Izák is a name of my cat. If you want something meaningful, it means Image Zero Agitation Kit.

features
--------
* image class allowing per-pixel manipulation - done
* matrix class for mathematical operations with images - done
* image loading/saving from/to files (HTML5 File API) - done
* drawing image to HTML canvas - done
* multiple image wrapping behaviors - done
* multiple image value clamping behaviors - done
* multiple between-pixel interpolation methods - partly done
* DCT/IDCT (discrete cosine transform) - done
* DFT/IDFT (discrete fourier transform) - NOT done
* DWT/IDWT (discrete wavelet transform) - NOT done
* (multilevel) thresholding - done
* binary/grayscale erosion/dilation (morphology) - done
* noise generation (white, Perlin, simplex, ...) - partly done
* rich image blending - done
* convolution using matrix core - done
* channel splitting/merging - done
* to grayscale - done
* shape drawing (with or without antialiasing) - NOT done
* resizing (with interpolation) - done
* stereogram generation/reversing - NOT done
* geometric transformations (using matrices) - NOT done
* warping - NOT done
