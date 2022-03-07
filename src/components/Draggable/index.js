import draggable from 'vuedraggable';

const VueDraggable = {
  install(Vue, options) {
    Vue.component('vue-draggable', draggable);
  }
};

export default VueDraggable;