<template>
  <el-dialog class="activity-dialog"
    :visible.sync="visible"
    v-loading="loading"
    width="500px"
    :title="title"
    @open="handleOpen"
    @closed="handleInit">
    <el-form v-if="visible" ref="activityform" :rules="rules" :model="form">
      <el-form-item label="Time" prop="times">
        <el-date-picker
          v-model="form.times"
          type="daterange"
          :disabled="!role"
          range-separator="-"
          start-placeholder="Start"
          end-placeholder="End"
          format="yyyy-MM-dd"
          value-format="MM/dd/yyyy"
        />
      </el-form-item>
      <el-form-item label="Activities" prop="activities">
        <el-select v-model="form.activities" placeholder="select activities" :disabled="!role">
          <el-option
            v-for="activity in activiLst"
            :key="activity.title"
            :label="activity.title"
            :value="activity.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="Analyst" prop="analyst">
        <el-select v-model="form.analyst" placeholder="select analyst" :disabled="!role">
          <el-option
            v-for="analyst in analysts"
            :key="analyst.title"
            :label="analyst.title"
            :value="analyst.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="Comments" prop="comments">
        <el-input v-model="form.comments" type="textarea" :disabled="!role" />
      </el-form-item>
      <el-form-item class="form-button-group">
        <el-button v-if="role" type="success" @click="onSubmit">SAVE</el-button>
        <el-button v-if="(id != null) && role" type="danger" @click="onDelete">DELETE</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { Msgs } from '../utils/global';

export default {
  name: 'DialogActivity',
  data () {
    let validTime = (rule, value, callback) => {
      if (!value || value.length != 2) return callback(new Error(Msgs.validTime));
      callback();
    };
    let validActivity = (rule, value, callback) => {
      if (!value) return callback(new Error(Msgs.validActivity));
      callback();
    };
    let validAnalyst = (rule, value, callback) => {
      if (!value) return callback(new Error(Msgs.validAnalyst));
      callback();
    };
    return {
      visible: false,
      loading: false,
      title: '',
      role: false,
      id: null,
      author: '',
      ticket: null,
      ids: {
        method: null,
        project: '',
        projectId: null
      },
      options: [],
      activiLst: [],
      analysts: [],
      rules: {
        times: [{ validator: validTime, trigger: 'blur' }],
        activities: [{ validator: validActivity, trigger: 'blur' }],
        analyst: [{ validator: validAnalyst, trigger: 'blur' }]
      },
      form: {
        times: [],
        activities: '',
        analyst: '',
        comments: ''
      }
    }
  },
  methods: {
    handleOpen () {
      this.activiLst = this.$root.ActiviDetails;
      this.analysts = this.$root.Analysts;
      this.role = this.$root.Permission.activity;
      if (this.id == null) {
        this.role = this.$root.Permission.activity;
      } else {
        this.role = this.$root.Permission.super 
            || (this.$root.Permission.activity && this.$root.email == this.author);
      }
    },
    handleInit () {
      Object.assign(this.$data, this.$options.data());
    },
    onSubmit () {
      const that = this;
      this.$refs.activityform.validate((valid) => {
        if (!valid) return;
        this.loading = true;
        let ids = {
          ...this.ids
        };
        this.ticket != null && (ids.ticket = this.ticket);
        if (this.id != null) {
          jcrdUtil.update_activity({
            id: this.id,
            ...ids,
            startDate: this.form.times[0],
            endDate: this.form.times[1],
            activityStatus: this.form.activities,
            analyst: this.form.analyst,
            comments: this.form.comments
          }).done((res) => {
            that.loading = false;
            that.$emit('call', 'activdialog', res, Msgs.activityUpdateSucc);
          });
        } else {
          jcrdUtil.create_activity({
            ...ids,
            startDate: this.form.times[0],
            endDate: this.form.times[1],
            activityStatus: this.form.activities,
            analyst: this.form.analyst,
            comments: this.form.comments
          }).done((res) => {
            that.loading = false;
            that.$emit('call', 'activdialog', res, Msgs.activityCreateSucc);
          });
        }
      });
    },
    onDelete () {
      const that = this;
      this.$confirm(Msgs.activityDelCheck, 'Confirm delete', {
        distinguishCancelAndClose: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'Cancel'
      }).then(() => {
        this.loading = true;
        let ids = {
          id: this.id,
          ...this.ids
        };
        this.ticket != null && (ids.ticket = this.ticket);
        jcrdUtil.delete_activity(ids).done((res) => {
          that.loading = false;
          that.$emit('call', 'activdialog', res, Msgs.activityDelSucc);
        });
      });
    }
  }
}
</script>