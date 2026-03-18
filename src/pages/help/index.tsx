import { View, Text, ScrollView } from '@tarojs/components'
import {
  FileQuestionMark,
  ChevronRight,
  ArrowLeft,
  Phone,
  MessageCircle,
  Mail
} from 'lucide-react-taro'
import Taro, { useLoad } from '@tarojs/taro'
import { useState } from 'react'
import './index.css'

interface FAQItem {
  id: number
  question: string
  answer: string
}

const HelpPage = () => {
  const [activeTab, setActiveTab] = useState('faq')

  const faqList: FAQItem[] = [
    {
      id: 1,
      question: '如何浏览科创项目？',
      answer: '您可以在首页浏览推荐的科创项目，或使用搜索功能查找特定类别的项目。点击项目卡片可以查看详细信息。'
    },
    {
      id: 2,
      question: '如何联系老师咨询？',
      answer: '在项目详情页面，您可以查看老师的联系方式，包括电话和微信。点击"电话咨询"可以直接拨打老师电话，点击"微信咨询"可以复制老师的微信号。'
    },
    {
      id: 3,
      question: '如何参加科创活动？',
      answer: '在"最新活动"页面可以查看所有正在报名的科创活动。点击活动卡片可以查看活动详情，并根据提示报名参加。'
    },
    {
      id: 4,
      question: '如何使用AI导师？',
      answer: '在"我的"页面点击"AI导师"即可进入智能对话界面，您可以向AI导师提问，获取科创学习的建议和指导。'
    },
    {
      id: 5,
      question: '如何定制科创项目？',
      answer: '在"定制工坊"页面，您可以提交项目定制需求，我们的专业团队会根据您的需求为您定制专属的科创项目方案。'
    }
  ]

  const guideList = [
    {
      title: '新手入门指南',
      description: '了解平台基本功能和使用方法',
      icon: '📘'
    },
    {
      title: '项目浏览指南',
      description: '学习如何浏览和筛选科创项目',
      icon: '🔍'
    },
    {
      title: '活动报名指南',
      description: '了解如何报名参加科创活动',
      icon: '📝'
    },
    {
      title: 'AI导师使用指南',
      description: '掌握AI导师的使用技巧',
      icon: '🤖'
    }
  ]

  useLoad(() => {
    Taro.setNavigationBarTitle({ title: '帮助文档' })
  })

  const handleBack = () => {
    Taro.navigateBack()
  }

  const handleCall = () => {
    Taro.makePhoneCall({
      phoneNumber: '400-888-8888',
      success: () => {
        console.log('拨打客服电话成功')
      },
      fail: (err) => {
        console.error('拨打客服电话失败', err)
        Taro.showToast({ title: '拨打电话失败', icon: 'none' })
      }
    })
  }

  const handleContact = () => {
    Taro.showActionSheet({
      itemList: ['电话咨询', '在线客服', '邮件联系'],
      success: (res) => {
        if (res.tapIndex === 0) {
          handleCall()
        } else if (res.tapIndex === 1) {
          Taro.showToast({ title: '在线客服功能开发中', icon: 'none' })
        } else if (res.tapIndex === 2) {
          Taro.setClipboardData({
            data: 'support@kechuang.com',
            success: () => {
              Taro.showToast({ title: '邮箱已复制', icon: 'success' })
            }
          })
        }
      }
    })
  }

  return (
    <View className="help-page">
      {/* 自定义导航栏 */}
      <View className="custom-navbar">
        <View className="navbar-content">
          <View className="navbar-left block" onClick={handleBack}>
            <ArrowLeft size={24} color="#333" />
          </View>
          <Text className="navbar-title">帮助文档</Text>
          <View className="navbar-right"></View>
        </View>
      </View>

      <ScrollView className="help-content" scrollY>
        {/* 标签切换 */}
        <View className="tab-bar px-4 py-4">
          <View className="flex gap-2">
            <View
              className={`tab-item flex-1 py-2 px-4 rounded-full text-center block ${activeTab === 'faq' ? 'tab-active' : 'tab-inactive'}`}
              onClick={() => setActiveTab('faq')}
            >
              <Text className={`text-sm font-medium ${activeTab === 'faq' ? 'text-white' : 'text-gray-600'}`}>
                常见问题
              </Text>
            </View>
            <View
              className={`tab-item flex-1 py-2 px-4 rounded-full text-center block ${activeTab === 'guide' ? 'tab-active' : 'tab-inactive'}`}
              onClick={() => setActiveTab('guide')}
            >
              <Text className={`text-sm font-medium ${activeTab === 'guide' ? 'text-white' : 'text-gray-600'}`}>
                使用指南
              </Text>
            </View>
          </View>
        </View>

        {/* 常见问题 */}
        {activeTab === 'faq' && (
          <View className="section px-4 py-4">
            {faqList.map((item) => (
              <View key={item.id} className="faq-item bg-white rounded-2xl p-4 mb-3 shadow-sm">
                <View className="flex items-start gap-3">
                  <View className="faq-icon">
                    <FileQuestionMark size={20} color="#2563EB" />
                  </View>
                  <View className="flex-1">
                    <Text className="block text-sm font-bold text-gray-900 mb-2">{item.question}</Text>
                    <Text className="block text-sm text-gray-600 leading-relaxed">{item.answer}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* 使用指南 */}
        {activeTab === 'guide' && (
          <View className="section px-4 py-4">
            {guideList.map((item, index) => (
              <View key={index} className="guide-item bg-white rounded-2xl p-4 mb-3 shadow-sm">
                <View className="flex items-center gap-3">
                  <View className="guide-icon">
                    <Text className="guide-icon-text">{item.icon}</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="block text-sm font-bold text-gray-900 mb-1">{item.title}</Text>
                    <Text className="block text-xs text-gray-500">{item.description}</Text>
                  </View>
                  <ChevronRight size={20} color="#9CA3AF" />
                </View>
              </View>
            ))}
          </View>
        )}

        {/* 联系客服 */}
        <View className="section px-4 py-4 pb-20">
          <Text className="block text-lg font-bold text-gray-900 mb-3">联系客服</Text>
          <View className="bg-white rounded-2xl p-4 shadow-sm">
            <View className="contact-item flex items-center justify-between mb-4 block" onClick={handleContact}>
              <View className="flex items-center gap-3">
                <Phone size={20} color="#2563EB" />
                <View>
                  <Text className="block text-sm text-gray-800">客服热线</Text>
                  <Text className="block text-xs text-gray-500">400-888-8888</Text>
                </View>
              </View>
              <ChevronRight size={20} color="#9CA3AF" />
            </View>

            <View className="contact-item flex items-center justify-between mb-4 block" onClick={() => Taro.setClipboardData({ data: 'support@kechuang.com', success: () => Taro.showToast({ title: '邮箱已复制', icon: 'success' }) })}>
              <View className="flex items-center gap-3">
                <Mail size={20} color="#2563EB" />
                <View>
                  <Text className="block text-sm text-gray-800">客服邮箱</Text>
                  <Text className="block text-xs text-gray-500">support@kechuang.com</Text>
                </View>
              </View>
              <ChevronRight size={20} color="#9CA3AF" />
            </View>

            <View className="contact-item flex items-center justify-between block" onClick={() => Taro.showToast({ title: '在线客服功能开发中', icon: 'none' })}>
              <View className="flex items-center gap-3">
                <MessageCircle size={20} color="#2563EB" />
                <View>
                  <Text className="block text-sm text-gray-800">在线客服</Text>
                  <Text className="block text-xs text-gray-500">工作时间：9:00-18:00</Text>
                </View>
              </View>
              <ChevronRight size={20} color="#9CA3AF" />
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

export default HelpPage
