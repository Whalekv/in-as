import { defineStore } from 'pinia'
import { ref } from 'vue'
import { chatWithCoze } from '../services/coze-service'

export const useUserSentMessagesStore = defineStore('userSentMessages', () => {
  const messages = ref([])
  const userMessage = ref('')

  async function addUserMessage(message) {
    // 先保存消息内容
    const currentMessage = message
    // 立即清空输入框
    userMessage.value = ''

    // 添加用户消息
    messages.value.push({
      type: 'user',
      content: currentMessage,
      content_type: 'text',
    })

    try {
      // 准备 AI 消息
      const aiMessage = {
        type: 'ai',
        content: '',
        content_type: 'text',
        isStreaming: true,
      }
      messages.value.push(aiMessage)

      // 调用 API 获取回复
      await chatWithCoze(message, (chunk) => {
        console.log('收到新的文本片段:', chunk)
        const index = messages.value.length - 1
        messages.value[index].content += chunk
        console.log('当前AI回复内容:', messages.value[index].content)
      }) //所有数据接收完成

      // 更新状态
      const index = messages.value.length - 1
      messages.value[index].isStreaming = false
    } catch (error) {
      console.error('AI响应错误:', error)
      messages.value.push({
        type: 'ai',
        content: '抱歉，我遇到了一些问题。请稍后再试。',
        content_type: 'text',
        error: true,
      })
    }
  }

  return {
    messages,
    userMessage,
    addUserMessage,
  }
})
