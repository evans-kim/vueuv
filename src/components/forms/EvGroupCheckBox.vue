<template>
  <div class="flex">
    <label v-for="(option,index) in options" :key="index" class="flex py-1 first:ml-0 ml-2">
      <div class="bg-white border w-6 h-6 p-1 flex justify-center items-center mr-2">
        <input ref="input" :checked="isChecked(option)" :value="option" class="hidden" type="checkbox"
               @input="checkHandler">
        <svg v-show="isChecked(option)" class="w-4 h-4 text-gray-800 pointer-events-none" viewBox="0 0 172 172">
          <g fill="none" font-family="none" font-size="none" font-weight="none" stroke-miterlimit="10"
             stroke-width="none" style="mix-blend-mode:normal" text-anchor="none">
            <path d="M0 172V0h172v172z"/>
            <path d="M145.433 37.933L64.5 118.8658 33.7337 88.0996l-10.134 10.1341L64.5 139.1341l91.067-91.067z"
                  fill="currentColor" stroke-width="1"/>
          </g>
        </svg>
      </div>
      <span class="select-none mr-2 ">
                <slot name="default">{{ option }}</slot>
            </span>
    </label>
  </div>
</template>

<script>
export default {
  name: "EvGroupCheckBox",
  props: {
    value: {
      required: true
    },
    options: {
      default() {
        return [];
      }
    }
  },
  computed: {
    serialized() {
      return typeof this.value === 'string';
    },
    selections() {
      if (!this.value) {
        return [];
      }

      if (Array.isArray(this.value)) {
        return this.value;
      }

      return this.value.split(',');
    }
  },
  data() {
    return {
      mutates: {}
    }
  },
  methods: {
    checkHandler(e) {
      let selections = [];
      const checkValue = e.target.value;

      if (!this.selections.includes(checkValue)) {
        this.selections.push(e.target.value);
        selections = this.selections;
      } else {
        selections = this.selections.filter((value, index) => {
          return checkValue !== value;
        });
      }
      if (this.serialized) {
        this.$emit('input', selections.join(','));
      } else {
        this.$emit('input', selections);
      }
    },
    isChecked(option) {
      return this.selections.includes(option);
    }
  }
}
</script>

<style scoped>
.custom-label input:checked + svg {
  display: block !important;
}
</style>
