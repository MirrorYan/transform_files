import Vue from 'vue';
import ElementUI from 'element-ui';
import locale from 'element-ui/lib/locale/lang/en';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App';

// Define the global event bus.
Vue.prototype.bus = new Vue();

Vue.config.productionTip = false;
Vue.use(ElementUI, { locale });

new Vue({
  el: '#app',
  components: { App },
  template: '<App/>',
  data () {
    return {
      Permission: {
        ticket: false,
        activity: false,
        super: false
      },
      email: '',
      Methods: [],
      Activities: [],
      ActiviDetails: [],
      Analysts: [],
      weekOffset: 0
    }
  }
});
