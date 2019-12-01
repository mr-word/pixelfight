class Engine {
  constructor (operationDataInEmitter, hexUpdateOutEmitter) {
    this.arena = new Arena()
  }

  start () {
    this.operations.on('data', (bytes) => {
      const cmd = encoder.decode(bytes)
      const updateBox = arena.fillDraw()
      const imageData = format(resultPixels)

      if (op.cmd == 'fill') {

      } else {
        throw new Error('unrecognized decoded op')
      }
    })
  }
}
