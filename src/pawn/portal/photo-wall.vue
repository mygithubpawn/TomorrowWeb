<template>
    <div class="photo-index-box">
      <div style="width: 100%;height: 90px"></div>
      <div class="photo-index-par">
        <div class="photo-index-wall clear-fix">
          <div class="photo-index-wall-par">
          <div class="photo-index-img-list float-left" v-for="(item,index) in listImg":key="index">
          <figure>
            <div class="photo-img">
            <el-image fit="cover" style="height: 180px;width: 260px" :src="item.imageUrl" :preview-src-list="srcList" alt="my_photo">
            </el-image>
            </div>
            <figcaption>{{item.introduction}}</figcaption>
          </figure>
          </div>
          </div>
        </div>
        <div v-if="listImg.length!==0">
        <div class="img-list-box">
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
      </div>
      <div class="no-data" v-else>
        <span style="margin: 0 auto">暂无照片！</span>
      </div>
      </div>
    </div>
</template>

<script>
  import * as api from "../../api/api";
  import * as dateUtils from "../../utils/date";
    export default {
        name: "photo-wall",
      data(){
          return{
            //分页参数
            pageNavigation: {
              currentPage: 1,
              totalCount: 0,
              pageSize: 9,
            },
            listImg:[],
            srcList: [],
          }
      },
      methods:{
        onPgeChange(page) {
          this.pageNavigation.currentPage = page + 1;
          this.PhotoImgList();
        },
        PhotoImgList(){
            api.PhotoList(this.pageNavigation.currentPage,this.pageNavigation.pageSize).then(result=>{
              let res = result.data;
              if (res.code=api.success_code){
                this.listImg=res.data.photoList.records;
                this.listImg.forEach((item => {
                  this.srcList.push(item.imageUrl);
                }));
                this.pageNavigation.currentPage = res.data.photoList.current;
                this.pageNavigation.totalCount = res.data.photoList.total;
                this.pageNavigation.pageSize = res.data.photoList.size;
              }else {

              }
            });
        }
      },
      mounted() {
          this.PhotoImgList();
        document.body.scrollTop = 0
        document.documentElement.scrollTop = 0
        window.pageYOffset = 0
        }
    }
</script>

<style lang="css" scoped>
@import "css/photo-wall.css";
</style>
