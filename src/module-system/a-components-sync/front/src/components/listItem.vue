<script>
import Vue from 'vue';
import perform from '../common/perform.js';
import link from '../common/link.js';
const f7ListItem = Vue.prototype.$meta.util.extend({}, Vue.options.components['f7-list-item'].extendOptions);
delete f7ListItem.props.href;
export default {
  meta: {
    global: true,
  },
  name: 'eb-list-item',
  extends: f7ListItem,
  mixins: [ perform, link ],
  mounted() {
    this.$$(this.$el).on('contextmenu', this.onContextMenu);
    if (this.externalLink) {
      this.$nextTick(() => {
        const linkEl = this.getLinkEl();
        if (linkEl) {
          linkEl.addClass('eb-external');
        }
      });
    }
  },
  beforeDestroy() {
    this.$$(this.$el).off('contextmenu', this.onContextMenu);
  },
  methods: {
    onContextMenu(event) {
      const popover = this.$$(this.$el).find('.popover');
      if (popover.length === 0) return;

      event.stopPropagation();
      event.preventDefault();

      // finished the event immediately
      this.$nextTick(() => {
        this.$f7.popover.open(popover, this.$el);
        this.$emit('contextmenuOpened', event);
      });
    },
    getLinkEl() {
      // bypass the popover's link
      const content = this.$$(this.$el).find('.item-content');
      if (content.length === 0) return null;
      return this.$$(content[0]).closest('a');
    },
  },
};

</script>
<style scoped>
</style>
