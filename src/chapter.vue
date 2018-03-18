<template>
  <div>
    <div class="alert alert-info"><strong>{{chapter.book.name}} / {{chapter.name}}</strong></div>
    <div class="alert alert-info">
      <p><strong>翻译须知:</strong></p>
      <p>由于生成器对中文支持不好, 所有 _text_ 需要翻译为 _'文本'_ , 注意两边的空格.</p>
      <p>所有 [text] 不支持内容为中文, 应该翻译成 "文本" 或 "文本"([text]) 或 不翻译 .</p>
    </div>
    <div class="item-box">
      <div v-for="(block, idx) in chapter.block_list" :key="block._id" class="item">
        <div class="row">
          <div class="origin col-md-6">
            <div class="panel panel-default auto-hide-anchor"
            :class="{'panel-success':block.trans_list.filter(x=>x.vote>0).length>0}">
              <div class="panel-heading position-anchor">
                <h3 class="panel-title">#{{idx}}</h3>
                <div v-if="user_can_edit()" class="btn btn-warning position-right auto-hide" @click="add_trans(idx)">add trans</div>
              </div>
              <div class="panel-body">
                <code class="code-box pull-right">{{block.origin}}</code>
              </div>
            </div>
          </div>
          <div class="trans-box col-md-6">
            <div v-for="trans in block.trans_list" :key="trans._id" class="trans">
              <div class="panel panel-default"
              :class="{'panel-success':trans.vote>0, 'panel-warning':trans.vote==0, 'panel-danger':trans.vote<0}">
                <div class="panel-heading" @click.stop="trigger_trans(trans)">
                  <h3 class="panel-title">
                    {{trans.user && trans.user.name || "null"}}
                    <span class="auto-hide-anchor pull-right" @click.stop="0">
                      <span v-if="user_can_vote()" class="badge auto-hide-transparent" @click.stop="vote_trans(trans, -1)">-1</span>
                      <span class="badge"><span>vote:</span> <span>{{trans.vote}}</span></span>
                      <span v-if="user_can_vote()" class="badge auto-hide-transparent" @click.stop="vote_trans(trans, 1)">+1</span>
                    </span>
                  </h3>
                </div>
                <div class="panel-body" :class="{hide: trans._hide}">
                  <code class="code-box pull-left">{{trans.text}}</code>
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
          <!--code class="code-box pull-right">{{chapter.block_list[current_block].origin}}</code-->
          <textarea class="code-area pull-right" cols="80" rows="10" disabled v-model="chapter.block_list[current_block].origin"></textarea>
        </div>
        <div class="col-md-6">
          <!--code class="code-box pull-left" contenteditable="true" spellcheck="false" @blur="current_trans_blur">
          {{current_trans}}
          </code-->
          <textarea class="code-area" cols="80" rows="10" v-model="current_trans"></textarea>
        </div>
      </div>
      <hr>
      <div class="pull-right">
        <div class="btn btn-default" @click="add_trans_active=false">Cancle</div>
        <div class="btn btn-primary" @click="save_trans(chapter.block_list[current_block]._id)">Commit</div>
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
      chapter: {
        "_id": "5a57301dd71e2b62ecb6f42a",
        "book_id": "5a572a2d693fa45ad081c856",
        "book": {"name": "sfct", chapter_list: []},
        "name": "chapter 1",
        "block_list": [
          {
            "_id": "5a584b9df6a6b74ef2942b67",
            "chapter_id": "5a57301dd71e2b62ecb6f42a",
            "origin": "some english text",
            "status": "unverified",
            "trans_list": [
              {
                "_id": "5a584f6775e88555fb84da52",
                "block_id": "5a584b9df6a6b74ef2942b67",
                "user_id": "5a5822631499b111f6c3f2cc",
                "text": "origin text2",
                "vote": 0,
                "origin": "some english text",
                "user": {
                  "_id": "5a5822631499b111f6c3f2cc",
                  "name": "admin"
                }
              }
            ]
          }
        ]
      },
      current_block: 0,
      add_trans_active: false,
      current_trans: ''
    }
  },
  methods: {
    // TODO: remove old code
    // current_trans_blur(ev){
    //   this.current_trans = ev.target.textContent
    // },
    user_can_edit(){
      return this.$root.user.editor
    },
    user_can_vote(){
      return this.$root.user.voter
    },
    load_chapter(book_id, chapter_id){
      api(this.$root.token, '/api/sfct/get_chapter_block_trans', {chapter_id})
      .then(t=>JSON.parse(t))
      .then(j=>{
        j.block_list = j.block_list.filter(block=>block.origin.startsWith('(*'))
        j.block_list = j.block_list.map(block=>this.trans_list_update(block))
        this.chapter = j
      })
      .catch(console.log)
    },
    trans_list_update(block){
      block.trans_list.sort((a,b)=>b.vote-a.vote)
      block.trans_list.forEach((v,i)=>{ v._hide = i!=0 })
      return block
    },
    trigger_trans(trans){
      trans._hide = trans._hide ? false : true
      console.log(trans._hide)
    },
    add_trans(idx){
      this.current_block = idx
      this.current_trans = this.chapter.block_list[this.current_block].origin
      this.add_trans_active = true
    },
    save_trans(block_id){
      this.add_trans_active=false
      let block = this.chapter.block_list[this.current_block]
      let origin = block.origin
      let text = this.current_trans.trim()
      if(text.startsWith('(*') && text.endsWith('*)')){
        api(this.$root.token, '/api/sfct/add_trans', {origin, text})
        .then(JSON.parse)
        .then(j=>{
          j.user = {name: this.$root.user.username}
          block.trans_list.push(j)
          return this.trans_list_update(block)
          // {
          // "origin": "(** * Basic Extraction *)",
          // "text": "(** * 基础导出 *)",
          // "user_id": "5a5881d3023da428f323f6af",
          // "vote": 0,
          // "_id": "5a94ca9af50da062312153f7"
          // }
        })
        .catch(console.log)
      }
    },
    vote_trans(trans, value){
      let trans_id = trans._id
      trans.vote += value
      api(this.$root.token, '/api/sfct/vote_trans', {trans_id, value})
      .then(console.log)
      .catch(console.log)
    }
  },
  created(){
    let args = new URL(window.location)
    let book_id = args.searchParams.get("book_id")
    let chapter_id = args.searchParams.get("chapter_id")

    this.load_chapter(book_id, chapter_id)
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

.auto-hide-anchor:not(:hover) {
  .auto-hide {
    display: none;
  }
  .auto-hide-transparent {
    opacity: 0;
  }
}

.code-box {
  display: inline-block;
  white-space: pre;
  border: 0.25rem solid lightgray;
  width: 100%;
  &[contenteditable] {
    border: 0.25rem solid lightpink;
  }
  overflow: hidden;

  &:hover {
    overflow: visible;
    width: 65rem;
  }
}

.code-area {
  color: FireBrick;
  background-color: whitesmoke;
  border: 0.25rem solid PeachPuff;
  border-radius: 0.25rem;
  padding: 0.25rem;
  resize: vertical;
}

</style>
