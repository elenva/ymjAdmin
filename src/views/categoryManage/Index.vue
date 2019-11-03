<template>
  <Page>
    <div slot="handleArea" v-if="info">
      <TbaleArea 
        v-for="item in info"
        @refresh="getAllCategory()" 
        :key="item.id"
        :info="item"/>
    </div>
  </Page>
</template>

<script>
import {$getAllCategory} from '@/api/index';
import TbaleArea from './tableArea';
export default {
  components:{ TbaleArea },
  data(){
    return {
      info:null
    }
  },
  mounted(){
    this.getAllCategory();
  },
  methods:{
    getAllCategory(){
      $getAllCategory().then(res=> {
        this.info = res.datas;
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>