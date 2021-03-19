<template>
  <div class="article-post-box">
    <!--      标题 -->
    <div class="article-title-part margin-bottom-20">
      <el-input v-model="article.title" placeholder="文章标题（6~42）个字符"
                maxlength="42"
                show-word-limit
                minlength="6"></el-input>
    </div>
    <!--      类容编辑部分-->
    <div class="article-post-part margin-bottom-20">
      <mavon-editor
        v-model="article.content"
        ref="editor"
        @imageClick="onEditorImage"
      />
    </div>
    <div style="height: 100px;width: 100%"></div>
    <!--      发布操作-->
    <div class="article-post-action-bar">
      <div class="action-btn-container clear-fix">
        <el-button size="meitem" type="danger" @click="DoViewContentEr">重置文章</el-button>
        <el-button size="meitem" type="success" @click=saveArticleDraft>保存草稿</el-button>
        <el-button type="primary" size="meitem" @click="TocommitArticle">发布文章</el-button>
      </div>
    </div>
    <div class="article-post-dialog-box">
      <el-dialog
        :visible.sync="dialogVisibleArticle"
        width="25%"
        :before-close="handleClose">
        <span>您确定要重置该文章吗！</span>
        <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisibleArticle = false">取 消</el-button>
    <el-button type="primary" @click="DoViewContent">确 定</el-button>
  </span>
      </el-dialog>
      <el-dialog
        title="图片选择"
        :visible.sync="isImageSelectShow"
        width="500"
        :before-close="handleClose">
        <div class="image-selector-box">
          <div class="image-action-bar">
            <el-upload
              class="upload-demo"
              :action="imagesAdd"
              :show-file-list="false"
              :on-success="cropUploadSuccess"
              :before-upload="cropUploadFail">
              <el-button size="small" type="primary">上传图片&nbsp;<i class="el-icon-upload"></i></el-button>
            </el-upload>
          </div>
          <div v-if="images.length!==0">
          <div class="image-action-list clear-fix">
            <el-radio-group v-model="selectedImageIndex">
              <el-radio-button :label="index" v-for="(item,index) in images" :key="index">
                <el-image fit="cover" :src="item.url"></el-image>
              </el-radio-button>
            </el-radio-group>
          </div>
          <div class="image-picker-navigation">
            <!--    分页-->
            <el-pagination
              class="article-list-page-navigation-bar"
              background
              @current-change="onPgeChange"
              :current-page="pageNavigation.currentPage"
              :page-size="pageNavigation.pageSize"
              layout="prev, pager, next"
              :total="pageNavigation.totalCount">
            </el-pagination>
          </div>
        </div>
            <div v-else>
              <span style="color: #4C5156;font-size: 13px">暂无文章封面！</span>
            </div>
          </div>
        <span slot="footer" class="dialog-footer">
    <el-button @click="isImageSelectShow = false" size="small">取 消</el-button>
    <el-button type="primary" @click="onImageSelect" size="small">确 定</el-button>
  </span>
      </el-dialog>
    </div>
<div>
  <el-dialog style=" overflow-x : auto;"
    title="文章发布"
    :visible.sync="determineArticle"
    :close-on-click-modal="false"
    width="600px">
    <!--      分类，封面，标签-->
    <div class="article-post-settings-part">
      <el-form label-width="100px">
        <el-form-item label="文章分类" required>
          <el-select v-model="article.categoryId" placeholder="选择文章分类" size="meitem">
            <el-option
              v-for="item in categories"
              :key="item.id"
              :label="item.name"
              :value="item.name">
            </el-option>
          </el-select>
          <el-button type="primary" plain @click="addCategory">添加分类</el-button>
        </el-form-item>
        <el-form-item label="发布位置" required>
          <el-radio-group v-model="article.position">
            <el-radio label="1" @change="comm($event)">社区</el-radio>
            <el-radio label="2" @change="localEr($event)">本地博客</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否置顶" required>
        <el-switch v-model="article.status"
                   inactive-value="1"
                   active-value="3"
                   @change=chang($event)>
        </el-switch>
        </el-form-item>
        <el-form-item label="摘要" required>
          <el-input
            type="textarea"
            :rows="4"
            show-word-limit
            maxlength="400"
            minlength="6"
            placeholder="文章摘要（6~400）个字符"
            v-model="article.summary">
          </el-input>
        </el-form-item>
        <el-form-item label="封面" required>
          <div class="cover-selector" @click="showCodeSelector">
            <i class="el-icon-upload" v-if="article.cover===''"></i>
            <el-image :src="article.cover"></el-image>
          </div>
        </el-form-item>
        <el-form-item label="标签" class="label-input-box" required>
          <el-tag
            :key="tag"
            v-for="tag in labels"
            closable
            :disable-transitions="false"
            @close="deleteLabels(tag)">
            {{tag}}
          </el-tag>
          <el-input
            class="input-new-tag"
            v-if="labelsInputVisible"
            v-model="labelsNewValue"
            ref="saveTagInput"
            size="small"
            @keyup.enter.native="handleLabelsInputConfirm">
          </el-input>
          <el-button v-if="!labelsInputVisible&&!isEnough" class="button-new-tag" size="small" @click="showLabelsInput">
            + 标签
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
    <el-button @click="determineArticle = false">取 消</el-button>
    <el-button type="primary" @click="commitArticle">发 布</el-button>
  </span>
  </el-dialog>

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
  name: "pot-article",
  data() {
    return {
      imageSelectFor: 'article',
      selectedImageIndex: 0,
      labelsNewValue: '',
      imagesAdd: api.http_img,
      userIdToken: '',
      isImageSelectShow: false,
      determineArticle: false,
      dialogVisibleArticle: false,
      isEnough: false,
      labelsInputVisible: false,
      labels: [],
      categories: [],
      images: [],
      //分页参数
      pageNavigation: {
        currentPage: 1,
        totalCount: 0,
        pageSize: 12,
      },
      article: {
        title: '',
        content: '',
        categoryId: '',
        summary: '',
        cover: '',
        position: '1',
        review: '',
        labels: '',
        status: '1',
        type: '1',
      },
    }
  },
  methods: {
    chang(status){
      this.article.status=status;
      this.article.review='3';
    },
    comm(val){
      this.article.position=val;
      this.article.review='1';
    },
    localEr(val){
      this.article.position=val;
      this.article.review='2';
    },
    addCategory(){
      this.$router.push({
        path: '/operation/manage-category',
      });
    },
    TocommitArticle(){
      this.determineArticle=true;
    },
    DoViewContentEr() {
      this.dialogVisibleArticle = true;
    },
    DoViewContent() {
      this.dialogVisibleArticle = false;
      this.article.content = '';
      this.article.summary = '';
      this.article.labels = '';
      this.article.categoryId = '';
    },
    saveArticleDraft() {
      //检查数据
      if (this.article.title === '') {
        return this.$message.error("文章标题不可以为空噢")
      }
      this.article.status = '2';
      //提交数据
      api.saveArticleDraft(this.article).then(result => {
        if (result.data.code === api.success_code) {
          this.$notify({
            title: '保存成功', message: '草稿保存成功 ', type: 'success'
          });
          //跳转到文章管理页面
          this.$router.push({
            path: '/content/manage-article',
          })
        } else {
          return this.$notify({
            title: '文章保存异常', message: '文章保存异常，请稍后再试 ', type: 'warnings'
          });
        }
      });
    },
    commitArticle() {
      this.determineArticle=false;
      //检查数据
      if (this.article.title === '') {
        return this.$message.error("文章标题不可以为空噢")
      }
      if (this.article.categoryId === '') {
        return this.$message.error("分类还没选择呢")
      }
      if (this.article.summary === '') {
        return this.$message.error("摘要不可以为空噢")
      }
      if (this.article.cover === '') {
        return this.$message.error("请设置文章封面")
      }
      if (this.labels.length === 0) {
        return this.$message.error("请设置标签，更容易检索")
      }
      let tempLabels = '';
      console.log(tempLabels);
      //处理标签
      this.labels.forEach((itemLabel, index) => {
        tempLabels += itemLabel;
        if (index !== this.labels.length - 1) {
          tempLabels += '-';
        }
      });
      console.log(this.article);
      this.article.labels = tempLabels;
      //提交数据
      api.postArticle(this.article).then(result => {
        if (result.data.code === api.success_code) {
          if (this.article.position==='2'){
          this.$notify({
            title: '发布成功', message: '文章发布成功 ', type: 'success'
          });
            //跳转到文章管理页面
            return this.$router.push({
              path: '/content/manage-article',
            });
          }else {
             this.$notify({
              title: '发布成功', message: '文章发布成功,待管理员审核中,', type: 'success'
            });
            //跳转到文章管理页面
            return this.$router.push({
              path: '/content/manage-article',
            });
          }
        } else {
          return this.$notify({
            title: '保存异常', message: '文章保存异常，请稍后再试 ', type: 'warning'
          });
        }
      });
    },
    onEditorImage() {
      //显示图框
      this.isImageSelectShow = true;
      this.imageSelectFor = 'article';
    },
    onPgeChange(page) {
      this.pageNavigation.currentPage = page + 1;
      this.ListImages();
    },
    //上传成功
    cropUploadSuccess(response) {
      console.log(this.imagesAdd);
      if (response.code === api.success_code) {
        console.log(response)
        this.ListImages();
        return this.$notify({
          title: '上传成功', message: '图片上传成功', type: 'success'
        });
      } else {
        return this.$notify({
          title: '上传异常', message: '图片上传异常，请稍后再试', type: 'warning'
        });
      }
    },
    cropUploadFail() {
    },
    handleClose() {

    },
    onImageSelect() {
      //判断是插入到封面还是文章内
      if (this.imageSelectFor === 'article') {
      } else if (this.imageSelectFor === 'cover') {

        //拿到当前选中的对象
        let image = this.images[this.selectedImageIndex];
        this.article.cover = image.url;
      }
      this.isImageSelectShow = false;
    },
    showCodeSelector() {
      //显示图框
      this.isImageSelectShow = true;
      this.imageSelectFor = 'cover';
    },
    showLabelsInput() {
      //限制个数5个
      //控制输入框的显示
      if (this.labels.length < 5) {
        this.labelsInputVisible = true;
      } else {
        this.labelsInputVisible = false;
      }
    },
    deleteLabels(label) {
      //删除数组里的标签
      this.labels.splice(this.labels.indexOf(label), 1);
      if (this.labels.length < 5) {
        this.labelsInputVisible = true;
        this.isEnough = false;
      }
    },
    handleLabelsInputConfirm() {
      //回车
      if (this.labels.length < 5) {
        this.labels.push(this.labelsNewValue);
        this.labelsNewValue = '';
      }
      //标签大于5个
      if (this.labels.length >= 5) {
        this.labelsInputVisible = false;
        this.isEnough = true;
      }
    },
    histArticleCategories() {
      api.listCategories().then(result => {
        let res = result.data;
        if (result.data.code === api.success_code) {
          this.categories = res.data.categoriesList.records;
        }
      });
    },
    ListImages() {
      api.listImages(this.pageNavigation.currentPage, this.pageNavigation.pageSize, "article").then(result => {
        let res = result.data;
        if (result.data.code === api.success_code) {
          this.images = res.data.imagesList[0].records;
          this.pageNavigation.currentPage = res.data.imagesList[0].current;
          this.pageNavigation.totalCount = res.data.imagesList[0].total;
          this.pageNavigation.pageSize = res.data.imagesList[0].size;
        } else {
          this.$notify({
            title: '加载失败', message: '数据加载失败，请稍后再试', type: 'error'
          });
        }
      });
    },
    TokenInfo(){
      api.LoginGet().then(result=>{
        this.userIdToken = result.data.data.userFromToken.id; // 要保证取到
        this.imagesAdd= this.imagesAdd+this.userIdToken+'/article';
        console.log( this.imagesAdd)
      });
    },
  },
  mounted() {
    this.TokenInfo();
    this.histArticleCategories();
    this.ListImages();
  }

}
</script>

<style scoped>
  .image-picker-navigation{
   margin-right: 20px;
  }
  .article-list-page-navigation-bar {
    margin-top: 20px;
    margin-right: 40px;
  }

  .image-action-bar {
    padding-left: 6px;
    margin-bottom: 20px;
  }

  .image-action-list >>> .el-radio-button__inner,
  .image-action-list >>> :first-child.el-radio-button__inner,
  .image-action-list >>> :last-child.el-radio-button__inner {
    border: none;
    border-radius: 4px;
    margin: 5px;
    padding: 3px;
  }

  .image-action-list >>> img {
    width: 160px;
    height: 160px;
    float: left;
  }

  .article-post-dialog-box >>> .el-dialog__header {
    display: none;
  }

  .input-new-tag {
    width: 120px;
  }

  .article-title-part >>> input {
    border: none;
    font-size: 18px;
  }

  .label-input-box >>> .el-tag {
    margin-right: 16px;
  }

  .cover-selector {
    background-color: #fff;
    border: 1px dashed #d9d9d9;
    border-radius: 4px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    width: 320px;
    height: 179px;
    text-align: center;
    position: relative;
    overflow: hidden;
  }

  .cover-selector i {
    font-size: 67px;
    color: #C0C4CC;
    margin: 60px 0 16px;
    line-height: 50px;
  }
  .article-post-settings-part >>> .el-textarea {
    width: 78%;
  }
  .article-post-part >>> .markdown-body {
    height: 800px;
    box-shadow: none !important;
  }
  .article-post-part {
    background: aqua;
  }

  .article-post-part >>> .v-note-op {
    position: sticky;
    top: 0;
  }

  .article-post-settings-part {
    margin-bottom: 60px;
  }

  .article-post-action-bar {
    /*border-top: #e6e6e6 solid 1px;*/
    position: fixed;
    bottom: 0;
    background: transparent;
    width: 100%;
    margin-left: -220px;
  }

  .action-btn-container {
    margin-bottom: 10px;
  }

  .action-btn-container {
    float: right;
    margin-right: 50px;
    padding: 10px;
  }

</style>
