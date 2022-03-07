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
          <el-table stripe :data="list" style="width: 1500px">
            <el-table-column
              show-overflow-tooltip
              align="center"
              prop="sourceId"
              label="数据源编号"
            >
            </el-table-column>
            <el-table-column align="center" prop="sourceType">
              <template slot="header" slot-scope="scope">
                <span>数据源类型</span>
                <el-tooltip
                  effect="dark"
                  content="(0:mysql,1:elasticsearch-sql,2:doris,3:clickhouse,4:elasticsearch-dsl)"
                  placement="top"
                >
                  <i class="el-icon-question"></i>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="driverClassName"
              label="驱动包名"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              align="center"
              prop="url"
              show-overflow-tooltip
              label="数据库链接"
            >
            </el-table-column>
            <el-table-column align="center" prop="username" label="用户名">
            </el-table-column>
            <el-table-column align="center" prop="testWhileIdle">
              <template slot="header" slot-scope="scope">
                <span>指明连接</span>
                <el-tooltip
                  effect="dark"
                  content="指明连接是否被空闲连接回收器(如果有)进行检验.如果检测失败,则连接将被从池中去除"
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
            <el-table-column align="center" prop="initOnStartup">
              <template slot="header" slot-scope="scope">
                <span>数据源</span>
                <el-tooltip
                  effect="dark"
                  content="数据源是否在应用启动时进行初始化(0:否，1:是)"
                  placement="top"
                >
                  <i class="el-icon-question"></i>
                </el-tooltip>
              </template>
            </el-table-column>
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
      width="60%"
      center
    >
      <el-form
        ref="addQuerySourceRef"
        :model="addQuerySource"
        :rules="addQuerySourceRules"
        label-width="110px"
      >
        <el-form-item label="数据源编号" prop="sourceId">
          <el-input v-model="addQuerySource.sourceId"></el-input>
        </el-form-item>
        <el-form-item label="数据源类型" prop="sourceType">
          <el-input-number
            placeholder="(0:mysql,1:elasticsearch-sql,2:doris,3:clickhouse,4:elasticsearch-dsl)"
            v-model="addQuerySource.sourceType"
            style="width: 600px"
            :min="0"
            :max="4"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="驱动包名">
          <el-input v-model="addQuerySource.driverClassName"></el-input>
        </el-form-item>
        <el-form-item label="数据库链接" prop="url">
          <el-input v-model="addQuerySource.url"></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addQuerySource.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addQuerySource.password"></el-input>
        </el-form-item>
        <el-form-item label="指明连接">
          <el-input-number
            placeholder="指明连接是否被空闲连接回收器(如果有)进行检验.如果检测失败,则连接将被从池中去除"
            v-model="addQuerySource.testWhileIdle"
            :min="0"
            :max="1"
            style="width: 600px"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="验证连接">
          <el-input
            placeholder="验证连接是否可用的SQL语句"
            v-model="addQuerySource.validationQuery"
          ></el-input>
        </el-form-item>
        <el-form-item label="数据源">
          <el-input-number
            placeholder="数据源是否在应用启动时进行初始化(0:否，1:是)"
            v-model="addQuerySource.initOnStartup"
            style="width: 600px"
            :min="0"
            :max="1"
          ></el-input-number>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveQuerySource">确 定</el-button>
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
        ref="updQuerySourceRef"
        :model="updQuerySource"
        :rules="updQuerySourceRules"
        label-width="110px"
      >
        <el-form-item label="数据源编号" prop="sourceId">
          <el-input v-model="updQuerySource.sourceId"></el-input>
        </el-form-item>
        <el-form-item label="数据源类型" prop="sourceType">
          <el-input-number
            placeholder="(0:mysql,1:elasticsearch-sql,2:doris,3:clickhouse,4:elasticsearch-dsl)"
            v-model="updQuerySource.sourceType"
            style="width: 600px"
            :min="0"
            :max="4"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="驱动包名">
          <el-input v-model="updQuerySource.driverClassName"></el-input>
        </el-form-item>
        <el-form-item label="数据库链接" prop="url">
          <el-input v-model="updQuerySource.url"></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="updQuerySource.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="updQuerySource.password"></el-input>
        </el-form-item>
        <el-form-item label="指明连接">
          <el-input-number
            placeholder="指明连接是否被空闲连接回收器(如果有)进行检验.如果检测失败,则连接将被从池中去除"
            v-model="updQuerySource.testWhileIdle"
            :min="0"
            :max="1"
            style="width: 600px"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="验证连接">
          <el-input
            placeholder="验证连接是否可用的SQL语句"
            v-model="updQuerySource.validationQuery"
          ></el-input>
        </el-form-item>
        <el-form-item label="数据源">
          <el-input-number
            placeholder="数据源是否在应用启动时进行初始化(0:否，1:是)"
            v-model="updQuerySource.initOnStartup"
            style="width: 600px"
            :min="0"
            :max="1"
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
  saveQuerySource,
  queryQuerySource,
  updQuerySource,
  delQuerySource,
} from "@/api/QuerySource";

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
      addQuerySource: {}, // 数据查询资源对象
      addDialogVisible: false, // 添加对话框
      addQuerySourceRules: {
        // 添加表单规则
        sourceId: [
          { required: true, message: "请输入数据源编号", trigger: "blur" },
        ],
        sourceType: [
          {
            required: true,
            message:
              "请输入数据源类型(0:mysql,1:elasticsearch-sql,2:doris,3:clickhouse,4:elasticsearch-dsl)",
            trigger: "blur",
          },
        ],
        url: [{ required: true, message: "请输入数据库链接", trigger: "blur" }],
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
      },
      updDialogVisible: false, // 修改对话框
      updQuerySource: {}, // 单条数据查询资源对象
      updQuerySourceRules: {
        // 添加表单规则
        sourceId: [
          { required: true, message: "请输入数据源编号", trigger: "blur" },
        ],
        sourceType: [
          {
            required: true,
            message:
              "请输入数据源类型(0:mysql,1:elasticsearch-sql,2:doris,3:clickhouse,4:elasticsearch-dsl)",
            trigger: "blur",
          },
        ],
        url: [{ required: true, message: "请输入数据库链接", trigger: "blur" }],
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
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
          return this.$message.error("获取数据查询资源数据失败!");
        }

        const tempData = response.data.data;

        this.totalCount = tempData.totalCount;
        this.list = tempData.data;

        this.list.forEach((item) => {
          if (item.sourceType === 0) {
            item.sourceType = "MySQL";
          } else if (item.sourceType === 1) {
            item.sourceType = "ElaticSearch";
          } else if (item.sourceType === 2) {
            item.sourceType = "Doris";
          } else if (item.sourceType === 3) {
            item.sourceType = "ClickHouse";
          } else if (item.sourceType === 4) {
            item.sourceType = "ElasticSearch-DSL";
          }

          item.initOnStartup = item.initOnStartup === 0 ? "否" : "是";
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
    saveQuerySource() {
      this.$refs.addQuerySourceRef.validate((valid) => {
        if (!valid) return;
        else {
          saveQuerySource(this.addQuerySource).then((response) => {
            if (response.status !== 200) {
              return this.$message.error("添加数据查询资源数据失败！");
            }

            this.$message.success("添加数据查询资源数据成功！");
            this.addDialogVisible = false;
            this.fetchData();
          });
        }
      });
    },
    // 添加对话框关闭事件
    handleCloseAddDialogVisible() {
      this.$refs.addQuerySourceRef.resetFields();
    },
    // 修改对话框关闭事件
    handleCloseUpdDialogVisible() {
      this.$refs.updQuerySourceRef.resetFields();
    },
    // 修改按钮操作
    async updBtn(entity) {
      this.updDialogVisible = true;

      await queryQuerySource(entity.id).then((response) => {
        if (response.status !== 200) {
          return this.$message.error("获取此条数据失败！");
        }

        this.updQuerySource = response.data.data;
      });
    },
    // 修改事件
    updFin() {
      this.$refs.updQuerySourceRef.validate(async (valid) => {
        if (!valid) return;
        else {
          await updQuerySource(this.updQuerySource).then((response) => {
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
          await delQuerySource(entity.id).then((response) => {
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

