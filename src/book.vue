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
      book_id: '',
      book: {}
    }
  },
  methods: {
    load_book(book_id){
      api(this.$root.token, '/api/sfct/get_book_chapter', {book_id})
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
    let args = new URL(window.location)
    let book_id = args.searchParams.get("book_id")

    this.load_book(book_id)
  }
}
</script>

<style>
</style>
