<template>
<div class="underlayer" :class="{active:value}" @click="close()">
  <div class="content">
    <div class="container">
      <div class="panel panel-info" @click.stop="true">
        <div class="panel-heading">
          <h3 class="panel-title">
            <slot name="title">message</slot>
          </h3>
        </div>
        <div class="panel-body">
          <slot>popup messages</slot>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
export default {
  props: ["value"],
  data(){
    return {
    }
  },
  methods: {
    close(){
      this.$emit('input', false)
    }
  }
}
</script>

<style lang="scss" scoped>

.underlayer {
  position: absolute;
  background-color: rgba(#000, 0.3);
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 9999;

  &:not(.active) {
    display: none;
  }
  .content {
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
  }
}

</style>
