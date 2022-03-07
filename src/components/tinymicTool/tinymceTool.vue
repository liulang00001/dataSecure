<template>
  <div>
    <textarea :id="myTinymceId" style="height:300px" v-model="value" v-bind="$attrs"></textarea>
  </div>
</template>

<script>
const uuid = require('uuid');

export default {
  name: "tinymceTool",
  props: ['value'],
  data(){
    return{
      updateStatus: false,
      myTinymceId: uuid.v1(),
    }
  },
  mounted: function(){
    this.initTinymce();
  },
  methods:{
    initTinymce() {
      const me = this;
      window.tinymce.init({
        selector: '#' + me.myTinymceId,
        readonly: this.$attrs && (this.$attrs.readonly || this.$attrs.disabled) || false,
        language: this.getLang(),
        hasChange: false,
        hasInit: false,
        menubar: false,
        body_class: 'panel-body ',
        object_resizing: false,
        end_container_on_empty_block: true,
        powerpaste_word_import: 'clean',
        code_dialog_height: 300,
        code_dialog_width: 1000,
        advlist_bullet_styles: 'square',
        advlist_number_styles: 'default',
        imagetools_cors_hosts: [],
        default_link_target: '_blank',
        link_title: false,
        nonbreaking_force_tab: true,
        plugins: ['advlist anchor autolink autosave code codesample colorpicker colorpicker contextmenu directionality emoticons fullscreen hr image imagetools insertdatetime link lists media nonbreaking noneditable pagebreak paste preview print save searchreplace spellchecker tabfocus table template textcolor textpattern visualblocks visualchars wordcount'],
        toolbar: ['searchreplace bold italic underline strikethrough alignleft aligncenter alignright outdent indent  blockquote undo redo removeformat subscript superscript  code fullscreen',
          'table hr bullist numlist link image charmap anchor pagebreak insertdatetime fontsizeselect forecolor backcolor'],
        init_instance_callback(editor) {
          if (me.value) {
            editor.setContent(me.value)
          }
          editor.on('NodeChange Change KeyUp SetContent', () => {
            me.updateValue(editor.getContent());
          })
        },
        setup(editor) {
          editor.on('input undo redo execCommand', () => {
            me.updateValue(editor.getContent());
          })
        }
      });
    },
    updateValue(value) {
      if(this.value === value) {
        return;
      }
      this.updateStatus = true;
      this.$emit('input', value);
    },
    setContent(value) {
      if(!this.updateStatus) {
        const tinymce = window.tinymce.get(this.myTinymceId);
        if (tinymce) {
          tinymce.setContent(value);
        }
      }
      this.updateStatus = false;
    },
    destroyTinymce() {
      const tinymce = window.tinymce.get(this.myTinymceId);
      if (tinymce) {
        tinymce.destroy();
      }
    },
    getLang() {
      if(this.$store.getters.language === 'zh') {
        return 'zh_CN';
      }
      return '';
    }
  },
  watch: {
    value(nv) {
      this.setContent(nv);
    }
  },
  destroyed() {
    this.destroyTinymce();
  }
}
</script>

<style scoped>

</style>
