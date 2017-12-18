<template>
  <div>login_cb</div>
</template>

<script>
export default {
    data(){return{}},
    methods: {
        set_token(token){
            localStorage.setItem('token', token)
        },
        parse_search(search){
            if(search == ''){ return {} }
            let ret = {}
            if(search[0] =='?'){ search = search.substr(1) }
            search.split('&').map(item=>item.split('='))
                .map(([k,v])=>{
                    if(v === undefined){ v = true }
                    ret[k] = v
                })
            return ret
        }
    },
    created(){
        let search = this.parse_search(window.location.search)
        this.set_token(search.token)
        window.location.hash = '#index'
    }
}
</script>

<style>
</style>
