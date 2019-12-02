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
    var data = encoder.encode({
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
    fail('bad prefix', () => { encoder.decode('006d504958') })
  })
})
