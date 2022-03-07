<template>
  <div class="tags-view-container">
    <scroll-pane class='tags-view-wrapper' ref='scrollPane'>
      <router-link ref='tag' class="tags-view-item" :class="{'active': tag.path === $route.path}" v-for="tag in Array.from(visitedViews)"
        :to="tag" :key="tag.path">
        {{ generateTitle(tag.title) }}
        <span class='el-icon-close' @click.prevent.stop='closeSelectedTag(tag)'></span>
      </router-link>
    </scroll-pane>
  </div>
</template>

<script>
import ScrollPane from '@/components/ScrollPane';
import { generateTitle } from '@/utils/i18n';
import { closeSelectedTag } from '@/utils/viewUtil';

export default {
  components: {
    ScrollPane,
  },
  data() {
    return {};
  },
  computed: {
    visitedViews() {
      const visitedViews = this.$store.state.tagsView.visitedViews || [];
      return visitedViews.map(item => {
        item.params = Object.assign({}, item.params, {
          isTagTrigger: true,
        });
        return item;
      });
    },
  },
  watch: {
    $route() {
      this.addViewTag();
      this.setCurrentViewTag();
    },
  },
  mounted() {
    this.addViewTag()
  },
  methods: {
    generateTitle,
    closeSelectedTag,
    addViewTag() {
      if (this.$route.name) {
        this.$store.dispatch('addVisitedViews', this.$route);
        this.$store.dispatch('addCachedViews', this.$route);
      }
    },
    setCurrentViewTag() {
      const tags = this.$refs.tag;
      this.$nextTick(() => {
        for (const tag of tags) {
          if (tag.to.path === this.$route.path) {
            this.$refs.scrollPane.moveToTarget(tag.$el);
            break;
          }
        }
      })
    },
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.tags-view-container {
  .tags-view-wrapper {
    background: #fff;
    height: 34px;
    border-bottom: 1px solid #d8dce5;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .12), 0 0 3px 0 rgba(0, 0, 0, .04);
    .tags-view-item {
      display: inline-block;
      position: relative;
      height: 26px;
      line-height: 26px;
      border: 1px solid #d8dce5;
      color: #495060;
      background: #fff;
      padding: 0 8px;
      font-size: 12px;
      margin-left: 5px;
      margin-top: 4px;
      &:first-of-type {
        margin-left: 15px;
      }
      &.active {
        background-color: #42b983;
        color: #fff;
        border-color: #42b983;
        &::before {
          content: '';
          background: #fff;
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          position: relative;
          margin-right: 2px;
        }
      }
    }
  }
}
</style>

<style rel="stylesheet/scss" lang="scss">
//reset element css of el-icon-close
.tags-view-wrapper {
  .tags-view-item {
    .el-icon-close {
      width: 16px;
      height: 16px;
      vertical-align: 2px;
      border-radius: 50%;
      text-align: center;
      transition: all .3s cubic-bezier(.645, .045, .355, 1);
      transform-origin: 100% 50%;
      &:before {
        transform: scale(.6);
        display: inline-block;
        vertical-align: -3px;
      }
      &:hover {
        background-color: #b4bccc;
        color: #fff;
      }
    }
  }
}
</style>
