<template>
  <div>
    <div class="alert alert-info"><strong>book_name and chapter_name: </strong>{{book_id}}/{{chapter_id}}</div>
    <div class="item-box">
      <div v-for="(item, idx) in item_list" :key="item.id" class="item">
        <div class="row">
          <div class="origin col-md-6">
            <div class="panel panel-default auto-hide-anchor"
            :class="{'panel-default':item.status=='pass', 'panel-danger':item.status=='unverified', 'panel-success':item.status=='verified'}">
              <div class="panel-heading position-anchor">
                <h3 class="panel-title">#123</h3>
                <div class="btn btn-warning position-right auto-hide" @click="add_trans(idx)">add trans</div>
              </div>
              <div class="panel-body">
                <code>{{item.origin}}</code>
              </div>
            </div>
          </div>
          <div class="trans-box col-md-6">
            <div v-for="trans in item.trans_list" :key="trans.id" class="trans">
              <div class="panel panel-default"
              :class="{'panel-success':trans.vote>0, 'panel-warning':trans.vote==0, 'panel-danger':trans.vote<0}">
                <div class="panel-heading" @click="trans._hide=!trans._hide">
                  <h3 class="panel-title">
                    {{trans.user}}
                    <span class="auto-hide-anchor pull-right" @click.stop="0">
                      <span class="badge auto-hide-transparent" @click.stop="111">-1</span>
                      <span class="badge"><span>vote:</span> <span>{{trans.vote}}</span></span>
                      <span class="badge auto-hide-transparent" @click.stop="111">+1</span>
                    </span>
                  </h3>
                </div>
                <div class="panel-body" :class="{hide:trans._hide}">
                  <code>{{trans.content}}</code>
                </div>
              </div>
            </div>
          </div>
        </div>
        <hr>
      </div>
    </div>
    <popup v-model="add_trans_active">
      <div slot="title">Add translate</div>
      <div class="row">
        <div class="col-md-6">
          <code>{{item_list[current_item].origin}}</code>
        </div>
        <div class="col-md-6">
          <code contenteditable="true">{{current_trans}}</code>
        </div>
      </div>
      <hr>
      <div class="pull-right">
        <div class="btn btn-default" @click="add_trans_active=false">Cancle</div>
        <div class="btn btn-primary">Commit</div>
      </div>
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
        'id':'1', origin:'origin text', status:'verified',
        trans_list:[
          {'id':'trans_id1', user:'username', content:'trans_content', vote:42, _hide:false},
          {'id':'trans_id2', user:'username', content:'trans_content', vote:0, _hide:true}
          ]
      },{
        'id':'2', origin:'origin text2', status:'unverified',
        trans_list:[
          {'id':'trans_id3', user:'username', content:'trans_content', vote:0, _hide:false},
          {'id':'trans_id4', user:'username', content:'trans_content', vote:-1, _hide:true}
          ]
      }],
      current_item: 0,
      add_trans_active: false,
      current_trans: ''
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
      this.current_trans = this.item_list[this.current_item].origin
      this.add_trans_active = true
    },
    save_trans(){}
  },
  created(){
    let args = new URL(window.location)
    this.book_id = args.searchParams.get("book_id")
    this.chapter_id = args.searchParams.get("chapter_id")

    // TODO: this.load_chapter()
  },
  components: {
    popup
  }
}
</script>

<style lang="scss" scoped>
.position-anchor {
  position: relative;
  top: 0;
}
.position-right {
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
  .auto-hide-transparent {
    opacity: 0;
  }
}

</style>
