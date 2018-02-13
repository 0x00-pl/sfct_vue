<template>
<div id="app">
  <div class="navbar navbar-default">
    <div class="container">
      <div class="navbar-header">
        <div class="navbar-brand">
         SFCT
        </div>
      </div>
      <div class="navbar-collapse collapse">
        <ul class="nav navbar-nav">
          <li :class="{active:location=='book'}"><a>Book</a></li>
          <li :class="{active:location=='chapter'}"><a>Chapter</a></li>
          <li class="dropdown" :class="{open:header_dropdown_open}">
                <a class="dropdown-toggle" @click="header_dropdown_open=!header_dropdown_open">
                  {{user.username}} <span class="caret"></span>
                </a>
                <ul class="dropdown-menu">
                  <li><a>Settings</a></li>
                  <li role="separator" class="divider"></li>
                  <li class="dropdown-header">account</li>
                  <li><a @click="logout()">Logout</a></li>
                  <li role="separator" class="divider"></li>
                  <li class="dropdown-header">debug</li>
                  <li><a @click="cache_block_transed()">cache-block-transed</a></li>
                  <!--<li><a @click="add_user()">add_user</a></li>
                  <li><a @click="add_book()">add_book</a></li>
                  <li><a @click="add_chapter()">add_chapter</a></li>
                  <li><a @click="add_block()">add_block</a></li>
                  <li><a @click="get_chapter_block_trans()">get_chapter_block_trans</a></li> -->
                </ul>
              </li>
        </ul>
      </div>
    </div>
  </div>
  <div class="container">
    <component :is="location"></component>
  </div>
  <div class="footer"></div>
</div>
</template>

<script>
import config from '../config.js'
import api from './api'
import book_index from './index.vue'
import book from './book.vue'
import login_cb from './login_cb.vue'
import chapter from './chapter.vue'

export default {
    name: 'app',
    data () {
        return {
          header_dropdown_open: false,
          location: '',
          user: {
            login_name: 'my-username'
          }
        }
    },
    methods: {
        route(s){
          if(s=='' || s=='#'){
            s = '#book'
          }
          console.log('route to: ', s, s.substr(1))
          return s.substr(1)
        },
        login(){
          let cb = encodeURIComponent(new URL('#login_cb', window.location).href)
          let next = new URL('/oauth0', config.api_server)
          next.searchParams.append('cb', cb)
          window.location.assign(next.href)
        },
        logout(){
            window.localStorage.removeItem('token')
            window.location.reload()
        },
        get_token(){
            let token = localStorage.getItem('token')
            if(!token){
                this.login() // reload page
            } else {
                return token
            }
        },
        // auth(){
        //   api(this.get_token(), '/api/sfct/auth', [])
        //   .then(t=>console.log('success'))
        //   .catch(err=>console.log('fail'))
        // },
        // add_user(){
        //   api(this.get_token(), '/api/sfct/add_user', {name: 'admin'})
        //   .then(console.log)
        //   .catch(console.log)
        // },
        // add_book(){
        //   api(this.get_token(), '/api/sfct/add_book', {name: 'sfct'})
        //   .then(console.log)
        //   .catch(console.log)
        // },
        // add_chapter(){
        //   api(this.get_token(), '/api/sfct/add_chapter', {book_id: '5a572a2d693fa45ad081c856', name: 'chapter 1'})
        //   .then(console.log)
        //   .catch(console.log)
        // },
        // add_block(){
        //   api(this.get_token(), '/api/sfct/add_block', {chapter_id: '5a57301dd71e2b62ecb6f42a', origin: 'some english text'})
        //   .then(console.log)
        //   .catch(console.log)
        // },
        // get_chapter_block_trans(){
        //   api(this.get_token(), '/api/sfct/get_chapter_block_trans', {chapter_id: '5a57301dd71e2b62ecb6f42a'})
        //   .then(console.log)
        //   .catch(console.log)
        // }
        cache_block_transed(){
          api(this.get_token(), '/api/sfct/cache-block-transed', {})
          .then(console.log)
          .catch(console.log)
        }
    },
    created(){
        window.onhashchange = () => {
            this.location = this.route(window.location.hash)
        }
        window.onhashchange()
        if(window.location.hash == '#login_cb'){
          // skip token check on login_cb
          return
        }
        if(window.location.hash == ''){
          window.location.assign('#index')
        }
        this.$root.token = this.get_token()
        console.log('get_token: ', this.$root.token, typeof this.$root.token)
        api(this.$root.token, '/api/sfct/auth', [])
        .then(JSON.parse)
        .then(j=>{
          this.user = j
          this.$root.user = this.user
        }).catch(err=>{
          console.log(err)
          alert('your have no authorization !!!')
        })
    },
    components: {
        book,
        login_cb,
        chapter,
        'index': book_index
    }
}
</script>

<style lang="scss" scoped>
</style>
