<template>
  <div class="user-tag">
    <img src="../assets/user.svg" alt="User icon">
    {{ text }}
  </div>
</template>

<script>
export default {
  name: 'TagUser',
  props: {
    text: String
  }
}
</script>

<style lang="scss">
.user-tag {
  display: inline-block;
  padding: 8px 7px;
  font-weight: bold;
  font-size: .78em;
  background: #fff;
  border-radius: 3px;
  box-shadow: 0px 1px 4px rgba(201, 217, 226, 0.44);
  img {
    display: inline-block;
    width: 16px;
    height: 16px;
    vertical-align: middle;
  }
}
</style>