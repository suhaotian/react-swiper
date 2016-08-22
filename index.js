import React, { Component, PropTypes } from 'react'


class Swiper extends Component {
  constructor(props) {
    super(props)

    this.init = this.init.bind(this)
    this.handleTouchStart = this.handleTouchStart.bind(this)
    this.handleTouchMove = this.handleTouchMove.bind(this)
    this.handleTouchEnd = this.handleTouchEnd.bind(this)
    this.calcDirection = this.calcDirection.bind(this)

    this.init()
  }

  init() {
    this.stouch = null  // initial touch cache
    this.ctouch = null  // current touch cache
    this.swipeStart = null
  }

  calcDirection(sx, sy, cx, cy) {
    const xDist = sx - cx
    const yDist = sy - cy
    const r = Math.atan2(yDist, xDist)
    const swipeAngle = (r * 180) / Math.PI

    let direction = null
    if (swipeAngle >= 45 && swipeAngle < 135) {
        direction = 'Up'
    } else if (swipeAngle >= -45 && swipeAngle < 45) {
        direction = 'Left'
    } else if (swipeAngle >= -135 && swipeAngle < -45) {
        direction = 'Down'
    } else if ((swipeAngle >= 135 && swipeAngle <= 180) || (swipeAngle >= -180 && swipeAngle < -135)) {
        direction = 'Right'
    }
    return direction
  }

  handleTouchStart(e) {
    if (e.touches.length !== 1) {
      return
    }
    this.stouch = e.touches[0]
    this.swipeStart = new Date()
  }

  handleTouchMove(e) {
    e.preventDefault()
    if (e.touches.length !== 1 || !this.stouch) {
      return
    }
    this.ctouch = e.touches[0]
  }

  handleTouchEnd(e) {
    if (!this.ctouch) {
      return
    }
    const ctouch = this.ctouch
    const stouch = this.stouch
    const xlength = Math.abs(ctouch.pageX - stouch.pageX)
    const ylength = Math.abs(ctouch.pageY - stouch.pageY)
    const swipe_length = xlength + ylength

    const {
      minSwipeLength,
      moveThreshold,
      preventDefault,
      ...other
    } = this.props

    if (swipe_length > minSwipeLength) {
      const direction = this.calcDirection(
        stouch.pageX, stouch.pageY,
        ctouch.pageX, ctouch.pageY
      )

      const method = `onSwipe${direction}`

      const evt = {
        type: `swipe ${direction}`,
        timeStampStart: this.swipeStart,
        timeStampEnd: new Date(),
        initialTouch: this.stouch,
        finalTouch: this.ctouch
      }
      other.onSwipe && other.onSwipe(evt)
      other[method] && other[method](evt)
      preventDefault && e.preventDefault()
    }
    this.init()
  }

  render() {
    const {
      Component,
      tagName,
      children,
      className,
      onClick,
    } = this.props
    const RealComponent = Component ? Component : tagName
    const other = {
      onClick,
      className,
    }
    return (
      <RealComponent
        {...other}
        onTouchStart={this.handleTouchStart}
        onTouchEnd={this.handleTouchEnd}
        onTouchCancel={this.handleTouchEnd}
        onTouchMove={this.handleTouchMove}
      >
        {children}
      </RealComponent>
    )
  }
}

Swiper.propTypes = {
  tagName: PropTypes.string,
  component: PropTypes.element,
  minSwipeLength: PropTypes.number,
  moveThreshold: PropTypes.number,
  preventDefault: PropTypes.bool,
  onSwipe: PropTypes.func,
  onSwipeLeft: PropTypes.func,
  onSwipeUpLeft: PropTypes.func,
  onSwipeUp: PropTypes.func,
  onSwipeUpRight: PropTypes.func,
  onSwipeRight: PropTypes.func,
  onSwipeDownRight: PropTypes.func,
  onSwipeDown: PropTypes.func,
  onSwipeDownLeft: PropTypes.func,
}

Swiper.defaultProps = {
  tagName: 'div',
  minSwipeLength: 75,
  moveThreshold: 10,
  preventDefault: false,
}

export default Swiper
