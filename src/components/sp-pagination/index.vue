<template>
  <el-pagination
    ref="pagination"
    v-bind="paginationAttrs"
    v-on="paginationListeners" />
</template>

<script>
export default {
  props: {
    hideLastPage: Boolean,
  },
  computed: {
    paginationAttrs() {
      return {
        ...{
          'page-sizes': [10, 20, 30, 40, 50],
          'pager-count': 5,
          'layout': 'total, sizes, prev, pager, next',
          'background': true,
        },
        ...this.$attrs,
      };
    },
    paginationListeners() {
      const listeners = this.$listeners;
      const originSizeChange = listeners['size-change'];
      const originCurrentChange = listeners['current-change'];
      listeners['size-change'] = (size) => {
        this.onSizeChange(size);
        if (originSizeChange) {
          originSizeChange(size);
        }
      };
      listeners['current-change'] = (num) => {
        this.onPageChange(num);
        if (originCurrentChange) {
          originCurrentChange(num);
        }
      };
      return listeners;
    },
  },
  watch: {
    ['$attrs.total'](val)  {
      this.$nextTick(() => {
        this.updateLastPageNum();
      })
    },
  },
  mounted() {
    this.updateLastPageNum();
  },
  methods: {
    showLastPage() {
      const pagination = this.$refs.pagination;
      if (!pagination) return true;
      return (pagination.internalPageCount <= pagination.pagerCount) || (pagination.internalPageCount - pagination.internalCurrentPage) < (pagination.pagerCount - 2) || !this.hideLastPage;
    },
    updateLastPageNum() {
      const show = this.showLastPage();
      const lastPagerNum = this.$el.querySelector('.el-pager .number:last-child');
      if (lastPagerNum) {
        lastPagerNum.hidden = !show;
      }
    },
    onSizeChange() {
      this.updateLastPageNum();
    },
    onPageChange() {
      this.updateLastPageNum();
    },
  },
}
</script>