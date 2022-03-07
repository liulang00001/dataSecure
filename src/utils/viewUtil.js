import store from '@/store';
import router from '@/router';

export function closeSelectedTag(view) {
  const $store = this ? this.$store : store;
  const $router = this ? this.$router : router;
  const $route = this ? this.$route : router.currentRoute;
  $store.dispatch('delVisitedViews', view).then((views) => {
    if (view.path === $route.path) {
      const latestView = views.slice(-1)[0];
      if (latestView) {
        $router.push(latestView);
      } else {
        $router.push('/');
      }
    }
  });
  setTimeout(() => {
    $store.dispatch('delCachedViews', view);
  }, 500);
}

export function closeTagView(path) {
  const views = store.getters.visitedViews || [];
  let view;
  for (let i = 0; i < views.length; i++) {
    if (views[i].path === path) {
      view = views[i];
      break;
    }
  }
  if (view) {
    closeSelectedTag(view);
  }
}

export function isInTagsViews(routeName) {
  let isExist = false;
  const visitedViews = store.getters.visitedViews;
  if (visitedViews) {
    visitedViews.forEach(item => {
      if (item.name === routeName) {
        isExist = true;
      }
    });
  }
  return isExist;
}
