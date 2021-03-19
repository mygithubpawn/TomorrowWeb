<template>
    <div class="cover-index-box">
      <div class="cover-index-par">
      <div class="cover-index-par clear-fix">
        <el-radio-group v-model="selectedImageIndex">
          <el-radio-button class="cover-list-box"
                           :label="index" v-for="(item,index) in coverImages" :key="index">
            <el-image style="height: 200px;width: 300px;border-radius: 4px;" fit="cover" :src="item.url"></el-image>
          </el-radio-button>
        </el-radio-group>
        <div class="cover-abm-box">
          <el-button type="success" @click="deleteCoverImageAdd">添加</el-button>
          <el-button type="danger" @click="deleteCoverImage">删除</el-button>
        </div>
      </div>
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
        <el-dialog
          title="删除文章封面"
          :visible.sync="dialogVisibleImage"
          width="30%">
          <span>你确定删除该文章封面吗</span>
          <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisibleImage = false">取 消</el-button>
    <el-button type="primary" @click="TodeleteCoverImage">删 除</el-button>
  </span>
        </el-dialog>

        <el-dialog
          title="添加文章封面"
          :visible.sync="dialogVisibleImageAdd"
          width="500px">
          <div class="cover-image-add">
            <el-upload
              class="upload-demo"
              drag
              :action="imagesAdd"
              multiple
              :on-success="cropUploadSuccess">
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
              <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </div>
        </el-dialog>
      </div>
    </div>
</template>

<script>
    import * as api from "../../../api/api";
    export default {
        name: "cover-image",
      data(){
          return{
            coverImages:[],
            imagesAdd: api.http_img,
            userIdToken: '',
            dialogVisibleImage:false,
            dialogVisibleImageAdd:false,
            selectedImageIndex:0,
            images: [],
            //分页参数
            pageNavigations: {
              currentPage: 1,
              totalCount: 0,
              pageSize: 12,
            },
          }
      },
      methods:{
        addCoverImage(){

        },
        cropUploadSuccess(response){
          if (response.code === api.success_code) {
            this.ListImages();
            this.dialogVisibleImageAdd = false;
            return this.$notify({
              title: '上传成功', message: '图片上传成功', type: 'success'
            });
          } else {
            this.dialogVisibleImageAdd = false;
            return this.$notify({
              title: '上传异常', message: '图片上传异常，请稍后再试', type: 'warning'
            });
          }
        },
        deleteCoverImageAdd(){
          this.dialogVisibleImageAdd=true;
        },
        TodeleteCoverImage(){
          let image = this.coverImages[this.selectedImageIndex];
          console.log(image.id)
          api.deleteImage(image.id).then(result=>{
            if (result.data.code=api.success_code){
              this.ListImages();
              return this.$notify({
                title: '删除成功', message: '图片删除成功', type: 'success'
              });
            }else {
              return this.$notify({
                title: '删除异常', message: '图片删除异常，请稍后再试', type: 'warning'
              });
            }
          })
          this.dialogVisibleImage=false;
        },
        deleteCoverImage(){
          //拿到当前选中的对象
          this.dialogVisibleImage=true;
        },
        onPgeChanges(page) {
          this.pageNavigations.currentPage = page + 1;
          this.ListImages();
        },
        ListImages() {
          api.listImages(this.pageNavigations.currentPage, this.pageNavigations.pageSize, "article").then(result => {
            let res = result.data;
            if (result.data.code === api.success_code) {
              this.coverImages = res.data.imagesList[0].records;
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
            console.log( this.imagesAdd)
          });
        },
      },
      mounted() {
          this.TokenInfo();
          this.ListImages();
      }
    }
</script>

<style lang="css" scoped>
    @import "../css/cover-img.css";
</style>
