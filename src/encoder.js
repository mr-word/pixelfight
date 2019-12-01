function assert (cond, str) {
  if (!cond) throw new Error("Failed assert: ", str)
}
module.exports = class Encoder {
  decode (bytes) {
    let op = {};
    // OP_TRUE OP_RETURN PIX
    const prefix = '016a504958'
    let head = bytes.slice(0, prefix.length)
    let rest = bytes.slice(prefix.length)
    if (head !== prefix) throw new Error(`Invalid prefix: ${head}, pixelfight prefix is ${prefix}`)
    console.log(head, rest)
    head = rest.slice(0, 2)
    rest = rest.slice(2)
    if (head == '00') {
       op.op = 'fill'
       head = rest.slice(8)
       rest = rest.slice(8)
    }
  }

  encode (op) {
    let hex = ''
    if (op.op === undefined) {
      throw new Error('op.op undefined')
    } else if (op.op === 'fill') {
      // OP_TRUE OP_RETURN PIX 0 weight:2 xOff:2 yOff:2 width:2 height:2 color:1
      hex += '01' // OP_TRUE
      hex += '6a' // OP_RETURN
      hex += '504958' // PIX (app)
      hex += '00' // 0   (operation)
      // These arguments are represented with 16 bits,
      // but are interpreted mod 1024 in the drawing
      assert(op.weight < 2 ** 16, `op.weight ${op.weight} < 2**16`)
      assert(op.xOff < 2 ** 16, `op.weight ${op.weight} < 2**16`)
      assert(op.yOff < 2 ** 16, `op.weight ${op.weight} < 2**16`)
      assert(op.width < 2 ** 16, `op.weight  ${op.weight} < 2**16`)
      assert(op.height < 2 ** 16, `op.weight ${op.weight} < 2**16`)
      hex += op.weight.toString('16').padStart(4, '0')
      hex += op.xOff.toString('16').padStart(4, '0')
      hex += op.yOff.toString('16').padStart(4, '0')
      hex += op.width.toString('16').padStart(4, '0')
      hex += op.height.toString('16').padStart(4, '0')
      // The 16-bit color is stored in the high bits.
      hex += op.color.toString('16') + '0'
      // The low bits are the 'flavor' and are ignored by the protocol. Use your imagination.
      hex += (op.flavor !== undefined ? op.flavor.toString('16') : '0')
    } else if (op.op === 'dense') {
      // OP_TRUE OP_RETURN PIX1 weight:2 xOff:2 yOff:2 width:2 height:2 [color:1]
    } else if (op.op === 'sparse') {
      // OP_TRUE OP_RETURN PIX2 weight:2 xOff:2 yOff:2 [(mx:1,my:1,color:1)]
    } else {
      throw new Error(`unrecognized op.op: ${op.op}`)
    }
    return hex
  }

  getOpCost (op) {
    if (op.op === undefined) {
      throw new Error('op.op undefined')
    } else if (op.op === 'fill') {
      return op.weight * op.width * op.height
    } else if (op.op === 'dense') {
      return op.weight * op.width * op.height
    } else if (op.op === 'sparse') {
      return op.weight * op.points.length
    } else {
      throw new Error(`unrecognized op.op: ${op.op}`)
    }
  }
}
