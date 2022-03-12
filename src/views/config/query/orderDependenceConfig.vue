<template>
  <div>
    <el-card>
      <div slot="header">
        <el-row :gutter="20">
          <el-col :span="5">
            <el-select
              style="width: 250px"
              v-model="selectValue"
              placeholder="请选择"
            >
              <el-option
                v-for="item in selectOrderTypes"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="4">
            <el-input
              style="width: 400px"
              v-model="orderNo"
              class="input-with-select"
            >
              <el-button
                @click="searchOrderNo"
                slot="append"
                icon="el-icon-search"
              ></el-button>
            </el-input>
          </el-col>
        </el-row>
      </div>
      <div>
        <el-tree :data="hierarchyData" accordion> </el-tree>
      </div>
    </el-card>
  </div>
</template>

<script>
import { queryOrderTypeMap } from "@/api/dataQuery";

import { queryHierarchy } from "@/api/dataQuery";

export default {
  data() {
    return {
      selectOrderTypes: [], // 所选的交易类型列表
      selectValue: "", // 所选的交易类型
      orderNo: "", // 单号
      hierarchyData: [], // 层级数据
      orderTypeMap: null, // 交易类型名称映射
    };
  },
  created() {
    this.queryMap();
  },
  methods: {
    // 查询订单类型名称映射
    async queryMap() {
      await queryOrderTypeMap().then((response) => {
        this.orderTypeMap = new Map(Object.entries(response.data.data));

        this.orderTypeMap.forEach((item, key) => {
          this.selectOrderTypes.push({
            value: key,
            label: item,
          });
        });
      });
    },
    // 查询层级关系
    async queryHierarchyLevel() {
      this.hierarchyData = [];
      await queryHierarchy(this.selectValue).then((response) => {
        // console.log(response.data.data);
        this.hierarchyData.push(response.data.data);

        this.hierarchyData.forEach((item) => {
          this.recursionData(item);
        });
        // this.recursionData(this.hierarchyData);

        console.log(this.hierarchyData);
      });
    },
    recursionData(data) {
      data.label =
        this.orderTypeMap.get(data.relOrderType) +
        "             " +
        data.templateId;
      if (data.children !== null) {
        data.children.forEach((item) => {
          this.recursionData(item);
        });
      }
    },
    searchOrderNo() {
      this.queryHierarchyLevel();
    },
  },
};
</script>

<style lang="scss" scoped>
</style>

