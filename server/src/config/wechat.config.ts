import { ConfigService } from '@nestjs/config';

export interface WechatConfig {
  appId: string;
  appSecret: string;
}

// 使用 ConfigService 动态获取微信配置
export const getWechatConfig = (configService: ConfigService): WechatConfig => {
  return {
    appId: configService.get<string>('TARO_APP_WEAPP_APPID') || '',
    appSecret: configService.get<string>('WECHAT_APP_SECRET') || '',
  };
};

// 验证配置是否完整
export const validateWechatConfig = (configService: ConfigService): boolean => {
  const config = getWechatConfig(configService);
  return !!(config.appId && config.appSecret);
};
