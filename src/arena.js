// Contains special grid representation of pigment votes
// Has the actual draw API, which returns dirtied regions

module.exports = class Arena {
  constructor (width, height, numcolors) {
    this.grid = new Int32Array(width * height * 16)
    this.width = width
    this.height = height
  }

  addPigment (x, y, c, w) {
    const X = x % this.width
    const Y = y % this.height
    const i = c + (16 * X) + (16 * this.width * Y)
    this.grid[i] += w
  }

  getColorID (x, y) {
    const i = (16 * x) + (16 * this.width * y)
    let maxN = 0
    let maxC = 0
    for (var j = 0; j < 16; j++) {
      if (this.grid[i + j] > maxN) {
        maxN = this.grid[i + j]
        maxC = j
      }
    }
    return maxC
  }

  fillDraw (weight, xOff, yOff, width, height, color) {
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        this.addPigment(x + xOff, y + yOff, color, weight)
      }
    }
    return this.getRegion(xOff, yOff, width, height)
  }

  denseDraw (weight, xOff, yOff, width, height, colors) {
    if (colors.length !== width * height) {
      throw new Error('denseDraw: width * height != colors.length', width, height, colors.length)
    }
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        const color = colors[x + y * width]
        this.addPigment(x + xOff, y + yOff, color, weight)
      }
    }
    return this.getRegion(xOff, yOff, width, height)
  }

  sparseDraw (weight, xOff, yOff, points) {
    let minX = 255
    let minY = 255
    let maxX = 0
    let maxY = 0
    for (let i = 0; i < points.length; i++) {
      const p = points[i]
      const x = p[0] + xOff
      const y = p[1] + yOff
      const c = p[2]
      this.addPigment(x, y, c, weight)
      if (x > maxX) { maxX = x }
      if (x < minX) { minX = x }
      if (y > maxY) { maxY = y }
      if (y < minY) { minY = y }
    }
    return this.getRegion(xOff + minX, yOff + minY, maxX + 1, maxY + 1)
  }

  // TODO row major slices
  getRegion (xOff, yOff, width, height) {
    const out = new Uint8Array(width * height)
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const c = this.getColorID(x + xOff, y + yOff)
        const outPoint = width * y + x
        out[outPoint] = c
      }
    }
    return out
  }

  // debug helper, paint by numbers
  // WARNING, won't render correctly with colors >= 10
  renderToLog (xOff, yOff, width, height, data) {
    for (var y = 0; y < height; y++) {
      var line = ''
      for (var x = 0; x < width; x++) {
        const X = x + xOff
        const Y = y + yOff
        line += this.getColorID(X, Y)
      }
      console.log(line)
    }
  }
}
