<template>
  <div class="markdown-view markdown-body" v-html="parsedMarkdownText"></div>
</template>

<script>
  const MarkdownIt = require('markdown-it');
  const md = new MarkdownIt({
    breaks: true,
    html: true,
    linkify: true
  });

  export default {
    props: {
      value: {
        type: String,
        default: '',
      },
    },
    computed: {
      parsedMarkdownText() {
        try {
          return md.render(this.value);
        } catch (error) {
          console.log('------------------------------------');
          console.log('render markdown err', error);
          console.log('------------------------------------');
          return '';
        }
      }
    },
    watch: {
    },
  }
</script>

<style lang="scss" scoped>
  .markdown-view {
    overflow: auto;
    display: block;
    word-break: break-word;
  }
</style>

<style lang="scss">
  @import 'github-markdown-css/github-markdown.css';

  .markdown-view {
    &.markdown-body {
      code {
        display: initial;
      }
    }
  }
</style>
