<template>
  <div class="">
    <b-field label="Selector">
      <b-taginput
          v-model="selector"
          :data="filteredSelectors"
          autocomplete
          allow-new
          placeholder="Add a selector"
          >
      </b-taginput>
    </b-field>
    <b-field label="Css Property">
      <b-autocomplete
          ref="property"
          v-model="keyword"
          :data="filteredDataArray"
          open-on-focus
          placeholder="e.g. jQuery"
          clearable
          @select="option => selected = option">
        <template slot="empty">Not found</template>
      </b-autocomplete>
    </b-field>
    <b-input v-model="value"></b-input>
    <b-button @click="submit">submit</b-button>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: "StylePropertyInput",
  data(){
    return {
      keyword : '',
      value : '',
      rules : {},
      selector: []
    }
  },
  computed: {
    ...mapGetters([
        'getSelectedContent'
    ]),
    filteredSelectors() {
      return this.selector.filter(rule=>{
        const exp = new RegExp(this.keyword);
        return exp.test(rule)
      });
    },
    filteredDataArray() {
      return Object.keys(this.rules).filter(rule=>{
        const exp = new RegExp(this.keyword);
        return exp.test(rule)
      });
    }
  },
  methods: {
    submit() {
      const property = {};
      property[this.keyword] = this.value;
      const selector = this.selector.join(" ");
      this.$emit('submit', {selector, property});
      this.keyword = '';
      this.value = '';
    }
  },
  created() {
    this.rules = document.createElement('div').style;
    this.selector.push('#'+this.getSelectedContent.uid);
  }
}
</script>

<style scoped>

</style>