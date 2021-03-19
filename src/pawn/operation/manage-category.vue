<template>
  <div class="category-box">
    <div class="category-action-bar margin-bottom-8">
      <el-button type="primary" size="medium" @click="showAddCategory"><i class="el-icon-plus"></i>&nbsp;分类
      </el-button>
    </div>
    <div class="category-list-box">
      <el-table
        v-loading="loading"
        :data="categories"
        size="medium"
        style="width:100%">
        <el-table-column
          prop="name"
          label="分类名称"
          width="120">
        </el-table-column>
        <el-table-column
          prop="pinyin"
          label="分类拼音"
          width="120">
        </el-table-column>
        <el-table-column
          prop="description"
          label="分类描述"
          width="250">
        </el-table-column>
        <el-table-column
          prop="status"
          label="分类状态"
          width="120">
          <template slot-scope="scope">
            <div v-if="scope.row.status==='1'">
              <el-tag type="success">正&nbsp;常</el-tag>
            </div>
            <div v-if="scope.row.status==='0'">
              <el-tag type="danger">已删除</el-tag>
            </div>
          </template>
        </el-table-column>

        <el-table-column
          label="创建时间"
          width="200">
          <template slot-scope="scope">
          <span v-text="formatDate(scope.row.createTime)">
          </span>
          </template>
        </el-table-column>
        <el-table-column
          label="更新时间"
          width="200">
          <template slot-scope="scope">
            <span v-text="formatDate(scope.row.updateTime)">
          </span>
          </template>
        </el-table-column>

        <el-table-column
          fixed="right"
          label="操作"
          width="200">
          <template slot-scope="scope">
            <el-button round type="primary" size="small" @click="edit(scope.row)" icon="el-icon-edit-outline">编辑
            </el-button>
            <el-button round type="danger" size="small" @click="deleteItem(scope.row)" icon="el-icon-delete">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="navigation-bar">
    </div>
    <!--   提示框-->
    <div class="category-dialog-box">
      <el-dialog
        title="删除提示"
        :visible.sync="deleteDialogShow"
        width="25%">
        <span>您确定要删除：“{{deleteMessage}}”这个分类吗 ！</span>
        <span slot="footer" class="dialog-footer">
    <el-button @click="deleteDialogShow = false" size="mini" type="danger">取 消</el-button>
    <el-button size="mini" type="primary" @click="toDeleteItem">{{editorCommitText}}</el-button>
  </span>
      </el-dialog>
      <div class="category-dialog-box">
      <el-drawer
        direction="rtl"
        size="35%"
        :before-close="handleClose"
        :visible.sync="editorDialogShow"
        :with-header="false">
        <div class="drawer-title">{{editTitle}}</div>
        <div class="category-aditr-box margin-ma-box">
          <el-form label-width="80px" size="medium">
            <el-form-item label="分类名称" required>
              <el-input v-model="category.name" placeholder="分类名称"></el-input>
            </el-form-item>
            <el-form-item label="描述" required>
              <el-input
                type="textarea"
                :rows="3"
                show-word-limit
                minlength="6"
                resize="none"
                maxlength="90"
                placeholder="分类描述（6~90）个字符"
                v-model="category.description">
              </el-input>
            </el-form-item>
            <el-form-item label="拼音" required>
              <el-input v-model="category.pinyin" placeholder="分类拼音"></el-input>
            </el-form-item>
            <el-form-item label="顺序" required size="medium">
              <el-input-number v-model="category.order" :min="1" :max="10"></el-input-number>
            </el-form-item>
            <el-form-item label="状态" required>
              <el-select v-model="category.status" placeholder="请选择状态">
                <el-option label="正常" value="1"></el-option>
                <el-option label="已删除" value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer float-right clear-fix">
    <el-button @click="clearData" size="medium" type="danger">取 消</el-button>
    <el-button size=medium type="primary" @click="postCategory">{{editorCommitText}}</el-button>
  </span>
        </div>
      </el-drawer>
      </div>
    </div>
  </div>

</template>

<script>
import * as api from '../../api/api'
import * as dateUtils from '../../utils/date'

export default {
  name: "manage-category",
  data() {
    return {
      loading: false,
      editorCommitText: '操作框名称',
      editorDialogShow: false,
      editTitle: '确认按钮',
      categories: [],
      //默认不展示
      deleteDialogShow: false,
      deleteMessage: '',
      deleteTargetId: '',
      category: {
        id: '',
        name: '',
        pinyin: '',
        description: '',
        order: 1,
        status: '1',
      }
    }
  },
  methods: {
    handleClose() {

    },
    clearData() {
      this.editorDialogShow = false
      this.category.id = '';
      this.category.name = '';
      this.category.pinyin = '';
      this.category.description = '';
      this.category.order = 1;
      this.category.status = '1';
    },
    showAddCategory() {
      this.editTitle = "分类添加";
      this.editorCommitText = "添加";
      this.editorDialogShow = true;
    },
    //操作分类
    postCategory() {
      // 检查数据
      if (this.category.name === '') {
        return this.showWarningErr("分类不能为空");
      }
      if (this.category.description === '') {
        return this.showWarningErr("分类描述不能为空");
      }
      if (this.category.pinyin === '') {
        return this.showWarningErr("分类名称拼音不能为空");
      }
      //判断操作类型，有id为修改，没有为添加
      if (this.category.id === '') {
        //添加数据
        api.addPostCategory(this.category).then(result => {
          let res = result.data;
          if (res.code === api.success_code) {
            this.editorDialogShow = false;
            //提示结果
            this.$notify({
              title: '添加成功', message: '分类已添加 ', type: 'success'
            });
            //重置数据
            this.resetCategory();
            //刷列表
            return this.listCategories();

          } else {
            this.editorDialogShow = false;
            return this.$notify({
              title: '添加异常', message: '分类添加异常 ', type: 'warning'
            });
          }
        })
      } else {
        //修改数据
        api.updateCategory(this.category.id, this.category).then(result => {
          let res = result.data;
          if (res.code === api.success_code) {
            this.editorDialogShow = false;
            //提示结果
            this.$notify({
              title: '数据更新成功', message: '已是最新数据 ', type: 'success'
            });
            //重置数据
            this.resetCategory();
            //刷列表
            return this.listCategories();
          } else {
            this.editorDialogShow = false;
            return this.$notify({
              title: '更新异常', message: '数据更新异常 ', type: 'warning'
            });
          }
        });
      }

    },
    //编辑
    edit(item) {
      this.category.id = item.id;
      this.category.name = item.name;
      this.category.description = item.description;
      this.category.pinyin = item.pinyin;
      this.category.order = item.order;
      this.category.status = item.status;
      this.editTitle = "分类编辑";
      this.editorCommitText = "保存";
      this.editorDialogShow = true;
    },
    resetCategory() {
      this.category.name = '';
      this.category.description = '';
      this.category.pinyin = '';
      this.category.id = '';
      this.category.order = 1;
      this.category.status = '1';
    },
    deleteItem(item) {
      //展示提示框
      this.deleteDialogShow = true;
      this.deleteMessage = item.name;
      this.deleteTargetId = item.id;
      this.editorCommitText = "删除";
    },
    //格式化日期
    formatDate(dateStr) {
      let date = new Date(dateStr);
      return dateUtils.formatDate(date, 'yyyy-MM-dd hh:mm');
    },
    //删除分类
    toDeleteItem() {
      api.deleteCategoryId(this.deleteTargetId).then(result => {
        let res = result.data;
        if (res.code === api.success_code) {
          this.$notify({
            title: '删除成功', message: '分类已删除 ', type: 'success'
          });
          //刷新
          return this.listCategories();
        }
      });
      this.deleteDialogShow = false;
    },

    showWarning(msg) {
      this.$message({
        message: msg,
        center: true,
        type: 'success'
      })
    },
    showWarningErr(msg) {
      this.$message({
        message: msg,
        center: true,
        type: 'error'
      })
    },

    //获取分类列表
    listCategories() {
      this.loading = true;
      api.listCategories().then(result => {
        let res = result.data;
        console.log(result.data)
        if (result.data.code === api.success_code) {
        this.loading = false;
          this.categories = res.data.categoriesList.records;
        }
      });

    }
  },
  mounted() {
    this.listCategories();

  }
}
</script>

<style scoped>
  .category-box >>> .el-table .cell{
    height: 45px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }
  .category-list-box >>> .el-table {
    min-height: 300px;
  }
  .category-dialog-box >>> .el-drawer__body{
    overflow: auto;
  }
</style>
