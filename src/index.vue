<template>
<div>
  <div class="container">
      <div v-for="i in book_list" :key="i._id"
      class="text-center">
        <h2><a :href="book_href(i)">{{i.name}}</a></h2>
      </div>
  </div>
</div>
</template>

<script>
import api from './api'

export default {
  data(){
    return {
      book_list: [{name: 'loading'}]
    }
  },
  methods: {
    load_book_list(){
      api(this.$root.token, '/api/sfct/get_book_list', {})
      .then(t=>JSON.parse(t))
      .then(j=>{
        this.book_list = j
      })
      .catch(console.log)
    },
    book_href(book){
      return `?book_id=${book._id}#book`
    }
  },
  created(){
    this.load_book_list()
  }
}
</script>

<style>
</style>
