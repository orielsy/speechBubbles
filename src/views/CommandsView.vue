<template>
  <div class="wrapper">
    <div class="title-bar">Commands</div>
    <div :class="{ speech: true, hide: hide }">
      <img
        :class="{ show: animateJutsu }"
        :src="`/images/${jutsu}.png`" />
      <Caption
        v-for="(command, x) in renderedCommands"
        :ref="(el) => messageRefs.push(el)"
        :msg="command"
        :color="store.chatColor"
        @beforeMount="msgMounted(x)" />
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
import { storeToRefs } from 'pinia';
import Caption from '@/components/Caption.vue';
import IsTyping from '@/components/IsTyping.vue';
import { useStore } from '@/stores/chatterStore';

//import SupportIcon from './icons/IconSupport.vue'

const store = useStore();
const { commands } = storeToRefs(store);
const messageRefs = ref([]);
const renderedCommands = ref([]);
const rendering = ref(false);
const jutsu = ref(1);
const animateJutsu = ref(false);
const hide = ref(false);
const msgSound = new Audio('./sounds/pop.wav');

let currentDomRects = [];
let prevDomRects = [];
let intervalHolder = null;

let prevCommandsLength = 0;
let timeout = null;

onBeforeUpdate(() => {
  messageRefs.value = [];
});
watch(commands, async () => {
  //if (rendering == true && commands.value.length > 0) return;
  if (commands.value.length === prevCommandsLength) return;
  prevCommandsLength = commands.value.length;
  rendering.value = true;
  startRenderingCommands();
});

function startRenderingCommands() {
  animateJutsu.value = false;
  if (timeout) clearTimeout(timeout);
  renderedCommands.value.push(commands.value[commands.value.length - 1]);
  setTimeout(() => {
    solveNewJutsu();
    animateJutsu.value = true;
    hide.value = false;
  }, 200);
  timeout = setTimeout(() => {
    hide.value = true;
  }, 6000);
}
function solveNewJutsu() {
  let newJutsu = Math.floor(Math.random() * 12) + 1;
  if (newJutsu === jutsu.value) {
    solveNewJutsu();
  } else {
    jutsu.value = newJutsu;
  }
}

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
    const animationTiming = 250;

    const performAnimation = (multiplier = 1) => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          reference.$el.style.transition = `all ease-in-out ${animationTiming * multiplier}ms`;
          reference.$el.style.opacity = x >= messageRefs.value.length - 1 ? 1 : 0;
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
.wrapper {
  overflow: hidden;
  position: relative;
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
  height: 340px;
  opacity: 1;

  &.hide {
    opacity: 0;
  }

  img {
    transform: scale(0) translateY(-700px);
    opacity: 0;
    position: absolute;
    top: 55px;
    width: 200px;
    left: 50%;
    margin-left: -100px;
    background: rgba(0, 0, 0, 0.8);
    border-radius: 10px;
    transition: all ease-in-out 250ms;
    &.show {
      opacity: 1;
      transform: scale(1);
    }
  }
}
</style>
