import { View, Text, Input } from '@tarojs/components'
import { LogIn, User, Lock, Smartphone } from 'lucide-react-taro'
import Taro, { useLoad } from '@tarojs/taro'
import { useState } from 'react'
import { Network } from '@/network'
import './index.css'

const LoginPage = () => {
  const [isRegister, setIsRegister] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [wechatLoading, setWechatLoading] = useState(false)

  // 获取当前环境
  const isWeapp = Taro.getEnv() === Taro.ENV_TYPE.WEAPP

  useLoad(() => {
    Taro.setNavigationBarTitle({ title: isRegister ? '注册' : '登录' })
  })

  // 微信授权登录
  const handleWechatLogin = async () => {
    // 检测是否在微信小程序环境
    if (!isWeapp) {
      Taro.showToast({ title: '微信登录仅在小程序中可用', icon: 'none' })
      return
    }

    setWechatLoading(true)

    try {
      // 获取微信登录 code
      const loginRes = await Taro.login()

      if (!loginRes.code) {
        Taro.showToast({ title: '获取微信授权失败', icon: 'none' })
        setWechatLoading(false)
        return
      }

      console.log('微信登录 code:', loginRes.code)

      // 调用后端接口进行微信登录
      const res = await Network.request({
        url: '/api/user/wechat-login',
        method: 'POST',
        data: { code: loginRes.code },
      })

      console.log('微信登录响应:', res.data)

      if (res.data.code === 200) {
        Taro.setStorageSync('isLogin', 'true')
        Taro.setStorageSync('token', res.data.data.token)
        Taro.setStorageSync('userInfo', res.data.data.user)

        console.log('登录信息已保存')

        Taro.showToast({ title: '登录成功', icon: 'success' })

        setTimeout(() => {
          Taro.switchTab({ url: '/pages/profile/index' })
        }, 1500)
      } else {
        Taro.showToast({ title: res.data.msg || '登录失败', icon: 'none' })
      }
    } catch (error) {
      console.error('微信登录错误:', error)
      Taro.showToast({ title: '微信登录失败，请重试', icon: 'none' })
    } finally {
      setWechatLoading(false)
    }
  }

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Taro.showToast({ title: '请输入用户名和密码', icon: 'none' })
      return
    }

    setLoading(true)

    try {
      console.log('开始登录，用户名:', username)
      const res = await Network.request({
        url: '/api/user/login',
        method: 'POST',
        data: { username, password }
      })

      console.log('登录响应:', res)

      if (res.data.code === 200) {
        Taro.setStorageSync('isLogin', 'true')
        Taro.setStorageSync('token', res.data.data.token)
        Taro.setStorageSync('userInfo', res.data.data.user)

        console.log('登录信息已保存')

        Taro.showToast({ title: '登录成功', icon: 'success' })

        setTimeout(() => {
          Taro.switchTab({ url: '/pages/profile/index' })
        }, 1500)
      } else {
        Taro.showToast({ title: res.data.msg || '登录失败', icon: 'none' })
      }
    } catch (error) {
      console.error('登录错误:', error)
      Taro.showToast({ title: '网络错误，请重试', icon: 'none' })
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async () => {
    if (!username.trim() || !password.trim()) {
      Taro.showToast({ title: '请填写完整信息', icon: 'none' })
      return
    }

    if (password.length < 6) {
      Taro.showToast({ title: '密码至少6位', icon: 'none' })
      return
    }

    if (password !== confirmPassword) {
      Taro.showToast({ title: '两次密码不一致', icon: 'none' })
      return
    }

    setLoading(true)

    try {
      const res = await Network.request({
        url: '/api/user/register',
        method: 'POST',
        data: { username, password }
      })

      if (res.data.code === 200) {
        Taro.setStorageSync('isLogin', 'true')
        Taro.setStorageSync('token', res.data.data.token)
        Taro.setStorageSync('userInfo', res.data.data.user)

        Taro.showToast({ title: '注册成功', icon: 'success' })

        setTimeout(() => {
          Taro.switchTab({ url: '/pages/profile/index' })
        }, 1500)
      } else {
        Taro.showToast({ title: res.data.msg || '注册失败', icon: 'none' })
      }
    } catch (error) {
      console.error('注册错误:', error)
      Taro.showToast({ title: '网络错误，请重试', icon: 'none' })
    } finally {
      setLoading(false)
    }
  }

  const toggleMode = () => {
    setIsRegister(!isRegister)
    setUsername('')
    setPassword('')
    setConfirmPassword('')
  }

  return (
    <View className="login-page">
      <View className="login-container">
        {/* Logo */}
        <View className="logo-section">
          <View className="logo-icon">
            <LogIn size={48} color="#2563EB" />
          </View>
          <Text className="block text-2xl font-bold text-gray-900 mt-4">
            科普优创小助手
          </Text>
          <Text className="block text-sm text-gray-500 mt-2">
            让创意变为现实
          </Text>
        </View>

        {/* 微信授权登录 */}
        <View className="login-form">
          <View
            className={`wechat-login-btn ${wechatLoading ? 'opacity-70' : ''}`}
            onClick={!wechatLoading ? handleWechatLogin : undefined}
          >
            <Smartphone size={20} color="#fff" />
            <Text className="wechat-login-btn-text">
              {wechatLoading ? '登录中...' : '微信授权登录'}
            </Text>
          </View>
          <Text className="block text-xs text-gray-400 text-center mt-3">
            {isWeapp ? '推荐使用微信授权快速登录' : '微信登录仅在小程序中可用'}
          </Text>
        </View>

        {/* 分隔线 */}
        <View className="divider">
          <Text className="divider-text">或</Text>
        </View>

        {/* 账号密码登录 */}
        <View className="login-form">
          <View className="form-item">
            <View className="input-wrapper">
              <User size={20} color="#9CA3AF" />
              <Input
                style={{ flex: 1, backgroundColor: 'transparent' }}
                placeholder="请输入用户名"
                value={username}
                onInput={(e) => setUsername(e.detail.value)}
              />
            </View>
          </View>

          <View className="form-item">
            <View className="input-wrapper">
              <Lock size={20} color="#9CA3AF" />
              <Input
                style={{ flex: 1, backgroundColor: 'transparent' }}
                placeholder="请输入密码（至少6位）"
                password
                value={password}
                onInput={(e) => setPassword(e.detail.value)}
              />
            </View>
          </View>

          {isRegister && (
            <View className="form-item">
              <View className="input-wrapper">
                <Lock size={20} color="#9CA3AF" />
                <Input
                  style={{ flex: 1, backgroundColor: 'transparent' }}
                  placeholder="请确认密码"
                  password
                  value={confirmPassword}
                  onInput={(e) => setConfirmPassword(e.detail.value)}
                />
              </View>
            </View>
          )}

          <View
            className={`login-btn ${loading ? 'opacity-70' : ''}`}
            onClick={!loading ? (isRegister ? handleRegister : handleLogin) : undefined}
          >
            <Text className="login-btn-text">
              {loading ? (isRegister ? '注册中...' : '登录中...') : (isRegister ? '注册' : '登录')}
            </Text>
          </View>

          <View className="form-actions">
            <View className="action-link block" onClick={toggleMode}>
              <Text className="text-xs text-blue-600">
                {isRegister ? '已有账号？立即登录' : '没有账号？立即注册'}
              </Text>
            </View>
            {!isRegister && (
              <View className="action-link block">
                <Text className="text-xs text-gray-400">忘记密码?</Text>
              </View>
            )}
          </View>

          <Text className="block text-xs text-gray-400 text-center mt-4">
            {isRegister ? '注册即表示同意' : '登录即表示同意'}《用户协议》和《隐私政策》
          </Text>
        </View>
      </View>
    </View>
  )
}

export default LoginPage
