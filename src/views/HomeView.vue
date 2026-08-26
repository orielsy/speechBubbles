<template>
  <div class="control-screen">
    <section class="toolbar"><CaptionControl></CaptionControl></section>
    <section class="title-controls">
      <div class="controls">
        <div
          class="toggle"
          @click="isBannerType = !isBannerType">
          <div
            class="background"
            :class="{ active: isBannerType }">
            <span class="ball"></span>
          </div>
          <input
            v-model="isBannerType"
            checked
            type="checkbox"
            name="isBannerType" />
        </div>
      </div>
      <input
        type="text"
        @keypress="handleTitleKeypress"
        :placeholder="isBannerType ? store.bannerMsg : store.videoTitle"
        v-model="videoTitle" />
      <button
        :disabled="videoTitle.length === 0"
        @click="isBannerType ? setBanner() : setTitle()">
        Set
      </button>
    </section>
    <section class="chat-controls">
      <div class="msg-input">
        <input
          type="text"
          @keypress="handleKeypress"
          @blur="store.typing = false"
          placeholder="Text Message"
          v-model="inputText" />
        <div class="timers">
          <div>{{ chatterResetCounter }}</div>
        </div>
      </div>
      <button
        :disabled="inputText.length === 0"
        @click="sendMsg()">
        Send
      </button>
    </section>
    <section class="timeline-controls">
      <input
        type="text"
        @keypress="handleListKeypress"
        :placeholder="store.list"
        v-model="currentList" />
      <button
        :disabled="currentList.length === 0"
        @click="setList()">
        Set
      </button>
    </section>
    {{ store.list }}
  </div>
</template>
<script setup>
import { ref, reactive, onBeforeUpdate, onMounted } from 'vue';
import { useStore } from '@/stores/chatterStore';
import CaptionControl from '@/components/CaptionControl.vue';

const store = useStore();
const inputText = ref('');
const videoTitle = ref('');
const currentList = ref('');
const isBannerType = ref(false);
const chatterResetCounter = ref(30);

let chatterInterval = null;
let bannerInterval = null;

const jump = new Audio('./sounds/jump.mp3');

onMounted(() => {
  initiateReset();
});

function handleListKeypress(e) {
  if (e.keyCode === 13 && currentList.value.length > 0) {
    setList();
  }
}

function handleTitleKeypress(e) {
  if (e.keyCode === 13 && videoTitle.value.length > 0) {
    isBannerType.value ? setBanner() : setTitle();
  }
}

function handleKeypress(e) {
  store.typing = true;
  chatterResetCounter.value = 30;
  if (e.keyCode === 13 && inputText.value.length > 0) {
    sendMsg();
  }
}

function setList() {
  store.list = currentList.value.split(',').map((val) => val.trim());
}

function setTitle() {
  store.videoTitle = videoTitle.value;
  videoTitle.value = '';
}

function setBanner() {
  store.bannerMsg = videoTitle.value;
  videoTitle.value = '';
}

function sendMsg() {
  store.typing = false;
  store.messages.push(inputText.value);
  jump.play();
  inputText.value = '';
  chatterResetCounter.value = 30;
  if (chatterInterval === null) initiateReset();
}

function initiateReset() {
  chatterInterval = setInterval(() => {
    chatterResetCounter.value -= 1;
    if (chatterResetCounter.value < 0) {
      clearInterval(chatterInterval);
      chatterResetCounter.value = 30;
      chatterInterval = null;
      store.typing = false;
      store.messages.length = 0;
    }
  }, 1000);
}

function initiateBannerReset() {
  bannerInterval = setInterval(() => {
    bannerResetCounter.value -= 1;
    if (bannerResetCounter.value < 0) {
      clearInterval(bannerInterval);
      store.bannerMsg = '';
      bannerInterval = null;
      bannerResetCounter.value = 20;
    }
  }, 1000);
}
</script>
<style lang="scss" scoped>
.control-screen {
  background: #222;
  padding: 20px;
  display: flex;
  flex-direction: column;
  width: 100%;

  section {
    position: relative;
    margin: 20px 0;
    display: flex;
  }
  .toolbar {
    margin: -20px -20px 20px;
    background: mediumaquamarine;
    padding: 10px;
  }
}
.controls {
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  .toggle {
    cursor: pointer;
    .background {
      background: #ddd;
      width: 50px;
      height: 20px;
      border-radius: 25px;
      display: flex;
      align-items: center;
      &.active {
        .ball {
          background: #ffa500;
          border: 1px solid #cc8400;
          transform: translateX(27px);
        }
      }
      .ball {
        display: inline-block;
        height: 25px;
        width: 25px;
        background: #478f76;
        border: 1px solid #38725e;
        border-radius: 100%;
        transition: all ease-in-out 250ms;
      }
    }
    input {
      display: none;
    }
  }
}
.msg-input {
  position: relative;
  flex-grow: 2;
  input {
    display: block;
    width: 100%;
  }
}
.timers {
  position: absolute;
  right: 0;
  top: 2px;
  display: flex;
  align-items: center;
  & div {
    margin-right: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 100%;
    background: #478f76;
    border: 2px solid #38725e;
    font-size: 18px;
    line-height: 31px;
    font-weight: bold;
    height: 31px;
    width: 31px;
    color: #fff;
    transition: all ease-in-out 250ms;
  }
}
input,
button {
  border: none;
  border-radius: 4px;
  background: white;
  font-size: 16px;
  padding: 8px 4px;
  outline: none;
}
button {
  margin-left: 4px;
}
input {
  padding-left: 20px;
  display: block;
  flex-grow: 1;
}
button {
  padding: 4px 6px;
  cursor: pointer;
  &:hover {
    background: #ccc;
  }
}
.timeline {
  padding-top: 20px;
}
</style>
