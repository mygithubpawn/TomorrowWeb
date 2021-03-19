import Http from './http';
import {isInContainer} from "element-ui/src/utils/dom";

let http = 'http://localhost:8181';
export const http_uer = 'http://localhost:8181';
export const http_img = 'http://localhost:8181/images/';
export const success_code = 200;

//用户登陆http://localhost
export const userSign = (verifyCode,captcha_key,user) => {
  return Http.post(http + '/user/login/'+verifyCode+'/'+captcha_key, user);
};
//退出登陆
export const login = () => {
  return Http.get(http + '/user/logout');
};
//用户注册
export const registerLog = (captcha_code,captcha_key,email_code,user) => {
  return Http.post(http + '/user/join/to?captchaCode='+captcha_code +'&captchaKey='+captcha_key+'&emailCode='+email_code,user);
};
//获取邮箱验证码
export const geVerifyCode = (email, type) => {
  return Http.get(http + '/user/email?email=' + email + '&type=' + type);
};
//邮箱修改邮件发送
export const emailReminder = (email,name) => {
  return Http.get(http + '/email/send/ email/update?email=' + email +'&name='+name);
};
//密码修改邮箱提示
export const passwordReminder = (email,name) => {
  return Http.get(http + '/email/send/password/update?email=' + email +'&name='+name);
};
//用户反馈邮件发送
export const feedbackContent = (name,email, classCapacity) => {
  return Http.get(http + '/email/send/feedback?userEmail=' + email +'&userName='+name+
    '&content=' + classCapacity);
};
//用户留言邮件发送
export const leaveMessageContent = (userName,userEmail, content) => {
  return Http.get(http + '/email/send/leave/message?userEmail=' + userEmail +'&userName='+userName+
    '&content=' + content);
};
//管理员邮件发送接口（前台定义发送内容）
export const userOperating = (userName,userEmail, content) => {
  return Http.get(http + '/email/send/operating?userEmail=' + userEmail +'&userName='+userName+
    '&content=' + content);
};

//检查用户角色,通过Token获取用户信息
export const LoginGet = () => {
  return Http.get(http + '/user/check_token');
};
//获取分类列表
export const listCategories = () => {
  return Http.get(http + '/categories/list/1/20');
};
//删除分类
export const deleteCategoryId = (categoryId) => {
  return Http.del(http + '/categories/delete/' + categoryId);
};
//添加分类
export const addPostCategory = (category) => {
  return Http.post(http + '/categories', category);
};
//更新分类
export const updateCategory = (categoryId, category) => {
  return Http.put(http + '/categories/update/' + categoryId, category);
};
//用户列表
export const listUser = (page, size) => {
  return Http.get(http + '/user/list?page=' + page + '&size=' + size);
};
//用户列表(被停用的用户)
export const deactivateListUser = (page, size) => {
  return Http.get(http + '/user/admin/list?page=' + page + '&size=' + size);
};
//用户列表(被停用的用户)
export const enableUser = (id, userState) => {
  return Http.put(http + '/user/enable/?userId='+ id+'&userState='+userState);
};
//用户搜索
export const doUserSearch = (userName, email) => {
  return Http.get(http + '/user/list?page=1&size=10&userName=' + userName + '&email=' + email);
};
//用户删除
export const deleteUserById = (userId) => {
  return Http.del(http + '/user/delete/' + userId);
};
//重置密码
export const resetPassword = (userId, newPassword) => {
  return Http.put(http + '/user/reset_password/' + userId + '?password=' + newPassword);
};
//更改邮箱
export const updateEmailAddress = (email, verifyCode) => {
  return Http.put( http + '/user/update/email?email=' + email + '&verifyCode=' + verifyCode);
};
//检查用户名的合法性
export const checkUserName = (userName) => {
  return Http.get(http + '/user/check/name_name?userName=' + userName);
};
//更新用信息
export const updateUserInfo = (userInfo, userId) => {
  return Http.put(http + '/user/update/' + userId, userInfo);
};
//获取网站信息
export const getWebSizeInfo = () => {
  return Http.get(http + '/web_size_info/get/title');
};
//校验网站标题
export const checkWebInfoTitle = (value) => {
  return Http.get(http + '/web_size_info/check/value?value=' + value);
};
//更新网站信息
export const updateWebSizeInfo = (webInfo) => {
  return Http.put(http + '/web_size_info/put/seo', webInfo);
};
//获取轮播图列表
export const listLoop = (page, size) => {
  return Http.get(http + '/looper/list?page=' + page + '&size=' + size);
};
//上传图片请求
// TODO:未使用
export const uploadAnnexInfo = (img) => {
  return Http.post(http + '/images', img);
};
export const deleteImage = (imagesId) => {
  return Http.del(http + '/images/delete/'+imagesId);
};
//添加轮播图
export const postLoop = (loop) => {
  return Http.post(http + '/looper', loop);
};
//删除轮播图
export const toDeleteItemLoop = (loopId) => {
  return Http.del(http + '/looper/delete/' + loopId);
};
//更新轮播图
export const updateLoop = (loopId, loop) => {
  return Http.put(http + '/looper/update/' + loopId, loop);
};
//获取友情连接列表
export const listLinks = () => {
  return Http.get(http + '/friends/list');
};
//添加友情连接
export const handIeFriendEditorCommit = (friend) => {
  return Http.post(http + '/friends', friend);
};
//更新友情连接
export const updateLink = (friendId, friend) => {
  return Http.put(http + '/friends/update/' + friendId, friend);
};
//删除友情连接
export const toDeleteItemLink = (friendId) => {
  return Http.del(http + '/friends/delete/' + friendId)
};
//获取网站信息
export const webInfo = () => {
  return Http.get(http + '/web_size_info/get/title')
};
//获取文章封面图片列表
export const listImages = (page, size, original) => {
  return Http.get(http + '/images/list/' + page + '/' + size + '/' + original)
};
//添加文章
export const postArticle = (article) => {
  return Http.post(http + '/article', article)
};
//添加文章(保存草稿)
export const saveArticleDraft = (article) => {
  return Http.post(http + '/article', article)
};
//获取文章列表
export const listArticle = (page, size, categoryId, keyword, position, status) => {
  return Http.get(http + '/article/list/' + page + '/' + size
    + '?categoryId=' + categoryId + '&keyword=' + keyword + '&position=' + position + '&status=' + status)
};
//获取单篇文章（门户）
export const gitArticle = (articleId) => {
  return Http.get(http + '/article/get/' + articleId)
};
//获取回收站文章列表 state=0，
export const recycleList = (userId,page,size) => {
  return Http.get(http + '/article/get/recycle/'+userId+'/'+page+'/'+size)
};
//文章删除，物理删出，
export const deleteArticle = (articleId) => {
  return Http.del(http + '/article/delete/'+articleId)
};
//文章恢复
export const recoveryArticle = (articleId) => {
  return Http.get(http + '/article/recovery/'+articleId)
};

//获取单篇文章(后台)
export const gitArticleMin = (articleId) => {
  return Http.get(http + '/article/get/min/' + articleId)
};

//更新文章
export const cherSaveArticle = (articleId, article) => {
  return Http.put(http + '/article/update/' + articleId, article)
};
//删除文章（逻辑删除）
export const toDeleteItemArticle = (articleId) => {
  return Http.del(http + '/article/sate/' + articleId)
};
//获取置顶文章
export const topArticle = (page, size) => {
  return Http.get(http + '/portal/article/private/top/' + page + '/' + size);
};
//获取用户的所有文章
export const listArticlePortal = (page, size) => {
  return Http.get(http + '/portal/article/list/' + page + '/' + size);
};
//获取用户的所有社区文章
export const listArticleComment = (page, size) => {
  return Http.get(http + '/portal/article/comment/' + page + '/' + size);
};
//获取用户的所有本地文章
export const listArticleLocal= (page, size) => {
  return Http.get(http + '/portal/article/local/' + page + '/' + size);
};
//首页文章推荐接口
export const recommendList = (size) => {
  return Http.get(http + '/portal/article/recommend/' + size);
};
//社区文章推荐接口
export const CommendList = (size) => {
  return Http.get(http + '/portal/article/recommend/community/' + size);
};
//获取标签云
export const listLabels = (userId,size) => {
  return Http.get(http + '/portal/article/Labels/' + userId+'/'+size);
};
//通过标题获取文章列表
export const articleListTitleEr = (title,page,size) => {
  return Http.get(http + '/portal/article/article/list/' + title+'/'+page+'/'+size);
};
//门户获取分类列表
export const portalCategoriesList = (page,size) => {
  return Http.get(http + '/portal/categories/list/'+page+'/'+size);
};
//通过分类获取文章列表(博客接口)
export const categoryList = (categoryId,page,size) => {
  return Http.get(http + '/portal/article/sort/list/'+categoryId+'/'+page+'/'+size);
};
//通过分类获取文章列表（社区接口）
export const commCategoryList = (category,page,size) => {
  return Http.get(http + '/portal/article/list/capacity/'+category+'/'+page+'/'+size);
};
//通过标题获取文章列表（社区接口）
export const commCategoryTitleList = (title,page,size) => {
  return Http.get(http + '/portal/article/capacity/title/'+title+'/'+page+'/'+size);
};
//通过标签获取文章列表
export const labelsList = (labels,page,size) => {
  return Http.get(http + '/portal/article/list/labels/'+labels+'/'+page+'/'+size);
};
//添加照片
export const addPhoto = (photo) => {
  return Http.post(http + '/photo',photo);
};
//删除照片
export const deletePhoto = (photoId) => {
  return Http.del(http + '/photo/delete/'+photoId);
};
//更新照片
export const updatePhoto = (photoId,photo) => {
  return Http.put(http + '/photo/update/'+photoId,photo);
};
//获取单张照片
export const getPhoto = (photoId) => {
  return Http.put(http + '/photo/get/'+photoId);
};
//后台获取照片列表
export const PhotoList = (page,size) => {
  return Http.get(http + '/photo/list/'+page+'/'+size);
};
//门户获取照片列表
export const postalPhotoList = (page,size) => {
  return Http.get(http + '/postal/photo/list/'+page+'/'+size);
};
//门户获取社区文章列表
export const communityList = (page,size) => {
  return Http.get(http + '/portal/article/community/list/'+page+'/'+size);
};
//门户获取最新分类
export const recommendNameList = (size) => {
  return Http.get(http + '/portal/categories/recommend/list/'+size);
};
//修改密码/找回密码
export const updatePassword = (verifyCode,password) => {
  return Http.put(http + '/user/password/'+verifyCode,password);
};
//后台获取待审核文章
export const adminArList = (page,size) => {
  return Http.get(http + '/article/review/list/'+page+'/'+size);
};
//文章审核
export const adminReview = (id,review) => {
  return Http.put(http + '/article/review/'+id,review);
};
//文章审核
export const adminReviewList = (page,size) => {
  return Http.get(http + '/article/review/did/'+page+'/'+size);
};
//添加评论
export const addComment = (comment) => {
  return Http.post(http + '/portal/comment',comment);
};
//文章评列表
export const CommentList = (commentId,page,size) => {
  return Http.get(http +'/portal/comment/list/'+commentId+'/'+page+'/'+size);
};
//文章评列表
export const ReleaseList = (release) => {
  return Http.get(http +'/portal/comment/list/release/'+release);
};

//用户所有评论列表
export const userCommentList = (page,size) => {
  return Http.get(http +'/comment/list?page='+page+'&size='+size);
};
//评论删除
export const DeleteComment = (commentId) => {
  return Http.del(http +'/comment/delete/'+commentId);
};
//获取用户相册总数
export const imageCountApi = (userId) => {
  return Http.get(http +'/photo/get/total/'+userId);
};
//获取用户文章总数
export const articleCountApi = (userId) => {
  return Http.get(http +'/article/get/total/'+userId);
};
//获取用户评论总数
export const commentCountApi = (userId) => {
  return Http.get(http +'/comment/get/total/'+userId);
};
//获取用户分类总数
export const categoriesCountApi = (userId) => {
  return Http.get(http +'/categories/get/total/'+userId);
};
//获取用户友情链接总数
export const friendsCountApi = (user_id) => {
  return Http.get(http +'/friends/get/total/'+user_id);
};
//获取用户文章总数
export const commArticleCount = () => {
  return Http.get(http +'/portal/article/get/total');
};
//获取上传图片总数
export const commImageCountPar = () => {
  return Http.get(http +'/images/image/Total');
};
//获取所有评论总数
export const commCommentCountPar = () => {
  return Http.get(http +'/comment/comment/Total');
};
//获取所有文章总数（社区文章）
export const commArticleCountPar = () => {
  return Http.get(http +'/portal/article/get/total');
};
//获取所有用户总数
export const commUserCountPar = () => {
  return Http.get(http +'/user/user/total');
};
//获取用户的标签总数
export const labelsCountPar = (userId) => {
  return Http.get(http +'/labels/get/labels/'+userId);
};
//消息发送（添加消息）
export const addNews = (news) => {
  return Http.post(http +'/portal/news',news);
};
//消息状态修改为已查看
export const alreadyNews = (newsId) => {
  return Http.get(http +'/portal/news/already/'+newsId);
};
//获取所有的公告announcement==>1
export const announcementNews = () => {
  return Http.get(http +'/portal/news/announcement/list');
};
//消息删除
export const deleteNews = (newsId) => {
  return Http.del(http +'/portal/news/delete/'+newsId);
};
//获取用户未查看消息的总数 view==>1
export const contentNews = (userId) => {
  return Http.get(http +'/portal/news/list/content/'+userId);
};
//获取用户的所有消息
export const listNewsUser = (userId,page,size) => {
  return Http.get(http +'/portal/news/list/'+userId+'/'+page+'/'+size);
};
//获取用户未查看的消息 view==>1 announcement==>2
export const waitNews = (userId,page,size) => {
  return Http.get(http +'/portal/news/wait/list/'+userId);
};
//一键修改消息状态为已读
export const newsOne = (userId) => {
  return Http.get(http +'/portal/news/news/one/'+userId);
};
//
export const addViewCount = (articleId) => {
  return Http.get(http +'/portal/article/private/count/'+articleId);
};
