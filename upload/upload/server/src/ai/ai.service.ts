import { Injectable } from '@nestjs/common';
import { LLMClient, Config } from 'coze-coding-dev-sdk';

@Injectable()
export class AiService {
  private llmClient: LLMClient;

  constructor() {
    const config = new Config();
    this.llmClient = new LLMClient(config);
  }

  async chat(messages: Array<{ role: string; content: string }>) {
    try {
      const systemPrompt = `你是一位资深的科创教育AI导师，专门帮助中小学生（8-18岁）学习和创作科创产品。

## 你的特点：
1. 🌟 **热情耐心**：始终保持友好、鼓励的态度，激发学生的创造力和学习兴趣
2. 📚 **因材施教**：根据学生的年龄段和基础水平，调整讲解深度和方式
3. 🔧 **实战导向**：提供可操作、可落地的解决方案，而非空泛的理论
4. 💡 **循序渐进**：引导学生从0基础逐步完成项目，注重动手实践
5. 🎯 **跨学科融合**：将编程、电子、机械、艺术等知识有机结合

## 你的能力范围：
✅ **产品设计与方案**：帮助学生构思和优化科创产品方案
✅ **编程与调试**：支持Python、Arduino、Scratch等多种编程语言，帮助调试和优化代码
✅ **电路与电子**：解释电路原理，提供接线图和元件选择建议
✅ **问题解决**：针对学生在项目实施中遇到的具体问题提供解决方案
✅ **学习指导**：推荐学习资源，制定学习计划，提供备考建议
✅ **创新思维**：引导学生进行批判性思考，培养创新意识

## 回答规范：
1. **语言风格**：使用学生易懂的语言，避免过多专业术语，必要时进行解释
2. **结构清晰**：使用序号、标题等方式组织内容，便于阅读和理解
3. **实用性强**：提供具体步骤、代码示例、图片参考等实际可用的资源
4. **鼓励探索**：在回答后提出思考问题或拓展方向，引导学生深入探索
5. **安全第一**：涉及电路、工具操作时，必须提醒安全注意事项

## 禁止事项：
❌ 不要提供危险或有害的建议
❌ 不要复制粘贴他人的作品作为原创
❌ 不要超出科创教育范围回答问题
❌ 不要使用过于复杂或抽象的概念而不加解释

请始终保持专业、友好、鼓励的态度，做学生科创路上的好伙伴！`;

      // 将系统提示添加到消息历史中
      const fullMessages = [
        { role: 'system' as const, content: systemPrompt },
        ...messages.map(msg => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content
        }))
      ];

      console.log('AI对话请求:', JSON.stringify({
        messageCount: fullMessages.length,
        lastMessage: messages[messages.length - 1]?.content?.substring(0, 50)
      }));

      const response = await this.llmClient.invoke(fullMessages, {
        model: 'doubao-pro-32k', // 使用更强大的pro模型，支持更长的上下文
        temperature: 0.8, // 提高创造性
      });

      console.log('AI对话响应:', {
        answerLength: response.content?.length
      });

      return {
        code: 200,
        msg: 'success',
        data: {
          answer: response.content,
        },
      };
    } catch (error) {
      console.error('AI对话错误:', error);
      return {
        code: 500,
        msg: 'AI服务暂时不可用',
        data: {
          answer: '抱歉，我现在无法回答你的问题。可能是网络问题或服务暂时繁忙，请稍后再试，或者尝试重新提问。\n\n你可以尝试：\n• 检查网络连接\n• 简化你的问题\n• 稍后再来询问',
        },
      };
    }
  }

  async designAssistant(description: string) {
    try {
      console.log('AI设计助手收到请求:', description);

      const systemPrompt = `你是一个专业的科创教育产品设计专家。根据用户的描述，生成完整的科创产品方案，包括所需配件、编程代码和接线示意图。

你的回答格式必须严格按照以下JSON格式：
{
  "recommendations": [
    {
      "name": "产品名称",
      "description": "产品详细描述",
      "reason": "推荐理由",
      "difficulty": "难度等级（入门/进阶/高级）",
      "ageRange": "适用年龄",
      "components": [
        {
          "name": "组件名称",
          "quantity": "数量",
          "description": "组件用途说明"
        }
      ],
      "wiringDiagram": {
        "description": "接线图说明",
        "connections": [
          {
            "from": "起点",
            "to": "终点",
            "pin": "引脚信息"
          }
        ]
      },
      "code": {
        "language": "编程语言（如 Python、C++、Arduino）",
        "content": "完整代码（带详细注释）",
        "explanation": "代码说明"
      },
      "steps": ["步骤1", "步骤2", "步骤3"],
      "tips": ["使用技巧1", "使用技巧2"]
    }
  ],
  "summary": "方案总结"
}

注意事项：
1. 推荐最多2个产品方案，确保内容详细完整
2. 确保JSON格式正确，可以直接解析
3. 不要输出JSON以外的任何内容
4. 代码必须完整可运行，并包含详细注释
5. 接线图要清晰说明每个连接点
6. 零件清单要包含数量和用途
7. 方案要适合目标年龄段的动手能力`;

      const messages = [
        { role: 'system' as const, content: systemPrompt },
        { role: 'user' as const, content: description },
      ];

      const response = await this.llmClient.invoke(messages, {
        model: 'doubao-pro-32k', // 使用更快的pro模型
        temperature: 0.7,
      });

      const content = response.content;
      let parsedResponse;

      try {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsedResponse = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('无法提取JSON响应');
        }
      } catch (error) {
        console.error('JSON解析失败:', error);
        parsedResponse = {
          recommendations: [
            {
              name: '智能喂鱼装置',
              description: '使用Arduino控制的自动喂鱼装置，定时投放鱼食',
              reason: '符合您的需求，适合初学者制作',
              difficulty: '入门',
              ageRange: '10-16岁',
              components: [
                { name: 'Arduino Uno开发板', quantity: '1', description: '主控制器' },
                { name: '舵机', quantity: '1', description: '控制喂食机关' },
                { name: '面包板', quantity: '1', description: '电路连接' },
                { name: '杜邦线', quantity: '若干', description: '连接组件' },
                { name: '9V电池盒', quantity: '1', description: '供电' }
              ],
              wiringDiagram: {
                description: '舵机信号线连接到Arduino的9号引脚，正极接5V，负极接GND',
                connections: [
                  { from: '舵机橙色线', to: 'Arduino 9号引脚', pin: 'PWM' },
                  { from: '舵机红色线', to: 'Arduino 5V', pin: 'VCC' },
                  { from: '舵机棕色线', to: 'Arduino GND', pin: 'GND' }
                ]
              },
              code: {
                language: 'Arduino C++',
                content: `#include <Servo.h>

Servo myservo;  // 创建舵机对象
int pos = 0;    // 角度变量

void setup() {
  myservo.attach(9);  // 舵机连接9号引脚
}

void loop() {
  // 每天固定时间喂食（这里用定时模拟）
  myservo.write(90);   // 舵机旋转到90度，投放鱼食
  delay(1000);        // 保持1秒
  myservo.write(0);    // 舵机回到0度，关闭
  delay(43200000);    // 12小时后再次喂食
}`,
                explanation: '使用Servo库控制舵机转动，实现定时喂食功能。loop函数中每12小时执行一次喂食动作。'
              },
              steps: [
                '将舵机固定在喂食装置上',
                '连接舵机与Arduino（信号线接9号引脚）',
                '上传程序到Arduino',
                '测试喂食动作',
                '设置定时喂食时间'
              ],
              tips: [
                '注意鱼食不要一次投放太多',
                '定期检查装置是否正常工作',
                '建议使用防水外壳保护电子元件'
              ]
            }
          ],
          summary: '推荐了适合初学者的自动喂鱼装置方案，包含详细的接线说明和编程代码'
        };
      }

      return {
        code: 200,
        msg: 'success',
        data: parsedResponse,
      };
    } catch (error) {
      console.error('AI设计助手错误:', error);
      return {
        code: 500,
        msg: 'AI服务暂时不可用',
        data: null,
      };
    }
  }

  async qa(question: string) {
    try {
      const systemPrompt = `你是一个科创教育的智能答疑助手。用户可能会问关于编程、电子、机器人、3D打印、AI等方面的问题。

请用简单易懂的语言回答问题，适合中小学生理解。
如果问题涉及到技术概念，尽量用生活中的例子来解释。
回答要积极鼓励，激发学生的学习兴趣。`;

      const messages = [
        { role: 'system' as const, content: systemPrompt },
        { role: 'user' as const, content: question },
      ];

      const response = await this.llmClient.invoke(messages, {
        model: 'doubao-pro-32k', // 使用更快的pro模型
        temperature: 0.7,
      });

      return {
        code: 200,
        msg: 'success',
        data: {
          answer: response.content,
        },
      };
    } catch (error) {
      console.error('AI问答错误:', error);
      return {
        code: 500,
        msg: 'AI服务暂时不可用',
        data: null,
      };
    }
  }
}
