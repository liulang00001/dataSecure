<template>
  <div class="standard-table">
    <el-table v-bind="tableAttrs" v-on="$listeners">
      <slot />
    </el-table>
    <div v-if="showFooter" class="table-footer" :border="paginationAttrs.border">
      <el-pagination
        v-if="showPagination"
        v-bind="paginationAttrs"
        v-on="paginationListeners"
        @size-change="sizeChange"
        @current-change="currentChange" />
    </div>
  </div>
</template>

<script>
const DEFAULT_TABLE_ATTRS = {
  'border': true
};
const DEFAULT_PAGINATION_ATTRS = {
  'page-sizes': [10, 20, 50, 100],
  'pager-count': 5,
  'background': true,
  'border': true,
  'layout': 'total, sizes, prev, pager, next, jumper'
};

export default {
  props: {
    showFooter: {
      type: Boolean,
      default: true
    },
    showPagination: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      isPending: false,
      pagination: {
        currentPage: this.$attrs['current-page'],
        pageSize: this.$attrs['page-size']
      }
    };
  },
  computed: {
    tableAttrs() {
      return { ...DEFAULT_TABLE_ATTRS, ...this.$attrs };
    },
    paginationAttrs() {
      return { ...DEFAULT_PAGINATION_ATTRS, ...this.$attrs };
    },
    paginationListeners() {
      const listeners = this.$listeners;
      delete listeners['size-change'];
      delete listeners['current-change'];
      return listeners;
    }
  },
  methods: {
    // 当前页
    currentChange(currentPage) {
      this.pagination.currentPage = currentPage;
      this.pageChange();
    },
    // 每页条数
    sizeChange(pageSize) {
      this.pagination.pageSize = pageSize;
      this.pageChange();
    },
    // 分页回调
    pageChange() {
      // 防止组件currentChange触发后又触发sizeChange
      if (!this.isPending) {
        this.isPending = true;
        setTimeout(() => {
          this.isPending = false;
          this.$emit('pageChange', this.pagination);
        }, 0);
      }
    }
  },
};
</script>

<style lang="scss" scoped>
.standard-table{
  .el-table{
    width: 100%;
  }
  .table-footer {
    height: 60px;
    width: 100%;
    display: table;
    padding: 0px 12px;
    &[border] {
      border: 1px solid $color-divider;
      border-top: none;
    }
    .el-pagination {
      display: table-cell;
      text-align: right;
      vertical-align: middle;
    }
  }
}
</style>
