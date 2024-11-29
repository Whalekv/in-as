<script lang="ts" setup>
import { ref } from 'vue'
import { useUserSentMessagesStore } from '../stores/userSentMessages'

const drawer = ref(false)
const store = useUserSentMessagesStore()

const handleNewChat = () => {
  store.createNewChat()
}
const handleChatSelect = (chatId) => {
  store.switchChat(chatId)
}
</script>

<template>
  <el-button type="primary" size="large" style="margin-left: 16px" @click="drawer = true">
    历史聊天
  </el-button>
  <el-drawer v-model="drawer" title="历史聊天">
    <div class="drawer-content">
      <el-button type="primary" @click="handleNewChat" style="width: 100%; margin-bottom: 20px">
        新建对话
      </el-button>
      <el-card
        v-for="chat in store.chatHistory"
        :key="chat.id"
        class="chat-card"
        :class="{ active: chat.id === store.currentChatId }"
        @click="handleChatSelect(chat.id)"
      >
      </el-card>
    </div>
  </el-drawer>
</template>

<style scoped>
.drawer-content {
  padding: 20px;
}

.chat-card {
  margin-bottom: 10px;
  cursor: pointer;
  transition: all 0.3s;
}

.chat-card:hover {
  transform: translateX(5px);
}

.chat-card.active {
  border-left: 4px solid #409eff;
}

.chat-info {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.chat-title {
  font-weight: bold;
}

.chat-last-message {
  font-size: 0.9em;
  color: #666;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.chat-time {
  font-size: 0.8em;
  color: #999;
}
</style>
