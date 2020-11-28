<template>
  <transition name="modal" appear>
    <div class="fixed z-10 inset-0 overflow-y-auto opacity-100" v-if="visible">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity">
          <div class="absolute inset-0 bg-gray-800 opacity-75"></div>
        </div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
        <transition name="modal-inner" appear>
        <div v-if="visible"
            class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full"
            role="dialog" aria-modal="true" aria-labelledby="modal-headline">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
                  사용법 안내
                </h3>
                <div class="mt-2">
                  <ul class="text-gray-800">
                    <li class="py-2 my-1 flex justify-start items-baseline">
                      <tag color="green">Content</tag>
                      <p>드레그 앤 드롭으로 원하는 곳에 새로운 컨덴츠를 추가할 수 있습니다.</p>
                    </li>
                    <li class="py-2 my-1 flex justify-start items-baseline">
                      <tag color="green">Media</tag>
                      <p>에디터에 Media Query 를 적용합니다. Mobile 상태에서 하는 스타일 작업은 모두 media query 안에 적용되며, 모바일과 데스크톱 환경에서 서로 다른 스타일을 적용할 수 있습니다.</p>
                    </li>
                    <li class="py-2 my-1 flex justify-start items-baseline">
                      <tag color="green">Config</tag>
                      <p>작업을 돕기 위한 가이드나 그리드를 켜고 끌 수 있습니다.</p>
                    </li>
                    <li class="py-2 my-1 flex justify-start items-baseline">
                      <tag color="green">Action</tag>
                      <p>작업물을 Export 하거나 되돌립니다.</p>
                    </li>
                    <li class="py-2 my-1 flex justify-start items-baseline">
                      <tag color="green">Template</tag>
                      <p>선택한 컨덴츠를 사용자의 로컬 스토리지에 저장하고 재활용할 수 있습니다.</p>
                    </li>
                  </ul>
                  <h4 class="text-lg bold">Handler & Hot Key</h4>
                  <ul class="flex flex-col">
                    <li class="py-2 my-1 flex justify-start items-baseline">
                      <div class="flex-shrink-0"><tag>mouse select</tag></div>
                      <div>클래스, 스타일, 레이아웃을 작업할 컨덴츠를 선택합니다. 선택된 컨덴츠는 삭제, 복제 또는 템플릿으로 저장(Keep) 할 수 있습니다.</div>
                    </li>
                    <li class="py-2 my-1 flex justify-start items-baseline">
                      <div class="flex-shrink-0"><tag>mouse double click</tag></div>
                      <div>컨덴츠를 수정모드로 변경하고 내용을 수정할 수 있게 합니다.</div>
                    </li>
                    <li class="py-2 my-1 flex justify-start items-baseline">
                      <div class="flex-shrink-0"><tag>cmd</tag> + <tag>z</tag></div>
                      <div>작업상황을 한단계 이전으로 되돌립니다.</div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <slot name="button">
              <button type="button" @click.stop="hide"
                      class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                닫기
              </button>
            </slot>
          </div>
        </div>
        </transition>
      </div>
    </div>
  </transition>
</template>

<script>
import Tag from "@/components/Tag";
export default {
  name: "Document",
  components: {Tag},
  props:{
    visible:{
      type: Boolean
    }
  },
  methods:{
    exec() {
      this.$emit('success', true);
      this.$emit('update:visible', false);
    },
    hide() {
      this.$emit('fail', false);
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style scoped>

.modal-enter-active {
  transition: all .3s ease;
}
.modal-leave-active {
  transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.modal-enter, .modal-leave-to
{
  opacity: 0;
}
.modal-inner-enter, .modal-inner-leave-to
{
  transform: translateY(30px);
  opacity: 0;
}
</style>