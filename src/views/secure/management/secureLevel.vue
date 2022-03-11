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
            <el-table-column align="center" prop="secureLevel" label="安全等级">
            </el-table-column>
            <el-table-column
              align="center"
              prop="transmissionMode"
              label="传输模式"
            >
            </el-table-column>
            <el-table-column align="center" prop="storageMode" label="存储模式">
            </el-table-column>
            <el-table-column align="center" prop="displayMode" label="展示模式">
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
      width="50%"
      center
    >
      <el-form
        ref="addSecureLevelRef"
        :model="addSecureLevel"
        :rules="addSecureLevelRules"
        label-width="210px"
      >
        <el-form-item label="安全等级" prop="secureLevel">
          <el-input
            maxlength="2"
            v-model="addSecureLevel.secureLevel"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="传输模式(0: 不加密, 1:加密)"
          prop="transmissionMode"
        >
          <el-input-number
            :min="0"
            :max="1"
            style="width: 380px"
            v-model="addSecureLevel.transmissionMode"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="存储模式(0: 不加密, 1: 加密)" prop="storageMode">
          <el-input-number
            style="width: 380px"
            :min="0"
            :max="1"
            v-model="addSecureLevel.storageMode"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="展示模式(0: 不加密, 1: 加密)" prop="displayMode">
          <el-input-number
            :min="0"
            :max="1"
            style="width: 380px"
            v-model="addSecureLevel.displayMode"
          ></el-input-number>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveSecureLevel">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改对话框 -->
    <el-dialog
      @close="handleCloseUpdDialogVisible"
      title="修改数据"
      :visible.sync="updDialogVisible"
      width="50%"
      center
    >
      <el-form
        ref="updSecureLevelRef"
        :model="updSecureLevel"
        :rules="updSecureLevelRules"
        label-width="210px"
      >
        <el-form-item label="安全等级" prop="secureLevel">
          <el-input
            maxlength="2"
            v-model="updSecureLevel.secureLevel"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="传输模式(0: 不加密, 1:加密)"
          prop="transmissionMode"
        >
          <el-input-number
            :min="0"
            :max="1"
            style="width: 380px"
            v-model="updSecureLevel.transmissionMode"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="存储模式(0: 不加密, 1: 加密)" prop="storageMode">
          <el-input-number
            style="width: 380px"
            :min="0"
            :max="1"
            v-model="updSecureLevel.storageMode"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="展示模式(0: 不加密, 1: 加密)" prop="displayMode">
          <el-input-number
            :min="0"
            :max="1"
            style="width: 380px"
            v-model="updSecureLevel.displayMode"
          ></el-input-number>
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
  saveSecureLevel,
  querySecureLevel,
  updSecureLevel,
  delSecureLevel,
} from "@/api/SecureLevel";

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
      totalCount: 0, // 记录数
      addSecureLevel: {}, // 数据安全等级对象
      addDialogVisible: false, // 添加对话框
      addSecureLevelRules: {
        // 添加表单规则
        secureLevel: [
          { required: true, message: "请输入安全等级", trigger: "blur" },
        ],
      },
      updDialogVisible: false, // 修改对话框
      updSecureLevel: {}, // 单条数据安全等级对象
      updSecureLevelRules: {
        // 添加表单规则
        secureLevel: [
          { required: true, message: "请输入安全等级", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    // 获取数据
    fetchData() {
      getTableData(this.pageRequestDTO).then((response) => {
        if (response.status !== 200) {
          return this.$message.error("获取数据安全等级数据失败!");
        }

        const tempData = response.data.data;

        this.totalCount = tempData.totalCount;
        this.list = tempData.data;

        this.list.forEach((item) => {
          item.displayMode = item.displayMode === 0 ? "不加密" : "加密";
          item.storageMode = item.storageMode === 0 ? "不加密" : "加密";
          item.transmissionMode = item.transmissionMode === 0 ? "不加密" : "加密";
        });
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
    saveSecureLevel() {
      this.$refs.addSecureLevelRef.validate((valid) => {
        if (!valid) return;
        else {
          saveSecureLevel(this.addSecureLevel).then((response) => {
            if (response.status !== 200) {
              return this.$message.error("添加数据安全等级数据失败！");
            }

            this.$message.success("添加数据安全等级数据成功！");
            this.addDialogVisible = false;
            this.fetchData();
          });
        }
      });
    },
    // 添加对话框关闭事件
    handleCloseAddDialogVisible() {
      this.$refs.addSecureLevelRef.resetFields();
    },
    // 修改对话框关闭事件
    handleCloseUpdDialogVisible() {
      this.$refs.updSecureLevelRef.resetFields();
    },
    // 修改按钮操作
    async updBtn(entity) {
      this.updDialogVisible = true;

      await querySecureLevel(entity.id).then((response) => {
        if (response.status !== 200) {
          return this.$message.error("获取此条数据失败！");
        }

        this.updSecureLevel = response.data.data;
      });
    },
    // 修改事件
    updFin() {
      this.$refs.updSecureLevelRef.validate(async (valid) => {
        if (!valid) return;
        else {
          await updSecureLevel(this.updSecureLevel).then((response) => {
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
          await delSecureLevel(entity.id).then((response) => {
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

