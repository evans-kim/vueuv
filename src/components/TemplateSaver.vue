<template>
  <modal :visible.sync="isShowTemplate" title="템플릿 등록" @success="createTemplate">
    <ul class="my-2">
      <li>+ 템플릿 이름을 입력하고 확인 버튼을 누르세요. 동일한 이름의 템플릿이 있다면 덮어집니다.</li>
      <li>+ 별도의 CSS 파일에 적용된 효과는 저장되지 않을 수 있습니다.</li>
    </ul>

    <div class="col-span-3 sm:col-span-2">
      <label class="block text-sm font-medium text-gray-700">
        <input v-model="templateName" type="text"
               class="focus:outline-none border flex-1 block w-full rounded-none h-8 p-2 sm:text-sm border-gray-600">
      </label>

      <label class="flex items-center">
          <input id="remember_me" v-model="isCopyCss" type="checkbox" class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded">
          <label for="remember_me"  class="ml-2 block text-sm text-gray-900">
            CSS 전체를 복사
          </label>
        </label>

    </div>
  </modal>
</template>
<script>
import Modal from "@/components/Modal.vue"
import LocalStore from "@/lib/LocalStore";
import {cloneAll, getCssProperties} from "@/lib/createUniqueId";


export default {
  name: 'TemplateSaver',
  inject:['$editor'],
  components: {Modal},
  data() {
    return {
      isShowTemplate: false,
      templateName: null,
      isCopyCss: false,
      store:null
    }
  },
  methods: {
    show() {
      this.isShowTemplate = true;
    },
    /**
     *
     * @param {ContentRender} render
     */
    getContentModelByComputedCss(render){

      const v = cloneAll( render.getValue );

      v.style = Object.assign(getCssProperties(render.$el), v.style);

      if(v.contents && v.contents.length){
        v.contents = render.$children.map((child)=>{
          if(!child.isContentRender){

            return false;
          }
          return this.getContentModelByComputedCss(child)
        }).filter(item=>item)
      }
      return v;
    },
    deleteTemplate(template) {
      this.store.remove(template.label);
      this.$editor.refreshMenu();
    },
    createTemplate() {

      let cloneTemplate;
      const component = this.$editor.states.focusedContent.component;
      if(this.isCopyCss){
        cloneTemplate = this.getContentModelByComputedCss(component);
      }else{
        cloneTemplate = component.value;
      }

      this.store.set(this.templateName, cloneTemplate);
      this.$editor.refreshMenu();
    }
  },
  mounted() {
    this.store = new LocalStore();
  }
}
</script>
