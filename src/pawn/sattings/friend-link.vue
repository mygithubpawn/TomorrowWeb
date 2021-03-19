<template>
  <div class="settings-friend-link-box">
    <div class="friend-link-action-box margin-bottom-20">
      <el-button type="primary" size="medium" @click="showAdFriend"><i class="el-icon-plus"></i>&nbsp;友情连接</el-button>
    </div>
    <div class="friend-link-list-box">
      <el-table
        v-loading="loading"
        :data="links"
        size="medium"
        style="width: 100%">
        <el-table-column
          prop="name"
          label="友情连接/地址"
          width="200">
          <template slot-scope="scope">
            <el-tag type="danger">
              <a :href="scope.row.url" target="view_window">{{scope.row.name}}</a>
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="Logo"
          width="250">
          <template slot-scope="scope">
            <el-image class="loop-url" :src="scope.row.logo" :preview-src-list="srcList"></el-image>
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          width="120">
          <template slot-scope="scope">
            <div v-if="scope.row.state==='1'">
              <el-tag type="success" >正&nbsp;常</el-tag>
            </div>
            <div v-if="scope.row.state==='0'">
              <el-tag type="danger">已屏蔽</el-tag>
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
          width="220">
          <template slot-scope="scope">
            <el-button round type="primary" size="small" @click="edit(scope.row)" icon="el-icon-edit-outline">编辑</el-button>
            <el-button round type="danger" size="small" @click="deleteItem(scope.row)" icon="el-icon-delete">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="friend-dialog-box">
        <el-drawer
          direction="rtl"
          size="35%"
          :before-close="handleClose"
          :visible.sync="friendDialogShow"
          :with-header="false">
        <div class="margin-ma-box clear-fix">
          <div class="drawer-title">{{friendEditorTitle}}</div>
          <el-form label-width="110px" size="medium">
            <el-form-item label="昵称" required>
              <el-input placeholder="对方网站名称" v-model="link.name"></el-input>
            </el-form-item>
            <el-form-item label="封面" required>
              <div class="friend-i-size" @click="showLinkLogoDialog">
                <el-image fit="scale-down" v-if="link.logo" :src="link.logo" class="avatar"></el-image>
                <i class="el-icon-upload"></i>
              </div>
            </el-form-item>

            <el-form-item label="跳转连接" required>
              <el-input placeholder="对方连接地址...." v-model="link.url"></el-input>
            </el-form-item>
            <el-form-item label="顺序" required size="medium">
              <el-input-number v-model="link.order" :min="1" :max="10"></el-input-number>
            </el-form-item>
            <el-form-item label="状态" required>
              <el-select v-model="link.state" placeholder="请选择状态">
                <el-option label="正常" value="1"></el-option>
                <el-option label=不可用 value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        <span slot="footer" class="dialog-footer float-right">
    <el-button @click="friendDialogShowEr" type="danger" size="medium">取 消</el-button>
    <el-button type="primary" @click="handIeFriendEditorCommit" size="medium">{{friendDialogButton}}</el-button>
  </span>
        </div>
        </el-drawer>
      <el-dialog
        title="删除提示"
        :visible.sync="deleteDialogShow"
        width="30%">
        <span>您确定要删除：“{{deleteLinkTitle}}”这个友情链接吗 ！</span>
        <span slot="footer" class="dialog-footer">
    <el-button @click="deleteDialogShow=false" size="mini" type="danger">取 消</el-button>
    <el-button size="mini" type="primary" @click="toDeleteItemFriend">删 除</el-button>
  </span>
      </el-dialog>
    </div>
    <div class="friend-info-dialog">
      <!--    图片上传-->
      <avatar-update field="file"
                     class="upload-demo"
                     @crop-upload-success="cropUploadSuccess"
                     @crop-upload-fail="cropUploadFail"
                     v-model="showAvatarCutter"
                     :width="240"
                     :height="120"
                     :url="imagesAdd"
                     img-format="png"></avatar-update>

    </div>
  </div>
</template>

<script>
import * as api from '../../api/api'
import * as dateUtils from '../../utils/date'
import avatarUpload from 'vue-image-crop-upload/upload-2.vue';

export default {
  components: {
    'avatar-update': avatarUpload,
  },
  name: "friend-linx",
  data() {
    return {
      friendDialogButton: '添 加',
      friendDialogShow: false,
      showAvatarCutter: false,
      imagesAdd: api.http_img,
      userIdToken: '',
      friendEditorTitle: '添加友情连接',
      loading: false,
      deleteLinkId: '',
      links: [],
      link: {
        id: '',
        name: '',
        logo: '',
        order: 1,
        state: '',
        url: '',
      },
      srcList: [],
      deleteLinkTitle: '',
      deleteDialogShow: false,
    }
  },
  methods: {
    handleClose(){

    },
    deleteItem(item) {
      this.deleteLinkId = item.id;
      this.deleteLinkTitle = item.name;
      this.deleteDialogShow = true;
    },
    showLinkLogoDialog() {
      this.showAvatarCutter = true;
    },
    //上传成功
    cropUploadSuccess(response) {
      response.data.images.userId='12';
      if (response.code === api.success_code) {
        // console.log(response)
        //回显图片
        this.link.logo = response.data.images.url;
        return this.$notify({
          title: '上传成功', message: '图片已上传', type: 'success'
        });
      } else {
        return this.$notify({
          title: '图片上传异常', message: '图片上传异常，请稍后再试！', type: 'warning'
        });
      }
    },
    //上传失败
    cropUploadFail() {
      return this.$notify({
        title: '图片上传异常', message: '图片上传异常，请稍后再试！', type: 'warning'
      });
    },
    edit(item) {
      this.link.id = item.id;
      this.link.name = item.name;
      this.link.logo = item.logo;
      this.link.state = item.state;
      this.link.order = item.order;
      this.link.url = item.url;
      this.friendDialogShow = true;
      this.friendDialogButton = "保 存";
      this.friendEditorTitle = "编辑友情链接";
    },
    toDeleteItemFriend() {
      api.toDeleteItemLink(this.deleteLinkId).then(result => {
        this.deleteDialogShow = false;
        if (result.data.code === api.success_code) {
          this.listLinks();
          return this.$notify({
            title: '删除成功', message: '友情链接已删除', type: 'success'
          });
        } else {
          return this.$notify({
            title: '删除异常', message: '友情链接删除异常，请稍后再试！', type: 'warning'
          });

        }
      });
    },
    friendDialogShowEr() {
      this.resetLink();
      this.friendDialogShow = false;
    },
    handIeFriendEditorCommit() {
//检查数据
      if (this.link.name === '') {
        return this.$message.error("友情链接名称不可用为空");
      }
      if (this.link.logo === '') {
        return this.$message.error("logo不可以为空");
      }
      if (!this.link.url.startsWith('http://')
        && !this.link.url.startsWith('https://')) {
        return this.$message.error("跳转连接格式错误");
      }
      if (this.link.state === '') {
        return this.$message.error("状态异常");
      }
      if (this.link.order === '') {
        return this.$message.error("顺序异常");
      }
      //判断是更新还是添加，通过判断id的有无
      if (this.link.id === '') {
        //提交数据
        api.handIeFriendEditorCommit(this.link).then(result => {
          this.friendDialogShow = false;
          if (result.data.code === api.success_code) {
            //刷新列表
            this.listLinks();
            //重置表单
            this.resetLink();
            return this.$notify({
              title: '添加成功', message: '已添加该友情链接', type: 'success'
            });
          } else {
            //重置表单
            this.resetLink();
            return this.$notify({
              title: '添加异常', message: '友情链接添加异常，请稍后再试！', type: 'warning'
            });
          }
        });
      } else {
        //更新数据
        api.updateLink(this.link.id, this.link).then(result => {
          this.friendDialogShow = false;
          if (result.data.code === api.success_code) {
            //刷新列表
            this.listLinks();
            //重置表单
            this.resetLink();
            return this.$notify({
              title: '保存成功', message: '数据以保存', type: 'success'
            });
          } else {
            return this.$notify({
              title: '保存异常', message: '数据保存异常，请稍再试！', type: 'warning'
            });
          }
        });
      }
    },
    resetLink() {
      this.link.id = '';
      this.link.name = '';
      this.link.url = '';
      this.link.logo = '';
      this.link.order = 1;
      this.link.state = '1';
    },
    //格式化日期
    formatDate(dateStr) {
      let date = new Date(dateStr);
      return dateUtils.formatDate(date, 'yyyy-MM-dd hh:mm');
    },
    showAdFriend() {
      this.friendDialogButton = "添 加";
      this.friendEditorTitle = "添加友情链接";
      this.friendDialogShow = true;
    },
    listLinks() {
      this.loading = true;
      api.listLinks().then(result => {
        this.loading = false;
        let res = result.data;
        if (result.data.code === api.success_code) {
          this.links = res.data.friendsList;
          this.links.forEach((item => {
            this.srcList.push(item.logo);
          }));
        }
      });
    },
    TokenInfo(){
      api.LoginGet().then(result=>{
        this.userIdToken = result.data.data.userFromToken.id; // 要保证取到
        this.imagesAdd= this.imagesAdd+this.userIdToken+'/friend';
        // console.log( this.imagesAdd)
      });
    },
  },
  mounted() {
    this.TokenInfo();
    this.listLinks();
  }
}
</script>

<style scoped>
  .loop-url {
    width: 200px;
    height: 80px;
    padding: 2px;
    border-radius: 4px;
    border: aqua solid 1px;
  }

  .upload-demo >>> .el-upload-dragger {
    width: 250px;
    height: 150px;
  }

  .friend-i-size {
    background-color: #fff;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    width: 240px;
    height: 120px;
    text-align: center;
    position: relative;
    overflow: hidden;
  }

  .friend-i-size i {
    font-size: 67px;
    color: #C0C4CC;
    margin: 40px 0 16px;
    line-height: 40px;
  }
</style>
