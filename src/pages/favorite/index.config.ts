export default typeof definePageConfig === 'function'
  ? definePageConfig({
      navigationBarTitleText: '我的收藏',
      navigationStyle: 'custom'
    })
  : {
      navigationBarTitleText: '我的收藏',
      navigationStyle: 'custom'
    }
