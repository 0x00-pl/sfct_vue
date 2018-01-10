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
                  {{login_name}} <span class="caret"></span>
                </a>
                <ul class="dropdown-menu">
                  <li><a>Settings</a></li>
                  <li role="separator" class="divider"></li>
                  <li class="dropdown-header">account</li>
                  <li><a>Logout</a></li>
                  <li role="separator" class="divider"></li>
                  <li class="dropdown-header">debug</li>
                  <li><a @click="auth()">auth</a></li>
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
import book from './book.vue'
import login_cb from './login_cb.vue'
import chapter from './chapter.vue'

export default {
    name: 'app',
    data () {
        return {
          header_dropdown_open: false,
          location: '',
          login_name: 'my-username',
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
            let token = this.$root.token || localStorage.getItem('token')
            if(!token){
                this.login() // reload page
            } else {
                return token
            }
        },
        auth(){
          api(this.get_token(), '/api/sfct/auth', [])
          .then(t=>console.log('success'))
          .catch(err=>console.log('fail'))
        }
    },
    created(){
        window.onhashchange = () => {
            this.location = this.route(window.location.hash)
        }
        window.onhashchange()
        if(window.location.hash == ''){
          window.location.assign('#book')
        } else if(window.location.hash == '#login_cb'){
        } else {
            this.$root.token = this.get_token()
            console.log('get_token: ', this.$root.token)
            api(this.$root.token, '/api/sfct/auth', [])
            .then(JSON.parse)
            .then(console.log)
        }
    },
    components: {
        book,
        login_cb,
        chapter
    }
}
</script>

<style lang="scss" scoped>
</style>
