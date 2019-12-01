module.exports = class Encoder {
  decode (bytes) {
    throw new Error('unimplemented')
  }

  encode (op) {
    if (op.cmd === undefined) {
      throw new Error('op.cmd undefined')
    } else if (op.cmd === 'fill') {
    } else if (op.cmd === 'dense') {
    } else if (op.cmd === 'sparse') {
    } else {
      throw new Error(`unrecognized op.cmd: ${op.cmd}`)
    }
  }

  getOpCost (op) {
  }
}
