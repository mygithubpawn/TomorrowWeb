<template>
  <div class="article-list-box">
    <div class="article-action-bar">
      <el-form :inline="true" size="medium">
        <el-form-item>
          <el-input v-model="search.keyword" placeholder="请输入标题关键字"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="search.status" placeholder="所有状态">
            <el-option label="已发布" value="1"></el-option>
            <el-option label="草稿" value="2"></el-option>
            <el-option label="置顶" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="search.categoryId" placeholder="所有分类">
            <el-option
              v-for="item in categories"
              :key="item.id"
              :label="item.name"
              :value="item.name">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="search.position" placeholder="所有文章">
            <el-option label="社区文章" value="1"></el-option>
            <el-option label="本地文章" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>

          <el-button type="primary" @click="doArticleSearch" icon="el-icon-search">搜索</el-button>
          <el-button type="danger" @click="cleanSearch" icon="el-icon-refresh-left">重置</el-button>
          <el-button type="warning" @click="returnCleanSearch">查看打回</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="article-list-part">
      <el-table
        v-loading="loading"
        :data="article"
        size="medium"
        style="width: 100%">
        <el-table-column
          prop="title"
          label="标题"
          width="300">
        </el-table-column>
        <el-table-column
          prop="status"
          label="文章状态"
          width="120">
          <template slot-scope="scope">
            <div v-if="scope.row.status==='1'">
              <el-tag type="success">已发布</el-tag>
            </div>
            <div v-if="scope.row.status==='2'">
              <el-tag type="warning ">&nbsp;草&nbsp;稿&nbsp;</el-tag>
            </div>
            <div v-if="scope.row.status==='3'">
              <el-tag type="">&nbsp;置&nbsp;顶&nbsp;</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="review"
          label="文章审核"
          width="120">
          <template slot-scope="scope">
            <div v-if="scope.row.review==='1'">
              <el-tag type="info">待审核</el-tag>
            </div>
            <div v-if="scope.row.review==='2'">
              <el-tag type="success ">审核通过</el-tag>
            </div>
            <div v-if="scope.row.review==='3'">
              <el-tag type="warning">未通过</el-tag>
            </div>
            <div  v-if="scope.row.review===''">
              <el-tag type="warning">待发布</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          label="文章位置"
          width="120">
          <template slot-scope="scope">
            <div v-if="scope.row.position==='2'">
              <el-tag type="info">&nbsp;本&nbsp;地&nbsp;</el-tag>
            </div>
            <div v-if="scope.row.position==='1'">
              <el-tag>&nbsp;社&nbsp;区&nbsp;</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="view_count"
          label="浏览量"
          width="120">
        </el-table-column>
        <el-table-column
          label="发布时间"
          width="200">
          <template slot-scope="scope">
          <span v-text="formatDate(scope.row.create_time)">
          </span>
          </template>
        </el-table-column>
        <el-table-column
          label="更新时间"
          width="150">
          <template slot-scope="scope">
            <span v-text="formatDate(scope.row.update_time)">
          </span>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="300">
          <template slot-scope="scope">
            <el-button round type="primary" size="small" @click="edit(scope.row)" icon="el-icon-edit-outline">编辑
            </el-button>
            <el-button round type="danger" size="small" @click="deleteItem(scope.row)" icon="el-icon-delete">删除
            </el-button>
            <el-button round type="warning" size="small" @click="detailsArticle(scope.row)">查看详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="article-page-navigation clear-fix">
      <!--    分页-->
      <el-pagination
        class="article-page-navigation-bar clear-fix"
        background
        @current-change="onPgeChange"
        :current-page="pageNavigation.currentPage"
        :page-size="pageNavigation.pageSize"
        layout="prev, pager, next"
        :total="pageNavigation.totalCount">
      </el-pagination>
    </div>
    <div class="article-dialog-part">
      <el-drawer
        direction="ttb"
        size="100%"
        :visible.sync="articleDialogShow"
        :with-header="false">
        <div class="edit-article-par">
          <!--      标题 -->
          <div class="article-title-part margin-bottom-20">
            <el-input v-model="articles.title" placeholder="文章标题（6~42）个字符"
                      maxlength="42"
                      show-word-limit
                      resize="none"
                      minlength="6"></el-input>
          </div>
          <!--      类容编辑部分-->
          <div class="article-post-part margin-bottom-20">
            <mavon-editor
              v-model="articles.content"
              ref="editor"
              @imageClick="onEditorImage"
            />
          </div>
<div style="height: 100px;width: 100%"></div>
          <!--      发布操作-->
          <div class="article-post-action-bar">
            <div class="action-btn-container clear-fix">
              <el-button size="meitem" type="danger" @click="DoViewContentTan">重置文章</el-button>
              <el-button size="meitem" type="success" @click="articleDialogShow = false">退&nbsp;出</el-button>
              <el-button type="primary" size="meitem" @click="TocommitArticle">保存文章</el-button>
            </div>
          </div>
        </div>
      </el-drawer>
    </div>
    <div class="highlight-er">
      <div class="article-post-dialog-box">
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
            <div class="image-action-list clear-fix" >
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
                @current-change="onPgeChanges"
                :current-page="pageNavigations.currentPage"
                :page-size="pageNavigations.pageSize"
                layout="prev, pager, next"
                :total="pageNavigations.totalCount">
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
      <el-dialog
        title="删除提示"
        :visible.sync="deleteDialogShow"
        width="30%">
        <span>您确定要删除：《{{toDeleteItemTitle}}》这篇文章吗 ！</span>
        <span slot="footer" class="dialog-footer">
    <el-button @click="deleteDialogShow = false" size="mini" type="danger">取 消</el-button>
    <el-button size="mini" type="primary" @click="toDeleteItemArticle">删 除</el-button>
  </span>
      </el-dialog>
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
    </div>
<div>
  <el-dialog style=" overflow-x : auto;"
             title="文章编辑"
             :visible.sync="determineArticle"
             :close-on-click-modal="false"
             width="600px">
    <!--      分类，封面，标签-->
    <div class="article-post-settings-part">
      <el-form label-width="100px">
        <el-form-item label="文章分类" required>
          <el-select v-model="articles.categoryId" placeholder="选择文章分类" size="meitem">
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
          <el-radio-group v-model="articles.position">
            <el-radio label="1" @change="comm($event)">社区</el-radio>
            <el-radio label="2" @change="localEr($event)">本地博客</el-radio>
          </el-radio-group>
          <div v-if="articles.review==='3'">
            <span style="color: #FB4B26;font-size: 12px">
            注：文章审核未通过，请检查文章是否存在非法信息
            </span>
          </div>
        </el-form-item>
        <el-form-item label="是否置顶" required>
          <el-switch v-model="articles.status"
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
            v-model="articles.summary">
          </el-input>
        </el-form-item>
        <el-form-item label="封面" required>
          <div class="cover-selector" @click="showCodeSelector">
            <i class="el-icon-upload" v-if="articles.cover===''"></i>
            <el-image :src="articles.cover"></el-image>
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
          <el-button v-if="!labelsInputVisible&&!isEnough" class="button-new-tag" size="small"
                     @click="showLabelsInput">
            + 标签
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
    <el-button  @click="determineArticle = false">取 消</el-button>
    <el-button type="primary" @click="cherSaveArticle">保 存</el-button>
    </span>
  </el-dialog>
</div>
  </div>
</template>

<script>
import * as api from '../../api/api'
import * as dateUtils from '../../utils/date'
export default {
  name: "manage-article",
  data() {
    return {
      selectedImageIndex: 0,
      determineArticle: false,
      deleteDialogShow: false,
      imagesAdd: api.http_img,
      userIdToken: '',
      dialogVisibleArticle: false,
      isEnough: false,
      labelsNewValue: '',
      labelsInputVisible: false,
      articleDialogShow: false,
      isImageSelectShow: false,
      loading: false,
      images: [],
      labels: [],
      article: [],
      categories: [],
      //分页参数
      pageNavigation: {
        currentPage: 1,
        totalCount: 0,
        pageSize: 16,
      },
      toDeleteItemTitle: '',
      //分页参数
      pageNavigations: {
        currentPage: 1,
        totalCount: 0,
        pageSize: 12,
      },
      imageSelectFor: '',
      deleteArticleId: '',
      search: {
        categoryId: '',
        keyword: '',
        position: '',
        status: '',
      },
      articles: {
        id: '',
        title: '',
        content: '',
        categoryId: '',
        summary: '',
        cover: '',
        position: '',
        review: '',
        labels: '',
        status: '1',
        type: '',
      },
    }
  },
  methods: {
    detailsArticle(item){
      let routeData=this.$router.resolve({
        path: '/portal/article',
        query: {
          id: item.id
        }
      });
      window.open(routeData.href, '_blank');
    },
    returnCleanSearch(){
      api.adminReviewList(this.pageNavigations.currentPage,this.pageNavigations.pageSize).then(result=>{
        if (result.data.code=api.success_code){
          this.article =result.data.data.reviewArticle.records;
          this.pageNavigation.currentPage =result.data.data.reviewArticle.current;
          this.pageNavigation.totalCount =result.data.data.reviewArticle.total;
          this.pageNavigation.pageSize =result.data.data.reviewArticle.size;
        }else {
          return this.$notify({
            title: '数据加载异常', message: '数据加载异常，请稍后再试！', type: 'warning'
          });
        }
      });
    },
    chang(status){
      this.articles.status=status;
      this.articles.status='3';
    },
    comm(val){
      this.articles.position=val;
      this.articles.review='1';
    },
    localEr(val){
      this.articles.position=val;
      this.articles.review='2';
    },
    addCategory(){
      this.$router.push({
        path: '/operation/manage-category',
      });
    },
    TocommitArticle(){
      this.determineArticle=true;
    },
    toDeleteItemArticle() {
      this.deleteDialogShow = false;
      api.toDeleteItemArticle(this.deleteArticleId).then(result => {
        if (result.data.code === api.success_code) {
          this.listArticle();
          return this.$notify({
            title: '删除成功', message: '该文章已删除', type: 'success'
          });
        } else {
          return this.$notify({
            title: '删除异常', message: '文章删除异常，请稍后再试！', type: 'warning'
          });
        }
      });
    },
    DoViewContentTan() {
      this.dialogVisibleArticle = true;
    },
    cherSaveArticle() {
      this.determineArticle=false;
      if (this.articles.position==='1'){
        this.articles.review='1';
      };
      //检查数据
      if (this.articles.title === '') {
        return this.$message.error("文章标题不可以为空噢")
      }
      if (this.articles.categoryId === '') {
        return this.$message.error("分类还没选择呢")
      }
      if (this.articles.summary === '') {
        return this.$message.error("摘要不可以为空噢")
      }
      if (this.articles.cover === '') {
        return this.$message.error("请设置文章封面")
      }
      if (this.labels.length === 0) {
        return this.$message.error("添加标签，更容易检索噢")
      }
      let tempLabels = '';
      //处理标签
      this.labels.forEach((itemLabel, index) => {
        tempLabels += itemLabel;
        if (index !== this.labels.length - 1) {
          tempLabels += '-';
        }
      });
      this.articles.labels = tempLabels;
      api.cherSaveArticle(this.articles.id, this.articles).then(result => {
        if (result.data.code === api.success_code) {
          this.articleDialogShow = false;
          if (this.articles.position==='2'){
          this.listArticle();
          this.clearData();
          return this.$notify({
            title: '保存成功', message: '文章已是最新数据', type: 'success'
          });
          }else {
            this.listArticle();
            this.clearData();
            return this.$notify({
              title: '保存成功', message: '文章已是最新数据,待管理员审核中', type: 'success'
            });
          }
        } else {
          this.articleDialogShow = false;
          this.clearData();
          return this.$notify({
            title: '保存异常', message: '文章保存异常，请稍后再试 ', type: 'warning'
          });
        }
      });
    },
    clearData() {
      this.articles.title = '';
      this.articles.id = '';
      this.articles.position = '';
      this.articles.type = '';
      this.articles.summary = '';
      this.articles.status = '';
      this.articles.cover = '';
      this.articles.content = '';
      this.articles.categoryId = '';
      this.articles.labels = '';
    },
    onImageSelect() {
      //判断是插入到封面还是文章内
      if (this.imageSelectFor === 'article') {
      } else if (this.imageSelectFor === 'cover') {
        //拿到当前选中的对象
        let image = this.images[this.selectedImageIndex];
        this.articles.cover = image.url;
      }
      this.isImageSelectShow = false;
    },
    cropUploadFail() {
    },
    //上传成功
    cropUploadSuccess(response) {
        if (response.code === api.success_code) {
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
    DoViewContent() {
      this.dialogVisibleArticle = false;
      this.articles.content = '';
      this.articles.summary = '';
      this.articles.labels = '';
      this.articles.categoryId = '';
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
    deleteLabels(label) {
      //删除数组里的标签
      this.labels.splice(this.labels.indexOf(label), 1);
      if (this.labels.length < 5) {
        this.labelsInputVisible = true;
        this.isEnough = false;
      }
    },
    showCodeSelector() {
      //显示图框
      this.isImageSelectShow = true;
      this.imageSelectFor = 'cover';
    },
    onEditorImage() {
      //显示图框
      this.isImageSelectShow = true;
      this.imageSelectFor = 'article';
    },
    handleClose() {

    },
    deleteItem(item) {
      this.toDeleteItemTitle = item.title;
      this.deleteArticleId = item.id;
      this.deleteDialogShow = true;
    },
    edit(item) {
      api.gitArticleMin(item.id).then(result => {
        let ret = result.data;
        let labelsEr = ret.data.selectAerFrom.labels;
        //处理标签
        this.labels = labelsEr.split('-');
        // console.log(ret.data.selectAerFrom.categoryId);
        this.articles.id = ret.data.selectAerFrom.id;
        this.articles.title = ret.data.selectAerFrom.title;
        this.articles.content = ret.data.selectAerFrom.content;
        this.articles.categoryId = ret.data.selectAerFrom.categoryId;
        this.articles.cover = ret.data.selectAerFrom.cover;
        this.articles.status = ret.data.selectAerFrom.status;
        this.articles.summary = ret.data.selectAerFrom.summary;
        this.articles.type = ret.data.selectAerFrom.type;
        this.articles.review = ret.data.selectAerFrom.review;
        this.articles.position = ret.data.selectAerFrom.position;
      });
      this.ListImages();
      this.articleDialogShow = true;
    },

    onPgeChange(page) {
      this.pageNavigation.currentPage = page + 1;
      this.listArticle();
    },
    onPgeChanges(page) {
      this.pageNavigations.currentPage = page + 1;
      this.ListImages();
    },
    cleanSearch() {
      this.search.categoryId = '';
      this.search.keyword = '';
      this.search.position = '';
      this.search.status = '';
      this.listArticle();
    },
    doArticleSearch() {
      this.listArticle();
    },
    histArticleCategories() {
      api.listCategories().then(result => {
        let res = result.data;
        if (result.data.code === api.success_code) {
          this.categories = res.data.categoriesList.records;
          // this.categories.push({
          //   id: '',
          //   name: '所有分类',
          // })
        }
      });
    },
    listArticle() {
      this.loading = true;
      api.listArticle(this.pageNavigation.currentPage, this.pageNavigation.pageSize,
        this.search.categoryId, this.search.keyword, this.search.position, this.search.status).then(result => {
        this.loading = false;
        let res = result.data;
        if (result.data.code === api.success_code) {
          this.article = res.data.articleList[0].records;
          this.pageNavigation.currentPage = res.data.articleList[0].current;
          this.pageNavigation.totalCount = res.data.articleList[0].total;
          this.pageNavigation.pageSize = res.data.articleList[0].size;
        } else {
          return this.$notify({
            title: '加载异常', message: '数据加载失败 ', type: 'error'
          });
        }
      });
    },
    //格式化日期
    formatDate(dateStr) {
      let date = new Date(dateStr);
      return dateUtils.formatDate(date, 'yyyy-MM-dd hh:mm');
    },
    ListImages() {
      api.listImages(this.pageNavigations.currentPage, this.pageNavigations.pageSize, "article").then(result => {
        let res = result.data;
        if (result.data.code === api.success_code) {
          this.images = res.data.imagesList[0].records;
          this.pageNavigations.currentPage = res.data.imagesList[0].current;
          this.pageNavigations.totalCount = res.data.imagesList[0].total;
          this.pageNavigations.pageSize = res.data.imagesList[0].size;
        } else {
          this.$notify({
            title: '加载失败', message: '数据加载失败，请稍后再试', type: 'error'
          });
        }
      });
    },
    TokenInfo(){
      api.LoginGet().then(result=>{
        this.userIdToken = result.data.data.userFromToken.id;
        this.imagesAdd= this.imagesAdd+this.userIdToken+'/article';
        // console.log( this.imagesAdd)
      });
    },
  },
  mounted() {
    this.TokenInfo();
    this.listArticle();
    this.histArticleCategories();
  }
}
</script>

<style scoped>
  .article-list-box >>> .el-table .cell{
    height: 45px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }
  .article-page-navigation-bar {
    float: right;
    margin-right: 50px;
    margin-top: 20px;
  }

  .article-list-page-navigation-bar {
    margin-top: 20px;
  }

  .image-action-bar {
    padding-left: 6px;
    margin-bottom: 20px;
  }

  /*1.显示滚动条：当内容超出容器的时候，可以拖动：*/
  .article-dialog-part >>> .el-drawer__body {
    overflow: auto;
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

  .edit-article-par {
    margin: 20px;
  }

  .article-post-action-bar {
    margin-left: -20px;
  }

  .article-post-part {
    background: aqua;
  }

  .article-post-part >>> .v-note-op {
    postion: sticky;
    top: 0;
  }

  .article-post-settings-part {
    margin-bottom: 40px;
  }

  .article-post-action-bar {
    /*border-top: #e6e6e6 solid 1px;*/
    position: fixed;
    bottom: 0;
    background: transparent;
    width: 100%;
    margin-bottom: 10px;
  }

  .action-btn-container {
    float: right;
    margin-right: 50px;
    padding: 10px;
  }
</style>
