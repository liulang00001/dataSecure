<template>
  <el-button
    :type="type"
    v-bind="$attrs"
    v-on="computedListeners"
    v-throttle="onButtonClick">
    <slot></slot>
  </el-button>
</template>

<script>
// 将@click转成v-throttle来处理
export default {
  name: 'BaseButton',
  props: {
    // 封装el-button需将type单独提出，否则type会覆盖原生button的type，若类型无效且应用再表单中则会当作submit触发刷新事件
    type: {
      type: String,
    },
  },
  data() {
    return {};
  },
  computed: {
    computedListeners: function() {
      let custListeners = Object.assign({},
        this.$listeners,
      );
      delete custListeners.click;
      return custListeners;
    }
  },
  methods: {
    onButtonClick(event) {
      if(this.$listeners.click && this.$listeners.click.fns) {
        this.$listeners.click.fns();
      }
    },
  },
};
</script>
