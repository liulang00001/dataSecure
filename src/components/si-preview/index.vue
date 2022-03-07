<template>
  <div class="preview-wrap">
    <el-button type="text" class="preview-button" @click="previewFile(url)">{{ label || $t('siPreview.button') }}</el-button>
    <!-- PDF预览 -->
    <template v-if="pdfContainerVisible">
      <div id="pdf-container"></div>
      <div class="pdf-close" @click="pdfContainerVisible = false">
        <i class="el-icon-close"></i>
      </div>
    </template>
    <!-- 图片预览 -->
    <viewer
      :options="defaultOptions"
      :images="[url]"
      @inited="imagePreviewInited"
    >
      <template slot-scope="scope">
        <img v-for="(src, index) in scope.images" :src="src" :key="index" style="display:none;" />
      </template>
    </viewer>
  </div>
</template>

<script>
  import Viewer from 'v-viewer/src/component.vue';
  import 'viewerjs/dist/viewer.css';

  import local from './local';

  const SCOPE_NAME = 'siPreview';

  export default {
    name: SCOPE_NAME,
    inheritAttrs: false,
    components: {
      Viewer,
    },
    props: {
      url: {
        type: String,
        default: '',
      },
      label: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        pdfContainerVisible: false,
        defaultOptions: {
          toolbar: false,
          navbar: false,
          title: false
        }
      };
    },
    created() {
      if (!this.$i18n.getLocaleMessage('en')[SCOPE_NAME]) {
        this.$i18n.mergeLocaleMessage('en', local.en);
        this.$i18n.mergeLocaleMessage('zh', local.zh);
      }
    },
    methods: {
      // 文件预览
      previewFile(fileUrl) {
        const fileExtension = fileUrl.split('.').pop();
        const isPdf = fileExtension.toLowerCase().startsWith('pdf');
        const isImg = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].find(suffix => fileExtension.toLowerCase().startsWith(suffix));
        if (isPdf) {
          this.pdfPreview(fileUrl);
        } else if (isImg) {
          this.imagePreview();
        } else {
          window.open(fileUrl);
        }
      },
      // 图片预览
      imagePreview() {
        this.$viewer.show();
      },
      imagePreviewInited(viewer) {
        this.$viewer = viewer;
      },
      // PDF预览
      pdfPreview(fileUrl) {
        this.pdfContainerVisible = true;
        this.$nextTick(() => {
          let url = '';
          if (fileUrl.startsWith('https://')) {
            url = fileUrl.substring(6);
          } else if (fileUrl.startsWith('http://')) {
            url = fileUrl.substring(5);
          } else {
            url = fileUrl;
          }
          PDFObject.embed(url, '#pdf-container', {
            width: '80%'
          });
        });
      }
    },
  };
</script>

<style lang="scss" scoped>
  .preview-wrap {
    display: inline-block;
  }
  .preview-button {
    padding: 0;
  }
  #pdf-container {
    position: fixed;
    z-index: 10000;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.6);
  }
  .pdf-close {
    position: fixed;
    z-index: 10001;
    right: 0;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 60px;
    height: 60px;
    font-size: 40px;
    color: #fff;
    background-color: rgba(0, 0, 0, 0.4);
    cursor: pointer;
  }
</style>