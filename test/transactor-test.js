const Transactor = require('../src/transactor.js')

describe('transactor', () => {
  const testAddr = '1MrWordHHqEDFQUjQ59xFNSA94759VJC35'
  var transactor
  before(() => { transactor = Transactor.fromAddress(testAddr) })

  it('buildTransaction', () => {
    const trx = transactor.buildTrx([{
      op: 'fill',
      xOff: 12,
      yOff: 12,
      width: 24,
      height: 24,
      color: 1,
      weight: 7
    }, {
      op: 'fill',
      xOff: 0,
      yOff: 0,
      width: 4,
      height: 4,
      color: 2,
      weight: 5
    }], (err, trx) => {
    })
  })
})
