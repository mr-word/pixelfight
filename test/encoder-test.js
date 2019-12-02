const want = require('chai').expect

const Encoder = require('../src/encoder.js')

function fail (reason, fn) {
  var ok = true
  try {
    fn()
    ok = false
  } catch (e) {}
  if (!ok) {
    throw new Error(`expected function to throw for reason: ${reason}`)
  }
}

describe('encoder', () => {
  var encoder

  before(() => { encoder = new Encoder() })

  it('encodes fillDraw', () => {
    let op = {
      op: 'fill',
      xOff: 12,
      yOff: 12,
      width: 24,
      height: 24,
      color: 1,
      weight: 7
    }
    var data = encoder.encode(op)
    var decoded = encoder.decode(data)
    want(op).deep.equal(decoded);
  })

  it('encodes fillDraw useOpFalse', () => {
    var data = encoder.encode({
      useOpFalse: true,
      op: 'fill',
      xOff: 12,
      yOff: 12,
      width: 24,
      height: 24,
      color: 1,
      weight: 7
    })
    console.log(data)
    var op = encoder.decode(data)
  })


  it('decode fail bad prefix', () => {
    fail('bad prefix', () => { encoder.decode('006ab2') })
    fail('bad prefix, OP_TRUE is 81 == 0x51, not 0x01', () => { encoder.decode('016a01b2') })
  })
})
