<template>
  <div>chapter</div>
</template>

<script>
export default {
  data(){return{}},
  created(){
    let args = new URL(window.location)
    let chapter_id = args.searchParams.get("chapter_id")
  }
}
</script>

<style>
</style>
