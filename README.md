# `OP_TRUE OP_RETURN OP_DRAW pixelfight!`

* there are 16 colors
* there is a 1024x1024 pixel arena (1 megapixel)
* a pigment is a vote that a pixel should be a certain color
* 1 pigment costs 1 satoshi, paid to a special `OP_TRUE OP_RETURN` ouput

See the [announcement post](https://word.site/2019/12/01/pixelfight/) for a bit of context.

## To render the arena

* The grid follows the convention that +x to the right and +y is down.
* animated image: Each color with weight `w` appears with normalized probability `1 - (w)(1-w))`
* The color with the highest probability is the one that is drawn (unless the winner is `abyss`, in which case the next color is chosen, which gives dense draws more flexibility)

In other words a grid is represented as,

`grid: (x,y) -> color -> total`

a grid of 16-item color-vote pairs, or,

`grid: color -> (x,y) -> total`

16 grids (of size 1024x1024) of color weights.

## To draw to the arena:

There are three formats for drawing. See [`Encoder`](https://github.com/mr-word/pixelfight/blob/master/src/encoder.js) module for exact encoding.

In each one "weight" is a positive integer vote multiplier, e.g. a weight of 3 costs 3 satoshis per pixel and adds 3 pigments to each pixel. Pigment weights *in the grid* are *signed* `i32`, and do overflow. This makes color values cyclical.

* Fill Draw: Give a position, dimension, and color 

`fillDraw(weight, xOffset, yOffset, width, height, color)`

* Dense Draw: Give a position and specify a block of pixels in row-major order

`denseDraw(weight, xOffset, yOffset, width, height, [color])`

* Sparse Draw: Give a list of (x,y,color)

`sparseDraw(weight, xOffset, yOffset, [(x,y,color)])`

Points specified *do overflow* -- the arena is connected like a torus. Just take mod 1024 of each coordinate.

## Color encoding

A color is specified with a byte. The high bits are the actual, so `color / 16` is the literal numeric value used in the color list lookup.

The low bits are undefined. They are up to each viewport engineer's interpretation, purely for aesthetic purposes. Some interpretations are brightness, heightmap, or blend radius.


