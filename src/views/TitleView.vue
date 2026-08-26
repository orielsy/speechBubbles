<template>
  <div class="wrapper">
    <div class="title-bar">Title Graphic (renders off screen)</div>
    <p
      class="message"
      :class="{ show: showTitle }"
      v-if="store.videoTitle.length > 0">
      {{ store.videoTitle }}
    </p>
  </div>
</template>
<script setup>
import { ref, onMounted, onBeforeMount, watch } from 'vue';
import { useStore } from '@/stores/chatterStore';
import { storeToRefs } from 'pinia';

const store = useStore();
const { bannerMsg, videoTitle } = storeToRefs(store);

const emit = defineEmits(['mounted', 'beforeMount']);
const showTitle = ref(false);

let interval = null;
let timeout = null;

onBeforeMount(() => {
  emit('beforeMount');
});
onMounted(() => {
  emit('mounted');
  startTimer();
});

watch(bannerMsg, () => {
  startTimer();
});
watch(videoTitle, () => {
  startTimer();
});

function startTimer() {
  if (interval) clearTimeout(interval);
  if (timeout) clearTimeout(timeout);
  interval = interval = null;
  showTitle.value = true;

  interval = setTimeout(() => {
    showTitle.value = false;
    timeout = setTimeout(() => {
      startTimer();
    }, 180000);
  }, 10000);
}
</script>

<style scoped>
.title-bar {
  font-size: 25px;
  max-height: 40px;
  text-align: center;
  background: red;
  color: #fff;
}
.wrapper {
  border: 1px solid red;
  padding: 0px 0px 30px;
  overflow: hidden;
}
.message {
  margin: 40px 40px 0;
  min-width: 600px;
  display: inline-block;
  vertical-align: middle;
  height: 107px;
  background: linear-gradient(45deg, #e20473 0%, #00d0a8 100%);

  border-bottom-right-radius: 50px;
  border-bottom-left-radius: 50px;
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.7);
  font-size: 57px;
  line-height: 75px;
  font-weight: bold;
  text-shadow: 0px 0px 4px #222;
  color: #ffffff;
  padding: 12px 46px;
  position: relative;
  transform: translateY(-164px);
  transition: all 350ms cubic-bezier(0.68, -0.6, 0.32, 1.6); /*ease-in-out-back*/

  &.show {
    transform: translateY(0) !important;
  }

  &.alternate {
    background: white;
    border: none;

    padding: 12px;
    & span {
      box-shadow: 0px 0px 6px #666;
      display: block;
      padding: 0 24px;
      border-radius: 40px;
      border: 2px solid #ccc;
    }
  }
  &:before,
  &:after {
    content: '';
    position: absolute;
    top: -14px;
    left: -14px;
    right: -14px;
    bottom: -14px;
    border: 8px solid #e20473;
    transition: all 0.5s;
    animation: clippath 5s infinite linear;
    border-bottom-right-radius: 60px;
    border-bottom-left-radius: 60px;
  }
  &:after {
    border: 8px solid #00d0a8;
    animation: clippath 5s infinite -2.5s linear;
  }
}
@keyframes clippath {
  0%,
  100% {
    clip-path: inset(0 0 95% 0);
  }
  25% {
    clip-path: inset(0 95% 0 0);
  }
  50% {
    clip-path: inset(95% 0 0 0);
  }
  75% {
    clip-path: inset(0 0 0 95%);
  }
}
</style>
