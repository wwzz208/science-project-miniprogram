import { View, Text, ScrollView } from '@tarojs/components'
import {
  MessageCircle,
  Bell,
  CheckCheck,
  ArrowLeft,
  Calendar,
  ShoppingBag,
  Info
} from 'lucide-react-taro'
import Taro, { useLoad } from '@tarojs/taro'
import { useState } from 'react'
import './index.css'

interface Message {
  id: number
  type: 'system' | 'activity' | 'order'
  title: string
  content: string
  time: string
  read: boolean
}

const MessagePage = () => {
  const [activeTab, setActiveTab] = useState('all')
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: 'system',
      title: '系统通知',
      content: '欢迎来到科创教育平台！我们为您提供优质的科创教育资源和专业的指导服务。',
      time: '2024-01-15 10:00',
      read: false
    },
    {
      id: 2,
      type: 'activity',
      title: '活动提醒',
      content: '您报名的"科创教师培训会"活动即将开始，请准时参加！',
      time: '2024-01-14 15:30',
      read: false
    },
    {
      id: 3,
      type: 'system',
      title: '新功能上线',
      content: 'AI导师功能已上线，点击"我的"→"AI导师"即可体验智能学习指导！',
      time: '2024-01-13 09:00',
      read: true
    },
    {
      id: 4,
      type: 'order',
      title: '订单通知',
      content: '您的订单已提交，我们会尽快与您联系确认订单详情。',
      time: '2024-01-12 14:20',
      read: true
    },
    {
      id: 5,
      type: 'activity',
      title: '活动推荐',
      content: '最新活动"青少年科普大赛"正在报名中，快来参加吧！',
      time: '2024-01-11 11:00',
      read: true
    }
  ])

  useLoad(() => {
    Taro.setNavigationBarTitle({ title: '消息中心' })
  })

  const handleBack = () => {
    Taro.navigateBack()
  }

  const handleMessageClick = (message: Message) => {
    if (!message.read) {
      const updatedMessages = messages.map(m =>
        m.id === message.id ? { ...m, read: true } : m
      )
      setMessages(updatedMessages)
    }
    Taro.showModal({
      title: message.title,
      content: message.content,
      showCancel: false
    })
  }

  const handleMarkAllRead = () => {
    const updatedMessages = messages.map(m => ({ ...m, read: true }))
    setMessages(updatedMessages)
    Taro.showToast({ title: '全部标记为已读', icon: 'success' })
  }

  const getFilteredMessages = () => {
    if (activeTab === 'all') return messages
    return messages.filter(m => m.type === activeTab)
  }

  const getMessageIcon = (type: string) => {
    switch (type) {
      case 'system':
        return <Info size={20} color="#2563EB" />
      case 'activity':
        return <Calendar size={20} color="#8B5CF6" />
      case 'order':
        return <ShoppingBag size={20} color="#F59E0B" />
      default:
        return <Bell size={20} color="#2563EB" />
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'system':
        return '系统消息'
      case 'activity':
        return '活动通知'
      case 'order':
        return '订单通知'
      default:
        return '消息'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'system':
        return 'text-blue-600 bg-blue-50'
      case 'activity':
        return 'text-purple-600 bg-purple-50'
      case 'order':
        return 'text-orange-600 bg-orange-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  const filteredMessages = getFilteredMessages()
  const unreadCount = messages.filter(m => !m.read).length

  return (
    <View className="message-page">
      {/* 自定义导航栏 */}
      <View className="custom-navbar">
        <View className="navbar-content">
          <View className="navbar-left block" onClick={handleBack}>
            <ArrowLeft size={24} color="#333" />
          </View>
          <Text className="navbar-title">消息中心</Text>
          <View className="navbar-right">
            {unreadCount > 0 && (
              <View className="unread-badge" onClick={handleMarkAllRead}>
                <CheckCheck size={20} color="#2563EB" />
              </View>
            )}
          </View>
        </View>
      </View>

      {/* 标签切换 */}
      <View className="tab-bar px-4 py-4">
        <ScrollView scrollX className="tab-scroll">
          <View className="flex gap-2">
            <View
              className={`tab-item px-4 py-2 rounded-full whitespace-nowrap block ${activeTab === 'all' ? 'tab-active' : 'tab-inactive'}`}
              onClick={() => setActiveTab('all')}
            >
              <Text className={`text-sm font-medium ${activeTab === 'all' ? 'text-white' : 'text-gray-600'}`}>
                全部 ({messages.length})
              </Text>
            </View>
            <View
              className={`tab-item px-4 py-2 rounded-full whitespace-nowrap block ${activeTab === 'system' ? 'tab-active' : 'tab-inactive'}`}
              onClick={() => setActiveTab('system')}
            >
              <Text className={`text-sm font-medium ${activeTab === 'system' ? 'text-white' : 'text-gray-600'}`}>
                系统消息
              </Text>
            </View>
            <View
              className={`tab-item px-4 py-2 rounded-full whitespace-nowrap block ${activeTab === 'activity' ? 'tab-active' : 'tab-inactive'}`}
              onClick={() => setActiveTab('activity')}
            >
              <Text className={`text-sm font-medium ${activeTab === 'activity' ? 'text-white' : 'text-gray-600'}`}>
                活动通知
              </Text>
            </View>
            <View
              className={`tab-item px-4 py-2 rounded-full whitespace-nowrap block ${activeTab === 'order' ? 'tab-active' : 'tab-inactive'}`}
              onClick={() => setActiveTab('order')}
            >
              <Text className={`text-sm font-medium ${activeTab === 'order' ? 'text-white' : 'text-gray-600'}`}>
                订单通知
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>

      <ScrollView className="message-content" scrollY>
        {filteredMessages.length === 0 ? (
          <View className="empty-state">
            <MessageCircle size={64} color="#d1d5db" />
            <Text className="block text-gray-500 text-center mt-4">暂无消息</Text>
          </View>
        ) : (
          <View className="section px-4 py-4">
            {filteredMessages.map((message) => (
              <View
                key={message.id}
                className={`message-item bg-white rounded-2xl p-4 mb-3 shadow-sm ${!message.read ? 'message-unread' : ''}`}
                onClick={() => handleMessageClick(message)}
              >
                <View className="flex items-start gap-3">
                  <View className="message-icon">
                    {getMessageIcon(message.type)}
                  </View>
                  <View className="flex-1">
                    <View className="flex items-center justify-between mb-2">
                      <View className="flex items-center gap-2">
                        <Text className="block text-sm font-bold text-gray-900">{message.title}</Text>
                        {!message.read && <View className="unread-dot"></View>}
                      </View>
                      <View className={`message-type px-2 py-1 rounded-full ${getTypeColor(message.type)}`}>
                        <Text className="text-xs">{getTypeLabel(message.type)}</Text>
                      </View>
                    </View>
                    <Text className="block text-sm text-gray-600 leading-relaxed mb-2 line-clamp-2">{message.content}</Text>
                    <Text className="block text-xs text-gray-400">{message.time}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  )
}

export default MessagePage
