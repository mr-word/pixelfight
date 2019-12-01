const want = require('chai').expect

const { createCanvas } = require('canvas')
const Screen = require('../src/screen.js')

describe('screen', () => {
  var screen
  var out

  beforeEach(() => {
    const canvas = createCanvas(1024, 1024)
    screen = new Screen(canvas)
  })

  it('screen data is ImageBuffer', () => {
    want(screen.height > 0)
    want(screen.width > 0)
    want(screen.data.length > 0)
  })
})
