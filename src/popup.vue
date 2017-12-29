<template>
<div class="background" :class="{active:value}">
  <div class="content">
    <slot>popup messages</slot>
    <div class="button_list">
      <button v-for="button in button_list" :key="button">{{button}}</button>
    </div>
  </div>
</div>
</template>

<script>
export default {
  props: ["value", "button_list"],
  data(){
    return {
    }
  },
  methods: {
    close(){
      this.emit('input', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.background {
  display: none;
  &.active {
    display: block;
  }
}
</style>
