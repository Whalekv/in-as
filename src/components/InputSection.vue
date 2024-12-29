<script setup>
import { useUserSentMessagesStore } from '../stores/userSentMessages'

const userSentMessagesStore = useUserSentMessagesStore()
const handleSent = async () => {
  if (!userSentMessagesStore.userMessage.trim()) return
  console.log('用户输入的内容', userSentMessagesStore.userMessage)
  await userSentMessagesStore.addUserMessage(userSentMessagesStore.userMessage)
}
</script>

<template>
  <!-- 输入部分 -->
  <div class="input-area">
    <div class="search-box">
      <el-input
        v-model="userSentMessagesStore.userMessage"
        style="width: 800px"
        :autosize="{ minRows: 2, maxRows: 4 }"
        type="textarea"
        size="large"
        placeholder="Please Input"
        @keyup.enter.prevent="handleSent"
      />
    </div>
    <div class="search-button">
      <el-button type="primary" size="large" @click="handleSent">Send</el-button>
    </div>
  </div>
</template>

<style scoped>
.input-area {
  display: flex;
  height: 100%;
}
.el-input {
  resize: none; /* 禁止用户调整大小 */
}
.search-box {
  float: left;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.search-button {
  margin-left: 20px;
  margin-right: 20px;
}
</style>
