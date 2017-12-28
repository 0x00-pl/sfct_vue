<template>
<div>
  <div>index</div>
  <div class="content">
    <div v-for="i in chapter_list" :key="i.id"
    class="chapter_item">
      <a :href="i.href">{{i.name}}</a>
    </div>
  </div>
</div>
</template>

<script>
import api from './api'

export default {
  data() {
    return {
      chapter_list: [{'id':0, name:'no name', href:'?chapter_id=${i.id}#chapter'}]
    }
  },
  methods: {
    load_chapters(){
      api('/chapter_list', 'sfct')
      .then(t=>JSON.parse(t))
      .then(j=>{
        this.chapter_list = j.map(i=>{
          i.href=`?chapter_id=${i.id}#chapter`
          return i
        })
      })
      .catch(console.log)
    }
  },
  created(){
    this.load_chapters()
  }
}
</script>

<style>
</style>
