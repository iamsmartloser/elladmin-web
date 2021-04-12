const BMap = window.BMap

// 定义一个地点搜索自动补全控件类
function AutoComplete({ anchor, offset }) {
  this.defaultAnchor = anchor
  this.defaultOffset = offset
}

// 通过JavaScript的prototype属性继承于BMap.Control
AutoComplete.prototype = new BMap.Control()

// 自定义控件必须实现自己的initialize方法，并且将控件的DOM元素返回
// 在本方法中创建个div元素作为控件的容器，并将其添加到地图容器中
AutoComplete.prototype.initialize = function(map) {
  // 创建一个dom元素
  const element = document.createElement('span')
  element.innerHTML = `<input id="suggestId" style="width: 140px;border:1px #DCDCDC solid;font-size: 14px;" placeholder="输入位置快速查询"></input>
                      <div id="searchResultPanel" style="border:1px solid #C0C0C0;width:150px;height:auto; display:none;z-index: 10"></div>
                       `
  // 添加DOM元素到地图中
  map.getContainer().appendChild(element)
  localSearch(map)
  // 将DOM元素返回
  return element
}

function localSearch(map) {
  let searchMarker = null

  // 百度地图API功能
  function G(id) {
    return document.getElementById(id)
  }

  // var map = new BMap.Map("l-map");
  // map.centerAndZoom("北京",12);                   // 初始化地图,设置城市和地图级别。

  var ac = new BMap.Autocomplete( // 建立一个自动完成的对象
    {
      'input': 'suggestId',
      'location': map
    })

  ac.addEventListener('onhighlight', function(e) { // 鼠标放在下拉列表上的事件
    let str = ''
    let _value = e.fromitem.value
    let value = ''
    if (e.fromitem.index > -1) {
      value = _value.province + _value.city + _value.district + _value.street + _value.business
    }
    str = 'FromItem<br />index = ' + e.fromitem.index + '<br />value = ' + value

    value = ''
    if (e.toitem.index > -1) {
      _value = e.toitem.value
      value = _value.province + _value.city + _value.district + _value.street + _value.business
    }
    str += '<br />ToItem<br />index = ' + e.toitem.index + '<br />value = ' + value
    G('searchResultPanel').innerHTML = str
  })

  let myValue
  ac.addEventListener('onconfirm', function(e) { // 鼠标点击下拉列表后的事件
    const _value = e.item.value
    myValue = _value.province + _value.city + _value.district + _value.street + _value.business
    G('searchResultPanel').innerHTML = 'onconfirm<br />index = ' + e.item.index + '<br />myValue = ' + myValue

    setPlace()
  })

  function setPlace() {
    map.removeOverlay(searchMarker)// 清除地图上的查询标记点

    function myFun() {
      const pp = local.getResults().getPoi(0).point // 获取第一个智能搜索的结果
      map.centerAndZoom(pp, 18)
      searchMarker = new BMap.Marker(pp)
      map.addOverlay(searchMarker) // 添加标注
    }

    const local = new BMap.LocalSearch(map, { // 智能搜索
      onSearchComplete: myFun
    })
    local.search(myValue)
  }
}

export default AutoComplete
