<template>
  <div class="weekly-date-container">
    <div class="weekly-left" @click="onFlipClk(-1)"></div>
    <div class="weekly-date">
      <span class="weekly"
        v-for="n in (weeks.length / 7)"
        :key="n"
      >{{handleRmYear(weeks[7*n-7])}} ~ {{handleRmYear(weeks[7*n-1])}}</span>
    </div>
    <div class="weekly-right" @click="onFlipClk(+1)"></div>
  </div>
</template>

<script>
export default {
  name: 'WeeklyDate',
  props: {
    weeks: {
      type: Array,
      default: []
    }
  },
  methods: {
    // Click => trigger weeks load.
    onFlipClk (offset=0) {
      this.$emit('flip', offset);
    },
    // Remove year.
    handleRmYear (date) {
      const dateArr = date.split('/');
      return dateArr[0] + '/' + dateArr[1];
    }
  }
}
</script>

<style lang="scss">
.weekly-date-container {
  width: calc(100% - #{$projTable-width});
  padding-right: 30px;
  position: relative;
  .weekly-date {
    display: flex;
    height: 50px;
  }
  .weekly {
    display: inline-block;
    flex: 1;
    line-height: 50px;
    text-align: center;
    font-weight: bold;
  }
  .weekly-left,
  .weekly-right {
    width: 33px;
    height: 31px;
    background: url(../assets/radio-arrow.svg) 100% 100% no-repeat;
    cursor: pointer;
    position: absolute;
    top: 8px;
  }
  .weekly-left {
    left: -15px;
  }
  .weekly-right {
    transform: rotate(180deg);
    right: 15px;
  }
}
</style>