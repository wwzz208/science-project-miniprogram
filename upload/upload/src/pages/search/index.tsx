import { View, Text, ScrollView, Input } from '@tarojs/components'
import { Search, X, ShoppingBag } from 'lucide-react-taro'
import Taro, { useLoad } from '@tarojs/taro'
import { useState } from 'react'
import { Network } from '@/network'
import './index.css'

interface Project {
  id: number
  name: string
  category: string
  ageRange: string
  teacherName: string
}

const SearchPage = () => {
  const [keyword, setKeyword] = useState('')
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const hotSearch = ['编程机器人', '3D打印机', 'Arduino', '创客套件']
  const [searchResults, setSearchResults] = useState<Project[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [loading, setLoading] = useState(false)

  useLoad(() => {
    Taro.setNavigationBarTitle({ title: '搜索' })
    loadSearchHistory()
  })

  const loadSearchHistory = () => {
    const history = Taro.getStorageSync('searchHistory') || []
    setSearchHistory(history)
  }

  const handleSearch = async () => {
    if (!keyword.trim()) {
      Taro.showToast({ title: '请输入搜索关键词', icon: 'none' })
      return
    }

    setLoading(true)
    setIsSearching(true)

    try {
      // 保存搜索历史
      const history = [...searchHistory]
      const index = history.indexOf(keyword)
      if (index > -1) {
        history.splice(index, 1)
      }
      history.unshift(keyword)
      if (history.length > 10) history.pop()
      setSearchHistory(history)
      Taro.setStorageSync('searchHistory', history)

      // 调用后端搜索接口
      const res = await Network.request({
        url: '/api/products',
        data: { keyword }
      })

      if (res.data.code === 200) {
        setSearchResults(res.data.data.list)
      } else {
        Taro.showToast({ title: res.data.msg || '搜索失败', icon: 'none' })
      }
    } catch (error) {
      console.error('搜索错误:', error)
      Taro.showToast({ title: '网络错误，请重试', icon: 'none' })
    } finally {
      setLoading(false)
    }
  }

  const handleClearHistory = () => {
    Taro.showModal({
      title: '清空历史',
      content: '确定要清空搜索历史吗？',
      success: (res) => {
        if (res.confirm) {
          setSearchHistory([])
          Taro.removeStorageSync('searchHistory')
        }
      },
    })
  }

  const handleHistoryClick = (kw: string) => {
    setKeyword(kw)
    handleSearch()
  }

  const handleHotClick = (kw: string) => {
    setKeyword(kw)
    handleSearch()
  }

  const handleClearInput = () => {
    setKeyword('')
    setIsSearching(false)
    setSearchResults([])
  }

  const handleProductClick = (id: number) => {
    Taro.navigateTo({
      url: `/pages/product-detail/index?id=${id}`
    })
  }

  return (
    <View className="search-page">
      {/* 搜索框 */}
      <View className="search-bar">
        <View className="search-input-wrapper">
          <Search size={18} color="#9CA3AF" />
          <Input
            style={{ flex: 1, backgroundColor: 'transparent' }}
            placeholder="搜索科普项目..."
            value={keyword}
            onInput={(e) => setKeyword(e.detail.value)}
            onConfirm={handleSearch}
            confirmType="search"
          />
          {keyword && (
            <View className="clear-btn block" onClick={handleClearInput}>
              <X size={16} color="#9CA3AF" />
            </View>
          )}
        </View>
        <View className="search-btn block" onClick={handleSearch}>
          <Text className="search-btn-text">搜索</Text>
        </View>
      </View>

      <ScrollView className="search-content" scrollY>
        {/* 搜索结果 */}
        {isSearching && (
          <View className="search-results">
            {loading ? (
              <View className="loading-state">
                <Text className="block text-gray-400 text-sm text-center">搜索中...</Text>
              </View>
            ) : searchResults.length > 0 ? (
              <View className="result-list">
                <Text className="block text-sm text-gray-500 mb-3">找到 {searchResults.length} 个项目</Text>
                {searchResults.map((project) => (
                  <View
                    key={project.id}
                    className="result-item block"
                    onClick={() => handleProductClick(project.id)}
                  >
                    <View className="result-item-content">
                      <View className="result-icon">
                        <ShoppingBag size={32} color="#2563EB" />
                      </View>
                      <View className="result-info">
                        <Text className="result-name">{project.name}</Text>
                        <View className="flex items-center gap-2">
                          <Text className="text-xs text-gray-400">适合 {project.ageRange}</Text>
                          <Text className="text-xs text-blue-600">{project.teacherName}指导</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <View className="empty-state">
                <Text className="block text-gray-400 text-sm text-center">暂无相关项目</Text>
              </View>
            )}
          </View>
        )}

        {/* 搜索历史和热门搜索 */}
        {!isSearching && (
          <View className="search-suggestions">
            {/* 搜索历史 */}
            {searchHistory.length > 0 && (
              <View className="suggestion-section">
                <View className="suggestion-header">
                  <Text className="suggestion-title">搜索历史</Text>
                  <View className="clear-history-btn block" onClick={handleClearHistory}>
                    <Text className="clear-history-text">清空</Text>
                  </View>
                </View>
                <View className="suggestion-tags">
                  {searchHistory.map((item, index) => (
                    <View
                      key={index}
                      className="suggestion-tag block"
                      onClick={() => handleHistoryClick(item)}
                    >
                      <Text className="suggestion-tag-text">{item}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* 热门搜索 */}
            <View className="suggestion-section">
              <Text className="suggestion-title">热门搜索</Text>
              <View className="suggestion-tags">
                {hotSearch.map((item, index) => (
                  <View
                    key={index}
                    className="suggestion-tag block"
                    onClick={() => handleHotClick(item)}
                  >
                    <Text className="suggestion-tag-text">{item}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  )
}

export default SearchPage
