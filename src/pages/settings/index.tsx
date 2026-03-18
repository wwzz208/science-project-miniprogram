import { View, Text, ScrollView } from '@tarojs/components'
import {
  User,
  Bell,
  Shield,
  ChevronRight,
  Trash2,
  Info,
  ArrowLeft
} from 'lucide-react-taro'
import Taro, { useLoad } from '@tarojs/taro'
import './index.css'

const SettingsPage = () => {
  useLoad(() => {
    Taro.setNavigationBarTitle({ title: '设置' })
  })

  const handleBack = () => {
    Taro.navigateBack()
  }

  const handleAccount = () => {
    const isLogin = Taro.getStorageSync('isLogin')
    const userInfo = Taro.getStorageSync('userInfo')

    if (!isLogin) {
      Taro.showToast({ title: '请先登录', icon: 'none' })
      return
    }

    Taro.showModal({
      title: '账号信息',
      content: `用户：${userInfo?.nickname || '未设置'}\n积分：${userInfo?.points || 0}\n等级：Lv.${userInfo?.level || 1}`,
      showCancel: false
    })
  }

  const handleNotification = () => {
    Taro.navigateTo({ url: '/pages/message/index' })
  }

  const handlePrivacy = () => {
    Taro.showModal({
      title: '隐私设置',
      content: '我们重视您的隐私保护，不会收集或泄露您的个人信息。',
      showCancel: false
    })
  }

  const handleClearCache = () => {
    Taro.showModal({
      title: '清除缓存',
      content: '确定要清除所有缓存吗？',
      success: (res) => {
        if (res.confirm) {
          // 这里可以实现清除缓存的逻辑
          Taro.showToast({ title: '缓存已清除', icon: 'success' })
        }
      }
    })
  }

  const handleAbout = () => {
    Taro.showModal({
      title: '关于我们',
      content: '科创教育平台\n版本：1.0.0\n致力于为青少年提供优质的科创教育资源和专业的指导服务。',
      showCancel: false
    })
  }

  return (
    <View className="settings-page">
      {/* 自定义导航栏 */}
      <View className="custom-navbar">
        <View className="navbar-content">
          <View className="navbar-left block" onClick={handleBack}>
            <ArrowLeft size={24} color="#333" />
          </View>
          <Text className="navbar-title">设置</Text>
          <View className="navbar-right"></View>
        </View>
      </View>

      <ScrollView className="settings-content" scrollY>
        {/* 账号安全 */}
        <View className="section px-4 py-4">
          <Text className="block text-sm font-bold text-gray-900 mb-3">账号安全</Text>
          <View className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <View
              className="menu-item flex items-center justify-between px-4 py-4 border-b border-gray-100 block"
              onClick={handleAccount}
            >
              <View className="flex items-center gap-3">
                <User size={20} color="#2563EB" />
                <Text className="text-sm text-gray-700">账号与安全</Text>
              </View>
              <ChevronRight size={20} color="#9CA3AF" />
            </View>

            <View
              className="menu-item flex items-center justify-between px-4 py-4 block"
              onClick={handlePrivacy}
            >
              <View className="flex items-center gap-3">
                <Shield size={20} color="#2563EB" />
                <Text className="text-sm text-gray-700">隐私设置</Text>
              </View>
              <ChevronRight size={20} color="#9CA3AF" />
            </View>
          </View>
        </View>

        {/* 通知设置 */}
        <View className="section px-4 py-4">
          <Text className="block text-sm font-bold text-gray-900 mb-3">通知设置</Text>
          <View className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <View
              className="menu-item flex items-center justify-between px-4 py-4 block"
              onClick={handleNotification}
            >
              <View className="flex items-center gap-3">
                <Bell size={20} color="#2563EB" />
                <Text className="text-sm text-gray-700">消息通知</Text>
              </View>
              <ChevronRight size={20} color="#9CA3AF" />
            </View>
          </View>
        </View>

        {/* 其他设置 */}
        <View className="section px-4 py-4">
          <Text className="block text-sm font-bold text-gray-900 mb-3">其他</Text>
          <View className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <View
              className="menu-item flex items-center justify-between px-4 py-4 border-b border-gray-100 block"
              onClick={handleClearCache}
            >
              <View className="flex items-center gap-3">
                <Trash2 size={20} color="#2563EB" />
                <Text className="text-sm text-gray-700">清除缓存</Text>
              </View>
              <ChevronRight size={20} color="#9CA3AF" />
            </View>

            <View
              className="menu-item flex items-center justify-between px-4 py-4 block"
              onClick={handleAbout}
            >
              <View className="flex items-center gap-3">
                <Info size={20} color="#2563EB" />
                <Text className="text-sm text-gray-700">关于我们</Text>
              </View>
              <ChevronRight size={20} color="#9CA3AF" />
            </View>
          </View>
        </View>

        {/* 版本信息 */}
        <View className="px-4 py-4 pb-20">
          <View className="bg-white rounded-2xl p-4 shadow-sm">
            <Text className="block text-center text-xs text-gray-400">当前版本 1.0.0</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

export default SettingsPage
