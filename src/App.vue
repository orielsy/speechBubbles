<template>
  <router-view></router-view>
</template>
<script setup>
import { ref, onMounted, onBeforeMount } from 'vue';
import { useStore } from '@/stores/chatterStore';

const store = useStore();

window.electronAPI?.onUpdateCounter((value) => {
  window.electronAPI.counterValue(value);
  console.log(value);
  store.commands.push(value);
});
</script>

<style lang="scss">
body {
  background: transparent;
}
#app {
}
</style>
