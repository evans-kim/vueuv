<template>
  <div class="relative">
    <ul ref="dropButton" class="bg-white border border-main-200 flex flex-row flex-wrap h-full w-full select-none cursor-pointer"
        style="min-height: 40px;">
      <li v-if="!hasValue"
          class="select-none cursor-pointer text-gray-500 m-1 ml-2 h-full py-1 px-2 text-sm">
        {{ placeholder }}
      </li>
      <li v-for="(item,idx) in getValue" :key="idx" v-else
          class="text-sm shadow select-none hover:bg-gray-200 active:bg-gray-300 text-gray-800 border-gray-400 m-1 rounded ml-1 first:ml-2 border bg-gray-100 px-2"
          @click="unselectItem(item)">
        <slot :item="item" :name="resultSlotName">{{ getTag(item) }}</slot>
      </li>
    </ul>
    <div ref="dropMenu"
         :style="dropMenuStyle"
         class="bg-white border-t rounded shadow-md absolute top-0 right-0 min-w-full overflow-auto z-30 hidden"
    >
      <ul class="list-reset m-1">

          <li v-for="(item,idx) in options" :key="idx"
              class="border-t border-gray-200 hover:bg-gray-100 first:border-t-0 flex flex-row flex-wrap active:bg-gray-200 "
              @click="toggleItem(item)"
          >
                    <span
                        :class=" isSelected(item) ? selectedItemCSS : [] "
                        class="select-none cursor-pointer text-gray-800 m-1 ml-2 h-full py-1 px-1"
                    >
                        <slot :item="item" name="option">{{ getTag(item) }}</slot>
                    </span>
          </li>

      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "EvTagSelect",
  props: {
    placeholder: {
      type: String,
      default() {
        return '선택해 주세요.'
      }
    },
    valueKey: {
      default: 'value'
    },
    labelKey: {
      default: 'label'
    },
    options: {
      type: Array,
      default() {
        return []
      }
    },
    single: {
      type: Boolean,
      default: false
    },
    value: {
      default() {
        return []
      }
    },
    max: null
  },
  data() {
    return {
      dropMenuStyle: {}
    }
  },
  computed: {
    itemCSS() {
      return [];
    },
    selectedItemCSS() {
      return ['rounded', 'bg-gray-200', 'text-bold']
    },
    getValue() {
      if (this.single) {
        return this.options.filter(item => {
          if (typeof item === 'object') {
            return item[this.valueKey] === this.value;
          } else {
            return item === this.value;
          }
        })
      }

      if (!Array.isArray(this.value)) {
        return [];
      }

      return this.value;
    },
    hasValue() {

      return this.getValue.length !== 0;
    },
    resultSlotName() {

      if (this.$scopedSlots.option && !this.$scopedSlots.result) {
        return 'option';
      }
      return 'result';
    }
  },
  methods: {
    getDropMenuStyle() {
      const dropButton = this.$refs['dropButton'];
      if (dropButton) {
        setTimeout(() => {
          this.dropMenuStyle = {'margin-top': dropButton.clientHeight + "px"};
        }, 10);
      }
    },
    itemFormat(item) {
      const out = {};
      out[this.valueKey] = item[this.valueKey];
      out[this.labelKey] = item[this.labelKey];

      return out;
    },
    isSelected(item) {

      return this.getValue.filter((i) => {

        if (typeof i === 'object') {
          return i[this.valueKey] && item[this.valueKey] && i[this.valueKey] === item[this.valueKey];
        }
        return i === item;
      }).length > 0;
    },
    selectItem(item) {
      if (this.max && this.max === this.getValue.length) {
        this.$vueuvModal.show({
          color:'yellow',
          noButton:null,
          body:'최대 ' + this.max + '개만 선택 가능 합니다.'
        })
        return;
      }
      if (this.max && this.max === this.getValue.length + 1) {
        this.hiddenDropDownMenu();
      }
      if (this.single) {
        this.hiddenDropDownMenu();
        this.$emit('input', (item[this.valueKey]) ? item[this.valueKey] : item);
        return;
      }
      this.getDropMenuStyle();
      this.$emit('input', this.getValue.concat([item]));
    },
    toggleItem(item) {
      if (this.isSelected(item)) {
        this.unselectItem(item);

      } else {
        this.selectItem(item);
      }
    },
    unselectItem(item) {
      const items = this.getValue.filter((i) => {
        return i !== item;
      });
      this.getDropMenuStyle();
      if (this.single && items.length === 0) {
        this.$emit('input', '');
        return;
      }
      this.$emit('input', items);
    },
    checkParent(t, elm) {
      while (t.parentNode) {
        if (t === elm) {
          return true;
        }
        t = t.parentNode;
      }
      return false;
    },
    hiddenDropDownMenu() {
      if (!this.$refs['dropMenu'].classList.contains('hidden')) {
        this.$refs['dropMenu'].classList.add('hidden')
      }
    },
    showDropDownMenu() {

      if (this.$refs['dropMenu'].classList.contains('hidden')) {
        this.$refs['dropMenu'].classList.remove('hidden');
        this.getDropMenuStyle();

      }
    },
    documentClickEventHandler(e) {
      const target = (e && e.target);
      const dropButton = this.$refs['dropButton'];
      const dropMenu = this.$refs['dropMenu'];
      //User Menu
      if (!this.checkParent(target, dropMenu)) {
        // click NOT on the menu
        if (this.checkParent(target, dropButton)) {
          // click on the link
          if (dropMenu.classList.contains("hidden")) {
            dropMenu.classList.remove("hidden");
          } else {
            dropMenu.classList.add("hidden");
          }
        } else {
          // click both outside link and outside menu, hide menu
          dropMenu.classList.add("hidden");
        }
      }

    },
    getTag(item) {
      if (item[this.labelKey])
        return item[this.labelKey];
      else
        return item;
    }
  },
  mounted() {
    this.getDropMenuStyle();
    document.addEventListener('click', this.documentClickEventHandler);
  },
  destroyed() {
    document.removeEventListener('click', this.documentClickEventHandler);
  }
}
</script>

<style scoped>

</style>
