<template>
  <div>
    <div class="table">
      <el-card>
        <div slot="header">
          <el-button type="primary" @click="addDialogVisible = true"
            >添加记录</el-button
          >
        </div>

        <!-- 表格数据 -->
        <div>
          <el-table stripe :data="list" style="width: 100%">
            <el-table-column align="center" prop="sourceId" label="数据源ID">
            </el-table-column>
            <el-table-column
              align="center"
              prop="categoryId"
              label="合规示例表主键"
            >
            </el-table-column>
            <el-table-column
              align="center"
              prop="tableSchema"
              label="数据库名称"
            >
            </el-table-column>
            <el-table-column align="center" prop="tableName" label="数据表名称">
            </el-table-column>
            <el-table-column align="center" prop="fieldName" label="字段名称">
            </el-table-column>
            <el-table-column align="center" prop="fieldDesc" label="字段描述">
            </el-table-column>
            <el-table-column
              align="center"
              prop="privilegeLevel"
              label="权限等级"
            >
            </el-table-column>
            <el-table-column align="center" prop="domainId" label="业务域">
            </el-table-column>
            <el-table-column align="center" prop="collectMode" label="采集方式">
            </el-table-column>
            <el-table-column
              align="center"
              prop="usageScenario"
              label="使用场景"
            >
            </el-table-column>
            <el-table-column width="150px" align="center" label="操作">
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
      width="60%"
      center
    >
      <el-form
        ref="addSecureFieldRef"
        :model="addSecureField"
        :rules="addSecureFieldRules"
        label-width="110px"
      >
        <el-form-item label="数据源ID" prop="sourceId">
          <el-input-number
            :min="0"
            style="width: 600px"
            v-model="addSecureField.sourceId"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="合规示例表主键" prop="categoryId">
          <el-input v-model="addSecureField.categoryId"></el-input>
        </el-form-item>
        <el-form-item label="数据库名称" prop="tableSchema">
          <el-input v-model="addSecureField.tableSchema"></el-input>
        </el-form-item>
        <el-form-item label="数据表名称" prop="tableName">
          <el-input v-model="addSecureField.tableName"></el-input>
        </el-form-item>
        <el-form-item label="字段名称" prop="fieldName">
          <el-input v-model="addSecureField.fieldName"></el-input>
        </el-form-item>
        <el-form-item label="字段描述">
          <el-input v-model="addSecureField.fieldDesc"></el-input>
        </el-form-item>
        <el-form-item label="权限等级" prop="privilegeLevel">
          <el-input-number
            style="width: 600px"
            v-model="addSecureField.privilegeLevel"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="业务域">
          <el-input v-model="addSecureField.domainId"></el-input>
        </el-form-item>
        <el-form-item label="采集方式" prop="collectMode">
          <el-input v-model="addSecureField.collectMode"></el-input>
        </el-form-item>
        <el-form-item label="使用场景" prop="usageScenario">
          <el-input v-model="addSecureField.usageScenario"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveSecureField">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改对话框 -->
    <el-dialog
      @close="handleCloseUpdDialogVisible"
      title="修改数据"
      :visible.sync="updDialogVisible"
      width="60%"
      center
    >
      <el-form
        ref="updSecureFieldRef"
        :model="updSecureField"
        :rules="updSecureFieldRules"
        label-width="110px"
      >
        <el-form-item label="数据源ID" prop="sourceId">
          <el-input-number
            :min="0"
            style="width: 600px"
            v-model="updSecureField.sourceId"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="合规示例表主键" prop="categoryId">
          <el-input v-model="updSecureField.categoryId"></el-input>
        </el-form-item>
        <el-form-item label="数据库名称" prop="tableSchema">
          <el-input v-model="updSecureField.tableSchema"></el-input>
        </el-form-item>
        <el-form-item label="数据表名称" prop="tableName">
          <el-input v-model="updSecureField.tableName"></el-input>
        </el-form-item>
        <el-form-item label="字段名称" prop="fieldName">
          <el-input v-model="updSecureField.fieldName"></el-input>
        </el-form-item>
        <el-form-item label="字段描述">
          <el-input v-model="updSecureField.fieldDesc"></el-input>
        </el-form-item>
        <el-form-item label="权限等级" prop="privilegeLevel">
          <el-input-number
            style="width: 600px"
            v-model="updSecureField.privilegeLevel"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="业务域">
          <el-input-number
            style="width: 600px"
            v-model="updSecureField.domainId"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="采集方式" prop="collectMode">
          <el-input
            style="width: 600px"
            v-model="updSecureField.collectMode"
          ></el-input>
        </el-form-item>
        <el-form-item label="使用场景" prop="usageScenario">
          <el-input v-model="updSecureField.usageScenario"></el-input>
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
  saveSecureField,
  querySecureField,
  updSecureField,
  delSecureField,
} from "@/api/SecureField";

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
      },
      loading: true, // 加载
      sourceIdMap: null, // 数据源ID匹配
      totalCount: 0, // 记录数
      addSecureField: {}, // 数据安全字段对象
      addDialogVisible: false, // 添加对话框
      addSecureFieldRules: {
        // 添加表单规则
        sourceId: [
          { required: true, message: "请输入数据源ID", trigger: "blur" },
        ],
        categoryId: [
          { type: "number", message: "请输入数字类型", trigger: "blur" },
        ],
        tableSchema: [
          { required: true, message: "请输入数据库名称", trigger: "blur" },
        ],
        tableName: [
          { required: true, message: "请输入数据表名称", trigger: "blur" },
        ],
        fieldName: [
          { required: true, message: "请输入字段名称", trigger: "blur" },
        ],
        collectMode: [
          { type: "number", message: "采集方式必须为数字", trigger: "blur" },
        ],
      },
      updDialogVisible: false, // 修改对话框
      updSecureField: {}, // 单条数据安全字段对象
      updSecureFieldRules: {
        // 添加表单规则
        sourceId: [
          { required: true, message: "请输入数据源ID", trigger: "blur" },
        ],
        categoryId: [
          { type: "number", message: "请输入数字类型", trigger: "blur" },
        ],
        tableSchema: [
          { required: true, message: "请输入数据库名称", trigger: "blur" },
        ],
        tableName: [
          { required: true, message: "请输入数据表名称", trigger: "blur" },
        ],
        fieldName: [
          { required: true, message: "请输入字段名称", trigger: "blur" },
        ],
        collectMode: [
          { type: "number", message: "采集方式必须为数字", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.querySourceIdMap();
    this.fetchData();
  },
  methods: {
    // 获取数据
    fetchData() {
      getTableData(this.pageRequestDTO).then((response) => {
        if (response.status !== 200) {
          return this.$message.error("获取数据安全字段数据失败!");
        }

        const tempData = response.data.data;

        this.totalCount = tempData.totalCount;
        this.list = tempData.data;

        console.log(this.list);

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
    saveSecureField() {
      this.$refs.addSecureFieldRef.validate((valid) => {
        if (!valid) return;
        else {
          saveSecureField(this.addSecureField).then((response) => {
            if (response.status !== 200) {
              return this.$message.error("添加数据安全字段数据失败！");
            }

            this.$message.success("添加数据安全字段数据成功！");
            this.addDialogVisible = false;
            this.fetchData();
          });
        }
      });
    },
    // 添加对话框关闭事件
    handleCloseAddDialogVisible() {
      this.$refs.addSecureFieldRef.resetFields();
    },
    // 修改对话框关闭事件
    handleCloseUpdDialogVisible() {
      this.$refs.updSecureFieldRef.resetFields();
    },
    // 修改按钮操作
    async updBtn(entity) {
      this.updDialogVisible = true;

      await querySecureField(entity.id).then((response) => {
        if (response.status !== 200) {
          return this.$message.error("获取此条数据失败！");
        }

        this.updSecureField = response.data.data;
        console.log(this.updSecureField);
        console.log("response", response);
      });
    },
    // 修改事件
    updFin() {
      this.$refs.updSecureFieldRef.validate(async (valid) => {
        if (!valid) return;
        else {
          await updSecureField(this.updSecureField).then((response) => {
            if (response.status !== 200)
              return this.$message.error("修改记录失败！");

            this.$message.success("修改数据成功！");
            this.updDialogVisible = false;
            this.fetchData();
          });
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
          await delSecureField(entity.id).then((response) => {
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

