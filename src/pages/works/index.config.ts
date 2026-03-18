export default typeof definePageConfig === 'function'
  ? definePageConfig({
      navigationBarTitleText: '我的作品集',
      navigationStyle: 'custom'
    })
  : {
      navigationBarTitleText: '我的作品集',
      navigationStyle: 'custom'
    }
