<template>
<div>
  <div class="alert alert-info"><strong>book name: </strong>{{book.name}}</div>
  <div class="container">
      <div v-for="i in book.chapter_list" :key="i._id"
      class="chapter_item text-center">
        <h3><a :href="chapter_href(i)">{{i.name}}</a></h3>
        <div class="row">
          <h4>
            <div class="label label-primary col-md-1"
            :class="{'label-success':transed_progress_percent(i._id)==100}">[ {{chapter_transed[i._id].transed_count}} / {{chapter_transed[i._id].block_count }}]</div>
          </h4>
          <div class="col-md-11">
            <div class="progress">
              <div class="progress-bar"
              :class="{'progress-bar-success': transed_progress_percent(i._id)==100}"
              :style="{width: transed_progress_percent(i._id)+'%'}"></div>
            </div>
          </div>
        </div>
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
      book: {},
      chapter_transed: {
        '$chapter_id': {transed_count:24, block_count:40}
      }
    }
  },
  methods: {
    load_book(book_id){
      api(this.$root.token, '/api/sfct/get_book_chapter', {book_id})
      .then(JSON.parse)
      .then(j=>{
        this.book = j
      }).then(this.load_percent.bind(this))
      .catch(console.log)
    },
    load_percent(){
      let chapter_list = this.book.chapter_list.map(chapter=>chapter._id)
      api(this.$root.token, '/api/sfct/get-chapter-transed', {chapter_list})
      .then(JSON.parse)
      .then(chapter_transed_list=>{
        let chapter_transed_dict = {}
        chapter_transed_list.forEach(chapter_transed=>{
          chapter_transed_dict[chapter_transed.chapter_id] = chapter_transed
        });
        this.chapter_transed = chapter_transed_dict
        this.book = this.book // update page view
      })
    },
    chapter_href(chapter){
      return `?book_id=${this.book._id}&chapter_id=${chapter._id}#chapter`
    },
    transed_progress_percent(chapter_id){
      let chapter_transed = this.chapter_transed[chapter_id]
      if(chapter_transed){
        return 100.0 * chapter_transed.transed_count / chapter_transed.block_count
      } else {
        return 0
      }
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
