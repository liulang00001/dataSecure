<template>
  <div class="featureTitle" :active='isActive'>
    <span class="title"><slot></slot></span>
    <span class="right-slot"><slot name="right"></slot></span>
    <span v-if="status" class="status">{{status}}</span>
  </div>
</template>

<script>
  export default {
    props: {
      status: {
        type: String,
        default: ''
      },
      isActive: {
        type: Boolean,
        default: true
      }
    }
  }
</script>

<style lang="scss" scoped>
  $titleHeight: 56px;
  .featureTitle {
    height: $titleHeight;
    padding: 0 20px;
    background-color: rgba(51, 51, 51, 0.05);
    margin: 30px 0px 20px 0px;
    &+.featureTitle {
      margin: 0 0 20px 0;
    }
    .title {
      color: #333333;
      font-weight: 600;
      font-size: 20px;
      line-height: $titleHeight;
      float: left;
    }
    .status {
      color: #616163;
      font-weight: 500;
      font-size: 16px;
      line-height: $titleHeight;
      float: right;
    }
    .right-slot {
      float: right;
      line-height: $titleHeight;
    }
    &[active] {
      background-color: rgba(65, 158, 255, 0.05);
      .title {
        color: #419EFF;
      }
      .status {
        color: #61BD54;
      }
    }
  }
</style>