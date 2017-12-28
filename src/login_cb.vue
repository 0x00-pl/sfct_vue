<template>
  <div>login_cb</div>
</template>

<script>
export default {
    data(){return{}},
    created(){
      let u = new URL(window.location)
      let token = u.searchParams.get('token')
      localStorage.setItem('token', token)
      console.log('back to #index')
      window.location.assign('#index')
    }
}
</script>

<style>
</style>
