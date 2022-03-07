<template>
  <div>
    <div class="table">
      <el-card>
        <div slot="header">
          <el-row :gutter="10">
            <el-col :span="3">
              <el-button type="primary" @click="addDialogVisible = true"
                >添加记录</el-button
              >
            </el-col>
            <el-col :offset="14" :span="4">
              <el-select
                v-model="selectDatasource"
                placeholder="请选择数据库名称"
              >
                <el-option
                  v-for="item in datasources"
                  :key="item"
                  :label="item"
                  :value="item"
                >
                </el-option>
              </el-select>
            </el-col>

            <el-col :span="2">
              <el-button
                @click="fetchDataByCondition"
                type="success"
                circle
                icon="el-icon-search"
              ></el-button>
            </el-col>
          </el-row>
        </div>

        <!-- 表格数据 -->
        <div>
          <el-table stripe :data="list" style="width: 100%">
            <el-table-column align="center" prop="sourceId" label="数据源ID">
            </el-table-column>
            <el-table-column
              align="center"
              prop="tableSchema"
              label="数据库名称"
            >
            </el-table-column>
            <el-table-column align="center" prop="tableName" label="数据表名称">
            </el-table-column>
            <el-table-column align="center" label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="updBtn(scope.row)"
                ></el-button>
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="delBtn(scope.row)"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>

          <!-- 分页 -->

          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageRequestDTO.pageNum"
            :page-sizes="[10, 50, 100, 200]"
            :page-size="pageRequestDTO.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalCount"
          >
          </el-pagination>
        </div>
      </el-card>
    </div>

    <!-- 添加对话框 -->
    <el-dialog
      @close="handleCloseAddDialogVisible"
      title="添加数据"
      :visible.sync="addDialogVisible"
      width="30%"
      center
    >
      <el-form
        ref="addSecureExclusiveTableRef"
        :model="addSecureExclusiveTable"
        :rules="addSecureExclusiveTableRules"
        label-width="110px"
      >
        <el-form-item label="数据源ID" prop="sourceId">
          <el-input-number
            :min="0"
            v-model="addSecureExclusiveTable.sourceId"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="数据库名称" prop="tableSchema">
          <el-input v-model="addSecureExclusiveTable.tableSchema"></el-input>
        </el-form-item>
        <el-form-item label="数据表名称" prop="tableName">
          <el-input v-model="addSecureExclusiveTable.tableName"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveSecureExclusiveTable"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 修改对话框 -->
    <el-dialog
      @close="handleCloseUpdDialogVisible"
      title="修改数据"
      :visible.sync="updDialogVisible"
      width="30%"
      center
    >
      <el-form
        ref="updSecureExclusiveTableRef"
        :model="updSecureExclusiveTable"
        :rules="updSecureExclusiveTableRules"
        label-width="110px"
      >
        <el-form-item label="数据源ID" prop="sourceId">
          <el-input-number
            :min="0"
            v-model="updSecureExclusiveTable.sourceId"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="数据库名称" prop="tableSchema">
          <el-input v-model="updSecureExclusiveTable.tableSchema"></el-input>
        </el-form-item>
        <el-form-item label="数据表名称" prop="tableName">
          <el-input v-model="updSecureExclusiveTable.tableName"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="updDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updFin">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getTableData,
  saveSecureExclusiveTable,
  querySecureExclusiveTable,
  updSecureExclusiveTable,
  delSecureExclusiveTable,
  queryTableSchema,
} from "@/api/SecureExclusiveTable";

import { querySourceIdMap } from "@/api/QuerySource";

export default {
  data() {
    return {
      list: [], // 表记录数据
      tableData: null, // 表数据
      pageRequestDTO: {
        // 分页查询
        pageNum: 1,
        pageSize: 10,
        params: null,
      },
      datasources: [], // 数据库列表
      selectDatasource: "", // 选择的数据库
      sourceIdMap: null, // 数据源ID匹配
      loading: true, // 加载
      totalCount: 0, // 记录数
      addSecureExclusiveTable: {}, // 数据安全待排除对象
      addDialogVisible: false, // 添加对话框
      addSecureExclusiveTableRules: {
        // 添加表单规则
        sourceId: [
          { required: true, message: "请输入数据源ID", trigger: "blur" },
        ],
        tableSchema: [
          { required: true, message: "请输入数据库名称", trigger: "blur" },
        ],
        tableName: [
          { required: true, message: "请输入数据表名称", trigger: "blur" },
        ],
      },
      updDialogVisible: false, // 修改对话框
      updSecureExclusiveTable: {}, // 单条数据安全待排除对象
      updSecureExclusiveTableRules: {
        // 添加表单规则
        sourceId: [
          { required: true, message: "请输入数据源ID", trigger: "blur" },
        ],
        tableSchema: [
          { required: true, message: "请输入数据库名称", trigger: "blur" },
        ],
        tableName: [
          { required: true, message: "请输入数据表名称", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.querySourceIdMap();
    this.fetchData();
    this.getDatabases();
  },
  methods: {
    // 获取数据
    async fetchData() {
      await getTableData(this.pageRequestDTO).then((response) => {
        if (response.status !== 200) {
          return this.$message.error("获取数据安全待排除数据失败!");
        }

        const tempData = response.data.data;

        this.totalCount = tempData.totalCount;
        this.list = tempData.data;

        this.list.forEach((item) => {
          item.sourceId = this.sourceIdMap.get(item.sourceId.toString());
        });
      });
    },
    // 获取数据源ID映射
    async querySourceIdMap() {
      await querySourceIdMap().then((response) => {
        if (response.status !== 200) {
          return this.$message.error("获取数据源ID映射失败！");
        }

        this.sourceIdMap = new Map(Object.entries(response.data.data));
      });
    },
    // 获取数据库名称列表
    async getDatabases() {
      await queryTableSchema().then((response) => {
        if (response.status !== 200) {
          return this.$message.error("获取数据库列表失败！");
        }

        this.datasources = response.data.data;
      });
    },
    // 给定数据库条件下查询数据
    fetchDataByCondition() {
      this.pageRequestDTO.params = {
        tableSchema: this.selectDatasource,
      };

      this.fetchData();
    },
    // 修改页数据大小
    handleSizeChange(newSize) {
      this.pageRequestDTO.pageSize = newSize;
      this.fetchData();
    },
    // 修改当前页码
    handleCurrentChange(newPage) {
      this.pageRequestDTO.pageNum = newPage;
      this.fetchData();
    },
    // 添加数据
    saveSecureExclusiveTable() {
      this.$refs.addSecureExclusiveTableRef.validate((valid) => {
        if (!valid) return;
        else {
          saveSecureExclusiveTable(this.addSecureExclusiveTable).then(
            (response) => {
              if (response.status !== 200) {
                return this.$message.error("添加数据安全待排除数据失败！");
              }

              this.$message.success("添加数据安全待排除数据成功！");
              this.addDialogVisible = false;
              this.fetchData();
            }
          );
        }
      });
    },
    // 添加对话框关闭事件
    handleCloseAddDialogVisible() {
      this.$refs.addSecureExclusiveTableRef.resetFields();
    },
    // 修改对话框关闭事件
    handleCloseUpdDialogVisible() {
      this.$refs.updSecureExclusiveTableRef.resetFields();
    },
    // 修改按钮操作
    async updBtn(entity) {
      this.updDialogVisible = true;

      await querySecureExclusiveTable(entity.id).then((response) => {
        if (response.status !== 200) {
          return this.$message.error("获取此条数据失败！");
        }

        this.updSecureExclusiveTable = response.data.data;
      });
    },
    // 修改事件
    updFin() {
      this.$refs.updSecureExclusiveTableRef.validate(async (valid) => {
        if (!valid) return;
        else {
          await updSecureExclusiveTable(this.updSecureExclusiveTable).then(
            (response) => {
              if (response.status !== 200)
                return this.$message.error("修改记录失败！");

              this.$message.success("修改数据成功！");
              this.updDialogVisible = false;
              this.fetchData();
            }
          );
        }
      });
    },
    // 删除操作
    delBtn(entity) {
      this.$confirm("此操作将永久删除记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          await delSecureExclusiveTable(entity.id).then((response) => {
            if (response.status !== 200)
              return this.$message.error("删除失败！");

            this.$message.success("删除记录成功！");
            this.fetchData();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>

