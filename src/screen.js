// A screen is a wrapper around a canvas which listens to `repaint` events

const pallete = require('./palette.js')

module.exports = class Screen {
  constructor (canvas) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.width = canvas.width
    this.height = canvas.height
    this.data = this.ctx.createImageData(this.width, this.height)
  }

  listen (repaintEmitter) {
    repaintEmitter.on('data', (data) => {
      console.log(`imageDataEmitter data: ${data}`)
      ctx.putImageData(data, 0, 0)
    })
  }

  update (x, y, w, h, data) {
    // ctx.pushImageData
  }
}
