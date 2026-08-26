import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import TitleView from '../views/TitleView.vue';
import ChatView from '../views/ChatView.vue';
import BannerView from '../views/BannerView.vue';
import CaptionsView from '../views/CaptionsView.vue';
import CommandsView from '../views/CommandsView.vue';
import CollageView from '../views/CollageView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomeView
    },
    {
      path: '/chat',
      name: 'Chat',
      component: ChatView
    },
    {
      path: '/captions',
      name: 'Captions',
      component: CaptionsView
    },
    {
      path: '/banner',
      name: 'Banner',
      component: BannerView
    },
    {
      path: '/title',
      name: 'Title',
      component: TitleView
    },
    {
      path: '/commands',
      name: 'Commands',
      component: CommandsView
    },
    {
      path: '/collage',
      name: 'Collage',
      component: CollageView
    }
  ]
});
router.beforeEach((to, from, next) => {
  document.title = `Overlays - ${to.name}`;
  next();
});

export default router;
