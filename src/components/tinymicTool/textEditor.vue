<template>
  <tinymce-tool :value="value" @input="updateValue" :key="componentKey" v-bind="$attrs"></tinymce-tool>
</template>

<script>
import tinymceTool from "./tinymceTool";

export default {
  name: "textEditor",
  components: {
    tinymceTool
  },
  props: ['value'],
  data() {
    return {
      componentKey: 0,
    };
  },
  activated() {
    this.refresh();
  },
  methods: {
    updateValue(value) {
      if(this.value !== value) {
        this.$emit('input', value);
      }
    },
    refresh() {
      this.componentKey++;
    },
  },
  watch: {
    $attrs(nv, ov) {
      if(nv.disabled === ov.disabled && nv.readonly === ov.readonly) {
        return;
      }
      this.refresh();
    }
  }
}
</script>

<style scoped>

</style>
