<template>
  <div class="container">
    <div class="shadow-box" :style="{'top': top+'px'}">
      <WeeklyDate :weeks="weeks" @flip="handleWeeksLoad" />
      <div class="turnto-today" @click="onTodayClk">Today</div>
    </div>
    <div class="projCald-container">
      <Project :projects="projectLst" />
      <BlockCalendar
        ref="calendar"
        :weeks="weeks"
        :projects="projectLst"
      />
    </div>
    <DialogTicket ref="ticketdialog" @call="handleSubmitCall" />
    <DialogActivity ref="activdialog" @call="handleSubmitCall" />
  </div>
</template>

<script>
import { weekLength } from '../utils/global';
import WeeklyDate from './WeeklyDate';
import Project from './Project';
import BlockCalendar from './BlockCalendar';
import DialogTicket from './DialogTicket';
import DialogActivity from './DialogActivity';

export default {
  name: 'Container',
  props: {
    top: {
      type: Number,
      default: 0
    }
  },
  components: {
    WeeklyDate,
    Project,
    BlockCalendar,
    DialogTicket,
    DialogActivity
  },
  mounted () {
    const that = this;
    this.$emit('top', this.handleScroll);
    // Get weeklist.
    this.handleWeeksLoad();
    // Get project list.
    jcrdUtil.method_list().done((res) => {
      that.projectLst = res;
    });
  },
  data () {
    return {
      weeks: [],
      projectLst: [],
      ticketOptions: {}
    }
  },
  methods: {
    handleScroll () {

    },
    // Load weeks.
    handleWeeksLoad (offset=0) {
      const that = this;
      this.$root.weekOffset += offset;
      this.$refs.calendar.handleLoad();
      this.bus.$emit('implement');
      jcrdUtil.calendar_list({
        weekLength: weekLength(),
        weekOffset: this.$root.weekOffset
      }).done((res) => {
        that.weeks = res;
      });
    },
    // Open Ticket dialog.
    handleTicketOpen (type, detail, project) {
      this.$refs.ticketdialog.visible = true;
      this.$refs.ticketdialog.method = detail.methodId;
      this.$refs.ticketdialog.projDtl = {
        project: project.name,
        projectId: project.id
      };
      if (type == 'exit') {
        this.$refs.ticketdialog.title = 'Ticket';
        this.$refs.ticketdialog.id = detail.id;
        this.$refs.ticketdialog.author = detail.author;
        this.$refs.ticketdialog.form = {
          time: detail.ticketDate,
          comments: detail.comment
        }
      } else if (type == 'create') {
        this.$refs.ticketdialog.title = 'Create ticket';
        this.$refs.ticketdialog.form.time = detail.ticketDate;
        this.$refs.ticketdialog.form.methods.push(detail.methodId);
        this.$refs.ticketdialog.methodLst = project.list;
      }
    },
    // Open Activity dialog.
    handleActivOpen (type, detail, project) {
      this.$refs.activdialog.visible = true;
      this.$refs.activdialog.ids = {
        method: detail.methodId,
        ...project
      };
      if (detail.ticketId != null) {
        this.$refs.activdialog.ticket = detail.ticketId
      }
      if (type === 'exit') {
        this.$refs.activdialog.title = 'Activity';
        this.$refs.activdialog.id = detail.id;
        this.$refs.activdialog.author = detail.author;
        this.$refs.activdialog.form = {
          times: [detail.activityStartDate, detail.activityEndDate],
          activities: detail.activityStatusId,
          analyst: detail.analystId,
          comments: detail.comment
        };
      } else if (type === 'create') {
        this.$refs.activdialog.title = 'Create activity';
      }
    },
    // Handle call back for submit.
    handleSubmitCall (type, res, succMsg) {
      if (res.status === 'fail') {
        this.$message({
          message: res.msg,
          type: 'error',
          duration: 1500
        });
      } else {
        this.$refs[type].visible = false;
        this.$message({
          message: succMsg,
          type: 'success',
          duration: 1500
        });
        this.handleWeeksLoad();
      }
    },
    // Click(Today button) => Turn to current week.
    onTodayClk () {
      if (this.$root.weekOffset === 0) return;
      this.$root.weekOffset = 0;
      this.handleWeeksLoad();
    }
  }
}
</script>

<style lang="scss">
.shadow-box {
  height: 50px;
  background-color: #fff;
  border-radius: 3px;
  box-shadow: 0px 2px 16px rgba(127, 133, 139, .09);
  &::after {
    @include clearfix;
  }
  .turnto-today {
    float: right;
    height: 30px;
    line-height: 30px;
    margin-top: 10px;
    margin-right: 30px;
    padding: 0 15px;
    background: $blue;
    color: #fff;
    border-radius: 3px;
    transition: opacity .3s ease-in;
    cursor: pointer;
    &:hover {
      opacity: .8;
    }
  }
  .weekly-date-container {
    float: right;
  }
}
.projCald-container {
  display: flex;
  margin-top: 30px;
  .calendar {
    flex: 1;
  }
}

.container.fixed {
  .shadow-box {
    position: fixed;
    left: 30px;
    z-index: 5;
  }
}
</style>