<template>
  <div class="manage-img-index-box">
    <div class="photo-img-index-par">
      <el-button type="primary" size="medium" @click="showAddLoop"><i class="el-icon-plus"></i>&nbsp;照片 </el-button>
    </div>
      <div class="photo-list-box">
        <el-table
          v-loading="loading"
          :data="photoListOr"
          size="medium"
          style="width: 100%">
          <el-table-column
            prop="introduction"
            label="描述"
            width="200">
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
            label="相片"
            width="250">
            <template slot-scope="scope">
              <el-image class="loop-url" :src="scope.row.imageUrl" :preview-src-list="srcList"></el-image>
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
    <div class="photo-vim">
      <el-dialog
        :close-on-click-modal="false"
        :show-close="false"
        :close-on-press-escape="false"
        :title="photoEditorTitle"
        :visible.sync="dialogVisibleImageAdd"
        width="500px">
        <span class="in-span-box"> 照片描述</span>
        <div class="in-img-box-par">
          <el-input
            type="textarea"
            :rows="3"
            show-word-limit
            minlength="6"
            resize="none"
            maxlength="20"
            placeholder="照片介绍（6~20）个字符"
            v-model="photoWall.introduction">
          </el-input>
        </div>
        <div class="cover-image-add">
          <el-upload
            class="upload-demo"
            drag
            :action="imagesAdd"
            multiple
            :on-success="cropUploadSuccess">
            <el-image fit="scale-down" v-if="photoWall.imageUrl" :src="photoWall.imageUrl" class="avatar"></el-image>
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </div>
        <span slot="footer" class="dialog-footer">
    <el-button @click="clearData">取 消</el-button>
    <el-button type="primary" @click="addPhotoImg">{{photoDialogButton}}</el-button>
  </span>
      </el-dialog>

      <el-dialog
        title="删除提示"
        :visible.sync="dialogVisibleDelete"
        width="30%">
        <span>你确定删除该照片吗</span>
        <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisibleDelete = false">取 消</el-button>
    <el-button type="primary" @click="deleteDefine">确 定</el-button>
  </span>
      </el-dialog>

    </div>
    <!--    分页-->
    <div class="page-photo-navigation-box  margin-bottom-20 clear-fix">
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
    import * as api from "../../../api/api";
    import * as dateUtils from "../../../utils/date";
    export default {
        name: "photo-album",
      data(){
          return{
            photoDialogButton:'添加',
            photoEditorTitle:'添加照片',
            loading:false,
            dialogVisibleDelete:false,
            dialogVisibleImageAdd:false,
            imagesAdd: api.http_img,
            userIdToken: '',
            //分页参数
            pageNavigation: {
              currentPage: 1,
              totalCount: 0,
              pageSize: 15,
            },
            photoWall:{
              id:'',
              introduction:'',
              imageUrl:'',
              userId:'',
            },
            srcList: [],
            photoListOr:[],
          }
      },
      methods:{
          clearData(){
            this.photoWall.introduction='';
            this.photoWall.imageUrl='';
            this.photoWall.id='';
            this.dialogVisibleImageAdd=false;
          },
        addPhotoImg(){
          //检查数据
          if (this.photoWall.introduction===''){
            return this.$message.error("相片描述不能为空噢");
          }
          if (this.photoWall.imageUrl===''){
            return this.$message.error("照片还没上传呢");
          }
          //判断是更新还是添加，通过判断id的有无
          if (this.photoWall.id === '') {
            api.addPhoto(this.photoWall).then(result=>{
                this.listPhoto();
                this.clearData();
              if (result.data.code=api.success_code){
                return this.$notify({
                  title: '添加成功', message: '照片已添加 ', type: 'success'
                });
              }else {
                return this.$notify({
                  title: '添加异常', message: '照片添加失败，请稍后再试', type: 'success'
                });
              }
            });
          }else {
            api.updatePhoto(this.photoWall.id,this.photoWall).then(result=>{
                this.listPhoto();
                this.clearData();
              if (result.data.code=api.success_code){
                return this.$notify({
                  title: '更新成功', message: '照片已跟新', type: 'success'
                });
              }else {
                return this.$notify({
                  title: '更新异常', message: '照片跟新失败，请稍后再试', type: 'warning'
                });
              }
            });
          }
        },
        cropUploadSuccess(response){
          if (response.code === api.success_code) {
            //回显图片
            this.photoWall.imageUrl = response.data.images.url;
            return this.$notify({
              title: '上传成功', message: '照片上传成功', type: 'success'
            });
          } else {
            return this.$notify({
              title: '上传异常', message: '照片上传异常，请稍后再试', type: 'warning'
            });
          }
        },
        showAddLoop(){
          this.photoDialogButton="添加";
          this.photoEditorTitle="添加照片";
        this.dialogVisibleImageAdd=true;

        },
        edit(item){
          this.dialogVisibleImageAdd=true;
          this.photoWall.id=item.id;
          this.photoWall.introduction=item.introduction;
          this.photoWall.imageUrl=item.imageUrl;
          this.photoDialogButton="保 存";
          this.photoEditorTitle="照片编辑";
        },
        deleteItem(item){
          this.photoWall.id=item.id;
          this.dialogVisibleDelete=true;
        },
        deleteDefine(){
            api.deletePhoto(this.photoWall.id).then(result=>{
              this.listPhoto();
              this.dialogVisibleDelete=false;
              if (result.data.code=api.success_code){
                return this.$notify({
                  title: '删除成功', message: '照片已删除', type: 'success'
                });
              }else {
                return this.$notify({
                  title: '删除异常', message: '照片删除失败，请稍后再试', type: 'warning'
                });
              }
            });
        },
        onPgeChangeLoop(page) {
          this.pageNavigation.currentPage = page + 1;
          this.listPhoto();
        },
        //格式化日期
        formatDate(dateStr) {
          let date = new Date(dateStr);
          return dateUtils.formatDate(date, 'yyyy-MM-dd hh:mm');
        },
        listPhoto(){
          this.loading = true;
        api.PhotoList(this.pageNavigation.currentPage,this.pageNavigation.pageSize).then(result=>{
          this.loading = false;
          let res = result.data;
          if (res.code=api.success_code){
                this.photoListOr=res.data.photoList.records;
            this.photoListOr.forEach((item => {
              this.srcList.push(item.imageUrl);
            }));
            this.pageNavigation.currentPage = res.data.photoList.current;
            this.pageNavigation.totalCount = res.data.photoList.total;
            this.pageNavigation.pageSize = res.data.photoList.size;
          }else {

          }
        });
        },
        TokenInfo(){
          api.LoginGet().then(result=>{
            this.userIdToken = result.data.data.userFromToken.id;
            this.imagesAdd= this.imagesAdd+this.userIdToken+'/photo';
            console.log( this.imagesAdd)
          });
        },
      },
      mounted() {
        this.TokenInfo();
        this.listPhoto();
      }
    }
</script>

<style lang="css" scoped>
  @import "../css/manage-image.css";
</style>
