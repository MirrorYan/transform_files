<template>
  <div class="header" :style="{'top':top+'px'}">
    <div class="header-inner">
      <div class="left-side">
        <h1 class="page-title">Tracking Sheet for China BioTD Development Projects (QA)</h1>
        <TagMsg :url="msgUrl" :text="msgTxt" />
      </div>
      <div class="right-side">
        <TagUser
          v-for="item in Implementers"
          :key="item.title"
          :text="item.title + ' ' + item.full_time"
        />
        <div class="status-lists">
          <div class="method-list">
            <span
              v-for="(value, index) in statusName"
              :key="value"
              :class="['status-tag', methodCls[index]]"
            >{{value}}</span>
          </div>
          <div class="activity-list">
            <TagActive
              v-for="(item, index) in activities"
              :key="item"
              :text="item"
              :class="actvtsCls[index]"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { methodCls, actvtsCls } from '../utils/global';
import TagMsg from './TagMsg';
import TagUser from './TagUser';
import TagActive from './TagActive';

export default {
  name: 'Header',
  components: {
    TagMsg,
    TagUser,
    TagActive
  },
  props: {
    top: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      methodCls,
      statusName: [],
      Implementers: [],
      actvtsCls,
      activities: [],
      msgTxt: '',
      msgUrl: '',
      isTop: false
    }
  },
  mounted () {
    const that = this;
    // Get message.
    jcrdUtil.notice_list().done((res) => {
      res.forEach((value) => {
        that.msgTxt = value['content'];
        that.msgUrl = value['url'];
      });
    });
    // Get Method status list.
    jcrdUtil.method_status().done((res) => {
      that.statusName = res.map(item => item.title);
      that.$root.Methods = that.statusName;
    });
    this.statusName = ["Ready", "Not ready", "Need verification"]
    // Get Implementers list.
    this.handleImplement();
    this.bus.$on('implement', function() {
      that.handleImplement();
    });
    // Get Activities status list.
    jcrdUtil.activities_status().done((res) => {
      that.activities = res.map(item => item.title);
      that.$root.Activities = that.activities;
      that.$root.ActiviDetails = res;
    });
  },
  methods: {
    // Load Implementers list
    handleImplement () {
      let that = this;
      jcrdUtil.analyst_list().done((res) => {
        that.Implementers = res;
        that.$root.Analysts = that.Implementers;
      });
    }
  }
}
</script>

<style lang="scss">
.header {
  padding-top: 30px;
  padding-right: 20px;
  padding-bottom: 12px;
  background: #f7f7f7;
  &.fixed {
    position: fixed;
    left: 30px;
    z-index: 5;
  }
  .header-inner {
    &::after {
      @include clearfix;
    }
    @media #{$sm-desktop} {
      position: relative;
    }
  }
  .left-side {
    display: inline-block;
    padding-right: 20px;
    max-width: 50%;
    @media #{$sm-desktop} {
      max-width: 35%;
      position: absolute;
      bottom: 0;
    }
  }
  .right-side {
    float: right;
    text-align: right;
    margin-top: -30px;
    @media #{$sm-desktop} {
      margin-top: 0;
      max-width: 65%;
    }
  }
  .method-list,
  .activity-list {
    display: inline-block;
    margin-top: 20px;
  }
  .activity-list {
    margin-left: 20px;
    @media #{$lg-desktop} {
      margin-left: 40px;
    }
  }
  .user-tag + .user-tag {
    margin-left: 11px;
  }
  .active-tag + .active-tag {
    margin-left: 6px;
  }
  .active-tag-inner {
    padding-right: 4px;
  }
}
</style>