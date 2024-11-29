const COZE_API_CREATCONVERSATION_URL = 'https://api.coze.cn/v1/conversation/create'
const COZE_KEY = 'pat_7fkzMiEFmB0gcEjrFiM6Exa2O317TsmgWDoq0lbjr7dre3zDGCIihARO2Lp64XEJ'
const BOT_ID = '7442210806965813258'

//创建会话接口
export async function createConversation() {
  try {
    const response = await fetch(COZE_API_CREATCONVERSATION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${COZE_KEY}`,
      },
    })
    if (!response.ok) {
      throw new Error(`API1调用失败: ${response.status}`)
    }
    const data = await response.json()
    const id = data.data.id
    console.log('返回的会话ID:', id)
    console.log('API1响应状态:', response.status)
    return id
  } catch (error) {
    console.error('Coze API1调用错误:', error)
    throw error
  }
}

const COZE_API_URL = `https://api.coze.cn/v3/chat?conversation_id=7442211537055678499`

export async function chatWithCoze(message, onChunk) {
  try {
    const response = await fetch(COZE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${COZE_KEY}`,
      },
      body: JSON.stringify({
        bot_id: BOT_ID,
        user_id: '123456789',
        stream: true,
        auto_save_history: true,
        additional_messages: [
          {
            role: 'user',
            content: message,
            content_type: 'text',
          },
        ],
      }),
    })

    if (!response.ok) {
      throw new Error(`API2调用失败: ${response.status}`)
    }

    console.log('API2响应状态:', response.status)

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) {
        console.log('数据流读取完成')
        break
      }

      const chunk = decoder.decode(value, { stream: true })
      console.log('原始数据块:', chunk) //chunk是扣子api测试时输出的原始的流式数据的数据块

      buffer += chunk
      console.log('buffer:', buffer)
      const lines = buffer.split('\n') //根据\n分行
      console.log('lines:', lines)
      buffer = lines.pop() || '' //将lines中最后一行（如果这一行不完整的话）保存到buffer
      console.log('buffer3:', buffer)

      for (const line of lines) {
        // trim() 移除字符串两端的空白字符，包括：
        // - 空格
        // - 制表符 \t
        // - 换行符 \n
        // - 回车符 \r 等
        if (line.trim() === '') continue //跳过空行

        console.log('处理行:', line)
        // /^event:(.+)$/
        // ^ : 匹配行的开始
        // event: : 精确匹配字符串 "event:"
        // (.+) : 捕获组，匹配一个或多个任意字符
        // $ : 匹配行的结束
        const eventMatch = line.match(/^event:(.+)$/)
        const eventType = eventMatch ? eventMatch[1] : null
        console.log('事件类型:', eventType)

        if (line.startsWith('data:')) {
          try {
            //slice(5) 截取从第6个字符开始到结束的所有内容
            // 将 JSON 字符串转换为 JavaScript 对象
            //解析完成后就可以使用 JavaScript 对象了
            const jsonData = JSON.parse(line.slice(5))
            console.log('解析后的JSON:', jsonData)

            if (jsonData.type === 'answer' && jsonData.content) {
              onChunk(jsonData.content) //回调函数
            }
          } catch (e) {
            console.error('解析响应数据失败:', e)
          }
        }
      }
    }
  } catch (error) {
    console.error('Coze API调用错误:', error)
    throw error
  }
}
