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
      <h4>Position</h4>
      <div></div>
      <h4>Decoration</h4>
      <div>
        <ev-form v-model="focusedContent.contentStyleObject">
          <ev-form-field field="width" label="width" class="w-1/4"></ev-form-field>
          <ev-form-field field="height" label="height" class="w-1/4"></ev-form-field>
          <ev-form-field field="min-width" label="min width" class="w-1/4"></ev-form-field>
          <ev-form-field field="min-height" label="min height" class="w-1/4"></ev-form-field>
          <ev-form-field field="max-width" label="max width" class="w-1/4"></ev-form-field>
          <ev-form-field field="max-height" label="max height" class="w-1/4"></ev-form-field>
          <ev-form-field field="position" label="Position" class="w-1/2"></ev-form-field>
          <ev-form-field field="display" label="display" type="radio-group" :options="['block','inline','flex','none','inline-block','flow-root']" class="w-2/3"></ev-form-field>
          <ev-form-field field="justify-content" label="justify-content" type="radio-group" :options="['flex-start','center','flex-end','space-between','space-around']" class="w-2/3"></ev-form-field>
          <ev-form-field field="align-items" label="align-items" type="radio-group" :options="['flex-start','center','flex-end','baseline','stretch']" class="w-2/3"></ev-form-field>
          <ev-form-field field="padding" label="Padding" class="w-1/2"></ev-form-field>
          <ev-form-field field="margin" label="Margin" class="w-1/2"></ev-form-field>
          <ev-form-field field="border" label="border" class="w-1/2"></ev-form-field>
          <ev-form-field field="background-image" label="Bg Image" class="w-1/2"></ev-form-field>
          <ev-form-field field="background-color" label="Background<br>Color" class="w-1/3">
            <ev-color-picker slot-scope="{value}" :value="value" @input="(val)=>{ setStyle('background-color', val) }"></ev-color-picker>
          </ev-form-field>
          <ev-form-field field="border-color" label="Border Color" class="w-1/3">
            <ev-color-picker slot-scope="{value}" :value="value" @input="(val)=>{ setStyle('border-color', val) }"></ev-color-picker>
          </ev-form-field>
          <ev-form-field field="color" label="Text Color" class="w-1/3">
            <ev-color-picker slot-scope="{value}" :value="value" @input="(val)=>{ setStyle('color', val) }"></ev-color-picker>
          </ev-form-field>
        </ev-form>
      </div>
    </div>
  </div>
</template>

<script>
import EvForm from "@/components/forms/EvForm";
import EvFormField from "@/components/forms/EvFormField";
import EvButton from "@/components/forms/EvButton";
import {cloneAll} from "@/lib/createUniqueId";
import EvColorPicker from "@/components/forms/EvColorPicker";
export default {
  name: "StyleController",
  inject:['$editor'],
  components: {
    EvColorPicker,
    EvButton, EvFormField, EvForm
  },
  computed:{
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
    handleInput(val) {
      console.log(val);

    },
    hasStyle(key, value) {
      const obj = this.focusedContent.contentStyleObject

      if (!obj)
        return null;

      if (!obj[key])
        return null;

      if (obj[key] === value){
        return 'green';
      }

      return null;
    },
    setStyle(key, value) {
      this.focusedContent.setCssObject({ [key] : value });
    },
    setCssObject(style) {

      const media = this.$editor.getCurrentMedia;
      this.value.cssObject[media] = Object.assign({}, cloneAll(this.value.cssObject[media]), style);

      //this.$set(this.value, 'cssObject' , Object.assign({}, this.value.cssObject, newStyle));

      this.$emit('update:content', cloneAll(this.value));
    }
  }
}
</script>

<style scoped>

</style>