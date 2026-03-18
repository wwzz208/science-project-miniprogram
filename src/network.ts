import Taro from '@tarojs/taro'

/**
 * 网络请求模块
 * 封装 Taro.request、Taro.uploadFile、Taro.downloadFile，自动添加项目域名前缀
 * 如果请求的 url 以 http:// 或 https:// 开头，则不会添加域名前缀
 *
 * IMPORTANT: 项目已经全局注入 PROJECT_DOMAIN
 * IMPORTANT: 除非你需要添加全局参数，如给所有请求加上 header，否则不能修改此文件
 */
export namespace Network {
    const createUrl = (url: string): string => {
        if (url.startsWith('http://') || url.startsWith('https://')) {
            return url
        }

        // H5 开发环境使用相对路径，让 Vite 代理生效
        // 注意：H5 开发环境始终使用相对路径，避免使用编译时注入的 PROJECT_DOMAIN
        if (process.env.TARO_ENV === 'h5') {
            console.log('[Network] H5 环境使用相对路径:', url)
            return url
        }

        // 微信小程序开发环境使用 localhost（需要在开发者工具中关闭域名校验）
        if (process.env.TARO_ENV === 'weapp') {
            const devUrl = `http://localhost:3000${url}`
            console.log('[Network] 微信小程序开发环境使用 localhost:', devUrl)
            return devUrl
        }

        console.log('[Network] 非 H5 环境使用完整路径:', PROJECT_DOMAIN + url)
        return `${PROJECT_DOMAIN}${url}`
    }

    export const request: typeof Taro.request = option => {
        const finalUrl = createUrl(option.url)
        console.log('[Network] request:', option.method, finalUrl, option.data)
        return Taro.request({
            ...option,
            url: finalUrl,
        })
    }

    export const uploadFile: typeof Taro.uploadFile = option => {
        const finalUrl = createUrl(option.url)
        console.log('[Network] uploadFile:', finalUrl)
        return Taro.uploadFile({
            ...option,
            url: finalUrl,
        })
    }

    export const downloadFile: typeof Taro.downloadFile = option => {
        const finalUrl = createUrl(option.url)
        console.log('[Network] downloadFile:', finalUrl)
        return Taro.downloadFile({
            ...option,
            url: finalUrl,
        })
    }
}
