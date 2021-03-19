<template>
  <div class="loop-box">
    <div class="loop-action-box margin-bottom-20">
      <el-button type="primary" size="medium" @click="showAddLoop"><i class="el-icon-plus"></i>&nbsp;轮播图</el-button>
    </div>
    <div class="loop-list-box">
      <el-table
        v-loading="loading"
        :data="loops"
        size="medium"
        style="width: 100%">
        <el-table-column
          prop="title"
          label="标题/连接地址"
          width="250">
          <template slot-scope="scope">
            <el-tag type="danger">
              <a :href="scope.row.targetUrl">{{scope.row.title}}</a>
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="introduction"
          label="描述"
          width="250">
        </el-table-column>
        <el-table-column
          label="轮播图"
          width="250">
          <template slot-scope="scope">
            <el-image class="loop-url" :src="scope.row.imageUrl" :preview-src-list="srcList"></el-image>
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          width="120">
          <template slot-scope="scope">
            <div v-if="scope.row.state==='1'">
              <el-tag type="success">正&nbsp;常</el-tag>
            </div>
            <div v-if="scope.row.state==='0'">
              <el-tag type="danger">不可用</el-tag>
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
    <div class="loop-dialog-box">
      <el-drawer
        direction="rtl"
        size="35%"
        :before-close="handleClose"
        :visible.sync="loopDialogShow"
        :with-header="false">
        <div class="margin-ma-box">
          <div class="drawer-title">{{loopEditorTitle}}</div>
          <el-form label-width="80px" size="medium">
            <el-form-item label="标题" required>
              <el-input placeholder="轮播图标题..." v-model="loop.title"></el-input>
            </el-form-item>
            <el-form-item label="简介" required>
              <el-input
                type="textarea"
                :rows="3"
                show-word-limit
                minlength="4"
                resize="none"
                maxlength="20"
                placeholder="轮播图简介（4~20）个字符"
                v-model="loop.introduction">
              </el-input>
            </el-form-item>
            <el-form-item label="轮播图" required>
              <el-upload
                class="upload-demo"
                drag
                :action="imagesAdd"
                :show-file-list="false"
                :on-success="upLoopSuccess"
                :before-upload="beforeUpload">
                <el-image fit="scale-down" v-if="loop.imageUrl" :src="loop.imageUrl" class="avatar"></el-image>
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将图片拖到此处，或<em>点击上传</em></div>
              </el-upload>

            </el-form-item>

            <el-form-item label="跳转连接" required>
              <el-input placeholder="轮播图跳转地址...." v-model="loop.targetUrl"></el-input>
            </el-form-item>
            <el-form-item label="顺序" required size="medium">
              <el-input-number v-model="loop.order" :min="1" :max="10"></el-input-number>
            </el-form-item>
            <el-form-item label="状态" required>
              <el-select v-model="loop.state" placeholder="请选择状态">
                <el-option label="正常" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer float-right clear-fix">
    <el-button @click="loopDialogShowEr" type="danger" size="medium">取 消</el-button>
    <el-button type="primary" @click="handIeLoopEditorCommit" size="medium">{{loopDialogButton}}</el-button>
  </span>
        </div>
      </el-drawer>
      <el-dialog
        title="删除提示"
        :visible.sync="deleteDialogShow"
        width="30%">
        <span>您确定要删除：“{{deleteLoopTitle}}”这个轮播图吗 ！</span>
        <span slot="footer" class="dialog-footer">
    <el-button @click="deleteDialogShow = false" size="mini" type="danger">取 消</el-button>
    <el-button size="mini" type="primary" @click="toDeleteItemLoop">删 除</el-button>
  </span>
      </el-dialog>
    </div>
    <!--    分页-->
    <div class="page-loop-navigation-box  margin-bottom-20 clear-fix">
      <el-pagination
        class="loop-page-navigation-bar"
        background
        @current-change="onPgeChangeLoop"
        :current-page="pageNavigation.currentPage"
        :page-size="pageNavigation.pageSize"
        layout="prev, pager, next"
        :total="pageNavigation.totalCount">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import * as api from '../../api/api'
import * as dateUtils from '../../utils/date'

export default {
  name: "loop",
  data() {
    return {
      deleteLoopTitle: '',
      deleteLoopId: '',
      deleteDialogShow: false,
      imagesAdd: api.http_img,
      userIdToken: '',
      loopDialogButton: '添 加',
      loopDialogShow: false,
      loopEditorTitle: '添加轮播图',
      loading: false,
      url: '',
      loop: {
        id: '',
        title: '',
        order: 1,
        state: '1',
        imageUrl: '',
        targetUrl: '',
        introduction: '',
      },
      srcList: [],
      //分页参数
      pageNavigation: {
        currentPage: 1,
        totalCount: 0,
        pageSize: 15,
      },
      loops: [],
    }
  },
  methods: {
    handleClose() {

    },
    loopDialogShowEr() {
      this.loopDialogShow = false;
      //重置表单
      this.resetLoop();
    },
    toDeleteItemLoop() {
      api.toDeleteItemLoop(this.deleteLoopId).then(result => {
        this.deleteDialogShow = false;
        if (result.data.code === api.success_code) {
          this.listLoop();
          return this.$notify({
            title: '删除成功', message: '轮播图删除成功 ', type: 'success'
          });
        } else {
          return this.$notify({
            title: '删除异常', message: '轮播图删除失败，请稍后再试 ', type: 'warnings'
          });
        }
      });
    },
    onPgeChangeLoop(page) {
      this.pageNavigation.currentPage = page + 1;
      this.listLoop();
    },
    handIeLoopEditorCommit() {
      //检查数据
      if (this.loop.title === '') {
        return this.$message.error("标题不可以为空");
      }
      if (this.loop.imageUrl === '') {
        return this.$message.error("轮播图不可以为空");
      }
      if (this.loop.introduction === '') {
        return this.$message.error("轮播图描述不可以为空");
      }
      if (!this.loop.targetUrl.startsWith('http://')
        && !this.loop.targetUrl.startsWith('https://')) {
        return this.$message.error("跳转连接格式错误");
      }
      if (this.loop.state === '') {
        return this.$message.error("状态异常");
      }
      if (this.loop.order === '') {
        return this.$message.error("顺序异常");
      }
      //判断是更新还是添加，通过判断id的有无
      if (this.loop.id === '') {
        //提交数据
        api.postLoop(this.loop).then(result => {
          this.loopDialogShow = false;
          if (result.data.code === api.success_code) {
            //刷新列表
            this.listLoop();
            //重置表单
            this.resetLoop();
            return this.$notify({
              title: '添加成功', message: '已添加 ', type: 'success'
            });
          } else {
            return this.$notify({
              title: '添加异常', message: '添加失败，请稍后再试', type: 'success'
            });
          }
        });
      } else {
        //更新数据
        api.updateLoop(this.loop.id, this.loop).then(result => {
          this.loopDialogShow = false;
          if (result.data.code === api.success_code) {
            //刷新列表
            this.listLoop();
            //重置表单
            this.resetLoop();
            return this.$notify({
              title: '保存成功', message: '已保存', type: 'success'
            });
          } else {
            return this.$notify({
              title: '保存成功', message: '已保存', type: 'warning'
            });
          }
        });
      }
    },
    resetLoop() {
      this.loop.id = '';
      this.loop.title = '';
      this.loop.introduction = '';
      this.loop.order = 1;
      this.loop.state = '1';
      this.loop.targetUrl = '';
      this.loop.imageUrl = '';
    },
    //上传成功
    upLoopSuccess(response) {
      // console.log(response);
      if (response.code === api.success_code) {
        //回显图片
        this.loop.imageUrl = response.data.images.url;
        return this.$notify({
          title: '上传成功', message: '已上传', type: 'success'
        });
      } else {
        return this.$notify({
          title: '上传异常', message: '上传失败', type: 'warning'
        });
      }
    },
    //上传失败
    beforeUpload() {
    },
    edit(item) {
      //数据回显
      this.loopDialogButton = '保 存';
      this.loopDialogShow = true;
      this.loopEditorTitle = '编辑轮播图';
      this.loop.id = item.id;
      this.loop.title = item.title;
      this.loop.imageUrl = item.imageUrl;
      this.loop.targetUrl = item.targetUrl;
      this.loop.state = item.state;
      this.loop.order = item.order;
      this.loop.introduction = item.introduction;
    },
    deleteItem(item) {
      this.deleteLoopId = item.id;
      this.deleteLoopTitle = item.title;
      this.deleteDialogShow = true;
    },
    //格式化日期
    formatDate(dateStr) {
      let date = new Date(dateStr);
      return dateUtils.formatDate(date, 'yyyy-MM-dd hh:mm');
    },

    showAddLoop() {
      this.loopDialogButton = '添 加';
      this.loopDialogShow = true;
      this.loopEditorTitle = '添加轮播图';
    },
    listLoop() {
      this.loading = true;
      api.listLoop(this.pageNavigation.currentPage, this.pageNavigation.pageSize).then(result => {
        this.loading = false;
        let res = result.data;
        if (result.data.code === api.success_code) {
          this.loops = res.data.looperList.records;
          this.loops.forEach((item => {
            this.srcList.push(item.imageUrl);
          }));
          this.pageNavigation.currentPage = res.data.looperList.current;
          this.pageNavigation.totalCount = res.data.looperList.total;
          this.pageNavigation.pageSize = res.data.looperList.size;
          this.deleteLoopId = res.data.looperLis.records.id;
        }
      });
    },
    TokenInfo(){
      api.LoginGet().then(result=>{
        this.userIdToken = result.data.data.userFromToken.id; // 要保证取到
        this.imagesAdd= this.imagesAdd+this.userIdToken+'/loop';
        // console.log( this.imagesAdd)
      });
    },
  },
  mounted() {
    this.TokenInfo();
    this.listLoop();
  }
}
</script>

<style scoped>
  .loop-url {
    width: 180px;
    height: 100px;
    padding: 4px;
    border-radius: 4px;
    /*border: aqua solid 1px;*/
  }
  .loop-dialog-box >>> .el-drawer__body{
    overflow: auto;
  }
  .upload-demo >>> .el-upload-dragger {
    width: 250px;
   height: 140px;
  }

  .loop-page-navigation-bar {
    margin-right: 50px;
    margin-top: 20px;
    float: right;
  }

</style>
