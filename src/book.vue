<template>
<div>
  <div>{{meta_info.book_name}}</div>
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
  data(){
    return {
      book_id: '0',
      meta_info: {book_name:'sf'},
      chapter_list: [{'id':0, name:'no name', href:'?book_id=sfct&chapter_id=0#chapter'}]
    }
  },
  methods: {
    load_book(){
      api('/book', this.book_id)
      .then(t=>JSON.parse(t))
      .then(j=>{
        this.meta_info = j.meta_info
        this.chapter_list = j.chapter_list.map(i=>{
          i.href=`?chapter_id=${i.id}#chapter`
          return i
        })
      })
      .catch(console.log)
    }
  },
  created(){
    // TODO: this.load_book()
  }
}
</script>

<style>
</style>
