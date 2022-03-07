<template>
  <el-table :data="tableData" border v-loading="loading" :max-height="maxHeight">
    <el-table-column align="center" v-for="item in tableHeader" :key="item.prop" :label="item.label">
      <template slot-scope="scope">
        <span v-if="item.prop == 'createTime'">{{ $util.formatTime(parseInt(scope.row[item.prop])) }}</span>
        <span v-else-if="item.prop == 'behavior'">{{ behaviorDisplay(scope.row) }}</span>
        <span v-else>{{ $util.string.betterDisplay(scope.row[item.prop]) }}</span>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { findActionLogListApi } from "@/api/common";

export default {
  props: {
    bizId: {
      default: "",
    },
    moduleNo: {
      type: Number,
      default: NaN,
    },
    tableHeader: {
      type: Array,
      default: []
    },
    maxHeight: {
      type: String,
      default: '500px'
    },
    requestId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      loading: false,
      tableData: [],
    };
  },
  watch: {
    bizId(val) {
      this.update();
    },
    requestId() {
      if (!this.bizId) {
        this.update();
      }
    }
  },
  computed: {
    language() {
      return this.$store.getters.language;
    },
  },
  methods: {
    behaviorDisplay(data) {
      if (this.language === "zh") {
        return this.$util.string.betterDisplay(data.behavior);
      } else {
        return this.$util.string.betterDisplay(data.behaviorEn);
      }
    },
    update() {
      this.loading = true;
      findActionLogListApi({
        bizId: this.bizId,
        moduleNo: this.moduleNo,
        requestId: this.requestId
      }, {
        // 接口幂等，防止重复调用
        needIdempotent: true
      })
        .then((res) => {
          this.tableData = (res.data || {}).data || [];
          this.loading = false;
        })
        .catch((err) => {
          this.tableData = [];
          this.loading = false;
        });
    },
  },
  created() {
    this.update();
  },
};
</script>

<style scoped lang='scss'>
</style>