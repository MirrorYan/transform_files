<template>
  <el-dialog class="ticket-dialog"
    :visible.sync="visible"
    v-loading="loading"
    width="500px"
    :title="title"
    @open="handleOpen"
    @closed="handleInit">
    <el-form v-if="visible" ref="ticketform" :model="form" :rules="rules">
      <el-form-item label="Time" prop="time">
        <el-date-picker
          v-model="form.time"
          type="date"
          :disabled="!role.ticket"
          format="yyyy-MM-dd"
          value-format="MM/dd/yyyy"
        />
      </el-form-item>
      <el-form-item v-if="id == null" label="Methods" prop="methods">
        <el-checkbox-group v-model="form.methods">
          <el-checkbox v-for="item in methodLst" :key="item.id"
            :label="item.id"
            name="methods"
          >{{ item.title }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="Comments" prop="comments">
        <el-input v-model="form.comments" type="textarea" :disabled="!role.ticket" />
      </el-form-item>
      <el-form-item class="form-button-group">
        <!-- Button都要判断权限 -->
        <el-button v-if="role.ticket" type="success" @click="onSubmit">SAVE</el-button>
        <el-button v-if="(id != null) && role.ticket" type="danger" @click="onDelete">DELETE</el-button>
        <el-button v-if="role.activity" type="primary" @click="onCreate">CREATE ACTIVITIES</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { Msgs } from '../utils/global';

export default {
  name: 'DialogTicket',
  data () {
    let validTime = (rule, value, callback) => {
      if (!value) {
        return callback(new Error(Msgs.validTime));
      }
      callback();
    };
    let validMethods = (rule, value, callback) => {
      if (!value.length) {
        return callback(new Error(Msgs.validMethod));
      }
      callback();
    };
    return {
      visible: false,
      loading: false,
      title: '',
      role: {
        ticket: false,
        activity: false
      },
      id: null,
      author: '',
      method: null,
      methodLst: [],
      projDtl: {
        project: '',
        projectId: null,
      },
      rules: {
        time: [{ validator: validTime, trigger: 'blur' }],
        methods: [{ validator: validMethods, trigger: 'change' }]
      },
      form: {
        time: '',
        methods: [],
        comments: ''
      }
    }
  },
  methods: {
    handleOpen () {
      if (this.id == null) {
        this.role = this.$root.Permission;
      } else {
        this.role = {
          ticket: this.$root.Permission.super || (this.$root.Permission.ticket && this.$root.email == this.author),
          activity: this.$root.Permission.super || (this.$root.Permission.activity && this.$root.email == this.author),
        }
      }
    },
    handleInit () {
      Object.assign(this.$data, this.$options.data());
    },
    onSubmit () {
      const that = this;
      this.$refs.ticketform.validate((valid) => {
        if (!valid) return;
        let { form } = this;
        this.loading = true;
        if (this.id != null) {
          delete form.methods;
          jcrdUtil.update_ticket({
            id: this.id,
            ...form,
            ...this.projDtl,
            method: this.method
          }).done((res) => {
            that.loading = false;
            that.$emit('call', 'ticketdialog', res, Msgs.ticketUpdateSucc);
          });
        } else {
          const { methods } = form;
          delete form.methods;
          methods.forEach((id, index, arr) => {
            jcrdUtil.create_ticket({
              ...this.form,
              ...this.projDtl,
              method: id
            }).done((res) => {
              if (index === arr.length - 1) {
                that.loading = false;
                that.$emit('call', 'ticketdialog', res, Msgs.ticketCreateSucc);
              }
            });
          });
        }
      })
    },
    onDelete () {
      const that = this;
      this.$confirm(Msgs.ticketDelCheck, 'Confirm delete', {
        distinguishCancelAndClose: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'Cancel'
      }).then(() => {
        that.loading = true;
        jcrdUtil.delete_ticket({
          id: this.id,
          ...this.projDtl
        }).done((res) => {
          that.loading = false;
          that.$emit('call', 'ticketdialog', res, Msgs.ticketDelSucc);
        });
      });
    },
    onCreate () {
      this.visible = false;
      let detail = { methodId: this.method };
      this.id != null && (detail.ticketId = this.id);
      this.$parent.handleActivOpen('create', detail, this.projDtl);
    }
  }
}
</script>

<style lang="scss">
.el-icon-date::before {
  content: url(../assets/clock.svg);
}
.ticket-dialog {
  .el-checkbox-group {
    margin-top: 40px;
    &::before {
      content: '';
      display: block;
      width: 100%;
    }
  }
}
</style>