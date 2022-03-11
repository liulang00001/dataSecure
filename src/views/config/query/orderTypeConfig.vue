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
            <el-table-column align="center" prop="orderType" label="订单号类型">
            </el-table-column>
            <el-table-column align="center" prop="orderDesc" label="订单号描述">
            </el-table-column>
            <el-table-column align="center" prop="orderSeq" label="订单排序">
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
        ref="addQueryOrderConfigRef"
        :model="addQueryOrderConfig"
        :rules="addQueryOrderConfigRules"
        label-width="110px"
      >
        <el-form-item label="订单号类型" prop="orderType">
          <el-input v-model="addQueryOrderConfig.orderType"></el-input>
        </el-form-item>
        <el-form-item label="订单号描述">
          <el-input v-model="addQueryOrderConfig.orderDesc"></el-input>
        </el-form-item>
        <el-form-item label="订单排序" prop="orderSeq">
          <el-input-number
            :min="0"
            v-model="addQueryOrderConfig.orderSeq"
          ></el-input-number>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveQueryOrderConfig"
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
        ref="updQueryOrderConfigRef"
        :model="updQueryOrderConfig"
        :rules="updQueryOrderConfigRules"
        label-width="110px"
      >
        <el-form-item label="订单号类型" prop="orderType">
          <el-input v-model="updQueryOrderConfig.orderType"></el-input>
        </el-form-item>
        <el-form-item label="订单号描述">
          <el-input v-model="updQueryOrderConfig.orderDesc"></el-input>
        </el-form-item>
        <el-form-item label="订单排序" prop="orderSeq">
          <el-input :min="0" v-model="updQueryOrderConfig.orderSeq"></el-input>
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
  saveQueryOrderConfig,
  queryQueryOrderConfig,
  updQueryOrderConfig,
  delQueryOrderConfig,
} from "@/api/queryOrderConfig";

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
      addQueryOrderConfig: {}, // 数据查询订单配置对象
      addDialogVisible: false, // 添加对话框
      addQueryOrderConfigRules: {
        // 添加表单规则
        orderType: [
          { required: true, message: "请输入订单号类型", trigger: "blur" },
        ],
        orderSeq: [
          { required: true, message: "请输入订单排序", trigger: "blur" },
        ],
      },
      updDialogVisible: false, // 修改对话框
      updQueryOrderConfig: {}, // 单条数据查询订单配置对象
      updQueryOrderConfigRules: {
        // 添加表单规则
        orderType: [
          { required: true, message: "请输入订单号类型", trigger: "blur" },
        ],
        orderSeq: [
          { required: true, message: "请输入订单排序", trigger: "blur" },
          { type: "number", message: "订单排序必须为数字值", trigger: "blur" },
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
          return this.$message.error("获取数据查询订单配置数据失败!");
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
    saveQueryOrderConfig() {
      this.$refs.addQueryOrderConfigRef.validate((valid) => {
        if (!valid) return;
        else {
          saveQueryOrderConfig(this.addQueryOrderConfig).then((response) => {
            if (response.status !== 200) {
              return this.$message.error("添加数据查询订单配置数据失败！");
            }

            this.$message.success("添加数据查询订单配置数据成功！");
            this.addDialogVisible = false;
            this.fetchData();
          });
        }
      });
    },
    // 添加对话框关闭事件
    handleCloseAddDialogVisible() {
      this.$refs.addQueryOrderConfigRef.resetFields();
    },
    // 修改对话框关闭事件
    handleCloseUpdDialogVisible() {
      this.$refs.updQueryOrderConfigRef.resetFields();
    },
    // 修改按钮操作
    async updBtn(entity) {
      this.updDialogVisible = true;

      await queryQueryOrderConfig(entity.id).then((response) => {
        if (response.status !== 200) {
          return this.$message.error("获取此条数据失败！");
        }

        this.updQueryOrderConfig = response.data.data;
      });
    },
    // 修改事件
    updFin() {
      this.$refs.updQueryOrderConfigRef.validate(async (valid) => {
        if (!valid) return;
        else {
          await updQueryOrderConfig(this.updQueryOrderConfig).then(
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
          await delQueryOrderConfig(entity.id).then((response) => {
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

