import React, {Component} from 'react'
import iptCss from './input.scss'
import {CSSTransition} from 'react-transition-group'

const EMOJI_LIST = [
  '😄', '😆','😊','😃','😏','😍','😘','😚','😳','😌','😆','😁',
  '😉','😜','😝','😀','😗','😙','😛','😴','😟','😦','😧','😮','😬','😕','😯',
  '😑','😒','😅','😓','😥','😩','😔','😞','😖','😨','😰','😣','😢','😭','😂',
  '👍','👍','👎','👎','👌','👊','👊','✊','✌️'
]

const getLineSize = ele => {
  const { fontSize, paddingLeft, paddingRight } = getComputedStyle(ele)
  const width = ele.offsetWidth - parseInt(paddingLeft) - parseInt(paddingRight)
  return (2 * width / parseInt(fontSize))
}

const getRealLine = (str, size, indent) => {
  let len = indent + 1
  let index = 0
  str = str.replace(/[^\x00-\xff]/g, "01")
  for (let i = 0; i < str.length; i++, index++) {
    if (index > size) {
      index = 0
      len ++
    }
    if (str.charCodeAt(i) == 10) {
      index = 0
      len ++
    }
  }
  return len
}
export default class Input extends Component {
  constructor() {
    super()
    this.state = {
      showEmoji: false,
      currentHeight: 45,
      currentLine: 1
    }
  }
  emptyValue() {
    this.refs.commentText.value = ''
    this.setState({
      currentHeight: 45
    })
  }
  getValue() {
    return this.refs.commentText.value
  }
  selectEmoji(e) {
    if (e.target.tagName === 'SPAN') {
      this.refs.commentText.value += e.target.innerText
      this.refs.emojiToggle.blur()
      e.preventDefault()
    }
  }
  textAutoSize(e) {
    const element = this.refs.commentText
    const lineSize = this.$lineSize || getLineSize(element)
    const realLine = getRealLine(element.value, lineSize, e.keyCode == 13 ? 1 : 0) 
    const lineHeight = 22 
    this.$lineSize = lineSize
    this.setState({
      currentHeight: 45 + lineHeight * (realLine - 1)
    })
  }
  render() {
    return (
      <div className={iptCss['user-input']}>
        <div className={iptCss['user-input-label']}>
          <div className={iptCss['user-emoji']}>
            <span className={iptCss['user-emoji-icon']} onClick={()=>this.refs.emojiToggle.focus()}></span>
            <CSSTransition
              in={this.state.showEmoji}
              key='tests'
              timeout={200}
              unmountOnExit
              classNames="fade">
              <div className={iptCss['user-emoji-list']} onClick={(e)=>this.selectEmoji(e)}>
                {
                  EMOJI_LIST.map((emoji, i) => <span key={i}>{emoji}</span>)
                }
              </div>
            </CSSTransition>
            <input 
              ref="emojiToggle"
              className={iptCss['hided']}
              onFocus={()=>this.setState({showEmoji: true})}
              onBlur={()=>this.setState({showEmoji: false})}
            />
          </div>
          <div className={iptCss['user-input-enter']}>
            <textarea 
              ref="commentText" 
              placeholder="Leave a comment" 
              style={{height: this.state.currentHeight + 'px'}} 
              onKeyDown={(e)=>this.textAutoSize(e)}
            />
          </div>
        </div>
      </div>
    )
  }
}
