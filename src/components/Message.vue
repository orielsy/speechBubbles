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
  /*background: linear-gradient(45deg, #e20473 0%, #00d0a8 100%);*/
  background: #fff;
  border-radius: 8px;
  color: #000;
  box-shadow: 4px 8px 12px rgba(0, 0, 0, 0.5);
  margin: 10px 0;
  padding: 8px 12px;
  position: relative;
  font-size: 38px;

  &:first-of-type {
    margin-top: 0;
  }
  &:after {
    content: '';
    position: absolute;
    bottom: 8px;
    right: -8px;
    width: 0;
    height: 0;
    border-top: 14px solid transparent;
    border-bottom: 14px solid transparent;
    border-left: 14px solid #fff;
  }
  &.pink {
    background: #e20473;
    color: #fff;
    &:after {
      border-left: 14px solid #e20473;
    }
  }
  &.marine {
    background: #00d0a8;
    color: #000;
    &:after {
      border-left: 14px solid #00d0a8;
    }
  }
}
</style>
