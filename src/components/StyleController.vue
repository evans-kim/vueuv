<template>
  <div>
    <!-- 클래스를 토글하여 셀렉터를 설정 -->
    <div style="min-width: 10rem;">
      클래스 :
      <ev-button v-for="(cls, idx) in getTargetClasses" :key="idx" @click.stop="">
        {{cls}}
      </ev-button>
      ID :
      <ev-button @click.stop="">#{{ focusedContent.value.id }}</ev-button>
    </div>
    <div>
      <ev-form :value="focusedContent.contentStyleObject" @input="updateCssObject">
        <h4 class="sub-title">Layout</h4>
        <div class="field-group">
          <ev-form-field field="position" label="Position" type="radio-group" :options="['absolute','relative','fixed','sticky','inherent']" class="w-2/3"></ev-form-field>
          <ev-form-field field="display" label="display" type="radio-group" :options="['block','inline','flex','none','inline-block','flow-root']" class="w-2/3"></ev-form-field>
          <ev-form-field field="justify-content" label="justify" type="radio-group" :options="['flex-start','center','flex-end','space-between','space-around']" class="w-2/3"></ev-form-field>
          <ev-form-field field="align-items" label="align" type="radio-group" :options="['flex-start','center','flex-end','baseline','stretch']" class="w-2/3"></ev-form-field>
          <ev-form-field field="overflow" label="overflow" type="radio-group" :options="['auto','visible','hidden','inherent']" class="w-2/3"></ev-form-field>
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
        </div>
        <h4 class="sub-title">Background</h4>
        <div class="field-group">
          <ev-form-field field="background-image" label="Image" class="w-1/2"></ev-form-field>
          <ev-form-field field="background-position" label="Position" class="w-1/2"></ev-form-field>
          <ev-form-field field="background-repeat" label="Repeat" :hint="['repeat-x','repeat-y','repeat','space','round','no-repeat']" class="w-1/2"></ev-form-field>
          <ev-form-field field="background-attachment" label="Attachment" :hint="['scroll','fixed','local','inherit']" class="w-1/2"></ev-form-field>
          <ev-form-field field="background-clip" label="Clip" :hint="['border-box','padding-box','content-box','text','inherit']" class="w-1/2"></ev-form-field>
          <ev-form-field field="background-color" label="Back Color" class="w-1/2">
            <ev-color-picker slot-scope="{value}" :value="value" @input="(val)=>{ setStyle('background-color', val) }"></ev-color-picker>
          </ev-form-field>
        </div>

        <div class="field-group">
          <ev-form-field field="font-face" label="font-face" class="w-1/3"></ev-form-field>
          <ev-form-field field="font-size" label="font-size" class="w-1/3"></ev-form-field>
          <ev-form-field field="font-weight" label="font-weight" class="w-1/3"></ev-form-field>
          <ev-form-field field="line-height" label="line-height" class="w-1/3"></ev-form-field>
          <ev-form-field field="color" label="font color" class="w-1/3">
            <ev-color-picker slot-scope="{value}" :value="value" @input="(val)=>{ setStyle('color', val) }"></ev-color-picker>
          </ev-form-field>
        </div>
      </ev-form>
    </div>
  </div>
</template>

<script>
import EvButton from "@/components/forms/EvButton";
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
    EvButton
  },
  computed:{
    styleModel: {
      get: function () {
        return this.focusedContent.value.cssObject[this.$editor.getCurrentMedia] || {};
      },
      set: function (value) {
        this.$editor.setRollBackPoint();
        console.log('styleModel',value);
      }
    },
    focusedContent(){
      if(!this.$editor.states.focusedContent || !this.$editor.states.focusedContent.component){
        return null;
      }
      return this.$editor.states.focusedContent.component;
    },
    getTargetClasses() {
      return this.focusedContent.value.class || []
    },
  },
  methods: {
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

    }
  }
}
</script>

<style scoped>

</style>