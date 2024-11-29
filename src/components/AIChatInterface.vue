<template>
  <div class="chat-container">
    <div class="messages-container" ref="messagesContainer">
      <div v-for="(message, index) in messages" :key="index" :class="['message', message.type]">
        <div class="message-content" :class="{ streaming: message.isStreaming }">
          {{ message.content }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useUserSentMessagesStore } from '../stores/userSentMessages'
import { storeToRefs } from 'pinia'

const store = useUserSentMessagesStore()
const { messages } = storeToRefs(store)
</script>

<style scoped>
.chat-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.messages-container {
  overflow-y: auto;
  padding: 20px;
}
.message {
  margin: 10px;
  padding: 10px;
  border-radius: 8px;
  width: fit-content;
}

.message.user {
  background-color: #e3f2fd;
  margin-left: auto;
  max-width: 30%;
}

.message.ai {
  background-color: #f5f5f5;
  margin-right: auto;
  max-width: 30%;
}

.streaming {
  opacity: 0.7;
}
</style>
