import Hammer from 'hammerjs'
var gestures = ['tap', 'pan', 'pinch', 'press', 'rotate', 'swipe']
var directions = {
  tap: ['tap'],
  swipe: ['swipeleft', 'swiperight', 'swipeup', 'swipedown'],
  pan: ['panstart', 'panmove', 'panend', 'pancancel', 'panleft', 'panright', 'panup', 'pandown'],
  pinch: ['pinchstart', 'pinchmove', 'pinchend', 'pinchcancel', 'pinchin', 'pinchout'],
  press: ['press', 'pressup'],
  rotate: ['rotatestart', 'rotatemove', 'rotateend', 'rotatecancel']
}

function capitalize (str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

var count = 0
var instances = {}

var touches = {
  config: function (config) {
    if (config == null) return;
    if (config.gestures && (config.gestures instanceof Array)) gestures = config.gestures
    if (config.directions && (config.directions instanceof Array)) {
      for (let k in config.directions) {
        directions[k] = config.directions[k]
      }
    }
  },
  bind: function(el, binding) {
    var handler = null
    var evtType = ''

    var instance = new Hammer.Manager(el)
    count++
    el.setAttribute('touchElmId', count)
    instances[count] = instance

    var type = evtType = binding.arg.toLowerCase()
    var index = gestures.indexOf(type)
    if (index < 0) {
      console.warn('[vue2-touch] event type value is invalid')
      return
    }
    if (typeof binding.value !== 'function') {
      handler = null
      console.warn('[vue2-touch] invalid args value for v-touch, please check it')
      return
    }
    instance.add(new Hammer[capitalize(type)]())
    // bind function
    var evtsArray = directions[evtType]
    if (handler) {
      evtsArray.forEach(function(et) {
        instance.off(et, function(e) {
          handler(et, e)
        })
      })
    }
    if (typeof binding.value === 'function') {
      handler = binding.value
      evtsArray.forEach(function(et) {
        instance.on(et, function(e) {
          handler(et, e)
        })
      })
    }
  },
  unbind: function(el) {
    var id = el.getAttribute('touchElmId')
    var instance = instances[id]
    if(instance) {
      instance.destroy()
      delete instances[id]
    }
  }
}
export default touches
