<template>
<div>
  <div class="alert alert-info"><strong>book name: </strong>{{meta_info.book_name}}</div>
  <div class="container">
      <div v-for="i in chapter_list" :key="i.id"
      class="chapter_item text-center">
        <h3><a :href="i._href">{{i.name}}</a></h3>
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
      chapter_list: [
        {'id':0, name:'no name0', _href:`?book_id=${this.book_id}&chapter_id=0#chapter`},
        {'id':1, name:'no name1', _href:`?book_id=${this.book_id}&chapter_id=1#chapter`},
        {'id':2, name:'no name2', _href:`?book_id=${this.book_id}&chapter_id=2#chapter`},
        ]
    }
  },
  methods: {
    load_book(){
      api('/book', this.book_id)
      .then(t=>JSON.parse(t))
      .then(j=>{
        this.meta_info = j.meta_info
        this.chapter_list = j.chapter_list.map(i=>{
          i._href=`?book_id=${this.book_id}&chapter_id=${i.id}#chapter`
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
