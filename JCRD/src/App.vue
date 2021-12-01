<template>
  <div id="app">
    <div class="app-container" :style="{'min-width': width, 'padding-top': paddingTop}">
      <Header :class="{'fixed': isTop}" :top="top" />
      <Container :class="{'fixed': isTop}" :top="headHeight+top" />
    </div>
  </div>
</template>

<script>
import Header from './components/Header';
import Container from './components/Container';

export default {
  name: 'App',
  components: {
    Header,
    Container
  },
  mounted () {
    const that = this;
    // Wait for the view to render.
    const app = document.querySelector('#app');
    this.$nextTick(() => {
      this.width = app.offsetWidth + 'px';
      this.top = app.getBoundingClientRect().top;
      this.weekHeight = document.querySelector('.shadow-box').offsetHeight;
    });
    app.addEventListener('scroll', this.handleScroll);
    // Load user role.
    jcrdUtil.user_role().done((res) => {
      that.$root.Permission = {
        ticket: (res.indexOf('Submitter') != -1 || res.indexOf('Supervisor') != -1),
        activity: (res.indexOf('Analyst') != -1 || res.indexOf('Supervisor') != -1),
        super: res.indexOf('Supervisor') != -1
      };
    });
    // Load user email
    jcrdUtil.user_email().done((res) => {
      that.$root.email = res
    });
  },
  data () {
    return {
      width: 0,
      top: 0,
      paddingTop: 30,
      isTop: false,
      headHeight: 0,
      weekHeight: 0
    }
  },
  methods: {
    handleScroll () {
      const container =  document.querySelector('.app-container'),
            head = document.querySelector('.header'),
            week = document.querySelector('.shadow-box'),
            top = container.getBoundingClientRect().top;
      if (top - this.top < -30) {
        if (this.isTop) return;
        const width = container.offsetWidth;
        this.isTop = true;
        this.headHeight = head.offsetHeight;
        this.paddingTop = (this.headHeight + this.weekHeight + 30) + 'px';
        head.style.width = (width - 30) + 'px';
        week.style.width = (width - 30) + 'px';
      } else if (top - this.top >= -30) {
        if (!this.isTop) return;
        this.paddingTop = '30px';
        this.isTop = false;
        head.style.width = 'auto';
        week.style.width = 'auto';
      }
    }
  }
}
</script>

<style lang="scss">
#app {
  height: calc(100vh - 100px);
  overflow: auto;
  color: #000;
  background: #F7F7F7;
  .app-container {
    padding: 30px 0 60px 30px;
    overflow: auto;
    background: #F7F7F7;
  }
}
#s4-workspace {
  overflow-y: hidden !important;
}
</style>