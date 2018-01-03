<template>
  <div>
    <div>book_name and chapter_name: {{book_id}}/{{chapter_id}}</div>
    <div class="item-box">
      <div v-for="(item, idx) in item_list" :key="item.id" class="item row">
        <div class="origin col-md-6">
          <div class="panel panel-default auto-hide-anchor">
            <div class="panel-heading float-anchor">
              <h3 class="panel-title">#123</h3>
              <div class="btn btn-warning float-right auto-hide" @click="add_trans(idx)">add trans</div>
            </div>
            <div class="panel-body">
              <code>{{item.origin}}</code>
            </div>
          </div>
        </div>
        <div class="trans-box col-md-6">
          <div v-for="trans in item.trans_list" :key="trans.id" class="trans">
            <div class="panel panel-default">
              <div class="panel-heading">
                <h3 class="panel-title">
                  {{trans.user}}
                </h3>
              </div>
              <div class="panel-body">
                <code>{{trans.content}}</code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <popup v-model="add_trans_active">
      <div class="origin">{{item_list[current_item].origin}}</div>
      <div class="trans_editor"><input type="text" /></div>
    </popup>
  </div>
</template>

<script>
import api from './api'
import popup from './popup.vue'

export default {
  data(){
    return {
      book_id: '',
      chapter_id: '',
      meta_info: {},
      item_list: [{
        'id':'', origin:'origin text',
        trans_list:[
          {'id':'trans_id', user:'username', content:'trans_content'},
          {'id':'trans_id', user:'username', content:'trans_content'}
          ]
      }],
      current_item: 0,
      add_trans_active: false
    }
  },
  methods: {
    load_chapter(book_id, chapter_id){
      api('/chapter', [book_id, chapter_id])
      .then(t=>JSON.parse(t))
      .then(j=>{
        this.meta_info = j.meta_info
        this.item_list = j.item_list
      })
      .catch(console.log)
    },
    add_trans(current_item){
      this.current_item = current_item
      this.add_trans_active = true
    },
    save_trans(){}
  },
  created(){
    let args = new URL(window.location)
    this.book_id = args.searchParams.get("book_id")
    this.chapter_id = args.searchParams.get("chapter_id")
  },
  components: {
    popup
  }
}
</script>

<style lang="scss" scoped>
.float-anchor {
  position: relative;
  top: 0;
}
.float-right {
  position: absolute;
  top: 0;
  right: 0;
  left: auto;
}
.float-left {
  position: absolute;
  left: 0;
  right: auto;
}

.auto-hide-anchor:not(:hover) {
  .auto-hide {
    display: none;
  }
}
</style>
