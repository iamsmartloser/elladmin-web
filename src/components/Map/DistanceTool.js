const BMap = window.BMap
const BMapLib = window.BMapLib

// 定义一个全屏控件类
export function DistanceTool({ anchor, offset }) {
  this.defaultAnchor = anchor
  this.defaultOffset = offset
  this.isOpen = false
}

// 通过JavaScript的prototype属性继承于BMap.Control
DistanceTool.prototype = new BMap.Control()

// 自定义控件必须实现自己的initialize方法，并且将控件的DOM元素返回
// 在本方法中创建个div元素作为控件的容器，并将其添加到地图容器中
DistanceTool.prototype.initialize = function(map) {
  // 创建鼠标测距对象
  const distanceTool = new BMapLib.DistanceTool(map)
  // 创建一个dom元素
  const element = document.createElement('img')
  element.src = require('@/assets/images/rule.png')
  element.style = 'width: 30px;'
  element.alt = '鼠标测距'

  element.addEventListener('click', () => {
    if (!this.isOpen) {
      console.log('open')
      distanceTool.open()
    } else {
      console.log('close')
      distanceTool.close()
    }
  })
  element.addEventListener('mouseover', () => {
    element.style.cursor = 'pointer'
    element.title = '鼠标测距'
  })
  // 添加DOM元素到地图中
  map.getContainer().appendChild(element)
  // 将DOM元素返回
  return element
}

