import Layout from './layout.vue';
import Region from './region.vue'

Layout.install = function (Vue) {
  Vue.component(Layout.name, Layout);
};

Region.install = function (Vue) {
  Vue.component(Region.name, Region);
};

export default {Layout, Region};
