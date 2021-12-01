<template>
  <div class="project">
    <table class="project-table">
      <thead>
        <tr>
          <th scope="col">Method</th>
          <th scope="col">Owner</th>
          <th scope="col">TMD/TEC</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="project in projects">
          <tr class="title-line" :key="project.name">
            <td colspan="3">{{project.name}}</td>
          </tr>
          <tr class="method-line"
            v-for="method in project.list"
            :key="method.id"
            :data-id="method.id">
            <td>{{method.title}}</td>
            <td>{{method.owner}}</td>
            <td :class="handleStatus(method.method_status)">{{method.tmd_tec}}</td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<script>
import { methodCls } from '../utils/global';

export default {
  name: 'Project',
  props: {
    projects: Array
  },
  methods: {
    handleStatus (status) {
      const index = this.$root.Methods.indexOf(status);
      if (index == -1) return '';
      return methodCls[index];
    }
  }
}
</script>

<style lang="scss">
.project {
  display: inline-block;
}
table.project-table {
  width: 360px;
  table-layout: fixed;
  text-align: left;
  font-weight: 400;
  border-collapse: separate;
  border-spacing: 0 $projItem-space;
  thead {
    tr {
      height: $projHead-height;
    }
    th {
      font-size: 1.14em;
    }
  }
  .title-line {
    height: $projTitle-height;
    font-weight: bold;
    font-size: 1.14em;
    background-color: #fff;
  }
  .method-line {
    height: $projItem-height;
    font-size: 1.07em;
    background-color: #fff;
    & > td {
      padding: 0 2px;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
  }
  td, th {
    &:first-child {
      width: 30%;
      padding-left: 15px;
      border-radius: 3px 0 0 3px;
    }
    &:nth-child(2) {
      width: 20%;
    }
  }
}
</style>