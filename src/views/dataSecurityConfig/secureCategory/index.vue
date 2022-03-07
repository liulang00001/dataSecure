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
          <el-table
            :header-cell-style="{ 'text-align': 'center' }"
            stripe
            :data="list"
            style="width: 100%"
          >
            <el-table-column align="center" prop="secureLevel" label="安全级别">
            </el-table-column>
            <el-table-column align="center" prop="name" label="归类名称"> </el-table-column>
            <el-table-column prop="example" label="实例"> </el-table-column>
            <el-table-column prop="description" label="描述"> </el-table-column>
            <el-table-column prop="suggestion" label="建议"> </el-table-column>
            <el-table-column align="center" width="150px" label="操作">
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
        ref="addSecureCategoryRef"
        :model="addSecureCategory"
        :rules="addSecureCategoryRules"
        label-width="110px"
      >
        <el-form-item label="安全级别" prop="secureLevel">
          <el-input
            maxlength="2"
            v-model="addSecureCategory.secureLevel"
          ></el-input>
        </el-form-item>
        <el-form-item label="归类名称" prop="name">
          <el-input v-model="addSecureCategory.name"></el-input>
        </el-form-item>
        <el-form-item label="实例">
          <el-input
            type="textarea"
            v-model="addSecureCategory.example"
          ></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            type="textarea"
            v-model="addSecureCategory.description"
          ></el-input>
        </el-form-item>
        <el-form-item label="建议">
          <el-input
            type="textarea"
            v-model="addSecureCategory.suggestion"
          ></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveSecureCategory">确 定</el-button>
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
        ref="updSecureCategoryRef"
        :model="updSecureCategory"
        :rules="updSecureCategoryRules"
        label-width="110px"
      >
        <el-form-item label="安全级别" prop="secureLevel">
          <el-input
            maxlength="2"
            v-model="updSecureCategory.secureLevel"
          ></el-input>
        </el-form-item>
        <el-form-item label="归类名称" prop="name">
          <el-input v-model="updSecureCategory.name"></el-input>
        </el-form-item>
        <el-form-item label="实例">
          <el-input
            type="textarea"
            v-model="updSecureCategory.example"
          ></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            type="textarea"
            v-model="updSecureCategory.description"
          ></el-input>
        </el-form-item>
        <el-form-item label="建议">
          <el-input
            type="textarea"
            v-model="updSecureCategory.suggestion"
          ></el-input>
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
  saveSecureCategory,
  querySecureCategory,
  updSecureCategory,
  delSecureCategory,
} from "@/api/SecureCategory";

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
      addSecureCategory: {}, // 数据安全目录对象
      addDialogVisible: false, // 添加对话框
      addSecureCategoryRules: {
        // 添加表单规则
        secureLevel: [
          { required: true, message: "请输入安全级别", trigger: "blur" },
        ],
        name: [{ required: true, message: "请输入归类名称", trigger: "blur" }],
      },
      updDialogVisible: false, // 修改对话框
      updSecureCategory: {}, // 单条数据安全目录对象
      updSecureCategoryRules: {
        // 添加表单规则
        secureLevel: [
          { required: true, message: "请输入安全级别", trigger: "blur" },
        ],
        name: [{ required: true, message: "请输入归类名称", trigger: "blur" }],
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
          return this.$message.error("获取数据安全目录数据失败!");
        }

        const tempData = response.data.data;

        this.totalCount = tempData.totalCount;
        this.list = tempData.data;
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
    saveSecureCategory() {
      this.$refs.addSecureCategoryRef.validate((valid) => {
        if (!valid) return;
        else {
          saveSecureCategory(this.addSecureCategory).then((response) => {
            if (response.status !== 200) {
              return this.$message.error("添加数据安全目录数据失败！");
            }

            this.$message.success("添加数据安全目录数据成功！");
            this.addDialogVisible = false;
            this.fetchData();
          });
        }
      });
    },
    // 添加对话框关闭事件
    handleCloseAddDialogVisible() {
      this.$refs.addSecureCategoryRef.resetFields();
    },
    // 修改对话框关闭事件
    handleCloseUpdDialogVisible() {
      this.$refs.updSecureCategoryRef.resetFields();
    },
    // 修改按钮操作
    async updBtn(entity) {
      this.updDialogVisible = true;

      await querySecureCategory(entity.id).then((response) => {
        if (response.status !== 200) {
          return this.$message.error("获取此条数据失败！");
        }

        this.updSecureCategory = response.data.data;
      });
    },
    // 修改事件
    updFin() {
      this.$refs.updSecureCategoryRef.validate(async (valid) => {
        if (!valid) return;
        else {
          await updSecureCategory(this.updSecureCategory).then((response) => {
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
          await delSecureCategory(entity.id).then((response) => {
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

