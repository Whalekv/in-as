import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  chatWithCoze,
  createConversation,
  conversation_id,
  COZE_API_URL,
} from '../services/coze-service'

export const useUserSentMessagesStore = defineStore('userSentMessages', () => {
  const messages = ref([])
  const userMessage = ref('')
  const chatHistory = ref([
    {
      id: 1,
      title: '对话1',
      messages: [],
      lastMessage: '这是最后一条消息',
      timestamp: '2024-01-21 12:00',
    },
  ])
  const currentChatId = ref(1)

  async function createNewChat() {
    try {
      // 等待创建新会话并获取 ID
      await createConversation()

      const newChat = {
        id: Date.now(),
        title: `对话${chatHistory.value.length + 1}`,
        messages: [],
        lastMessage: '',
        timestamp: new Date().toLocaleString(),
        conversation_id: conversation_id.value, // 使用从 service 导入的 conversation_id
      }
      chatHistory.value.push(newChat)
      currentChatId.value = newChat.id
      messages.value = []
      console.log('新建对话的conversation_id:', conversation_id.value)
    } catch (error) {
      console.error('创建新对话失败:', error)
    }
  }

  console.log('conversation_id', conversation_id)

  function switchChat(chatId) {
    currentChatId.value = chatId
    const chat = chatHistory.value.find((c) => c.id === chatId)
    console.log('chatHistory11', chatHistory.value)
    if (chat) {
      messages.value = chat.messages
      conversation_id.value = chat.conversation_id // 假设每个聊天都有一个 conversation_id
    }
    console.log('messages11', chat.messages)
    console.log('COZE_API_URL123', COZE_API_URL)
  }

  async function addUserMessage(message) {
    // 先保存消息内容
    const currentMessage = message
    // 立即清空输入框
    userMessage.value = ''

    const newUserMessage = {
      type: 'user',
      content: currentMessage,
      content_type: 'text',
    }
    messages.value.push(newUserMessage)

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

      // 将当前消息更新到对应的 chatHistory
      const currentChat = chatHistory.value.find((c) => c.id === currentChatId.value)
      if (currentChat) {
        currentChat.messages = [...messages.value] // 更新对应聊天记录的消息
        currentChat.lastMessage = currentMessage // 更新最后一条消息
        currentChat.timestamp = new Date().toLocaleString() // 更新时间戳
      }
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
    chatHistory,
    currentChatId,
    createNewChat,
    switchChat,
  }
})
