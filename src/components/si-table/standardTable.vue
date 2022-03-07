<template>
  <div v-loading="$attrs.loading" :element-loading-text="loadingTextDisplay" class="standard-table div-table d2-card-np">
    <el-table v-bind="$attrs" v-on="$listeners">
      <div slot="empty" class="table-nodata-style">
        <div>{{ emptyTextDisplay }}</div>
        <div>{{ emptySubTextDisplay }}</div>
      </div>
      <slot />
    </el-table>
    <div v-if="visible" class="pagination-container">
      <pagination
        v-bind="paginationAttrs"
        v-on="paginationListeners"
        :hide-last-page="false"
        @size-change="onSizeChange"
        @current-change="onCurrentChange" />
    </div>
  </div>
</template>

<script>
import pagination from '@/components/sp-pagination';
import local from './local';

const SCOPE_NAME = 'siTable';

export default {
  name: SCOPE_NAME,
  components: {
    pagination,
  },
  props: {
    showPagination: {
      type: Boolean,
      default: true
    },
    defaultRequest: {
      type: Boolean,
      default: true,
    },
    emptyText: String,
    emptySubText: String,
    loadingText: String,
  },
  data() {
    return {
      pagination: {
        currentPage: 1,
        pageSize: this.$attrs['page-size'] || this.$attrs['pageSize'] || 10,
      },
      tableState: 1,
    };
  },
  computed: {
    language() {
      return this.$store.getters.language;
    },
    visible() {
      return this.showPagination && this.$attrs['data'] && this.$attrs['data'].length;
    },
    paginationAttrs() {
      return {
        'layout': 'total, sizes, prev, pager, next, jumper',
        ...this.$attrs,
        ...{
          'current-page': this.pagination.currentPage,
          'page-size': this.pagination.pageSize,
        },
      };
    },
    paginationListeners() {
      const listeners = this.$listeners;
      delete listeners['size-change'];
      delete listeners['current-change'];
      return listeners;
    },
    emptyTextDisplay() {
      if (this.emptyText !== undefined && this.emptyText !== null) {
        return this.emptyText;
      } else {
        return this.$t('siTable.emptyText');
      }
    },
    emptySubTextDisplay() {
      if (this.emptySubText !== undefined && this.emptySubText !== null) {
        return this.emptySubText;
      } else {
        return this.$t('siTable.emptySubText');
      }
    },
    loadingTextDisplay() {
      if (this.loadingText !== undefined && this.loadingText !== null) {
        return this.loadingText;
      } else {
        return this.$t('siTable.loadingText');
      }
    },
  },
  created() {
    if (!this.$i18n.getLocaleMessage('en')[SCOPE_NAME]) {
      this.$i18n.mergeLocaleMessage('en', local.en);
      this.$i18n.mergeLocaleMessage('zh', local.zh);
    }
    if (this.defaultRequest) {
      this.updateDrive();
    }
  },
  methods: {
    // 页码变更
    onCurrentChange(currentPage) {
      this.pagination.currentPage = currentPage;
      this.updateDrive();
    },
    // 页数变更
    onSizeChange(pageSize) {
      this.pagination.pageSize = pageSize;
      this.pagination.currentPage = 1;
      this.updateDrive();
    },
    // 数据更新驱动
    updateDrive(currentPage) {
      if (currentPage) {
        if (typeof currentPage === 'number') {
          this.pagination.currentPage = currentPage;
        } else {
          console.warn('updateDrive方法传参数类型需为number类型，否则currentPage默认指定为1');
          this.pagination.currentPage = 1;
        }
      }
      this.tableState = 2;
      const pageInfo = {};
      if(this.showPagination) {
        if(this.$attrs.version === '1.0') {
          pageInfo.pageIndex = this.pagination.currentPage;
          pageInfo.limit = this.pagination.pageSize;
        }else {
          pageInfo.pageNum = this.pagination.currentPage;
          pageInfo.pageSize = this.pagination.pageSize;
        }
      }
      this.$emit('update', pageInfo);
    }
  },
};
</script>

<style lang="scss" scoped>
  .standard-table {
    display: block;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    overflow: hidden;
  }

  .pagination-container {
    display: table;
    width: 100%;
    height: 60px;
    padding: 0px 12px;
    margin: 0;
    border: 1px solid $color-divider;
    border-top: none;
    .el-pagination {
      display: table-cell;
      text-align: right;
      vertical-align: middle;
    }
  }
</style>
