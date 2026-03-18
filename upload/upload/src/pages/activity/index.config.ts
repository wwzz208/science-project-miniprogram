export default typeof definePageConfig === 'function'
  ? definePageConfig({
      navigationBarTitleText: '最新活动'
    })
  : {
      navigationBarTitleText: '最新活动'
    }
