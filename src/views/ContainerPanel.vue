<template>
  <div v-if="content">
    <h2>{{ getContentName }}#{{ content.uid }}</h2>
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
    <h2> 먼저 선택해 주세요. </h2>
  </div>
</template>

<script>
import EvInput from "@/components/EvInput";
export default {
  name: "ContainerPanel",
  components: {EvInput},
  props:{
    content:{
      type:Object
    }
  },
  computed:{

    getContentName(){
      return this.content.name;
    },
    getProp(){
      return this.getContent.$props;
    },
    getProps(){
      return Object.keys( this.getContent.$props );
    },
    getContent(){
      return this.content
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
      console.log('update:'+target, value);
      this.getContent.$emit('update:'+target, value);

    }
  },
  mounted() {
    if(!this.content){
      return;
    }
  }
}
</script>

<style scoped>

</style>