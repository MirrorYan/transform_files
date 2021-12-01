<template>
  <div class="calendar">
    <div class="calendar-container">
      <div class="calendar-body">
        <div class="calendar-week"
          v-for="weekIndex in (weeks.length / 7)"
          :key="weekIndex">
          <div class="cld-days">
            <span :class="[{'cld-day': true}, {'today': weeks[(weekIndex-1)*7 + dayIndex] == local}]"
              v-for="(day, dayIndex) in weekTitles"
              :key="day"
              :data-day="day"
            ><span>{{day[0]}}</span></span>
          </div>
          <div class="calendar-project"
            v-for="project in projects"
            :key="project.name">
            <div class="calendar-line"
              v-for="method in project.list"
              :key="method.id"
              :data-lineid="method.id">
              <span class="calendar-day"
                v-for="(day, dayIndex) in weekTitles"
                :key="day"
                :data-day="day"
                @click.self="onDayClk(weeks[(weekIndex-1)*7 + dayIndex], method.id, project)">
                <template v-for="ticket in ticketLst[weeks[(weekIndex-1)*7 + dayIndex]]">
                  <el-tooltip v-if="ticket.methodId == method.id"
                    :key="ticket.id"
                    effect="dark"
                    :content="ticket.comment"
                    placement="top-start">
                    <span class="ticket-tag" @click="onTicketClk(ticket, project)"></span>
                  </el-tooltip>
                </template>
                <template v-for="activity in activityLst[weeks[(weekIndex-1)*7 + dayIndex]]">
                  <TagActive
                    :key="activity.id"
                    v-if="activity.methodId == method.id"
                    :text="activity.analyst"
                    :comments="activity.comment"
                    :class="handleActType(activity.activityStatus)"
                    :length="handleActLen(activity.activityShowStartDate, activity.activityShowEndDate)"
                    :style="'width: calc((100% + 1px) * ' + handleActLen(activity.activityShowStartDate, activity.activityShowEndDate) +' - 1px);'"
                    @click.native="onActivClk(activity, project)"
                  />
                </template>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { weekLength, weekTitles, actvtsCls } from '../utils/global';
import TagActive from './TagActive';

export default {
  name: 'BlockCalendar',
  components: {
    TagActive
  },
  props: {
    weeks: {
      type: Array,
      default: []
    },
    projects: {
      type: Array,
      default: []
    }
  },
  data () {
    return {
      local: '',
      weekTitles,
      ticketLst: {},
      activityLst: []
    }
  },
  mounted () {
    // Get Ticket & Activity list.
    this.handleLoad();
    // Set local date.
    const localDate = new Date();
    this.local = `${localDate.getMonth() + 1}/${localDate.getDate()}/${localDate.getFullYear()}`;
  },
  methods: {
    // Load tickets & activities.
    handleLoad () {
      const that = this;
      jcrdUtil.calendar_ticket_list({
        weekLength: weekLength(),
        weekOffset: this.$root.weekOffset
      }).done((res) => {
        that.ticketLst = res;
      });
      jcrdUtil.calendar_activity_list({
        weekLength: weekLength(),
        weekOffset: this.$root.weekOffset
      }).done((res) => {
        that.activityLst = res;
      });
    },
    // Judge activity type.
    handleActType (type) {
      const index = this.$root.Activities.indexOf(type);
      if (index < 0) {
        return '';
      } else {
        return actvtsCls[index];
      }
    },
    // Judge activity date length.
    handleActLen (start, end) {
      if (!start || !end) return '';
      const date1 = new Date(start),
            date2 = new Date(end);
      return Math.floor((date2 - date1) / 3600000 / 24) + 1;
    },
    // Click Day.
    onDayClk (ticketDate, methodId, project) {
      const { ticket, activity } = this.$root.Permission;
      if (!ticket && !activity) return;
      const tickets = this.ticketLst[ticketDate];
      let conti = false;
      for (let i=0; i<tickets.length; i++) {
        if (tickets[i].methodId == methodId) {
          conti = true;
          break;
        }
      }
      if (ticket && !conti) {
        this.$parent.handleTicketOpen('create', { ticketDate, methodId }, project);
      }else if (activity) {
        this.$parent.handleActivOpen('create',
          { ticketDate, methodId },
          { project: project.name, projectId: project.id }
        );
      }
    },
    // Click Ticket
    onTicketClk (detail, project) {
      this.$parent.handleTicketOpen('exit', detail, project);
    },
    // Click activity
    onActivClk (detail, project) {
      this.$parent.handleActivOpen('exit', detail, { project: project.name, projectId: project.id });
    }
  }
}
</script>

<style lang="scss">
.calendar {
  padding-right: 30px;
  .calendar-container {
    border-left: 1px dashed $silver-light;
  }
  .calendar-body,
  .cld-days,
  .calendar-line {
    display: flex;
  }
  .calendar-week {
    flex: 1;
    padding-top: calc(#{$projHead-height} + #{$projItem-space});
    border-right: 1px dashed $silver-light;
  }
  .cld-day,
  .calendar-day {
    flex: 1;
    display: inline-block;
    height: $projTitle-height;
  }

  .cld-days {
    padding: $projItem-space 0;
  }
  .cld-day {
    line-height: $projTitle-height;
    text-align: center;
    text-transform:uppercase;
    span {
      display: inline-block;
      width: 20px;
      height: 20px;
      padding: 0 5px;
      line-height: 20px;
      font-size: .75em;
      color: $silver-deep;
    }
    &.today span {
      color: #fff;
      border-radius: 50%;
      background-color: $red;
    }
  }

  .calendar-project + .calendar-project {
    margin-top: calc(#{$projTitle-height} + #{$projItem-space} * 2);
  }
  .calendar-line + .calendar-line {
    margin-top: $projItem-space;
  }
  .calendar-day {
    margin-right: 1px;
    display: inline-block;
    height: $projItem-height;
    background-color: #fff;
    cursor: pointer;
    position: relative;
  }
  .ticket-tag {
    display: inline-block;
    width: 16px;
    height: 16px;
    background: url(../assets/flag.svg) 100% 100% no-repeat;
    position: absolute;
    top: calc(50% - 8px);
    left: 2px;
    z-index: 2;
  }
  .active-tag {
    position: absolute;
    top: calc(50% - 10px);
    left: 0;
    z-index: 1;
    .active-tag-inner {
      width: 100%;
      padding-left: 16px;
    }
  }
}
</style>