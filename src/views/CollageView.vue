<template>
  <div class="collage">
    <TitleView style="width: 1300px"></TitleView>
    <BannerView style="width: 1300px"></BannerView>
    <ChatView style="width: 780px"></ChatView>
    <CaptionsView style="width: 1300px"></CaptionsView>
    <CommandsView style="width: 300px"></CommandsView>
  </div>
</template>
<script setup>
import { ref, onMounted, onBeforeMount, watch } from 'vue';

import ChatView from '@/views/ChatView.vue';
import BannerView from '@/views/BannerView.vue';
import TitleView from '@/views/TitleView.vue';
import CaptionsView from '@/views/CaptionsView.vue';
import CommandsView from '@/views/CommandsView.vue';

const emit = defineEmits(['mounted', 'beforeMount']);

onBeforeMount(() => {
  emit('beforeMount');
});
onMounted(() => {
  emit('mounted');
});
</script>

<style scoped>
.collage {
  padding: 0 20px;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-content: space-around;
  gap: 10px;
}
</style>
