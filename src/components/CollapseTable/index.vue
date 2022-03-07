<template>
  <el-table class="collapseTable" border ref="rootTable" :data="indexedTableData" :span-method="tableSpanMethod" :default-expand-all="true" @expand-change="onExpandChange" @select-all="onRootTableSelectAllChange" @select="onRootTableSelect" :row-class-name="rootTableRowClassName" :cell-class-name="rootTableCellClassName" :empty-text="$attrs.emptyText">
    <el-table-column type="expand">
      <template slot-scope="props">
        <el-table class="subTable" :ref="props.row.collapseData._subTableRef" :data="props.row.collapseData" :span-method="tableSpanSubChannel" border :show-header="false" @selection-change="onSubTableSelectionChange" @select="onSubTableSelect" :row-class-name="rowClassName">
          <el-table-column v-if="selectable" type="selection" width="47"></el-table-column>
          <template v-if="enableSubTableSlot">
            <el-table-column
              v-for="col in tableHeaders"
              :prop="col.prop"
              :key="col.prop"
              :label="col.label"
              :width="col.width"
              :min-width="col.minWidth"
              :align="col.align"
              :resizable="false"
            >
              <template slot-scope="scope">
                <slot :name="col.prop" :collapseKey="props.row.collapseKey" :row="scope.row" :column="scope.column" :$index="scope.$index"></slot>
              </template>
            </el-table-column>
          </template>
          <template v-else>
            <el-table-column
              v-for="col in tableHeaders"
              :prop="col.prop"
              :key="col.prop"
              :label="col.label"
              :width="col.width"
              :min-width="col.minWidth"
              :align="col.align"
              :resizable="false"
            ></el-table-column>
          </template>
        </el-table>
      </template>
    </el-table-column>
    <el-table-column v-if="selectable" type="selection" width="47"></el-table-column>
    <el-table-column
      v-for="(col, index) in headers"
      :prop="col.prop"
      :key="index"
      :label="col.label"
      :resizable="false"
      :header-align="'center'"
      :width="col.width"
      :min-width="col.minWidth"
    ></el-table-column>
  </el-table>
</template>

<script>
  const EVENT_SELECTIONS_CHANGED = "selectionsChanged";

  export default {
    model: {
      prop: 'selections',
      event: EVENT_SELECTIONS_CHANGED
    },
    props: {
      // --- model ---
      selections: {
        // type: Object
      },
      // --- props ---
      enableSubTableSlot: {
        type: Boolean,
        default: false
      },
      selectable: {
        type: Boolean,
        default: false
      },
      tableHeaders: {
        type: Array,
        default: function() {
          //such as, return [{ prop: "", label: "" }];
          return [];
        }
      },
      tableData: {
        type: Array,
        default: function() {
          //such as, return [{ collapseTitle: "", collapseData: [] }];
          return [];
        }
      },
      successRows: {
        type: Object,
        default: function() {
          //such as, return { collapseKey: [0, 1] };
          return {};
        }
      },
      warningRows: {
        type: Object,
        default: function() {
          //such as, return { collapseKey: [0, 1] };
          return {};
        }
      },
      onSelected: {
        type: Function
      }
    },
    data() {
      return {
        //such as, selectedRows: { ${collapseKey}: [], ...} ,
        selectedRows: {},
      }
    },
    watch: {
      // pass selections to invoker
      selectedRows(val) {
        let selections = Object.assign({}, val);
        this.$emit(EVENT_SELECTIONS_CHANGED, selections);
      }
    },
    computed: {
      headers() {
        if (!this.tableHeaders) {
          return [];
        }
        let newHeaders = [];
        for (let index = 0; index < this.tableHeaders.length; index++) {
          const element = this.tableHeaders[index];
          newHeaders.push({ prop: "collapseTitle", label: element.label, width: element.width, minWidth: element.minWidth });
        }
        return newHeaders;
      },
      indexedTableData() {
        if (!this.tableData) {
          return [];
        }
        let newData = Object.assign([], this.tableData);
        for (let index = 0; index < newData.length; index++) {
          const element = newData[index];
          if (element && element.collapseData) {
            const collapseKey = element.collapseKey;
            if(!collapseKey) {
              throw 'collapseKey undefined'
            }
            element.collapseTitle = this.$util.string.mappingState(this.$t('countryList'), collapseKey);
            element.collapseData._subTableIndex = index;
            element.collapseData._subTableRef = collapseKey;
            element.collapseData.forEach(row => {
              row._subTableIndex = index;
              row._subTableRef = collapseKey;
            });
          }
        }
        return newData;
      }
    },
    methods: {
      // 重置selection
      resetSelecction() {
        const refs = this.indexedTableData.map(item => item.collapseData._subTableRef);
        refs.forEach(ref => {
          this.selectSubTable(ref, false);
        });
      },
      // --- private ---
      tableSpanMethod({ row, column, rowIndex, columnIndex }) {
        const CONTENT_START_INDEX = this.selectable ? 2 : 1;
        if (columnIndex === CONTENT_START_INDEX) {
          return [1, this.headers.length];
        } else if (columnIndex > CONTENT_START_INDEX) {
          return [0, 0];
        }
      },
      tableSpanSubChannel({ row, column, rowIndex, columnIndex }) {
        if (row.type === 'subChannelButton') {
          const CONTENT_START_INDEX = this.selectable ? 1 : 0;
          if (columnIndex === CONTENT_START_INDEX) {
            return [1, this.headers.length + CONTENT_START_INDEX];
          } else if (columnIndex !== CONTENT_START_INDEX) {
            return [0, 0];
          }
        }
      },
      rootTableRowClassName({row, rowIndex}) {
        if (this.warningRows && this.warningRows.hasOwnProperty(row.collapseKey)) {
          return 'is-warning';
        } else if (this.successRows && this.successRows.hasOwnProperty(row.collapseKey)) {
          return 'is-success';
        }
      },
      rootTableCellClassName(cell) {
        if (!cell.column || cell.column.type != 'selection' || !cell.row || !cell.row.collapseKey)
          return;
        const key = cell.row.collapseKey;
        const rowData = this.getCollapseData(key);
        const totalSize = rowData && rowData.length ? rowData.length : 0;
        const selectedSize = this.selectedRows.hasOwnProperty(key) && this.selectedRows[key].length ? this.selectedRows[key].length : 0;
        if (selectedSize > 0 && totalSize > selectedSize)
          return 'indeterminate-row';
      },
      rowClassName({row, rowIndex}) {
        if (row.hiddenFlag) {
          return 'is-hidden';
        }
        if (row.type == 'subChannelButton') {
          return '';
        }
        let classString = '';
        if (row.isSubChannel) {
          classString += 'is-sub-channel';
        }
        if (this.successRows && this.successRows.hasOwnProperty(row._subTableRef)) {
          let subTableRows = this.successRows[row._subTableRef];
          if (Array.isArray(subTableRows) && subTableRows.length > 0 && subTableRows.includes(rowIndex)) {
            classString += (row.isSubChannel ? ' ' : '') + 'is-success';
          }
        }
        if (this.warningRows && this.warningRows.hasOwnProperty(row._subTableRef)) {
          let subTableRows = this.warningRows[row._subTableRef];
          if (Array.isArray(subTableRows) && subTableRows.length > 0 && subTableRows.includes(rowIndex)) {
            classString += (row.isSubChannel ? ' ' : '') + 'is-warning';
          }
        }
        return classString;
      },
      getCollapseData(collapseKey) {
        let row = this.indexedTableData.find(item => item.collapseKey == collapseKey);
        if (!row)
          return;
        return row.collapseData;
      },
      selectCollapseRow(collapseKey, selected) {
        let row = this.indexedTableData.find(item => item.collapseKey == collapseKey);
        if (!row)
          return;
        this.$refs.rootTable.toggleRowSelection(row, selected);
      },
      selectSubTable(ref, selected) {
        console.log('selectSubTable')
        if (!selected) {
          if (this.selectedRows.hasOwnProperty(ref)) {
            this.selectedRows[ref].splice(0);
          }
        }
        const $ref = this.$refs[ref];
        if ($ref) {
          if (selected) {
            $ref.clearSelection();
            $ref.toggleAllSelection();
          } else {
            $ref.clearSelection();
          }
        } else {
          if (selected) {
            this.onSubTableSelectionChange(this.getCollapseData(ref));
          }
        }
      },
      // 勾选【全选】
      onRootTableSelectAllChange(selection) {
        console.log('onRootTableSelectAllChange')
        if (!selection) {
          return;
        }
        const refs = this.indexedTableData.map(item => item.collapseData._subTableRef);
        if (selection.length > 0) {
          refs.forEach(ref => {
            this.selectSubTable(ref, true);
          });
        } else {
          refs.forEach(ref => {
            this.selectSubTable(ref, false);
          });
        }
      },
      // 勾选【国家】
      onRootTableSelect(selection, row) {
        console.log('onRootTableSelect')
        if (!selection || !row) {
          return;
        }
        const ref = row.collapseData._subTableRef;
        const selected = selection.some(item => item == row);
        if (this.$refs[ref]) {
          this.selectSubTable(ref, selected);
        } else {
          if (selected) {
            this.onSubTableSelectionChange(this.getCollapseData(ref));
          } else {
            if (this.selectedRows.hasOwnProperty(ref)) {
              this.selectedRows[ref].splice(0);
            }
          }
        }
      },
      // 勾选【支付方式】
      onSubTableSelect(selection, row) {
        console.log('onSubTableSelect')
        const ref = row._subTableRef;
        const collapseData = this.getCollapseData(ref);
        // 行selection
        // 选中/取消
        const existRow = selection.find(item => item.index === row.index);
        // 带有二级支付方式的子支付方式
        if (row.subFlag) {
          // const cancelRows = collapseData.filter(item => item.payWayParentCode === row.payWayCode);
          // cancelRows.forEach(cancelRow => {
          //   this.$refs[ref].toggleRowSelection(cancelRow, existRow ? true: false);
          // });
        }
        // 二级支付方式
        else if (row.isSubChannel) {
          // 二级支付方式添加按钮行【选中/取消】
          const btnRow = collapseData.find(item => item.type === 'subChannelButton' && item.payWayParentCode === row.payWayParentCode);
          if (btnRow) {
            this.$refs[ref].toggleRowSelection(btnRow, existRow ? true: false);
          }
          // 判断同级二级支付方式是否全部【选中/取消】
          // const siblingsRows = collapseData.filter(item => item.isSubChannel && item.payWayParentCode === row.payWayParentCode);
          // const siblingsSelectedRows = selection.filter(item => item.isSubChannel && item.payWayParentCode === row.payWayParentCode);
          // const parentRow = collapseData.find(item => item.subFlag && item.payWayCode === row.payWayParentCode);
          // if (siblingsSelectedRows.length >= siblingsRows.length) {
          //   this.$refs[ref].toggleRowSelection(parentRow, true);
          // }
          // if (siblingsSelectedRows.length <= 0) {
          //   this.$refs[ref].toggleRowSelection(parentRow, false);
          // }
        }
        // 国家selection
        if (!selection || selection.length <= 0) {
          this.selectedRows[ref] = [];
          this.selectCollapseRow(ref, false);
          return;
        }
        if (selection && collapseData && selection.length >= collapseData.length) {
          this.selectCollapseRow(ref, true);
        } else {
          this.selectCollapseRow(ref, false);
        }
      },
      // 勾选变化监听
      onSubTableSelectionChange(selection) {
        if (!selection) {
          return;
        }
        const rows = {};
        selection.forEach(element => {
          const ref = element._subTableRef;
          if(!rows.hasOwnProperty(ref)) {
            rows[ref] = [];
          }
          rows[ref].push(element);
        });
        this.selectedRows = Object.assign({}, this.selectedRows, rows);
      },
      onExpandChange(row, expandedRows) {
        // this row is root table's row.
        const _subTableRef = row.collapseData._subTableRef;
        this.$nextTick(() => {
          if (!this.$refs[_subTableRef])
            return;
          this.indexedTableData.forEach(row => {
            const currentTableRef = row.collapseData._subTableRef;
            if (currentTableRef != _subTableRef)
              return;
            const currentTableSelectedRow = this.selectedRows[currentTableRef];
            if (!currentTableSelectedRow || currentTableSelectedRow.length <= 0)
              return;
            currentTableSelectedRow.forEach(row => {
              // this row is sub table's row.
              this.$refs[currentTableRef].toggleRowSelection(row, true);
            });
          });
        });
      },
    },
  };
</script>

<style lang="scss">
  @mixin statusBackground {
    &.is-hidden {
      display: none;
    }
    &.is-sub-channel {
      height: 44px;
      line-height: 44px;
      background: #FBFCFF;
      td {
        .cell {
          font-size: 12px;
          color: $color-c2;
          .el-dropdown {
            font-size: 12px;
          }
        }
      }
      .channel {
        display: inline-block;
        line-height: 16px;
        padding-left: 15px;
      }
    }
    &.is-success {
      background: mix(#FFFFFF, #67C23A, 90%);
      &:hover {
        >td {
          background: mix(#FFFFFF, #67C23A, 85%);
        }
      }
    }
    &.is-warning {
      background: mix(#FFFFFF, #F56C6C, 90%);
      &:hover {
        >td {
          background: mix(#FFFFFF, #F56C6C, 85%);
        }
      }
    }
  }
  .collapseTable {
    .el-table__header {
      .cell {
        color: #666666;
        font-weight: 400;
        font-size: 14px;
      }
    }
    .el-table__body {
      // 使表格兼容safari，不错位
      width: 100%;
      table-layout: fixed !important;
    }
    .el-table__row {
      background-color: #FAFAFA;
      .el-table-column--selection {
        text-align: center;
        &.indeterminate-row {
          .el-checkbox__inner {
            background-color: #409EFF;
            border-color: #409EFF;

            &::before {
              content: '';
              position: absolute;
              display: block;
              background-color: #FFFFFF;
              height: 2px;
              transform: scale(0.5);
              left: 0;
              right: 0;
              top: 5px;
            }

            &::after {
              display: none;
            }
          }
        }
      }
      .cell {
        color: #333333;
        font-weight: 400;
        font-size: 14px;
      }
      @include statusBackground;
      &.expanded {
        background-color: #FAFAFA;
        &:hover {
          >td {
            background: #F5F7FA;
          }
        }
      }
    }
    .el-table__expanded-cell {
      padding: 0 0 0 46px;
      .el-table {
        margin: 0 -1px -1px 1px;
        border-top: none;
      }
    }
    .el-table-column--selection {
      text-align: center;
      .cell {
        padding: 0 14px !important;
      }
    }
    .subTable {
      .el-table__row {
        background-color: #FFFFFF;
        @include statusBackground;
      }
    }
    .el-button {
      font-weight: 400;
    }
  }
</style>