<template>
  <input
      ref="evInput"
      v-bind="$attrs"
      v-on="getListeners"
      :class="getClasses"
      :style="getStyles"
      :value="value"
      @change="changeHandler"
      @input="inputHandler"
  />
</template>
<script>
export default {
  name: 'EvInput',
  data() {
    return {
      classes: [
        "border",
        "border-main-200",
        "appearance-none",
        "py-1",
        "px-2",
        "leading-tight",
        "focus:outline-none",
        "transition-ease",
        "text-xs",
        "text-xs",
        "w-full"
      ],
      isChanged: false,
      availablePasswordChar: /[0-9a-zA-Z!@#$%^&*\s]*/ig,
      invalid: false,
      mutateValue: null,
      isDiff: false,
      originValue: null
    }
  },
  props: {
    autoMax: {default: null, required: false},
    value: null,
    diffCheck: {type: Boolean, default: false}
  },
  watch: {
    value: {
      handler(val) {
        if (this.originValue === this.getUidForDiff && this.diffCheck && val !== null) {
          // 맨처음 값 입니다.
          this.originValue = val;
        }
        if (
            !(this.originValue === null || this.originValue === '')
            && this.originValue !== this.getUidForDiff
            && this.originValue != val
        ) {
          this.isDiff = true;
          // 원래값과 변경된 값을 보내줍니다.
          this.$emit('diff', [this.originValue, val]);
        } else {
          this.isDiff = false;
          this.$emit('diff', []);
        }
      }
    }
  },
  computed: {
    getListeners() {
      return Object.assign({}, this.$listeners, {input:this.inputHandler,change:this.changeHandler}) ;
    },
    getInputType() {
      return (this.$attrs['type']) ? this.$attrs['type'] : 'text';
    },
    hasErrorField() {
      return this.$parent.hasError;
    },
    getClasses() {
      let mode = 'default';
      if (this.diffCheck && this.isDiff) {
        mode = 'diff';
      }
      if (this.hasErrorField) {
        mode = 'error';
      }

      let typeClasses = [];
      switch (mode) {
        case 'default':
          typeClasses = [
            "text-main-300",
              "bg-gray-100",
            "focus:border-gray-300",
          ];
          break;
        case 'diff' :
          typeClasses = [
            "bg-orange-200",
            "text-orange-700",
            "focus:bg-orange-100",
            "focus:border-orange-300",
          ];
          break;
        case 'error' :
          typeClasses = [
            "bg-red-200",
            "text-red-700",
            "focus:bg-red-100",
            "focus:border-red-300",
          ];
          break;
      }
      if (this.$attrs['type'] === 'password') {
        typeClasses.push('ime-inactive');
      }

      return typeClasses.concat(this.classes);
    },
    isNumberType() {
      return this.$attrs['type'] === 'number';
    },
    isPasswordType() {
      return this.$attrs['type'] === 'password';
    },
    getStyles() {
      let style = {};
      if (this.$attrs['style']) {
        style = this.$attrs['style'];
      }
      if (this.autoMax) {
        style['max-width'] = this.autoMax + 'px';
        if (this.mutateValue) {
          const length = this.getHelperDiv.offsetWidth + 32;
          if ((length) > parseInt(this.autoMax)) {
            style['max-width'] = length + 'px';
          }
        }
      }


      return style;
    },
    getUnique() {
      return this._uid;
    },
    getAutoMaxHelperDivId() {
      return 'div_proxy_' + this.getUnique;
    },
    getHelperDiv() {
      return document.getElementById(this.getAutoMaxHelperDivId);
    },
    getUidForDiff() {
      return 'original#' + this._uid;
    }
  },
  methods: {
    inputHandler(e) {
      const value = e.target.value;

      this.$emit('input', value);

      this.mutateValue = value;
      if (this.autoMax) {
        this.getHelperDiv.innerText = value;
      }

    },
    changeHandler(e) {
      this.$emit('change', e.target.value);
    },
    createProxyDiv() {
      const div = document.createElement('div');
      div.id = this.getAutoMaxHelperDivId;
      div.style.width = 'auto';
      div.style.display = 'inline-block';
      div.style.visibility = 'hidden';
      div.style.position = 'fixed';
      div.style.overflow = 'auto';
      document.body.appendChild(div);
    }
  },
  mounted() {
    if (this.diffCheck) {

      if (this.value) {
        this.originValue = this.value;
      } else {
        this.originValue = this.getUidForDiff;
      }

    }

    if (this.autoMax) {
      this.createProxyDiv();
    }
  }
}
</script>
<style scoped>
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
