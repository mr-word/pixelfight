const want = require('chai').expect
const Arena = require('../src/arena.js')

describe('arena', function () {
  var arena

  beforeEach(() => {
    arena = new Arena(1024, 1024)
  })

  it('grid is linear array of size width*height*16 (16 colors)', () => {
    want(arena.grid.length).to.equal(16 * (2 ** 20))
    want(arena.grid[0]).to.equal(0)
    want(arena.grid[16 * (2 ** 20) - 1]).to.equal(0)
    want(arena.getColorID(0, 0)).to.equal(0)
  })

  it('returns top color', () => {
    arena.addPigment(0, 0, 1, 1)
    want(arena.getColorID(0, 0)).to.equal(1)
    arena.addPigment(0, 0, 1, 1)
    want(arena.getColorID(0, 0)).to.equal(1)

    arena.addPigment(0, 0, 2, 3)
    want(arena.getColorID(0, 0)).to.equal(2)
  })

  it('fillDraw', () => {
    const dirt = arena.fillDraw(1, 0, 0, 4, 4, 1)
    want(dirt).deep.equal(new Uint8Array(4 * 4).fill(1))
    arena.renderToLog(0, 0, 4, 4)
  })

  it('fillDraw entire arena', () => {
    const w = arena.WIDTH
    const h = arena.HEIGHT
    arena.fillDraw(1, 0, 0, w, h, 1)
  })

  it('getColor entire arena', () => {
    const w = arena.WIDTH
    const h = arena.HEIGHT
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        arena.getColorID(1, x, y, w, h, 1)
      }
    }
  })

  it('denseDraw', () => {
    const draw = new Uint8Array([
      1, 2,
      2, 1
    ])
    const dirt = arena.denseDraw(1, 0, 0, 2, 2, draw)
    want(dirt).deep.equal(draw)
    arena.renderToLog(0, 0, 4, 4)
  })

  it('sparseDraw', () => {
    const dirt = arena.sparseDraw(1, 0, 0, [[0, 0, 1], [2, 2, 2]])
    want(dirt).deep.equal(new Uint8Array([
      1, 0, 0,
      0, 0, 0,
      0, 0, 2
    ]))
    arena.renderToLog(0, 0, 4, 4)
  })

  it('getRegion', () => {
    arena.fillDraw(1, 0, 0, 4, 4, 1)
    const img = arena.getRegion(0, 0, 12, 12)
    console.log(img)
  })
})
