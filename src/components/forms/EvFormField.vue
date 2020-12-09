<template>
  <div ref="fieldWrap" :class="getWrapClass" class="flex items-start transition-ease">
    <div v-if="isShowLabel" :style="getLabelStyle" class="flex justify-center items-start h-full">
      <label ref="formFieldLabel" :class="getLabelClass" v-html="label"></label>
    </div>
    <div :class="getFieldWrapClass" class="relative flex flex-col h-full">
      <slot :handler="handleInput" :value="getParentValue">
        <div class="items-center">
          <div v-if="isValue" class="py-1 px-2 text-right h-full">{{ getParentValue }}</div>
          <component :is="getInputComponent" v-else
                     :auto-max="autoMax"
                     :before-days="(options && options.beforeDays) ? options.beforeDays : 1" :name="field"
                     :options="(options) ? options : null"
                     :rows="rows ? rows : null"
                     :select-group="options && options.selectGroup"
                     :type="getInputType"
                     :value="getParentValue"
                     class="w-full"
                     single
                     @change="handleChange"
                     @input="handleInput"
                     @keypress.enter="handleEnterKey"

          ></component>
        </div>
      </slot>
      <div v-for="(msg, index) in getErrorMessage" :key="index" :class="getErrorMessageCSS"
           class="p-2 right-0 text-red-600 transition-ease">
        {{ msg }}
      </div>
    </div>
  </div>
</template>
<script>
import Vue from 'vue';
import EvInput from "./EvInput";
import EvCheckBox from "./EvCheckBox";
import EvRadioGroup from "@/components/forms/EvRadioGroup";
import EvHintInput from "@/components/forms/EvHintInput";

export default {
  name: 'EvFormField',
  components: {EvHintInput, EvRadioGroup, EvCheckBox, EvInput},
  props: {
    value: null,
    label: null,
    field: null,
    comment: null,
    /**
     *
     * @values input,textarea,checkbox,radio-group,select,datepicker,date-range
     */
    type: {
      type: String,
      default: 'text'
    },
    labelPosition: {
      default: 'left'
    },
    // 텍스트의 길이에 따라 인풋의 크기가 가변합니다.
    autoMax: {
      default: null
    },
    options: null,
    extInput: null,
    rows: null
  },
  data() {
    return {
      errorMessage: null,
      labelWidth: null,
      animated: null
    }
  },
  computed: {
    isBordered() {
      return this.$parent.bordered;
    },
    isNoLabel() {
      return this.$parent.noLabel;
    },
    getParentValue() {
      if (typeof this.value !== 'undefined') {
        return this.value;
      }
      if (!this.field) {
        return;
      }
      return this.$parent.getFieldValue(this.field);
    },
    hasSlot() {
      return !!this.$slots.default;
    },
    hasError() {
      return !!this.getErrorMessage;
    },
    getErrorMessage() {

      return this.$parent.getErrors(this.field);
    },
    hasComment() {
      return !!this.getCommentMessage && !this.hasError;
    },
    getCommentMessage() {
      return this.comment;
    },
    getInputType() {
      return this.type ? this.type : 'text';
    },
    isInput() {
      return ['text', 'password', 'number'].includes(this.type);
    },
    isCheckbox() {
      return this.type === 'checkbox'
    },
    getLabelStyle() {
      if (this.isLabelTop) {
        return {
          width: '100%',
          justifyContent: 'start'
        }
      }
      if (!this.labelWidth) {
        return {};
      }
      return {width: this.labelWidth, 'flex-shrink': 0}
    },
    getFieldWrapClass() {
      return {'has-error': this.hasError, 'w-full': this.labelWidth, 'border-l': this.isBordered}
    },
    getParentWrapClass() {
      if (this.hasError) {
        return ['items-start']
      } else {
        return ['items-center']
      }
    },
    getErrorMessageCSS() {
      if (this.hasError) {
        this.$nextTick(() => {
          this.animated = true;
        });
        return (this.animated) ? ['opacity-100'] : ['opacity-0']
      } else {
        this.$nextTick(() => {
          this.animated = false;
        })
        return ['hidden']
      }
    },
    isValue() {
      return this.type === 'value';
    },
    isDatePicker() {
      return this.type === 'datepicker';
    },
    getWrapClass() {
      if (this.isBordered) {
        return ['border-l', 'border-r', 'border-b', 'first:border-t'];
      }
      if (this.isLabelTop) {
        return ['flex-col']
      }
      return ['mb-1']
    },
    getLabelClass() {
      const classes = ['text-center', 'block', 'text-main-400', 'text-sm', 'px-2', 'py-1', 'form-field-label'];
      if (this.isLabelTop) {
        classes[0] = 'text-left';
        return classes;
      }
      return classes;
    },
    /**
     *
     * @return boolean
     */
    isLabelTop() {
      return this.$parent && this.$parent.isLabelTop();
    },
    isDateRangePicker() {
      return this.type === 'daterange'
    },
    isShowLabel() {
      if (this.isMobile) {
        return false;
      }
      if (this.isNoLabel) {
        return false;
      }
      return typeof this.label !== 'undefined';
    },
    getInputComponent() {
      switch (this.type) {
        case 'input':
          return 'ev-input';
        case 'textarea':
          return 'ev-textarea';
        case 'checkbox':
          return 'ev-check-box';
        case 'radio-group':
          return 'ev-radio-group';
        case 'select':
          return 'ev-tag-select';
        case 'switch':
          return 'ev-switch';
      }

      const snakeToCamel = this.snakeToCamel(this.type);
      let comps = Vue.options.components[snakeToCamel];
      // 전역 컴포넌트인가?
      if (comps) {
        return this.type;
      }
      // 지역 컴포넌트인가?
      comps = this.searchComponent(this, snakeToCamel);

      if (comps) {
        return this.type;
      }

      return 'ev-input';
    }
  },
  methods: {
    snakeToCamel(str) {
      str = str.replace(/([-_]\w)/g, g => g[1].toUpperCase());

      if (typeof str !== 'string') return ''

      return str.charAt(0).toUpperCase() + str.slice(1)
    },
    /**
     * 지역적으로 추가된 컴포넌트를 찾아 폼 필드에서도 사용할 수 있게 합니다.
     *
     * @param {Vue} component
     * @param {string} name
     * @returns {boolean|*}
     */
    searchComponent(component, name) {
      const localComp = component.$options.components[name];
      if (localComp) {
        this.$options.components[name] = localComp;
        return name;
      } else {
        if (component.$parent) {
          return this.searchComponent(component.$parent, name);
        } else {
          return false;
        }
      }
    },

    clearErrorMessage() {
      this.$parent.clearError(this.field);
    },
    handleInput(v) {
      if (typeof this.field === 'undefined') {
        return;
      }
      if (typeof this.value !== 'undefined') {
        this.$emit('input', v);
      }

      this.$parent.setFieldValue(this.field, v);
    },
    setLabelWidth(width) {
      this.labelWidth = (width + 5) + 'px';
    },
    handleChange(v) {
      this.$parent.setFieldValue(this.field, v);
      this.clearErrorMessage();
    },
    handleEnterKey() {

      if (this.$parent.submitHandler && typeof this.$parent.submitHandler === 'function') {
        this.$parent.submitHandler();
      }
    }
  },
  mounted() {
    this.$parent.alignLabels();
  }
}
</script>
