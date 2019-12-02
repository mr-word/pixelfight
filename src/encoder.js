function assert (cond, str) {
  if (!cond) throw new Error('Failed assert: ' + str)
}

module.exports = class Encoder {
  decode (bytes) {
    const op = {}
    // OP_TRUE OP_RETURN PIX
    const prefixFalse = '006a01b2'
    const prefixTrue = '516a01b2'
    let head = bytes.slice(0, prefixFalse.length)
    let rest = bytes.slice(prefixFalse.length)
    if (head !== prefixFalse && head != prefixTrue) {
      throw new Error(`Invalid prefix: ${head}, pixelfight prefix is ${prefixTrue} or ${prefixFalse}`)
    }
    head = rest.slice(0, 2)
    rest = rest.slice(2)
    assert(head === '01', `head (${head}) === 01 (pushdata length for op byte)`)
    console.log(head, rest)
    head = rest.slice(0, 2)
    rest = rest.slice(2)
    if (head == '00') {
      op.op = 'fill'
      head = rest.slice(8)
      rest = rest.slice(8)
    }
    throw new Error('unimplemented')
  }

  encode (op) {
    assert(typeof (op.weight) === 'number', 'typeof(weight) == number')
    assert(typeof (op.xOff) === 'number', 'typeof(xOff) == number')
    assert(typeof (op.yOff) === 'number', 'typeof(yOff) == number')
    assert(typeof (op.width) === 'number', 'typeof(width) == number')
    assert(typeof (op.weight) === 'number', 'typeof(height) == number')
    assert(typeof (op.color) === 'number', 'typeof(color) == number')
    // Recall that cumulative vote is signed i32, and overflows.
    // Adding a vote of weight 2^32 has no impact at all.
    // Adding a vote of weight 2^31 keeps the same vote amplitude.
    // Adding a vote of weight 2^30 has the effect of inverting the vote (rotating 1/4 amplitude).
    assert(op.weight < (2 ** 31) - 1, `op.weight (${op.weight}) < 2**32`)
    // These arguments are allowed to use the full 16 bits in the encoding
    // but are interpreted mod 1024 when evaluated by pixelfight engine/arena
    assert(op.xOff < 2 ** 16, `op.weight ${op.weight} < 2**16`)
    assert(op.yOff < 2 ** 16, `op.weight ${op.weight} < 2**16`)
    assert(op.width < 2 ** 16, `op.weight  ${op.weight} < 2**16`)
    assert(op.height < 2 ** 16, `op.weight ${op.weight} < 2**16`)
    // A color is an index into 16-color palette
    assert(op.color < 16, `op.color ${op.weight} < 16`)

    let hex = ''

    if (op.op === undefined) {
      throw new Error('op.op undefined')
    } else if (op.op === 'fill') {
      // OP_TRUE OP_RETURN 'pix' op:1 weight:4 xOff:2 yOff:2 width:2 height:2 color:1
      if (op.useOpFalse) {
        hex += '00' // OP_FALSE
      } else {
        hex += '51' // OP_TRUE
      }
      hex += '6a' // OP_RETURN

      hex += '01' //
      hex += 'b2' // magic `pix` char ASCII 178

      hex += '01'
      hex += '00' // 0 (fill operation)

      hex += '04'
      hex += op.weight.toString('16').padStart(8, '0') // 4 bytes
      hex += '02'
      hex += op.xOff.toString('16').padStart(4, '0') // 2 bytes
      hex += '02'
      hex += op.yOff.toString('16').padStart(4, '0') // 2 bytes
      hex += '02'
      hex += op.width.toString('16').padStart(4, '0') // 2 bytes
      hex += '02'
      hex += op.height.toString('16').padStart(4, '0') // 2 bytes

      // The 16-bit color is stored in the high bits.
      hex += '01'
      hex += op.color.toString('16')
      // The low bits are the 'flavor' and are ignored by the protocol. Use your imagination.
      hex += (op.flavor !== undefined ? op.flavor.toString('16') : '0')
    } else if (op.op === 'dense') {
      // OP_TRUE OP_RETURN PIX1 weight:4 xOff:2 yOff:2 width:2 height:2 [color:1]
      throw new Error('unimplemented')
    } else if (op.op === 'sparse') {
      // OP_TRUE OP_RETURN PIX2 weight:4 xOff:2 yOff:2 [(mx:1,my:1,color:1)]
      throw new Error('unimplemented')
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
