<template>
  <div>
    <ev-form :value="focusedContent.contentStyleObject" @input="updateCssObject">
        <h4 class="sub-title">Layout</h4>
        <div class="field-group">
          <ev-form-field field="Position" label="Position" type="ev-hint-input" :options="['absolute','relative','fixed','sticky','inherent']" class="w-1/3"></ev-form-field>
          <ev-form-field field="display" label="display" type="ev-hint-input" :options="['block','inline','flex','none','inline-block','flow-root']" class="w-1/3"></ev-form-field>
          <ev-form-field field="flex-direction" label="direction" type="ev-hint-input" :options="['row','column']" class="w-1/3"></ev-form-field>
          <ev-form-field field="justify-content" label="justify" type="ev-hint-input" :options="['flex-start','center','flex-end','space-between','space-around']" class="w-1/3"></ev-form-field>
          <ev-form-field field="align-items" label="align" type="ev-hint-input" :options="['flex-start','center','flex-end','baseline','stretch']" class="w-1/3"></ev-form-field>
          <ev-form-field field="overflow" label="overflow" type="ev-hint-input" :options="['auto','visible','hidden','inherent']" class="w-1/3"></ev-form-field>
        </div>
        <h4 class="sub-title">Dimension</h4>
        <div class="field-group">
          <ev-form-field field="width" label="width" class="w-1/3"></ev-form-field>
          <ev-form-field field="min-width" label="min width" class="w-1/3"></ev-form-field>
          <ev-form-field field="max-width" label="max width" class="w-1/3"></ev-form-field>
          <ev-form-field field="height" label="height" class="w-1/3"></ev-form-field>
          <ev-form-field field="min-height" label="min height" class="w-1/3"></ev-form-field>
          <ev-form-field field="max-height" label="max height" class="w-1/3"></ev-form-field>
        </div>
        <h4 class="sub-title">Spacing</h4>
        <div class="field-group">
          <ev-form-field field="padding" label="Padding" class="w-1/2"></ev-form-field>
          <ev-form-field field="margin" label="Margin" class="w-1/2"></ev-form-field>
        </div>
        <h4 class="sub-title">Border</h4>
        <div class="field-group">
          <ev-form-field field="border" label="border" class="w-1/2"></ev-form-field>
          <ev-form-field field="border-color" label="Border Color" class="w-1/2">
            <ev-color-picker slot-scope="{value}" :value="value" @input="(val)=>{ setStyle('border-color', val) }"></ev-color-picker>
          </ev-form-field>
          <ev-form-field field="border-top" label="Top" class="w-1/4"></ev-form-field>
          <ev-form-field field="border-right" label="Right" class="w-1/4"></ev-form-field>
          <ev-form-field field="border-bottom" label="Bottom" class="w-1/4"></ev-form-field>
          <ev-form-field field="border-left" label="Left" class="w-1/4"></ev-form-field>
        </div>
        <h4 class="sub-title">Background</h4>
        <div class="field-group">
          <ev-form-field field="background-image" label="Image" class="w-1/2"></ev-form-field>
          <ev-form-field field="background-position" label="Position" class="w-1/2"></ev-form-field>
          <ev-form-field field="background-repeat" label="Repeat" type="ev-hint-input" :options="['repeat-x','repeat-y','repeat','space','round','no-repeat']" class="w-1/2"></ev-form-field>
          <ev-form-field field="background-attachment" label="Attachment" type="ev-hint-input" :options="['scroll','fixed','local','inherit']" class="w-1/2"></ev-form-field>
          <ev-form-field field="background-clip" label="Clip" type="ev-hint-input" :options="['border-box','padding-box','content-box','text','inherit']" class="w-1/2"></ev-form-field>
          <ev-form-field field="background-color" label="Back Color" class="w-1/2">
            <ev-color-picker slot-scope="{value}" :value="value" @input="(val)=>{ setStyle('background-color', val) }"></ev-color-picker>
          </ev-form-field>
        </div>
        <h4 class="sub-title">Text</h4>
        <div class="field-group">
          <ev-form-field field="font-family" label="font-family" class="w-1/3"></ev-form-field>
          <ev-form-field field="font-size" label="font-size" class="w-1/3"></ev-form-field>
          <ev-form-field field="text-align" label="text-align" type="ev-hint-input" :options="['left','center','right','justify']" class="w-1/3"></ev-form-field>
          <ev-form-field field="font-weight" label="font-weight" class="w-1/3"></ev-form-field>
          <ev-form-field field="line-height" label="line-height" class="w-1/3"></ev-form-field>
          <ev-form-field field="color" label="font color" class="w-1/3">
            <ev-color-picker slot-scope="{value}" :value="value" @input="(val)=>{ setStyle('color', val) }"></ev-color-picker>
          </ev-form-field>
        </div>
      </ev-form>
  </div>
</template>

<script>
import {cloneAll} from "@/lib/createUniqueId";
import EvColorPicker from "@/components/forms/EvColorPicker";
import EvForm from "@/components/forms/EvForm";
import EvFormField from "@/components/forms/EvFormField";

export default {
  name: "StyleController",
  inject:['$editor'],
  components: {
    EvFormField,
    EvForm,
    EvColorPicker,
  },
  data(){
    return{
      selector:[]
    }
  },
  computed:{
    focusedContent(){
      if(!this.$editor.contentStates.focusedContent || !this.$editor.contentStates.focusedContent.component){
        return null;
      }
      return this.$editor.contentStates.focusedContent.component;
    },
    getClasses() {
      return this.focusedContent.value.class || []
    },
  },
  methods: {
    syncCssText(){
      this.$editor.$refs.helper
    },
    updateCssObject(style){
      const media = this.$editor.getCurrentMedia;

      for (const [key, value] of Object.entries(cloneAll(style))) {
        if(value){
          this.$set( this.focusedContent.value.cssObject[media], key, value);
        }else{
          this.$delete(this.focusedContent.value.cssObject[media], key);
        }
      }
    },
    setStyle(key, value) {

      this.updateCssObject({[key]:value})

    },
    updateClassOrder(items) {
      this.focusedContent.value.class = items;
    }
  }
}
</script>

<style scoped>

</style>