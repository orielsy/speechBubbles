<script setup>
import { ref, onMounted, onBeforeMount } from 'vue';
const props = defineProps({
  msg: {
    type: String,
    required: true
  },
  color: {
    type: String,
    defaut: 'white',
    required: false
  }
});
const emit = defineEmits(['mounted', 'beforeMount']);
onBeforeMount(() => {
  emit('beforeMount');
});
onMounted(() => {
  emit('mounted');
});
</script>

<template>
  <p
    class="message"
    :class="`${color}`">
    {{ msg }}
  </p>
</template>

<style scoped>
.message {
  background: #ffffff;
  border-radius: 8px;
  color: #000;
  box-shadow: 4px 8px 12px rgba(0, 0, 0, 0.5);
  margin: 10px 0;
  padding: 8px 12px;
  position: relative;
  font-size: 38px;

  &.pink {
    background: #e20473;
    color: #fff;
  }
  &.marine {
    background: #00d0a8;
    color: #000;
  }
}
</style>
