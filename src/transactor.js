// given structured op (json)
// encodes it
// datapay

const datapay = require('datapay')
const Encoder = require('./encoder.js')

module.exports = class Transactor {
  constructor (privkey) {
    this.privkey = privkey
    this.encoder = new Encoder()
  }

  buildFill (op) {
    const data = this.encoder.encode(op)
    const cost = this.encoder.getOpCost(op)
    datapay.build({
      data: data,
      pay: cost
    })
  }
}
