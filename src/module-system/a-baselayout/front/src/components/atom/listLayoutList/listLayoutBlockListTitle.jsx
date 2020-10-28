export default {
  meta: {
    global: false,
  },
  props: {
    layoutManager: {
      type: Object,
    },
    blockConfig: {
      type: Object,
    },
  },
  data() {
    return {
    };
  },
  created() {
  },
  methods: {
  },
  render() {
    return (
      <f7-nav-right>
        {this.layoutManager.create_renderActions()}
        {this.layoutManager.order_renderAction()}
        {this.layoutManager.filter_renderAction()}
      </f7-nav-right>
    );
  },
};