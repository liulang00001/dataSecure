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
            <el-table-column align="center" prop="name" label="业务域名称">
            </el-table-column>
            <el-table-column align="center" prop="description" label="业务描述">
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
        ref="addFintechDomainRef"
        :model="addFintechDomain"
        :rules="addFintechDomainRules"
        label-width="110px"
      >
        <el-form-item label="业务域名称" prop="name">
          <el-input v-model="addFintechDomain.name"></el-input>
        </el-form-item>
        <el-form-item label="业务域描述">
          <el-input v-model="addFintechDomain.description"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveFintechDomain">确 定</el-button>
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
        ref="updFintechDomainRef"
        :model="updFintechDomain"
        :rules="updFintechDomainRules"
        label-width="110px"
      >
        <el-form-item label="业务域名称" prop="name">
          <el-input v-model="updFintechDomain.name"></el-input>
        </el-form-item>
        <el-form-item label="业务域描述">
          <el-input v-model="updFintechDomain.description"></el-input>
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
  saveFintechDomain,
  queryFintechDomain,
  updFintechDomain,
  delFintechDomain,
} from "@/api/dataQuery";

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
      addFintechDomain: {}, // 互金业务域对象
      addDialogVisible: false, // 添加对话框
      addFintechDomainRules: {
        // 添加表单规则
        name: [
          { required: true, message: "请输入业务域名称", trigger: "blur" },
        ],
      },
      updDialogVisible: false, // 修改对话框
      updFintechDomain: {}, // 单条互金业务域对象
      updFintechDomainRules: {
        // 添加表单规则
        name: [
          { required: true, message: "请输入业务域名称", trigger: "blur" },
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
          return this.$message.error("获取互金业务域数据失败!");
        }

        const tempData = response.data.data;

        this.totalCount = tempData.totalCount;
        this.list = tempData.data;

        console.log(this.list);
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
    saveFintechDomain() {
      this.$refs.addFintechDomainRef.validate((valid) => {
        if (!valid) return;
        else {
          saveFintechDomain(this.addFintechDomain).then((response) => {
            if (response.status !== 200) {
              return this.$message.error("添加互金业务域数据失败！");
            }

            this.$message.success("添加互金业务域数据成功！");
            this.addDialogVisible = false;
            this.fetchData();
          });
        }
      });
    },
    // 添加对话框关闭事件
    handleCloseAddDialogVisible() {
      this.$refs.addFintechDomainRef.resetFields();
    },
    // 修改对话框关闭事件
    handleCloseUpdDialogVisible() {
      this.$refs.updFintechDomainRef.resetFields();
    },
    // 修改按钮操作
    async updBtn(entity) {
      this.updDialogVisible = true;

      await queryFintechDomain(entity.id).then((response) => {
        if (response.status !== 200) {
          return this.$message.error("获取此条数据失败！");
        }

        this.updFintechDomain = response.data.data;
      });
    },
    // 修改事件
    updFin() {
      this.$refs.updFintechDomainRef.validate(async (valid) => {
        if (!valid) return;
        else {
          await updFintechDomain(this.updFintechDomain).then((response) => {
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
          await delFintechDomain(entity.id).then((response) => {
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

