import { View, Text, ScrollView, Textarea } from '@tarojs/components'
import { Sparkles, Palette, Zap, ChevronRight, Info, Send, Loader, ArrowLeft, MessageSquare } from 'lucide-react-taro'
import Taro, { useLoad } from '@tarojs/taro'
import { useState } from 'react'
import { Network } from '@/network'
import './index.css'

const CustomPage = () => {
  const [aiInput, setAiInput] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [aiResult, setAiResult] = useState<any>(null)

  useLoad(() => {
    Taro.setNavigationBarTitle({ title: '定制工坊' })
  })

  const handleAIDesign = async () => {
    if (!aiInput.trim()) {
      Taro.showToast({ title: '请输入您的想法', icon: 'none' })
      return
    }

    setAiLoading(true)
    setAiResult(null)

    try {
      const res = await Network.request({
        url: '/api/ai/design-assistant',
        method: 'POST',
        data: { description: aiInput }
      })

      console.log('AI响应:', res)

      if (res.data.code === 200) {
        setAiResult(res.data.data)
        Taro.showToast({ title: 'AI推荐成功', icon: 'success' })
      } else {
        console.error('AI响应错误:', res)
        Taro.showToast({ title: res.data.msg || 'AI服务异常', icon: 'none' })
      }
    } catch (error) {
      console.error('AI请求错误:', error)
      Taro.showToast({ title: '网络错误，请重试', icon: 'none' })
    } finally {
      setAiLoading(false)
    }
  }

  const handleAIChat = () => {
    Taro.navigateTo({ url: '/pages/ai-chat/index' })
  }

  const handleCustom = (type: string) => {
    Taro.showToast({ title: `${type}功能开发中`, icon: 'none' })
  }

  return (
    <View className="custom-page">
      {/* 自定义导航栏 */}
      <View className="custom-navbar">
        <View className="navbar-content">
          <View className="navbar-left block" onClick={() => Taro.switchTab({ url: '/pages/index/index' })}>
            <ArrowLeft size={24} color="#333" />
          </View>
          <Text className="navbar-title">定制工坊</Text>
          <View className="navbar-right block" onClick={handleAIChat}>
            <MessageSquare size={24} color="#8B5CF6" />
          </View>
        </View>
      </View>

      {/* Banner */}
      <View className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-8">
        <Text className="block text-2xl font-bold text-white mb-2">定制你的专属作品</Text>
        <Text className="block text-sm text-blue-100">
          选择基础套件，添加个性化元素，创造独一无二的科创产品
        </Text>
      </View>

      <ScrollView className="custom-content" scrollY>
        {/* AI辅助设计 */}
        <View className="px-4 py-4">
          <View className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 mb-4">
            <View className="flex items-center gap-3 mb-4">
              <View className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                <Sparkles size={24} color="#2563EB" />
              </View>
              <View className="flex-1">
                <Text className="block text-lg font-bold text-gray-900 mb-1">AI辅助设计</Text>
                <Text className="block text-xs text-gray-600">
                  描述你的想法，AI推荐最适合的科创产品组合
                </Text>
              </View>
            </View>

            {/* 输入框 */}
            <View className="bg-white rounded-xl p-4 mb-3">
              <Textarea
                style={{ width: '100%', minHeight: '100px', backgroundColor: 'transparent' }}
                placeholder="例如：我想做一个能自动喂鱼的装置，使用编程控制"
                value={aiInput}
                onInput={(e) => setAiInput(e.detail.value)}
                maxlength={500}
              />
            </View>

            {/* 发送按钮 */}
            <View
              className={`flex items-center justify-center gap-2 bg-blue-600 rounded-xl py-3 block ${aiLoading ? 'opacity-70' : ''}`}
              onClick={!aiLoading ? handleAIDesign : undefined}
            >
              {aiLoading ? (
                <>
                  <Loader size={20} color="white" className="animate-spin" />
                  <Text className="block text-white font-medium">AI思考中...</Text>
                </>
              ) : (
                <>
                  <Send size={20} color="white" />
                  <Text className="block text-white font-medium">获取推荐</Text>
                </>
              )}
            </View>

            {/* AI 推荐结果 */}
            {aiResult && aiResult.recommendations && aiResult.recommendations.length > 0 && (
              <View className="mt-4">
                <Text className="block text-sm font-semibold text-gray-900 mb-3">AI推荐方案：</Text>
                {aiResult.recommendations.map((rec: any, index: number) => (
                  <View key={index} className="bg-white rounded-xl p-4 mb-4">
                    {/* 标题和难度 */}
                    <View className="flex justify-between items-start mb-3">
                      <Text className="block text-base font-semibold text-gray-800 flex-1">{rec.name}</Text>
                      <View className="bg-blue-100 px-2 py-1 rounded ml-2">
                        <Text className="text-xs text-blue-600">{rec.difficulty}</Text>
                      </View>
                    </View>

                    <Text className="block text-sm text-gray-600 mb-3">{rec.description}</Text>
                    <Text className="block text-sm text-gray-500 mb-3">{rec.reason}</Text>

                    {/* 零件清单 */}
                    <View className="mb-4">
                      <Text className="block text-sm font-semibold text-gray-800 mb-2">📦 零件清单</Text>
                      <View className="space-y-2">
                        {rec.components?.map((comp: any, idx: number) => (
                          <View key={idx} className="bg-gray-50 rounded-lg p-2 flex justify-between items-center">
                            <View>
                              <Text className="block text-sm text-gray-800">{comp.name}</Text>
                              <Text className="block text-xs text-gray-500">{comp.description}</Text>
                            </View>
                            <View className="bg-blue-100 px-2 py-0.5 rounded">
                              <Text className="text-xs text-blue-600 font-medium">{comp.quantity}</Text>
                            </View>
                          </View>
                        ))}
                      </View>
                    </View>

                    {/* 接线图说明 */}
                    {rec.wiringDiagram && (
                      <View className="mb-4">
                        <Text className="block text-sm font-semibold text-gray-800 mb-2">🔌 接线说明</Text>
                        <Text className="block text-sm text-gray-600 mb-2">{rec.wiringDiagram.description}</Text>
                        <View className="space-y-1">
                          {rec.wiringDiagram.connections?.map((conn: any, idx: number) => (
                            <View key={idx} className="bg-orange-50 rounded px-2 py-1 flex items-center gap-2">
                              <Text className="text-xs text-gray-500">{conn.from}</Text>
                              <Text className="text-xs text-orange-600">→</Text>
                              <Text className="text-xs text-gray-500">{conn.to}</Text>
                              <Text className="text-xs text-gray-400">({conn.pin})</Text>
                            </View>
                          ))}
                        </View>
                      </View>
                    )}

                    {/* 代码 */}
                    {rec.code && (
                      <View className="mb-4">
                        <Text className="block text-sm font-semibold text-gray-800 mb-2">💻 代码 ({rec.code.language})</Text>
                        <View className="bg-gray-900 rounded-lg p-3 overflow-x-auto">
                          <Text className="text-xs text-green-400 font-mono whitespace-pre">{rec.code.content}</Text>
                        </View>
                        <Text className="block text-xs text-gray-500 mt-2">💡 {rec.code.explanation}</Text>
                      </View>
                    )}

                    {/* 制作步骤 */}
                    {rec.steps && rec.steps.length > 0 && (
                      <View className="mb-4">
                        <Text className="block text-sm font-semibold text-gray-800 mb-2">📋 制作步骤</Text>
                        <View className="space-y-1">
                          {rec.steps.map((step: string, idx: number) => (
                            <View key={idx} className="flex gap-2">
                              <Text className="text-xs text-blue-600 font-medium">{idx + 1}.</Text>
                              <Text className="text-xs text-gray-600 flex-1">{step}</Text>
                            </View>
                          ))}
                        </View>
                      </View>
                    )}

                    {/* 使用技巧 */}
                    {rec.tips && rec.tips.length > 0 && (
                      <View className="mb-2">
                        <Text className="block text-sm font-semibold text-gray-800 mb-2">💡 使用技巧</Text>
                        <View className="space-y-1">
                          {rec.tips.map((tip: string, idx: number) => (
                            <View key={idx} className="bg-yellow-50 rounded px-2 py-1">
                              <Text className="text-xs text-yellow-800">• {tip}</Text>
                            </View>
                          ))}
                        </View>
                      </View>
                    )}

                    <View className="flex items-center gap-2 mt-4">
                      <Text className="text-xs text-gray-400">适用年龄：</Text>
                      <Text className="text-xs text-blue-600 font-medium">{rec.ageRange}</Text>
                    </View>
                  </View>
                ))}
                {aiResult.summary && (
                  <View className="bg-blue-50 rounded-xl p-3">
                    <Text className="block text-xs text-blue-800">{aiResult.summary}</Text>
                  </View>
                )}
              </View>
            )}
          </View>
        </View>

        {/* 定制选项 */}
        <View className="px-4 py-4">
          <Text className="block text-lg font-bold text-gray-900 mb-4">开始定制</Text>

          <View className="space-y-3">
            {/* 基础套件 */}
            <View
              className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-4 block"
              onClick={() => handleCustom('基础套件')}
            >
              <View className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center">
                <Palette size={32} color="#2563EB" />
              </View>
              <View className="flex-1">
                <Text className="block text-base font-semibold text-gray-800 mb-1">基础套件</Text>
                <Text className="block text-xs text-gray-500">选择核心控制板、传感器</Text>
              </View>
              <ChevronRight size={20} color="#9CA3AF" />
            </View>

            {/* 外观定制 */}
            <View
              className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-4 block"
              onClick={() => handleCustom('外观定制')}
            >
              <View className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center">
                <Sparkles size={32} color="#8B5CF6" />
              </View>
              <View className="flex-1">
                <Text className="block text-base font-semibold text-gray-800 mb-1">外观定制</Text>
                <Text className="block text-xs text-gray-500">颜色、激光雕刻文字、贴纸</Text>
              </View>
              <ChevronRight size={20} color="#9CA3AF" />
            </View>

            {/* 功能扩展 */}
            <View
              className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-4 block"
              onClick={() => handleCustom('功能扩展')}
            >
              <View className="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center">
                <Zap size={32} color="#F59E0B" />
              </View>
              <View className="flex-1">
                <Text className="block text-base font-semibold text-gray-800 mb-1">功能扩展</Text>
                <Text className="block text-xs text-gray-500">添加模块、升级配件</Text>
              </View>
              <ChevronRight size={20} color="#9CA3AF" />
            </View>
          </View>
        </View>

        {/* 热门定制案例 */}
        <View className="px-4 py-4">
          <View className="flex justify-between items-center mb-4">
            <Text className="block text-lg font-bold text-gray-900">热门定制案例</Text>
            <View className="block text-sm text-blue-600">查看更多</View>
          </View>

          <View
            className="bg-white rounded-2xl p-4 shadow-sm mb-3 block"
            onClick={() => handleCustom('校园气象站')}
          >
            <Text className="block text-base font-semibold text-gray-800 mb-2">
              校园气象站自动监测系统
            </Text>
            <View className="flex gap-2 mb-2">
              <Text className="block bg-blue-50 text-xs text-blue-600 px-2 py-1 rounded-full">小学</Text>
              <Text className="block bg-green-50 text-xs text-green-600 px-2 py-1 rounded-full">环保</Text>
            </View>
            <Text className="block text-xs text-gray-500">
              使用温度、湿度传感器，实时监测校园环境
            </Text>
          </View>

          <View
            className="bg-white rounded-2xl p-4 shadow-sm block"
            onClick={() => handleCustom('智能家居模型')}
          >
            <Text className="block text-base font-semibold text-gray-800 mb-2">
              智能家居模型控制系统
            </Text>
            <View className="flex gap-2 mb-2">
              <Text className="bg-purple-50 text-xs text-purple-600 px-2 py-1 rounded-full">初中</Text>
              <Text className="bg-orange-50 text-xs text-orange-600 px-2 py-1 rounded-full">物联网</Text>
            </View>
            <Text className="block text-xs text-gray-500">
              通过手机APP远程控制灯光、窗帘等家居设备
            </Text>
          </View>
        </View>

        {/* 帮助提示 */}
        <View className="px-4 py-4">
          <View className="bg-blue-50 rounded-2xl p-4 flex items-start gap-3">
            <Info size={20} color="#2563EB" />
            <Text className="block text-sm text-blue-800 flex-1">
              定制作品预计3-5个工作日发货，特殊工艺可能需要更长时间。如有疑问请联系客服。
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

export default CustomPage
