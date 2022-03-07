<template>
  <div>
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
        deep: true
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
        deep: true
      }
    },
    computed: {
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
      listeners() {
        return { ...this.$listeners };
      },
    },
    methods: {
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
