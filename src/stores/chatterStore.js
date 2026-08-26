import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

export const useStore = defineStore({
  id: 'overlay',
  state: () => ({
    videoTitle: ref('Developing assets for music site'),
    bannerMsg: 'Orielsy Diaz, Front-End Architect / Full Stack Developer',
    messages: [],
    list: [],
    captions: [
      /*'The behavior could be thought of as a minimum gutter, as if the gutter is bigger somehow (because of something like justify-content: space-between;) then the gap will only take effect if that space would end up smaller. The behavior could be thought of as a minimum gutter, as if the gutter is bigger somehow (because of something like justify-content: space-between;) then the gap will only take effect if that space would end up smaller.'*/
    ],
    commands: [],
    chatColor: '',
    typing: false
  }),
  share: {
    // An array of fields that the plugin will ignore.
    // Override global config for this store.
    enable: true,
    initialize: true
  }
});
