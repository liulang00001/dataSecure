<template>
  <div>
    <div class="table">
      <el-card>
        <div slot="header">
          <el-button type="primary" @click="addDialogVisible = true">添加记录</el-button>
        </div>

        <!-- 表格数据 -->
        <div>
          <el-table
            :header-cell-style="{ 'text-align': 'center' }"
            stripe
            :data="list"
            style="width: 100%"
          >
            <el-table-column
              prop="driverClassName"
              label="驱动包类名"
            >
            </el-table-column>
            <el-table-column prop="url" label="数据库连接">
            </el-table-column>
            <el-table-column align="center" prop="username" label="用户名">
            </el-table-column>
            <el-table-column align="center" prop="testWhileIdle">
              <template slot="header" slot-scope="scope">
                <span>指明连接</span>
                <el-tooltip
                  effect="dark"
                  content="指明连接是否被空闲连接回收器(如果有)进行检验.如果检测失败,则连接将被从池中去除）"
                  placement="top"
                >
                  <i class="el-icon-question"></i>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="validationQuery"
              label="验证连接是否可用的SQL语句"
            >
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              align="center"
              prop="exclusiveSchema"
              label="待排除的数据库名称集合"
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
        ref="addSecureScanSourceRef"
        :model="addSecureScanSource"
        :rules="addSecureScanSourceRules"
        label-width="210px"
      >
        <el-form-item label="驱动包类" prop="driverClassName">
          <el-input v-model="addSecureScanSource.driverClassName"></el-input>
        </el-form-item>
        <el-form-item label="数据库连接" prop="url">
          <el-input
            type="textarea"
            v-model="addSecureScanSource.url"
          ></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addSecureScanSource.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addSecureScanSource.password"></el-input>
        </el-form-item>
        <el-form-item label="指明连接" prop="testWhileIdle">
          <el-input-number
            style="width: 520px"
            placeholder="指明连接是否被空闲连接回收器(如果有)进行检验.如果检测失败,则连接将被从池中去除"
            v-model="addSecureScanSource.testWhileIdle"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="验证连接是否可用的SQL语句" prop="validationQuery">
          <el-input v-model="addSecureScanSource.validationQuery"></el-input>
        </el-form-item>
        <el-form-item label="待排除的数据库名称集合" prop="exclusiveSchema">
          <el-input
            type="textarea"
            v-model="addSecureScanSource.exclusiveSchema"
          ></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveSecureScanSource"
          >确 定</el-button
        >
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
        ref="updSecureScanSourceRef"
        :model="updSecureScanSource"
        :rules="updSecureScanSourceRules"
        label-width="210px"
      >
        <el-form-item label="驱动包类" prop="driverClassName">
          <el-input v-model="updSecureScanSource.driverClassName"></el-input>
        </el-form-item>
        <el-form-item label="数据库连接" prop="url">
          <el-input
            type="textarea"
            v-model="updSecureScanSource.url"
          ></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="updSecureScanSource.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="updSecureScanSource.password"></el-input>
        </el-form-item>
        <el-form-item label="指明连接" prop="testWhileIdle">
          <el-input-number
            style="width: 520px"
            placeholder="指明连接是否被空闲连接回收器(如果有)进行检验.如果检测失败,则连接将被从池中去除"
            v-model="updSecureScanSource.testWhileIdle"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="验证连接是否可用的SQL语句" prop="validationQuery">
          <el-input v-model="updSecureScanSource.validationQuery"></el-input>
        </el-form-item>
        <el-form-item label="待排除的数据库名称集合" prop="exclusiveSchema">
          <el-input
            type="textarea"
            v-model="updSecureScanSource.exclusiveSchema"
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
  saveSecureScanSource,
  querySecureScanSource,
  updSecureScanSource,
  delSecureScanSource,
} from "@/api/dataSecure";

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
      addSecureScanSource: {}, // 数据安全扫描数据对象
      addDialogVisible: false, // 添加对话框
      addSecureScanSourceRules: {
        // 添加表单规则
        driverClassName: [
          { required: true, message: "请输入驱动包类名", trigger: "blur" },
        ],
        url: [{ required: true, message: "数据库连接", trigger: "blur" }],
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        validationQuery: [
          {
            required: true,
            message: "请输入验证连接是否可用的SQL语句",
            trigger: "blur",
          },
        ],
      },
      updDialogVisible: false, // 修改对话框
      updSecureScanSource: {}, // 单条数据安全扫描数据对象
      updSecureScanSourceRules: {
        driverClassName: [
          { required: true, message: "请输入驱动包类名", trigger: "blur" },
        ],
        url: [{ required: true, message: "数据库连接", trigger: "blur" }],
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        validationQuery: [
          {
            required: true,
            message: "请输入验证连接是否可用的SQL语句",
            trigger: "blur",
          },
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
          return this.$message.error("获取数据安全扫描数据数据失败!");
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
    saveSecureScanSource() {
      this.$refs.addSecureScanSourceRef.validate((valid) => {
        if (!valid) return;
        else {
          saveSecureScanSource(this.addSecureScanSource).then((response) => {
            if (response.status !== 200) {
              return this.$message.error("添加数据安全扫描数据数据失败！");
            }

            this.$message.success("添加数据安全扫描数据数据成功！");
            this.addDialogVisible = false;
            this.fetchData();
          });
        }
      });
    },
    // 添加对话框关闭事件
    handleCloseAddDialogVisible() {
      this.$refs.addSecureScanSourceRef.resetFields();
    },
    // 修改对话框关闭事件
    handleCloseUpdDialogVisible() {
      this.$refs.updSecureScanSourceRef.resetFields();
    },
    // 修改按钮操作
    async updBtn(entity) {
      this.updDialogVisible = true;

      await querySecureScanSource(entity.id).then((response) => {
        if (response.status !== 200) {
          return this.$message.error("获取此条数据失败！");
        }

        this.updSecureScanSource = response.data.data;
      });
    },
    // 修改事件
    updFin() {
      this.$refs.updSecureScanSourceRef.validate(async (valid) => {
        if (!valid) return;
        else {
          await updSecureScanSource(this.updSecureScanSource).then(
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
          await delSecureScanSource(entity.id).then((response) => {
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

