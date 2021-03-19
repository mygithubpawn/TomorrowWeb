<template>
  <div class="settings-web-info-box">
    <div class="web-info-par">
    <div class="pass-tittle">
      <span>博客信息</span>
    </div>
      <div style="margin: 0 auto;width: 620px">
    <el-form label-width="100px" size="medium">
      <el-form-item label="网站名称" required>
        <el-input maxlength="26" show-word-limit placeholder="赶快为博客取一个高大上的名称吧！"
                  v-model="searchWebInfo.value"></el-input>
      </el-form-item>
      <el-form-item label="网站关键字" required>
        <el-input maxlength="46" show-word-limit v-model="searchWebInfo.keyword" placeholder="关建字用“ ，”隔开"></el-input>
      </el-form-item>
      <el-form-item label="网站描述" required>
        <el-input
          type="textarea"
          minlength="6"
          maxlength="248"
          show-word-limit
          resize="node"
          placeholder="网站描述（6~248）个字符"
          :rows="6" v-model="searchWebInfo.introduction"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="updateWebInfoBar">保存数据</el-button>
      </el-form-item>
    </el-form>
    <div class="web-info-update-box">
      <el-dialog
        title="提示"
        :visible.sync="dialogVisible"
        width="25%">
        <span>您确定保存这些数据吗</span>
        <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="checkWebInfoTitle">保 存</el-button>
  </span>
      </el-dialog>
    </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as api from '../../api/api'

export default {
  name: "websize-info",
  data() {
    return {
      searchWebInfo: {
        value: '',
        keyword: '',
        introduction: '',
      },
      dialogVisible: false,
      description: '',

    }
  },
  methods: {
    updateWebInfoBar() {
      this.dialogVisible = true;
    },
    checkWebInfoTitle() {
      if (this.searchWebInfo.value === '') {
        this.dialogVisible = false;
        return this.$message.error('网站标题不可以为空');
      }
      if (this.searchWebInfo.introduction === '') {
        this.dialogVisible = false;
        return this.$message.error('网站描述不可以为空');
      }
      if (this.searchWebInfo.keyword === '') {
        this.dialogVisible = false;
        return this.$message.error('网站关键字不可以为空');
      }
      //校验网站标题
      api.checkWebInfoTitle(this.searchWebInfo.value).then(result => {
        let res = result.data;
        if (res.code === api.success_code) {
          this.updateWebSizeInfo();
        } else {
          this.dialogVisible = false;
          return this.$notify({
            title: '网站标题异常', message: '该网站标题已被人使用', type: 'warning'
          });
        }
      });
    },
    updateWebSizeInfo() {
      api.updateWebSizeInfo(this.searchWebInfo).then(result => {
        let res = result.data;
        if (res.code === api.success_code) {
          this.dialogVisible = false;
          this.getWebSizeInfo();
          this.$notify({
            title: '数据保存成功', message: '数据已保存', type: 'success'
          });
        } else {
          this.getWebSizeInfo();
          this.dialogVisible = false;
          this.$notify({
            title: '保存异常', message: '数据保存异常，请稍后再试！', type: 'warning'
          });
        }
      })
    },

    getWebSizeInfo() {
      api.getWebSizeInfo().then(result => {
        let res = result.data;
        if (res.code === api.success_code) {
          this.searchWebInfo.value = res.data.webInfo.value;
          this.searchWebInfo.introduction = res.data.webInfo.introduction;
          this.searchWebInfo.keyword = res.data.webInfo.keyword;
        }
      })
    },

  },
  mounted() {
    this.getWebSizeInfo();
  }
}
</script>

<style scoped>
  .pass-tittle{
    font-size: 18px;
    color: #009432;
    text-align: center;
    font-weight: 600;
    padding-top: 30px;
    margin: 0 20px 40px 20px;
  }
  .settings-web-info-box >>> .el-input, .settings-web-info-box >>> .el-textarea {
    width: 500px;
  }
  .web-info-par{
    width: 800px;
    height: 600px;
    background-color: #EFF3F5;
    margin:  0 auto;
    border-radius: 4px;
  }
</style>
