<template>
  <div class="featureContent" :fit-padding="fitPadding">
    <div class="header" v-if="hasTitle">
      <div class="titleBadge"></div>
      <span v-if="title" class="title">{{title}}</span>
      <div v-if="$slots.headerStart" class="headerStart"><slot name="headerStart"></slot></div>
      <div v-if="$slots.headerEnd" class="headerEnd"><slot name="headerEnd"></slot></div>
    </div>
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      title: {
        type: String,
        default: ''
      },
      fitPadding: {
        type: Boolean,
        default: true
      },
      hasTitle: {
        type: Boolean,
        default: true
      }
    }
  }
</script>

<style lang="scss" scoped>
  .featureContent {
    position: relative;
    border: 1px solid #EDEEF0;
    &+.featureContent {
      margin-top: 10px;
    }
    .header {
      height: 44px;
      .titleBadge {
        display: inline-block;
        background: #333333;
        width: 4px;
        height: 10px;
        margin:17px 10px 0 0;
      }
      .title {
        color: #333333;
        font-size: 14px;
        font-weight: 500;
      }
      .headerStart {
        display: inline-block;
        height: 100%;
      }
      .headerEnd {
        float: right;
        height: 100%;
      }
    }
    .content {
      
    }
    .infoContent {
      padding: 0 20px 15px 20px;
      &[small] {
        .infoItem {
          .value {
            width: 210px;
            // @include fc-info-item-value;
          }
        }
      }
      .infoItem {
        display: inline-block;
        padding: 10px 0;
        line-height: 20px;
        color: #303846;
        &[small] {
          .value {
            width: 210px;
          }
        }
        &[new-line] {
          display: block;
          clear: both;
          .value {
            // width: 800px;
          }
        }
        .label {
          display: inline-block;
          width: 150px;
          margin-right: 10px;
          font-size: 14px;
          vertical-align: top;
        }
        .value {
          display: inline-block;
          width: 310px;
          margin-right: 10px;
          font-size: 13px;
          word-break: break-all;
          vertical-align: top;
          * {
            padding-top: 0px;
            padding-bottom: 0px;
            &+* {
              margin-left: 15px;
            }
          }
        }
      }
      
      /deep/ .el-row {
        padding: 8px 0;
      }
      /deep/ .el-col {
        display: flex;
        align-items: flex-start;
        line-height: 20px;
        .label {
          width: 120px;
          margin-right: 10px;
          font-size: 14px;
          color: #909399;
        }
        .value {
          flex: 1;
          margin-right: 10px;
          font-size: 13px;
          color: #303846;
          word-break: break-all;
        }
        .el-form-item {
          padding: 10px 5px;
          .el-form-item__label,
          .el-form-item__content {
            word-break: break-all;
            line-height: 1.5;
          }
          .el-form-item__label {
            color: #606266;
          }
          .el-form-item__content {
            color: #303846;
          }
        }
      }
    }
    &[fit-padding='true'] {
      .content {
        padding: 20px;
      }
    }
  }
</style>

<style lang="scss">
  .featureContent {
    .content {
      .el-form {
        .el-form-item {
          margin-bottom: 10px;
          .el-form-item__label {
            color: #303846;
            font-weight: 400;
          }
          .el-form-item__content {
            >span {
              display: inline-block;
              word-break: break-word;
            }
            &>.el-checkbox-group {
              &+.el-form-item__error {
                padding: 0;
                margin-top: -6px;
              }
            }
            &>*{
              margin-right: 16px;
              &:last-child {
                margin-right: 0px;
              }
            }
          }
          &:last-child {
            margin-bottom: 0px;
          }
        }
        &.el-form--label-left, &.el-form--label-top {
          .el-form-item {
            &.is-required {
              &>.el-form-item__label {
                &:before {
                  content: '';
                  margin-right: 0px;
                }
                &:after {
                  content: '*';
                  color: $color-error;
                  margin-left: 4px;
                }
              }
            }
          }
        }
        &.el-form--label-top {
          .el-form-item__label {
            padding: 0;
          }
        }
        .newLine {
          display: block;
          &+.newLine {
            margin-top: 10px;
          }
          &.bigFormItem, .bigFormItem {
            width: 720px;
          }
        }
        .smallFormItem {
          width: 194px;
        }
        .mediumFormItem {
          width: 386px;
        }
        .bigFormItem {
          width: 600px;
        }
      }
      a {
        color: #409eff;
        text-decoration: underline;
      }
    }
  }
  .el-form {
    .featureContent {
      .content {
        .el-form-item {
          margin-bottom: 10px;
          .el-form-item__label {
            color: #303846;
            font-weight: 400;
          }
          .el-form-item__content {
            >span {
              display: inline-block;
              word-break: break-word;
            }
            &>.el-checkbox-group {
              &+.el-form-item__error {
                padding: 0;
                margin-top: -6px;
              }
            }
            &>*{
              margin-right: 16px;
              &:last-child {
                margin-right: 0px;
              }
            }
          }
          &:last-child {
            margin-bottom: 0px;
          }
        }
        .newLine {
          display: block;
          &+.newLine {
            margin-top: 10px;
          }
          &.bigFormItem, .bigFormItem {
            width: 720px;
          }
        }
        .smallFormItem {
          width: 194px;
        }
        .mediumFormItem {
          width: 386px;
        }
        .bigFormItem {
          width: 600px;
        }
      }
      a {
        color: #409eff;
        text-decoration: underline;
      }
    }
    &.el-form--label-left, 
    &.el-form--label-top {
      .featureContent {
        .content {
          .el-form-item {
            &.is-required {
              &>.el-form-item__label {
                &:before {
                  content: '';
                  margin-right: 0px;
                }
                &:after {
                  content: '*';
                  color: $color-error;
                  margin-left: 4px;
                }
              }
            }
          }
        }
      }
    }
    &.el-form--label-top {
      .featureContent {
        .content {
          .el-form-item__label {
            padding: 0;
          }
        }
      }
    }
  }
</style>
