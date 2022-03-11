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
          <el-table :header-cell-style="{'text-align':'center'}" stripe :data="list" style="width: 100%">
            <el-table-column align="center" prop="sourceId" label="数据源编号">
            </el-table-column>
            <el-table-column align="center" prop="categoryId" label="分类名称">
            </el-table-column>
            <el-table-column prop="templateId" label="模板编号">
            </el-table-column>
            <el-table-column
              prop="templateDesc"
              label="模板描述"
            >
            </el-table-column>
            <el-table-column
              align="center"
              prop="scriptTemplate"
              show-overflow-tooltip
              label="脚本模板"
            >
            </el-table-column>
            <el-table-column align="center" prop="additional">
              <template slot="header" slot-scope="scope">
                <span>附加信息</span>
                <el-tooltip
                  effect="dark"
                  content="附加信息（当 source_type = 4时，字段值为es索引名称）"
                  placement="top"
                >
                  <i class="el-icon-question"></i>
                </el-tooltip>
              </template>
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
        ref="addQueryTemplateRef"
        :model="addQueryTemplate"
        :rules="addQueryTemplateRules"
        label-width="110px"
      >
        <el-form-item label="数据源编号" prop="sourceId">
          <el-input v-model="addQueryTemplate.sourceId"></el-input>
        </el-form-item>
        <el-form-item label="分类名称" prop="categoryId">
          <el-input-number
            style="width: 600px"
            v-model="addQueryTemplate.categoryId"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="模板编号" prop="templateId">
          <el-input v-model="addQueryTemplate.templateId"></el-input>
        </el-form-item>
        <el-form-item label="模板描述">
          <el-input v-model="addQueryTemplate.templateDesc"></el-input>
        </el-form-item>
        <el-form-item label="脚本模板" prop="scriptTemplate">
          <el-input
            type="textarea"
            v-model="addQueryTemplate.scriptTemplate"
          ></el-input>
        </el-form-item>
        <el-form-item label="附加信息">
          <el-input
            placeholder="附加信息（当 source_type = 4时，字段值为es索引名称）"
            v-model="addQueryTemplate.additional"
          ></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveQueryTemplate">确 定</el-button>
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
        ref="updQueryTemplateRef"
        :model="updQueryTemplate"
        :rules="updQueryTemplateRules"
        label-width="110px"
      >
        <el-form-item label="数据源编号" prop="sourceId">
          <el-input v-model="updQueryTemplate.sourceId"></el-input>
        </el-form-item>
        <el-form-item label="分类名称" prop="categoryId">
          <el-input-number
            style="width: 600px"
            v-model="updQueryTemplate.categoryId"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="模板编号" prop="templateId">
          <el-input v-model="updQueryTemplate.templateId"></el-input>
        </el-form-item>
        <el-form-item label="模板描述">
          <el-input v-model="updQueryTemplate.templateDesc"></el-input>
        </el-form-item>
        <el-form-item label="脚本模板" prop="scriptTemplate">
          <el-input
            type="textarea"
            v-model="updQueryTemplate.scriptTemplate"
          ></el-input>
        </el-form-item>
        <el-form-item label="附加信息">
          <el-input
            placeholder="附加信息（当 source_type = 4时，字段值为es索引名称）"
            v-model="updQueryTemplate.additional"
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
  saveQueryTemplate,
  queryQueryTemplate,
  updQueryTemplate,
  delQueryTemplate,
} from "@/api/QueryTemplate";

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
      addQueryTemplate: {}, // 数据查询模板对象
      addDialogVisible: false, // 添加对话框
      addQueryTemplateRules: {
        // 添加表单规则
        sourceId: [
          { required: true, message: "请输入数据源编号", trigger: "blur" },
        ],
        categoryId: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
        ],
        templateId: [
          { required: true, message: "请输入数据模板", trigger: "blur" },
        ],
        scriptTemplate: [
          { required: true, message: "请输入脚本模板", trigger: "blur" },
        ],
      },
      updDialogVisible: false, // 修改对话框
      updQueryTemplate: {}, // 单条数据查询模板对象
      updQueryTemplateRules: {
        // 添加表单规则
        sourceId: [
          { required: true, message: "请输入数据源编号", trigger: "blur" },
        ],
        categoryId: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
        ],
        templateId: [
          { required: true, message: "请输入数据模板", trigger: "blur" },
        ],
        scriptTemplate: [
          { required: true, message: "请输入脚本模板", trigger: "blur" },
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
          return this.$message.error("获取数据查询模板数据失败!");
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
    saveQueryTemplate() {
      this.$refs.addQueryTemplateRef.validate((valid) => {
        if (!valid) return;
        else {
          saveQueryTemplate(this.addQueryTemplate).then((response) => {
            if (response.status !== 200) {
              return this.$message.error("添加数据查询模板数据失败！");
            }

            this.$message.success("添加数据查询模板数据成功！");
            this.addDialogVisible = false;
            this.fetchData();
          });
        }
      });
    },
    // 添加对话框关闭事件
    handleCloseAddDialogVisible() {
      this.$refs.addQueryTemplateRef.resetFields();
    },
    // 修改对话框关闭事件
    handleCloseUpdDialogVisible() {
      this.$refs.updQueryTemplateRef.resetFields();
    },
    // 修改按钮操作
    async updBtn(entity) {
      this.updDialogVisible = true;

      await queryQueryTemplate(entity.id).then((response) => {
        if (response.status !== 200) {
          return this.$message.error("获取此条数据失败！");
        }

        this.updQueryTemplate = response.data.data;
      });
    },
    // 修改事件
    updFin() {
      this.$refs.updQueryTemplateRef.validate(async (valid) => {
        if (!valid) return;
        else {
          await updQueryTemplate(this.updQueryTemplate).then((response) => {
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
          await delQueryTemplate(entity.id).then((response) => {
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

