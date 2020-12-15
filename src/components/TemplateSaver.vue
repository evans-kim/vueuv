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
          <input v-model="isCopyCss" type="checkbox" class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded">
          <label class="ml-2 block text-sm text-gray-900">
            CSS 전체를 복사
          </label>
        </label>

    </div>
  </modal>
</template>
<script lang="ts">
import Modal from "@/components/Modal.vue"
import LocalStore from "@/lib/LocalStore";
import {Component, Inject, Vue} from "vue-property-decorator";
import VueuvEditor from "@/components/VueuvEditor.vue";

@Component({
  components: {Modal}
})
export default class TemplateSaver extends Vue{

  @Inject('$editor') readonly $editor!: VueuvEditor

  isShowTemplate = false;
  isCopyCss = false;
  templateName = '';
  store = new LocalStore();
  show() {
    this.isShowTemplate = true;
  }

  deleteTemplate(template) {
    this.store.remove(template.label);
  }

  createTemplate() {

    if(!this.$editor.contentStates.focusedContent){
      return
    }
    const component = this.$editor.contentStates.focusedContent.component;

    this.store.set(this.templateName || 'unknown', component.value);
  }
}
</script>
