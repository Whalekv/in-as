<script setup>
import InputSection from '../components/InputSection.vue'
import AIChatInterface from '../components/AIChatInterface.vue'
import SideDrawer from '../components/SideDrawer.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const handleRedirect = () => {
  router.push({
    name: 'setting',
  })
}
</script>

<template>
  <div class="chat-area">
    <div class="ai">
      <el-scrollbar>
        <AIChatInterface />
      </el-scrollbar>
    </div>
    <div class="bottom-area">
      <InputSection />
      <div class="setting-button">
        <el-button type="primary" size="large" @click="handleRedirect">Setting</el-button>
      </div>
      <SideDrawer />
    </div>
  </div>
</template>

<style scoped>
.chat-area {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column; /* 添加这行 */
}
.ai {
  flex: 1; /* 添加这行，让聊天区域占据剩余空间 */
  overflow-y: auto;
}
.bottom-area {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}
</style>
