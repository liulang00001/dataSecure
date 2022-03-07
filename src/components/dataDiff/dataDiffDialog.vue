<template>
  <div v-if="dialogState">
    <el-dialog
      :visible.sync="dialogState"
      :before-close="handleClose"
      v-bind="dialogAttrs"
      v-on="$listeners"
    >
      <div slot="title">{{ title }}</div>
      <el-row type="flex" justify="space-between" v-if="headerShow">
        <el-col :span="12">
          <div class="dividing-line-bot">{{ $t("route.oldString") }}</div>
          <el-input
            type="textarea"
            :rows="16"
            :placeholder="$t('common.hint.input')"
            v-model="oldStr"
            @change="onOldChange"
          >
          </el-input>
        </el-col>
        <el-col :span="12" class="omc_H_space_20">
          <div class="dividing-line-bot">{{ $t("route.newString") }}</div>
          <el-input
            type="textarea"
            :rows="16"
            :placeholder="$t('common.hint.input')"
            v-model="newStr"
            @change="onNewChange"
          >
          </el-input>
        </el-col>
      </el-row>
      <div class="omc_V_space_20">
        <slot name="diffConfig"></slot>
        <code-diff v-bind="diffAttrs" v-on="listeners"></code-diff>
      </div>
      <div class="dialog-footer" slot="footer" v-if="footerShow">
        <el-button @click="handleClose">{{ $t('common.actions.cancel') }}</el-button>
        <el-button type="primary" @click="onSubmit">{{ $t('common.actions.confirm') }}</el-button>
      </div>
      <slot name="footerOptions"></slot>
    </el-dialog>
  </div>
</template>

<script>
  import { CodeDiff } from 'v-code-diff'
  export default {
    components: {
      CodeDiff,
    },
    data() {
      return {
        oldStr: this.oldText,
        newStr: this.newText,
      }
    },
    props: {
      dialogState: {
        type: Boolean,
        default: false
      },
      footerShow: {
        type: Boolean,
        default: false
      },
      title: {
        type: String,
        default: '数据对比'
      },
      headerShow: {
        type: Boolean,
        default: false
      },
      oldText: {
        type: String,
        default: ''
      },
      newText: {
        type: String,
        default: ''
      }
    },
    watch: {
      oldText: {
        handler(newValue, oldValue) {
          if(typeof this.oldText == 'string') {
            try {
              const obj = JSON.parse(this.oldText);
              if(obj && typeof obj == 'object') {
                const newStr = JSON.stringify(obj, null, 2);
                this.oldStr = newStr
              }
            } catch(e) {
              this.oldStr = this.oldText
            }
          } else {
            this.oldStr = this.oldText
          }
        },
        immediate: true,
      },
      newText: {
        handler(newValue, oldValue) {
          if(typeof this.newText == 'string') {
            try {
              const obj = JSON.parse(this.newText);
              if(obj && typeof obj == 'object') {
                const newStr = JSON.stringify(obj, null, 2);
                this.newStr = newStr
              }
            } catch(e) {
              this.newStr = this.newText
            }
          } else {
            this.newStr = this.newText
          }
        },
        immediate: true,
      }
    },
    computed: {
      listeners() {
        return { ...this.$listeners };
      },
      dialogAttrs() {
        return {
          ...{
            'width': '80%',
            'top': '20px',
            'close-on-click-modal': false,
            'close-on-press-escape': false,
            'custom-class': 'common_dialog_custom'
          },
          ...this.$attrs
        }
      },
      diffAttrs() {
        return {
          ...{
            'highlight': true,
            'language': '',
            'output-format': 'side-by-side',
            'context': 100,
            'fileName': '',
            'noDiffLineFeed': true,
            'drawFileList': true,
            'isShowNoChange': false,
            'trim': true,
          },
          ...this.$attrs,
          'old-string': this.oldStr,
          'new-string': this.newStr,
        };
      },
    },
    methods: {
      handleClose() {
        this.$emit('update:dialogState', false);
        this.$emit('closeDiff');
      },
      onSubmit() {
        this.$emit('onSubmitDiff');
      },
      onOldChange(val) {
        let oldStr = val? val : ''
        this.$emit('update:oldText', oldStr)
      },
      onNewChange(val) {
        let newStr = val? val : ''
        this.$emit('update:newText', newStr)
      },
    },
  }
</script>

<style lang="scss" scoped>
.dividing-line-bot {
  margin-bottom: 5px;
}
/deep/ .d2h-file-list-header {
  display: none;
}
</style>
