<template>
  <div :id="getEditorId" v-html="value" v-vueuv-content></div>
</template>

<script>
/* eslint-disable @typescript-eslint/camelcase */

// Import TinyMCE
import tinymce from 'tinymce/tinymce';
require('tinymce/skins/ui/oxide/skin.min.css')
// Default icons are required for TinyMCE 5.3 or above
import 'tinymce/icons/default';

// A theme is also required
import 'tinymce/themes/silver';
// Any plugins you want to use has to be imported

import 'tinymce/plugins/print';
import 'tinymce/plugins/preview';
import 'tinymce/plugins/paste';
import 'tinymce/plugins/importcss';
import 'tinymce/plugins/searchreplace';
import 'tinymce/plugins/autolink';
import 'tinymce/plugins/autosave';
import 'tinymce/plugins/save';
import 'tinymce/plugins/directionality';
import 'tinymce/plugins/code';
import 'tinymce/plugins/visualblocks';
import 'tinymce/plugins/visualchars';
import 'tinymce/plugins/fullscreen';
import 'tinymce/plugins/image';
import 'tinymce/plugins/link';
import 'tinymce/plugins/media';
import 'tinymce/plugins/template';
import 'tinymce/plugins/codesample';
import 'tinymce/plugins/table';
import 'tinymce/plugins/charmap';
import 'tinymce/plugins/hr';
import 'tinymce/plugins/pagebreak';
import 'tinymce/plugins/nonbreaking';
import 'tinymce/plugins/anchor';
import 'tinymce/plugins/toc';
import 'tinymce/plugins/insertdatetime';
import 'tinymce/plugins/advlist';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/wordcount';
import 'tinymce/plugins/imagetools';
import 'tinymce/plugins/textpattern';
import 'tinymce/plugins/noneditable';
import 'tinymce/plugins/help';
import 'tinymce/plugins/charmap';
import 'tinymce/plugins/quickbars';
import 'tinymce/plugins/autoresize';


export default {
  name: "TextContent",
  label:'문단',
  contentDefault:{
    style:{padding:'1rem'},
    props:{
      value:'New paragraph'
    }
  },
  props: {
    value: {
      type: String
    }
  },
  data(){
    return {
      editor: null,
      contentId : null
    }
  },
  methods: {
    enableEdit(){
      this.loadEditor();
    },
    disableEdit(){
      if(this.editor)
        this.$emit('update:value', this.editor.getContent() );
      this.editor.hide();
    },
    async loadEditor(){
      if(this.editor){
        this.editor.show();
        return;
      }
      const id = this.$el.getAttribute('id');

      const editors = await tinymce.init( {
        selector: '#'+id,
        menubar: false,
        inline: true,
        plugins: [
          'advlist autolink lists link image charmap print preview anchor',
          'searchreplace visualblocks code fullscreen',
          'insertdatetime media table paste code help wordcount'
        ],
        font_formats:'Noto Sans KR=Noto Sans KR,sans-serif;',
        toolbar: 'undo redo | fontselect fontsizeselect formatselect | ' +
            'bold italic backcolor | forecolor backcolor casechange permanentpen formatpainter removeformat | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'help',
        inline_styles : true
        //content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
      });

      this.editor = editors[0];
    }
  },
  computed: {
    getEditorId(){
      return this.value.id || this._uid;
    }
  }
}
</script>

<style scoped>

</style>