<template>
  <div class="page-header">
    <div v-if="!$slots.title" class="title">{{  showTitle  }}</div>
    <div class="title">
      <slot name="title"/>
    </div>
    <div class="right-actions">
      <slot />
    </div>
  </div>
</template>

<script>
  import { generateTitle } from '@/utils/i18n';
  export default {
    props: {
      title: {
        type: String,
        default: ''
      }
    },
    computed: {
      showTitle() {
        if (this.title) {
          return this.title;
        }
        let titleKey = (this.$route.meta && this.$route.meta.title) || this.$route.name;
        return this.generateTitle(titleKey);
      }
    },
    methods: {
      generateTitle
    },
  }
</script>

<style lang="scss" scoped>
.page-header {
  display: flex;
  align-items: center;
  padding: 10px 0;
  border-bottom: solid 1px #EBEEF5;

  .title {
    flex: 1;
    line-height: 36px;
    font-size: 20px;
    color: #303846;
  }

  .right-actions {
    .el-button+.el-button {
      margin-left: 8px;
    }
  }
}
</style>