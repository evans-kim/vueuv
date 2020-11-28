<template>
  <transition name="modal" appear>
    <div class="fixed z-10 inset-0 overflow-y-auto opacity-100" v-if="visible">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity">
          <div class="absolute inset-0 bg-gray-800 opacity-75"></div>
        </div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
        <div
            class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
            role="dialog" aria-modal="true" aria-labelledby="modal-headline">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div :class="[`bg-${color}-100`]"
                  class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full sm:mx-0 sm:h-10 sm:w-10" >
                <!-- Heroicon name: exclamation -->
                <svg :class="[`text-${color}-600`]" class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                     stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                </svg>
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
                  {{ title }}
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-800">
                    <slot>
                      {{ body }}
                    </slot>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <slot name="button">
              <button type="button" @click.stop="exec"
                      :class="[`bg-${color}-600`, `hover:bg-${color}-700`, `focus:ring-${color}-500`]"
                      class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm">
                {{ yesButton }}
              </button>
              <button type="button" @click.stop="hide"
                      class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                {{ noButton }}
              </button>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import Vue from "vue";

// Define the props by using Vue's canonical way.
const ModalProps = Vue.extend({
  name: "Modal",
  props: {
    color:{type:String, default:'green'},
    title: {type: String, default: 'Title', required: false},
    body: {type: String, default: 'Body', required: false},
    yesButton: {type: String, default: 'Submit'},
    noButton: {type: String, default: 'Cancel'},
    visible: {type: Boolean, default: false, required: false}
  }
})

@Component
export default class Modal extends ModalProps {
  exec() {
    this.$emit('success', true);
    this.$emit('update:visible', false);
  }
  hide() {
    this.$emit('fail', false);
    this.$emit('update:visible', false)
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
  /* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateY(10px);
  opacity: 0;
}
</style>