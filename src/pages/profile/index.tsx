import { View, Text, ScrollView } from '@tarojs/components'
import {
  User,
  ShoppingBag,
  Star,
  Award,
  Settings,
  Heart,
  MessageCircle,
  ChevronRight,
  Info,
  ArrowRight,
  ArrowLeft,
  PanelTop
} from 'lucide-react-taro'
import Taro, { useLoad, useDidShow } from '@tarojs/taro'
import { useState } from 'react'
import './index.css'

const ProfilePage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userInfo, setUserInfo] = useState<any>(null)

  useLoad(() => {
    Taro.setNavigationBarTitle({ title: '我的' })
    checkLoginStatus()
  })

  // TabBar 页面切换时重新检查登录状态
  useDidShow(() => {
    console.log('页面显示，重新检查登录状态')
    checkLoginStatus()
  })

  const checkLoginStatus = () => {
    try {
      const isLogin = Taro.getStorageSync('isLogin')
      const user = Taro.getStorageSync('userInfo')
      console.log('检查登录状态 - isLogin:', isLogin, 'user:', user)
      setIsLoggedIn(isLogin === 'true')
      setUserInfo(user)
    } catch (error) {
      console.error('检查登录状态失败:', error)
      setIsLoggedIn(false)
      setUserInfo(null)
    }
  }

  const handleLogin = () => {
    Taro.navigateTo({ url: '/pages/login/index' })
  }

  const handleOrder = () => {
    if (!isLoggedIn) {
      handleLogin()
      return
    }
    Taro.navigateTo({ url: '/pages/order/index' })
  }

  const handleWorks = () => {
    if (!isLoggedIn) {
      handleLogin()
      return
    }
    Taro.navigateTo({ url: '/pages/works/index' })
  }

  const handlePoints = () => {
    if (!isLoggedIn) {
      handleLogin()
      return
    }
    Taro.showToast({ title: '积分商城开发中', icon: 'none' })
  }

  const handleSettings = () => {
    Taro.navigateTo({ url: '/pages/settings/index' })
  }

  const handleFavorite = () => {
    if (!isLoggedIn) {
      handleLogin()
      return
    }
    Taro.navigateTo({ url: '/pages/favorite/index' })
  }

  const handleMessage = () => {
    if (!isLoggedIn) {
      handleLogin()
      return
    }
    Taro.navigateTo({ url: '/pages/message/index' })
  }

  return (
    <View className="profile-page">
      {/* 自定义导航栏 */}
      <View className="custom-navbar">
        <View className="navbar-content">
          <View className="navbar-left block" onClick={() => Taro.switchTab({ url: '/pages/index/index' })}>
            <ArrowLeft size={24} color="#333" />
          </View>
          <Text className="navbar-title">我的</Text>
          <View className="navbar-right"></View>
        </View>
      </View>

      <ScrollView className="profile-content" scrollY>
        {/* 用户信息卡片 */}
        <View className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-6">
          {isLoggedIn ? (
            <View className="flex items-center gap-4">
              <View className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                <User size={40} color="#2563EB" />
              </View>
              <View className="flex-1">
                <Text className="block text-xl font-bold text-white mb-1">
                  {userInfo?.nickname || '科创小达人'}
                </Text>
                <Text className="block text-sm text-blue-100">
                  积分：{userInfo?.points || 0} | 等级：Lv.{userInfo?.level || 1}
                </Text>
              </View>
            </View>
          ) : (
            <View className="flex items-center gap-4">
              <View className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                <User size={40} color="#9CA3AF" />
              </View>
              <View className="flex-1">
                <Text className="block text-xl font-bold text-white mb-1">登录/注册</Text>
                <Text className="block text-sm text-blue-100">
                  登录后享受更多功能
                </Text>
              </View>
              <View className="login-btn block" onClick={handleLogin}>
                <ArrowRight size={24} color="white" />
              </View>
            </View>
          )}
        </View>

        {/* 快捷入口 */}
        <View className="px-4 py-4">
          <View className="bg-white rounded-2xl p-4 shadow-sm">
            <View className="flex justify-around">
              <View className="flex flex-col items-center block" onClick={handleOrder}>
                <View className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-2">
                  <ShoppingBag size={24} color="#2563EB" />
                </View>
                <Text className="block text-xs text-gray-600">我的订单</Text>
              </View>

              <View className="flex flex-col items-center block" onClick={handleWorks}>
                <View className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center mb-2">
                  <Star size={24} color="#8B5CF6" />
                </View>
                <Text className="block text-xs text-gray-600">作品集</Text>
              </View>

              <View className="flex flex-col items-center block" onClick={handlePoints}>
                <View className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center mb-2">
                  <Award size={24} color="#F59E0B" />
                </View>
                <Text className="block text-xs text-gray-600">积分商城</Text>
              </View>

              <View className="flex flex-col items-center block" onClick={handleFavorite}>
                <View className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mb-2">
                  <Heart size={24} color="#10B981" />
                </View>
                <Text className="block text-xs text-gray-600">收藏</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 我的成就 */}
        <View className="px-4 py-4">
          <Text className="block text-lg font-bold text-gray-900 mb-3">我的成就</Text>
          <View className="bg-white rounded-2xl p-4 shadow-sm">
            <View className="flex justify-between items-center mb-4">
              <Text className="block text-sm text-gray-600">科创小院士</Text>
              <Text className="text-sm text-orange-500 font-medium">Lv.{userInfo?.level || 1}</Text>
            </View>
            <View className="w-full bg-gray-200 rounded-full h-2 mb-3">
              <View className="bg-orange-500 h-2 rounded-full" style={{ width: '60%' }}></View>
            </View>
            <Text className="block text-xs text-gray-400">距离下一级还需 220 积分</Text>
          </View>
        </View>

        {/* 功能列表 */}
        <View className="px-4 py-4">
          <Text className="block text-lg font-bold text-gray-900 mb-3">更多功能</Text>
          <View className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <View
              className="menu-item flex items-center justify-between px-4 py-4 border-b border-gray-100 block"
              onClick={handleMessage}
            >
              <View className="flex items-center gap-3">
                <MessageCircle size={20} color="#2563EB" />
                <Text className="text-sm text-gray-700">消息中心</Text>
              </View>
              <ChevronRight size={20} color="#9CA3AF" />
            </View>

            <View
              className="menu-item flex items-center justify-between px-4 py-4 border-b border-gray-100 block"
              onClick={handleSettings}
            >
              <View className="flex items-center gap-3">
                <Settings size={20} color="#2563EB" />
                <Text className="text-sm text-gray-700">设置</Text>
              </View>
              <ChevronRight size={20} color="#9CA3AF" />
            </View>

            <View
              className="menu-item flex items-center justify-between px-4 py-4 border-b border-gray-100 block"
              onClick={() => Taro.navigateTo({ url: '/pages/admin/login' })}
            >
              <View className="flex items-center gap-3">
                <PanelTop size={20} color="#DC2626" />
                <Text className="text-sm text-gray-700">管理后台</Text>
              </View>
              <ChevronRight size={20} color="#9CA3AF" />
            </View>

            <View
              className="menu-item flex items-center justify-between px-4 py-4 border-b border-gray-100 block"
              onClick={() => Taro.navigateTo({ url: '/pages/help/index' })}
            >
              <View className="flex items-center gap-3">
                <Info size={20} color="#2563EB" />
                <Text className="text-sm text-gray-700">帮助文档</Text>
              </View>
              <ChevronRight size={20} color="#9CA3AF" />
            </View>

            <View
              className="menu-item flex items-center justify-between px-4 py-4 block"
              onClick={() => Taro.navigateTo({ url: '/pages/ai-chat/index' })}
            >
              <View className="flex items-center gap-3">
                <Star size={20} color="#8B5CF6" />
                <Text className="text-sm text-gray-700">AI导师</Text>
              </View>
              <ChevronRight size={20} color="#9CA3AF" />
            </View>
          </View>
        </View>

        {/* 退出登录 */}
        {isLoggedIn && (
          <View className="px-4 py-4 pb-20">
            <View
              className="bg-white rounded-2xl p-4 shadow-sm block"
              onClick={() => {
                Taro.removeStorageSync('isLogin')
                Taro.removeStorageSync('token')
                Taro.removeStorageSync('userInfo')
                checkLoginStatus()
                Taro.showToast({ title: '已退出登录', icon: 'success' })
              }}
            >
              <Text className="block text-center text-sm text-red-500 font-medium">退出登录</Text>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  )
}

export default ProfilePage
