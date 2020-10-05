<template>
  <div v-if="getContent">
    <h2>{{ getContentName }}#{{ getContent.uid }}</h2>
    <div v-for="key in getProps"  :key="key">
      <template v-if="typeof getProp[key] === 'object'">
        <label v-for=" sub in Object.keys(getProp[key]) " :key="key + sub">
          {{sub}} :
          <ev-input :value="getProp[key][sub]" @change="(e)=>{ handler([key,sub], e.target.value) }" :key="sub"/>
        </label>
      </template>
      <template v-else>
        <label>{{key}} :
          <ev-input :value="getProp[key]" @change="(e)=>{ handler(key, e.target.value) }"/>
        </label>
      </template>
    </div>
  </div>
  <div v-else>
    <h2> 먼저 선택해 주세요! </h2>
  </div>
</template>

<script>
import EvInput from "@/components/EvInput";
export default {
  name: "Panel",
  components: {EvInput},
  computed:{
    getContentName(){
      return this.getContent.option.name;
    },
    getProp(){
      return this.getContent.instance[0].$props;
    },
    getProps(){
      return Object.keys( this.getContent.instance[0].$props );
    },
    getContent(){
      return this.$store.getters.getSelectedContent
    }
  },

  methods: {
    handler(key, val) {
      let target = key;
      let value = val;
      if(Array.isArray(key)){
        const obj = this.getProp[key[0]]
        target = key[0]
        obj[key[1]] = val;
        value = obj;
      }

      this.$store.commit('setData', {target, value})

    }
  }
}
</script>