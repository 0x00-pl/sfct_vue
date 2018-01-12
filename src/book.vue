<template>
<div>
  <div class="alert alert-info"><strong>book name: </strong>{{book.name}}</div>
  <div class="container">
      <div v-for="i in book.chapter_list" :key="i._id"
      class="chapter_item text-center">
        <h3><a :href="chapter_href(i)">{{i.name}}</a></h3>
      </div>
  </div>
</div>
</template>

<script>
import api from './api'

export default {
  data(){
    return {
      book: {}
    }
  },
  methods: {
    load_book(){
      api(this.$root.token, '/api/sfct/get_book_chapter', {book_name: 'sfct'})
      .then(t=>JSON.parse(t))
      .then(j=>{
        this.book = j
      })
      .catch(console.log)
    },
    chapter_href(chapter){
      return `?book_id=${this.book._id}&chapter_id=${chapter._id}#chapter`
    }
  },
  created(){
    this.load_book()
  }
}
</script>

<style>
</style>
