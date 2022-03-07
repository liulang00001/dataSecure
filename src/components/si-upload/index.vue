<template>
  <!-- 目前仅支持单选文件 -->
  <el-upload
    ref="upload"
    :accept="accept"
    :action="$attrs.action || ''"
    :headers="getHeaders"
    :before-upload="onUploadBefore"
    :on-success="onUploadSuccess"
    :on-error="onUploadError"
    :on-remove="onUploadRemove"
    :on-change="onUploadChange"
    :file-list="fileList"
    :disabled="uploading"
    v-bind="$attrs"
    :multiple="false"
    v-on="$listeners">
    <template slot="trigger">
      <slot name="trigger">
        <base-button :loading="uploading">{{ fileUrl ? $t('siUpload.reupload'): $t('siUpload.upload') }}</base-button>
      </slot>
    </template>
    <template slot="tip" v-if="!$attrs.hideSlotTip">
      <slot name="tip">
        <div v-if="$attrs.slotTip" class="upload-tip">
          {{ $attrs.slotTip }}
        </div>
        <div v-else>
          <div v-if="uploadTypeMsg && uploadSizeMsg" class="upload-tip">{{ uploadTypeMsg }}&nbsp;{{ uploadSizeMsg }}</div>
          <div v-else-if="uploadTypeMsg" class="upload-tip">{{ uploadTypeMsg }}</div>
          <div v-else-if="uploadSizeMsg" class="upload-tip">{{ uploadSizeMsg }}</div>
        </div>
      </slot>
    </template>
  </el-upload>
</template>

<script>
  import local from './local';
  import { getToken } from '@/utils/auth';
  import { getCookie } from '@/utils/cookies';
  const SCOPE_NAME = 'siUpload';
  const FILENAME_MAX_LENGTH = 900;

  export default {
    name: SCOPE_NAME,
    inheritAttrs: false,
    model: {
      prop: 'value',
      event: 'change'
    },
    props: {
      value: {
        type: String,
        default: '',
      },
      limitSuffix: {
        type: Array,
        default: function() {
          return [];
        },
      },
      limitSize: Number,
      handledErrors: Array,
    },
    data() {
      return {
        fileUrl: '',
        fileList: [],
        uploading: false,
      };
    },
    computed: {
      getHeaders() {
        return { 'X-Token': getCookie() };
      },
      accept() {
        if (this.limitSuffix && this.limitSuffix.length) {
          return this.limitSuffix.map(item => `.${item},`).join(' ');
        } else {
          return '';
        }
      },
      uploadTypeMsg() {
        if (this.limitSuffix && this.limitSuffix.length) {
          const suffix = this.limitSuffix.map(item => `.${item}`).join(' ');
          return this.$t('siUpload.uploadTypeMsg', { suffix });
        } else {
          return '';
        }
      },
      uploadSizeMsg() {
        if (this.limitSize) {
          return this.$t('siUpload.uploadSizeMsg', { size: this.limitSize});
        } else {
          return '';
        }
      },
    },
    watch: {
      value(url) {
        // 只对首次外部传值有效
        if (this.fileUrl || this.fileList.length) {
          return;
        }
        if (url) {
          this.fileUrl = url;
          this.fileList = [{ name: this.getFileName(url), url }];
        }
      },
    },
    created() {
      if (!this.$i18n.getLocaleMessage('en')[SCOPE_NAME]) {
        this.$i18n.mergeLocaleMessage('en', local.en);
        this.$i18n.mergeLocaleMessage('zh', local.zh);
      }
    },
    methods: {
      getFileName(url) {
        const lastUrlPart = url.substring(url.lastIndexOf('/') + 1);
        const name = lastUrlPart.substring(lastUrlPart.indexOf('_') + 1);
        return decodeURI(name);
      },
      checkFileSize(file) {
        if (this.limitSize) {
          return file.size / 1024 / 1024 < this.limitSize;
        } else {
          return true;
        }
      },
      checkFileType(file) {
        if (this.limitSuffix.length) {
          const fileExtension = file.name.split('.').pop();
          const res = this.limitSuffix.find(suffix => fileExtension.toLowerCase().startsWith(suffix));
          return !!res;
        } else {
          return true;
        }
      },
      onUploadBefore(file) {
        if (!this.checkFileType(file)) {
          this.$message.error(this.uploadTypeMsg);
          return false;
        }
        if (!this.checkFileSize(file)) {
          this.$message.error(this.uploadSizeMsg);
          return false;
        }
        let length = this.$util.string.rfc3986EncodeURIComponent(file.name).length;
        if(length > FILENAME_MAX_LENGTH) {
          this.$confirm(this.$t('siUpload.filenameOverSize.content'), this.$t('siUpload.filenameOverSize.title'), {
            confirmButtonText: this.$t('siUpload.filenameOverSize.confirm'),
            showCancelButton: false,
            type: 'warning',
          });
          return false;
        }
        this.changeUploadingStatus(true);
        if(this.$attrs['before-upload']) {
          return this.$attrs['before-upload'](file);
        } else {
          return true;
        }
      },
      onUploadSuccess(res, file, fileList) {
        console.log('onUploadSuccess.res', res);
        try {
          if (typeof res.data == 'object') {
            this.fileUrl = res.data.url;
          } else {
            this.fileUrl = res.data;
          }
          this.$emit('change', this.fileUrl);
          this.changeUploadingStatus(false);
        } catch (error) {
          this.changeUploadingStatus(false);
          console.warn('si-upload error', error);
        }
      },
      onUploadError(err, file, fileList) {
        console.log('onUploadError.err', err);
        if (err) {
          if (err.error && this.handledErrors && this.handledErrors.length && this.handledErrors.includes(err.error)) {
            // skip
          } else if (err.message) {
            this.$message.error(err.message);
          } else {
            this.$message.error(this.$t('siUpload.statusUploadFailed'));
          }
        } else {
          this.$message.error(this.$t('siUpload.statusUploadFailed'));
        }
        this.fileUrl = '';
        this.$emit('change', this.fileUrl);
        this.changeUploadingStatus(false);
      },
      onUploadRemove(file, fileList) {
        if (this.checkFileSize(file)) {
          this.fileUrl = '';
          this.$emit('change', this.fileUrl);
        }
        this.changeUploadingStatus(false);
      },
      onUploadChange(file, fileList) {
        if (this.checkFileSize(file)) {
          if (fileList && fileList.length > 1) {
            fileList.splice(0, 1);
          }
        }
      },
      changeUploadingStatus(val) {
        this.uploading = val;
        this.$emit('change-uploading', val);
      },
      clearFiles() {
        this.$refs.upload.clearFiles();
      },
      reset() {
        this.clearFiles();
        Object.assign(this.$data, this.$options.data());
      }
    },
  };
</script>

<style lang="scss" scoped>
  .upload-tip {
    margin-top: 4px;
    line-height: 20px;
    font-size: 12px;
    color: #606266;
  }
</style>
