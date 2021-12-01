<template>
  <span class="active-tag">
    <el-tooltip v-if="length != 0" effect="dark" placement="top-start">
      <div slot="content">{{text}}<template v-if="comments != null && comments != ''"><br/>{{comments}}</template></div>
      <span class="active-tag-inner"></span>
    </el-tooltip>
    <span v-else class="active-tag-inner">{{text}}</span>
  </span>
</template>

<script>
export default {
  name: 'tagActive',
  props: {
    text: String,
    comments: {
      type: String,
      default: ''
    },
    length: {
      type: Number,
      default: 0
    }
  }
}
</script>

<style lang="scss">
.active-tag {
  display: inline-block;
  color: #000 !important;
  &.red .active-tag-inner {
    background-color: $red-trans;
    border-color: $red;
  }
  &.orange .active-tag-inner {
    background-color: $orange-trans;
    border-color: $orange;
  }
  &.green .active-tag-inner {
    background-color: $green-trans;
    border-color: $green;
  }
  &.blue .active-tag-inner {
    background-color: $blue-trans;
    border-color: $blue;
  }
  &.purple .active-tag-inner {
    background-color: $purple-trans;
    border-color: $purple;
  }
  &.brown .active-tag-inner {
    background-color: $brown-trans;
    border-color: $brown;
  }
  &.gray .active-tag-inner {
    background-color: $gray-trans;
    border-color: $gray;
  }
}
.active-tag-inner {
  display: inline-block;
  height: 20px;
  line-height: 20px;
  padding-left: 5px;
  font-weight: 400;
  font-size: .8em;
  border: 1px solid $gray;
  border-left-width: 3px;
}
</style>