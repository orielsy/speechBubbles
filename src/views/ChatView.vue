<template>
  <div>
    <div class="title-bar">Chat</div>
    <div :class="{ speech: true }">
      <Message
        v-for="(message, x) in store.messages"
        :ref="(el) => messageRefs.push(el)"
        :msg="message"
        :color="color"
        @beforeMount="msgMounted(x)" />
      <IsTyping
        :typing="store.typing"
        :color="color" />
    </div>
  </div>
</template>
<script setup>
import {
  ref,
  reactive,
  onBeforeUpdate,
  defineAsyncComponent,
  computed,
  watch,
  onMounted,
  nextTick
} from 'vue';

import Message from '@/components/Message.vue';
import IsTyping from '@/components/IsTyping.vue';
import { useStore } from '@/stores/chatterStore';

//import SupportIcon from './icons/IconSupport.vue'

const store = useStore();
const messageRefs = ref([]);

const invisible = ref(false);

const msgSound = new Audio('./sounds/pop.wav');

let currentDomRects = [];
let prevDomRects = [];
let chatterInterval = null;
let bannerInterval = null;
const color = ref('');

onMounted(() => {
  color.value = Math.floor(Math.random() * 2) + 1 === 1 ? 'pink' : 'marine';
  store.chatColor = color.value;
});

onBeforeUpdate(() => {
  messageRefs.value = [];
});

function msgMounted(key) {
  prevDomRects = currentDomRects;
  nextTick(() => {
    getMsgsBoundings();
  });
}

function getMsgsBoundings() {
  currentDomRects = messageRefs.value.map((reference, x) => {
    const domRects = reference.$el.getBoundingClientRect();
    const prevY = prevDomRects[x] ? prevDomRects[x].y : 0;
    const animationTiming = 150;

    const performAnimation = (multiplier = 1) => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          reference.$el.style.transition = `all ease-in-out ${animationTiming * multiplier}ms`;
          reference.$el.style.opacity = x >= messageRefs.value.length - 2 ? 1 : 0;
          reference.$el.style.transform = `revert`;
          setTimeout(() => {
            reference.$el.style.transition = 'unset';
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
  height: 600px;
  min-width: 780px;
}
</style>
