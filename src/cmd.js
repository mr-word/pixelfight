const cmd = require('commander')
const read = require('read')
const bitcoin = require('bsv')
const explorer = require('bitcore-explorers')

const Encoder = require('./encoder.js')
const Transactor = require('./transactor.js')

const INSIGHT_URL = 'https://api.bitindex.network'

cmd
  .option('--op <fill|dense|sparse>')
  .option('--weight <u32>')
  .option('--xOff <u16>')
  .option('--yOff <u16>')
  .option('--width <u16>')
  .option('--height <u16>')
  .option('--color <u8>')
  .option('--colors [u8]')
  .option('--points [(u8,u8,u8)]')
  .option('--fromPrivKey <privkey>')
  .option('--fromAddress <privkey>')
  .parse(process.argv)

if (!cmd.op) {
  throw new Error('Missing `op` argument')
}

if (!cmd.fromAddress) throw new Error('Missing `fromAddress`')

if (cmd.op == 'fill') {
  if (!cmd.weight) throw new Error('Missing `weight` argument for `fill`')
  if (!cmd.xOff) throw new Error('Missing `xOff` argument for `fill`')
  if (!cmd.yOff) throw new Error('Missing `yOff` argument for `fill`')
  if (!cmd.width) throw new Error('Missing `width` argument for `fill`')
  if (!cmd.height) throw new Error('Missing `height` argument for `fill`')
  if (!cmd.color) throw new Error('Missing `color` argument for `fill`')
  const op = {
    op: 'fill',
    weight: Number(cmd.weight),
    xOff: Number(cmd.xOff),
    yOff: Number(cmd.yOff),
    width: Number(cmd.width),
    height: Number(cmd.height),
    color: Number(cmd.color)
  }
  const hex = new Encoder().encode(op)
  console.log(`Successfully encoded output script: ${hex}`)
  const transactor = Transactor.fromAddress(cmd.fromAddress)
  transactor.buildTrx([op], (err, tx) => {
    if (err) { console.log(err); process.exit(1) }
    continueToSigning(tx)
  })
} else if (cmd.op == 'dense') {
  throw new Error('unimplemented')
} else if (cmd.op == 'sparse') {
  throw new Error('unimplemented')
} else {
  throw new Error(`Unrecognized op: ${cmd.op}`)
}

function continueToSigning (tx) {
  console.log(JSON.stringify(tx, null, 2))
  read({ prompt: 'Sign and send this trx? (YES/no)' }, (err, a) => {
    if (a == 'YES') {
      read({ prompt: 'Paste private key (will not show on screen): ', silent: true }, (err, pk) => {
        const key = bitcoin.PrivateKey(pk)
        const address = key.toAddress()
        if (address != cmd.fromAddress) throw new Error('Private key does not match `fromAddress`')
        tx.sign(key)
        console.log(JSON.stringify(tx, null, 2))
        console.log(tx.serialize())
        read({ prompt: 'Broadcast this transaction? (YES/no)' }, (err, a) => {
          if (a == 'YES') {
            const insight = new explorer.Insight(INSIGHT_URL)
            insight.broadcast(tx, (err, res) => {
              console.log(err, res)
            })
          }
        })
      })
    }
  })
}
