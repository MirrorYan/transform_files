<template>
  <el-tooltip effect="dark" placement="top-start">
    <div slot="content" class="msg-tip">{{ text }}</div>
    <a class="msg-tag" :href="url">
      <img src="../assets/radio.svg" alt="Bell icon">
      {{ text }}
    </a>
  </el-tooltip>
</template>

<script>
export default {
  name: 'TagMsg',
  props: {
    url: {
      type: String
    },
    text: {
      type: String
    }
  }
}
</script>

<style lang="scss">
.msg-tag {
  display: inline-block;
  max-width: 100%;
  margin-top: 15px;
  color: #000;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  &:visited {
    color: #000;
  }
  img {
    width: 18px;
    height: 20px;
    vertical-align: middle;
  }
}
</style>