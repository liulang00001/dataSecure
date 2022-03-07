<template>
  <div class="page-404">
    <img class="pic" :src="img_404" alt="404">
    <el-button class="btn" @click="backHome()">返回首页</el-button>
  </div>
</template>

<script>
import img_404 from '@/assets/404_images/404.png';

export default {
  name: 'page404',
  data() {
    return {
      img_404,
    }
  },
  methods: {
    backHome() {
      this.$router.replace({
        name: 'dashboard',
      });
    },
  },
}
</script>

<style lang="scss" scoped>
.page-404 {
  position: absolute;
  left: 0;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: #f0f2f5;
  .pic {
    position: relative;
    right: -80px;
    display: block;
    width: 600px;
  }
  .btn {
    position: relative;
    right: -40px;
    min-width: 150px;
    margin-top: 80px;
  }
}
</style>
