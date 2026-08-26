<template>
  <div class="wrapper">
    <div class="title-bar">Banner Graphic (renders off screen)</div>
    <p
      class="message"
      ref="bannerRef"
      :class="{ show: showBanner }"
      v-if="store.bannerMsg.length > 0"
      :style="`transform: translateX(-${bannerMsgWidth}px);`">
      <span
        class="title"
        v-if="title">
        <span class="text">{{ title }}</span>
      </span>
      <span
        class="body"
        v-if="body"
        >{{ body }}</span
      >
    </p>
  </div>
</template>
<script setup>
import { ref, onMounted, onBeforeMount, watch, nextTick } from 'vue';
import { useStore } from '@/stores/chatterStore';
import { storeToRefs } from 'pinia';

const store = useStore();
const { bannerMsg, videoTitle } = storeToRefs(store);
const emit = defineEmits(['mounted', 'beforeMount']);
const showBanner = ref(false);
const bannerRef = ref(null);
const bannerMsgWidth = ref(0);

const title = ref(false);
const body = ref(false);

let interval = null;
let timeout = null;

const tone = new Audio('./sounds/tone-beep-slower.wav');
const toneReverb = new Audio('./sounds/tone-beep-slower-reverb.wav');

onBeforeMount(() => {
  emit('beforeMount');
});
onMounted(() => {
  emit('mounted');
  solveText();
  startTimer();
  toneReverb.play();
});

watch(bannerMsg, () => {
  solveText();
  startTimer();
  toneReverb.play();
});
watch(videoTitle, () => {
  solveText();
  startTimer();
  toneReverb.play();
});
function solveText() {
  let fullMsg = bannerMsg.value.split(',');
  title.value = fullMsg.length > 1 ? fullMsg[0] : false;
  body.value = fullMsg.length > 1 ? fullMsg[1] : fullMsg[0];
  nextTick(() => {
    bannerMsgWidth.value = bannerRef.value.getBoundingClientRect().width + 100;
  });
}

function startTimer() {
  if (interval) clearTimeout(interval);
  if (timeout) clearTimeout(timeout);
  interval = interval = null;
  showBanner.value = true;

  interval = setTimeout(() => {
    showBanner.value = false;
    timeout = setTimeout(() => {
      startTimer();
      tone.play();
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
  border: 4px solid red;
  overflow: hidden;
}

.message {
  margin: 40px 40px 30px;
  min-width: 600px;
  display: inline-block;
  vertical-align: middle;
  height: 97px;
  background: linear-gradient(45deg, #e20473 0%, #00d0a8 100%);
  border-radius: 50px;
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.7);
  font-size: 47px;
  line-height: 65px;
  font-weight: bold;
  color: #ffffff;
  padding: 12px 36px;
  position: relative;
  transition: all 350ms cubic-bezier(0.68, -0.6, 0.32, 1.6); /*ease-in-out-back*/

  &.show {
    transform: translateX(0) !important;
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
  .title {
    background: #fff;
    position: absolute;
    font-size: 42px;
    font-weight: 500;
    top: -29px;
    line-height: 46px;
    display: inline-block;
    color: #97034d;
    padding: 0px 20px 5px;
    border-radius: 40px;
    box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.7);
    z-index: 2;
    .text {
      font-weight: 500;
      background: linear-gradient(45deg, #e20473 0%, #97034d 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }
  .body {
    font-weight: 500;
    text-shadow: 0px 0px 4px #222;
  }
  &:before,
  &:after {
    content: '';
    position: absolute;
    top: -12px;
    left: -12px;
    right: -12px;
    bottom: -12px;
    border: 5px solid #e20473;
    transition: all 0.5s;
    animation: clippath 5s infinite linear;
    border-radius: 60px;
  }
  &:after {
    border: 5px solid #00d0a8;
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
