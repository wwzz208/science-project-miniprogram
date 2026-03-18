import { View, Text, ScrollView, Textarea } from '@tarojs/components'
import { Send, Sparkles, Bot, User, RefreshCw, Copy } from 'lucide-react-taro'
import Taro, { useLoad } from '@tarojs/taro'
import { useState, useRef, useEffect } from 'react'
import { Network } from '@/network'
import './index.css'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

const AiChatPage = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: '你好！我是你的AI科创导师。我可以帮助你：\n\n🎯 设计科创产品方案\n💻 编写和调试代码\n🔌 理解电路原理\n🛠️ 解决技术问题\n📚 提供学习建议\n\n有什么我可以帮助你的吗？',
      timestamp: Date.now()
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const scrollViewRef = useRef<any>(null)

  useLoad(() => {
    Taro.setNavigationBarTitle({ title: 'AI导师' })
  })

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    setTimeout(() => {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTop = scrollViewRef.current.scrollHeight
      }
    }, 100)
  }

  const handleSend = async () => {
    if (!input.trim() || loading) return

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: Date.now()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      // 获取历史消息用于上下文
      const historyMessages = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }))

      const res = await Network.request({
        url: '/api/ai/chat',
        method: 'POST',
        data: {
          messages: [...historyMessages, { role: 'user', content: input }]
        }
      })

      if (res.data.code === 200) {
        const assistantMessage: Message = {
          role: 'assistant',
          content: res.data.data.answer,
          timestamp: Date.now()
        }
        setMessages(prev => [...prev, assistantMessage])
      } else {
        throw new Error(res.data.msg || 'AI服务异常')
      }
    } catch (error) {
      console.error('AI对话错误:', error)
      Taro.showToast({ title: '网络错误，请重试', icon: 'none' })
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '抱歉，我遇到了一些问题。请稍后再试，或者尝试重新提问。',
        timestamp: Date.now()
      }])
    } finally {
      setLoading(false)
    }
  }

  const handleClear = () => {
    setMessages([{
      role: 'assistant',
      content: '对话已清空。有什么我可以帮助你的吗？',
      timestamp: Date.now()
    }])
  }

  const handleCopy = (content: string) => {
    Taro.setClipboardData({
      data: content,
      success: () => {
        Taro.showToast({ title: '已复制', icon: 'success' })
      }
    })
  }

  const formatMessage = (content: string) => {
    // 简单的代码块格式化
    const codeBlockRegex = /```(\w*)\n([\s\S]*?)```/g
    const parts: any[] = []
    let lastIndex = 0
    let match

    while ((match = codeBlockRegex.exec(content)) !== null) {
      // 添加代码块前的文本
      if (match.index > lastIndex) {
        parts.push({
          type: 'text',
          content: content.slice(lastIndex, match.index)
        })
      }
      // 添加代码块
      parts.push({
        type: 'code',
        language: match[1] || 'plaintext',
        content: match[2]
      })
      lastIndex = codeBlockRegex.lastIndex
    }

    // 添加剩余文本
    if (lastIndex < content.length) {
      parts.push({
        type: 'text',
        content: content.slice(lastIndex)
      })
    }

    return parts
  }

  return (
    <View className="ai-chat-page">
      {/* 消息列表 */}
      <ScrollView
        className="chat-messages"
        scrollY
        ref={scrollViewRef}
        scrollTop={999999}
      >
        {messages.map((msg, index) => (
          <View
            key={index}
            className={`message-item ${msg.role === 'user' ? 'user' : 'assistant'}`}
          >
            <View className="message-avatar">
              {msg.role === 'user' ? (
                <User size={24} color="#2563EB" />
              ) : (
                <Bot size={24} color="#8B5CF6" />
              )}
            </View>
            <View className="message-content-wrapper">
              <View className="message-role">
                <Text className="text-xs font-medium">
                  {msg.role === 'user' ? '你' : 'AI导师'}
                </Text>
                <View
                  className="copy-btn block"
                  onClick={() => handleCopy(msg.content)}
                >
                  <Copy size={14} color="#9CA3AF" />
                </View>
              </View>
              <View className="message-bubble">
                {formatMessage(msg.content).map((part, idx) => (
                  <View key={idx}>
                    {part.type === 'code' ? (
                      <View className="code-block">
                        <Text className="text-xs text-gray-400 mb-2">{part.language}</Text>
                        <Text className="code-content">{part.content}</Text>
                      </View>
                    ) : (
                      <Text className="text-sm text-gray-800 whitespace-pre-wrap">
                        {part.content}
                      </Text>
                    )}
                  </View>
                ))}
              </View>
              <Text className="text-xs text-gray-400 mt-1">
                {new Date(msg.timestamp).toLocaleTimeString('zh-CN', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </Text>
            </View>
          </View>
        ))}

        {loading && (
          <View className="message-item assistant">
            <View className="message-avatar">
              <Bot size={24} color="#8B5CF6" />
            </View>
            <View className="message-content-wrapper">
              <View className="message-bubble">
                <View className="flex items-center gap-2">
                  <View className="typing-dot" style={{ animationDelay: '0s' }}></View>
                  <View className="typing-dot" style={{ animationDelay: '0.2s' }}></View>
                  <View className="typing-dot" style={{ animationDelay: '0.4s' }}></View>
                </View>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* 输入区域 */}
      <View className="chat-input-area">
        <View className="input-container">
          <Textarea
            style={{ width: '100%', minHeight: '80px', maxHeight: '150px', backgroundColor: 'transparent' }}
            placeholder="输入你的问题或想法..."
            value={input}
            onInput={(e) => setInput(e.detail.value)}
            maxlength={2000}
            autoHeight
          />
        </View>
        <View className="input-actions">
          <View
            className="action-btn block"
            onClick={handleClear}
          >
            <RefreshCw size={20} color="#9CA3AF" />
          </View>
          <View
            className={`send-btn ${loading ? 'disabled' : ''}`}
            onClick={!loading ? handleSend : undefined}
          >
            {loading ? (
              <Sparkles size={20} color="white" />
            ) : (
              <Send size={20} color="white" />
            )}
          </View>
        </View>
      </View>
    </View>
  )
}

export default AiChatPage
