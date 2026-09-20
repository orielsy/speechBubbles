<template>
  <div class="wrapper">
    <div class="title-bar">Captions</div>
    <div class="speech">
      <Caption
        v-for="(caption, x) in renderedCaptions"
        :key="x"
        :ref="(el) => { if (el) messageRefs.push(el); }"
        :msg="caption"
        @beforeMount="msgMounted(x)" />
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  onBeforeUpdate,
  watch,
  nextTick,
  onUnmounted
} from 'vue';
import { storeToRefs } from 'pinia';
import Caption from '@/components/Caption.vue';
import { useStore } from '@/stores/chatterStore';

const store = useStore();
const { captions } = storeToRefs(store);
const messageRefs = ref([]);
const renderedCaptions = ref([]);
const rendering = ref(false);

let currentDomRects = [];
let prevDomRects = [];
let intervalHolder = null;

onBeforeUpdate(() => {
  messageRefs.value = [];
});

onUnmounted(() => {
  if (intervalHolder) {
    clearTimeout(intervalHolder);
    intervalHolder = null;
  }
});

watch(captions, async () => {
  if (rendering.value && store.captions.length > 0) return;
  rendering.value = true;
  startRenderingCaptions();
}, { deep: true });

function startRenderingCaptions() {
  function timeLoop() {
    if (store.captions.length <= 0) {
      rendering.value = false;
      if (intervalHolder) {
        clearTimeout(intervalHolder);
        intervalHolder = null;
      }
      return;
    }
    const currentMsg = store.captions[0];
    const wait = Math.min(Math.max(currentMsg.length * 60, 1500), 6000);
    renderedCaptions.value.push(currentMsg);
    store.captions.shift();
    intervalHolder = setTimeout(() => {
      timeLoop();
    }, wait);
  }
  timeLoop();
}

function msgMounted(key) {
  prevDomRects = currentDomRects;
  nextTick(() => {
    getMsgsBoundings();
  });
}

function getMsgsBoundings() {
  // TODO: Batch geometry reads before DOM writes to reduce forced-layout risk.
  currentDomRects = messageRefs.value.map((reference, x) => {
    if (!reference || !reference.$el) return { y: 0, top: 0 };
    const domRects = reference.$el.getBoundingClientRect();
    const prevY = prevDomRects[x] ? prevDomRects[x].y : 0;
    const animationTiming = 250;

    const performAnimation = (multiplier = 1) => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (!reference.$el) return;
          reference.$el.style.transition = `all ease-in-out ${animationTiming * multiplier}ms`;
          reference.$el.style.opacity = x >= messageRefs.value.length - 1 ? 1 : 0;
          reference.$el.style.transform = `revert`;
          setTimeout(() => {
            if (reference.$el) reference.$el.style.transition = 'unset';
          }, animationTiming * multiplier);
        });
      });
    };
    if (Math.abs(prevY) > 0) {
      reference.$el.style.transform = `translateY(${Math.abs(prevY) - (domRects.top + 24)}px)`;
      performAnimation();
    } else {
      reference.$el.style.transform = `scale(0)`;
      reference.$el.style.opacity = '0';
      performAnimation(2);
    }
    return reference.$el.getBoundingClientRect();
  });
}
</script>

<style lang="scss" scoped>
.wrapper {
  overflow: hidden;
}
.title-bar {
  font-size: 25px;
  max-height: 40px;
  text-align: center;
  background: red;
  color: #fff;
}
.speech {
  border: 4px solid red;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  height: 530px;
  overflow: hidden;
  opacity: 1;

  &.visible {
    opacity: 1;
  }
}
</style>
