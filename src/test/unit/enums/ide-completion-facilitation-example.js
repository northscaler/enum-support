import Enumeration from '../../../main'

const Color = Enumeration.new({ name: 'Color', values: ['RED', 'GREEN', 'BLUE'] })

const exp = {
  RED: Color.RED,
  GREEN: Color.GREEN,
  BLUE: Color.BLUE
}
exp.class = Color

module.exports = exp
