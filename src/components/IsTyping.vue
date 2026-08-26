<script setup>
defineProps({
  typing: {
    type: Boolean,
    required: true,
    default: false
  },
  color: {
    type: String,
    defaut: 'white',
    required: false
  }
});
</script>

<template>
  <div
    class="is-typing"
    :class="{ visible: typing, pink: color === 'pink', marine: color === 'marine' }"
    style="text-align: right">
    <div class="dots">
      <i class="dot"></i>
      <i class="dot"></i>
      <i class="dot"></i>
    </div>
    <p class="heads-up">Orielsy is typing.</p>
  </div>
</template>

<style scoped>
.is-typing {
  align-items: center;
  align-self: flex-end;
  display: flex;
  justify-content: space-between;
  opacity: 0;
  transition: opacity ease-in-out 250ms;
  width: 335px;
  background: #ffffff;
  border-radius: 8px;
  color: #000;
  box-shadow: 4px 8px 12px rgba(0, 0, 0, 0.5);
  margin: 10px 0;
  padding: 8px 12px;
  position: relative;
  &:after {
    content: '';
    position: absolute;
    bottom: 8px;
    right: -8px;
    width: 0;
    height: 0;
    border-top: 14px solid transparent;
    border-bottom: 14px solid transparent;
    border-left: 14px solid white;
  }
  &.visible {
    opacity: 1;
  }
  &.pink {
    background: #e20473;
    color: #fff;
    &:after {
      border-left: 14px solid #e20473;
    }
    .heads-up {
      color: #fff;
    }
    .dots {
      .dot {
        animation-name: scale-up-down2;
      }
    }
  }
  &.marine {
    background: #00d0a8;
    color: #000;
    &:after {
      border-left: 14px solid #00d0a8;
    }
    .heads-up {
      color: #000;
    }
  }

  .heads-up {
    font-size: 32px;
    color: #000;
  }
  .dots {
    display: flex;
    .dot {
      background: #888;
      border-radius: 100%;
      display: block;
      height: 10px !important;
      width: 10px !important;
      margin: 0 5px;
      animation-name: scale-up-down;
      animation-duration: 2600ms;
      animation-iteration-count: infinite;
      &:nth-child(2) {
        animation-delay: 650ms;
      }
      &:nth-child(3) {
        animation-delay: 1300ms;
      }
    }
  }
}

@keyframes scale-up-down {
  0% {
    background-color: #888;
    transform: scale(1);
  }
  50% {
    background-color: #444;
    transform: scale(1.8);
  }
  100% {
    background-color: #888;
    transform: scale(1);
  }
}
@keyframes scale-up-down2 {
  0% {
    background-color: #888;
    transform: scale(1);
  }
  50% {
    background-color: #bbb;
    transform: scale(1.8);
  }
  100% {
    background-color: #888;
    transform: scale(1);
  }
}
</style>
