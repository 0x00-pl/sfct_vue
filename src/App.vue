<template>
<div id="app">
  <div class="header">{{login_name}}</div>
  <div class="content">
    <component :is="location"></component>
  </div>
  <div class="footer"></div>

  <!--img src="./assets/logo.png">
  <h1>{{ msg }}</h1>
  <h2>Essential Links</h2>
  <ul>
    <li><a href="https://vuejs.org" target="_blank">Core Docs</a></li>
    <li><a href="https://forum.vuejs.org" target="_blank">Forum</a></li>
    <li><a href="https://chat.vuejs.org" target="_blank">Community Chat</a></li>
    <li><a href="https://twitter.com/vuejs" target="_blank">Twitter</a></li>
  </ul>
  <h2>Ecosystem</h2>
  <ul>
    <li><a href="http://router.vuejs.org/" target="_blank">vue-router</a></li>
    <li><a href="http://vuex.vuejs.org/" target="_blank">vuex</a></li>
    <li><a href="http://vue-loader.vuejs.org/" target="_blank">vue-loader</a></li>
    <li><a href="https://github.com/vuejs/awesome-vue" target="_blank">awesome-vue</a></li>
  </ul-->
</div>
</template>

<script>
  import config from '../config.js'
  import index from './index.vue'
  import login_cb from './login_cb.vue'

export default {
    name: 'app',
    data () {
        return {
            location: '',
            login_name: '',
            //msg: 'Welcome to Your Vue.js App'
        }
    },
    methods: {
        route(s){
            return s.substr(1)
        },
        login(){
            let cb = encodeURIComponent(new URL('#login_cb', window.location).href)
            let next = new URL('/oauth0', window.location.protocol+config.api_server)
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
                this.login()
            } else {
                return token
            }
        }
    },
    created(){
        window.onhashchange = () => {
            this.location = this.route(window.location.hash)
        }
        if(window.location.hash == '#login_cb'){
            return
        } else {
            window.location.hash = '#index'
            console.log(this.get_token())
        }
    },
    components: {
        index,
        login_cb
    }
}
</script>

<style lang="scss">
#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}

h1, h2 {
    font-weight: normal;
}

ul {
    list-style-type: none;
    padding: 0;
}

li {
    display: inline-block;
    margin: 0 10px;
}

a {
    color: #42b983;
}
</style>
