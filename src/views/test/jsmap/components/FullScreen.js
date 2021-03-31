import { uuid } from '@/utils/utils'

const BMap = window.BMapGL
//定义一个全屏控件类
export function FullScreen(fullScreenId, changeFull) {
  this.isFull = false
  this.fullScreenId = fullScreenId
  this.changeFull = changeFull
  this.defaultAnchor = window.BMAP_ANCHOR_BOTTOM_RIGHT
  this.defaultOffset = new BMap.Size(10, 0)
}

//通过JavaScript的prototype属性继承于BMap.Control
FullScreen.prototype = new BMap.Control()

//自定义控件必须实现自己的initialize方法，并且将控件的DOM元素返回
//在本方法中创建个div元素作为控件的容器，并将其添加到地图容器中
FullScreen.prototype.initialize = function(map) {
  // console.log('initialize')
  // console.log('fullScreenId', this.fullScreenId)

  //创建一个dom元素
  let element = document.createElement('span')
  element.innerHTML = `<img id="${this.fullScreenId}_img"
                        src=${this.isFull ? require('@/assets/images/exit_full_screen.png') : require('@/assets/images/full_screen.png')} 
                        alt="" style="width: 30px;" />`

// 全屏
  const fullScreen = (el) => {
    const rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullScreen
    let wscript
    if (typeof rfs != 'undefined' && rfs) {
      rfs.call(el)
      return
    }

    if (typeof window.ActiveXObject != 'undefined') {
      wscript = new ActiveXObject('WScript.Shell')
      if (wscript) {
        wscript.SendKeys('{F11}')
      }
    }
  }

  //退出全屏
  const exitFullScreen = (el) => {
    var el = document,
      cfs = el.cancelFullScreen || el.webkitCancelFullScreen || el.mozCancelFullScreen || el.exitFullScreen,
      wscript
    if (typeof cfs != 'undefined' && cfs) {
      cfs.call(el)
      return
    }

    if (typeof window.ActiveXObject != 'undefined') {
      wscript = new ActiveXObject('WScript.Shell')
      if (wscript != null) {
        wscript.SendKeys('{F11}')
      }
    }
  }

  // fullScreenChange()
  element.addEventListener('click', () => {
    const el = document.getElementById(this.fullScreenId)
    if (!isFullScreen()) {
      fullScreen(el)
      var img = document.getElementById(`${this.fullScreenId}_img`)
      img.src=require('@/assets/images/exit_full_screen.png')
    } else {
      exitFullScreen(el)
      var img = document.getElementById(`${this.fullScreenId}_img`)
      img.src=require('@/assets/images/full_screen.png')
    }
  })
  // 添加DOM元素到地图中
  map.getContainer().appendChild(element)
  // 将DOM元素返回
  return element
}

// 判断是否是全屏
export function isFullScreen() {
  return document.fullscreenElement ||
    document.mozFullScreenElement ||
    document.msFullScreenElement ||
    document.webkitFullscreenElement || null
}

// export default {FullScreen,isFullScreen}
