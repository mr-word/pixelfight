const explorer = require('bitcore-explorers')
const bitcoin = require('bsv')

const Encoder = require('./encoder.js')

const INSIGHT_URL = 'https://api.bitindex.network'

module.exports = class Transactor {
  static fromAddress (addr) {
    const t = new Transactor()
    t.address = addr
    return t
  }

  static fromPrivKey (privkey) {
    const t = new Transactor()
    t.privkey = new bitcoin.PrivateKey(privkey)
    t.address = t.privkey.toAddress()
  }

  constructor () {
    this.encoder = new Encoder()
    this.feePerByte = 1
  }

  buildOutput (op) {
    const opdata = this.encoder.encode(op)
    const opcost = this.encoder.getOpCost(op)
    const output = new bitcoin.Transaction.Output({ script: opdata, satoshis: opcost })
    return output
  }

  buildTrx (ops, cb) {
    const tx = new bitcoin.Transaction()
    for (let i = 0; i < ops.length; i++) {
      const draw = this.buildOutput(ops[i])
      tx.addOutput(draw)
    }

    const insight = new explorer.Insight(INSIGHT_URL)

    insight.getUnspentUtxos(this.address, (err, res) => {
      if (err) cb(err)
      tx.from(res)
      tx.change(this.address)
      tx.fee(tx._estimateSize() * this.feePerByte)
      cb(null, tx)
    })
  }
}
