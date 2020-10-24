import ebAtomClasses from '../atomClasses.js';
import ebMenus from '../menus.js';
import Bulk from './bulk.jsx';
import Search from './search.jsx';
import Select from './select.jsx';
import Create from './create.jsx';
import Order from './order.jsx';

// container: {
//   atomClass,
//   options,
//   params,
//   scene, // default/search/select/selecting/mine
//   layout,
// },

export default {
  mixins: [ ebAtomClasses, ebMenus, Bulk, Search, Select, Create, Order ],
  data() {
    return {
      ready: false,
      layoutCurrent: null,
      layoutConfig: null,
      configAtomBase: null,
      configAtom: null,
      filter: null,
      subnavbarActions: false,
    };
  },
  computed: {
    layoutComponentInstance() {
      return this.$refs.layout && this.$refs.layout.getComponentInstance();
    },
    user() {
      return this.$store.state.auth.user.op;
    },
    userLabels() {
      return this.$store.getters['a/base/userLabels'];
    },
  },
  created() {
    //
    this.$store.dispatch('a/base/getLabels');
    //
    this.layoutCurrent = this.container.layout || this.getLayout();
    //
    this.prepareLayoutConfig().then(() => {
      this.ready = true;

      this.create_loadActions();
    });
  },
  methods: {
    onPageRefresh(done) {
      done && done();
      this.layoutComponentInstance && this.layoutComponentInstance.onPageRefresh(true);
    },
    onPageInfinite() {
      this.layoutComponentInstance && this.layoutComponentInstance.onPageInfinite();
    },
    onPageClear() {
      this.layoutComponentInstance && this.layoutComponentInstance.onPageClear();
    },
    onPerformFilter() {
      const inPanel = this.$view.inPanel();
      const immediate = this.$meta.vueApp.layout === 'pc' && !inPanel;
      const filterConfig = this._getFilterConfig();
      const navigateOptions = {
        context: {
          params: {
            layoutManager: this,
            filterConfig,
            immediate,
          },
        },
      };
      if (immediate) {
        navigateOptions.scene = 'sidebar';
        navigateOptions.sceneOptions = { side: 'right', name: 'filter', title: 'Filter' };
      } else {
        navigateOptions.target = '_self';
      }
      this.$view.navigate('/a/baselayout/listLayoutFilter', navigateOptions);
    },
    onFilterChanged(value) {
      this.filter = value;
      // reload
      this.onPageRefresh();
    },
    getLayout() {
      return this.$view.size === 'small' ? 'list' : 'table';
    },
    prepareSelectOptions() {
      // options
      let options = {
        where: { },
      };
      // search
      if (this.search.query) {
        options.where['a.atomName'] = { val: this.search.query, op: 'like' };
      }
      // select
      if (this.container.scene === 'select') {
        options.where['a.id'] = this.container.params.selectedAtomIds.length > 0 ? this.container.params.selectedAtomIds : null;
      }
      // mine
      if (this.container.scene === 'mine') {
        options.where['a.userIdCreated'] = this.user.id;
      }
      // order
      const atomOrderCurrent = this.order.selected || this.order_default;
      options.orders = [
        [ this.order_getKey(atomOrderCurrent), atomOrderCurrent.by ],
      ];
      // extend 1
      if (this.container.options) {
        options = this.$utils.extend({}, options, this.container.options);
      }
      // options
      return options;
    },
    prepareSelectParams() {
      // options
      const options = this.prepareSelectOptions();
      // params
      let params = {
        atomClass: this.container.atomClass,
        options,
      };
      // filter
      const filterParams = this.prepareFilterParams();
      if (filterParams) {
        params = this.$utils.extend({}, params, filterParams);
      }
      return params;
    },
    prepareFilterParams() {
      if (!this.filter) return null;
      // options
      const options = {
        where: {},
      };
      // params
      const params = {
        options,
      };
      // form
      if (this.filter.form) {
        if (this.filter.form.atomName) {
          options.where['a.atomName'] = { val: this.filter.form.atomName, op: 'like' };
        }
        if (this.filter.form.star) {
          options.star = Number(this.filter.form.star);
        }
        if (this.filter.form.label) {
          options.label = this.filter.form.label;
        }
        if (this.filter.form.stage) {
          options.stage = this.filter.form.stage;
        }
        if (this.filter.form.atomClass) {
          params.atomClass = this.filter.form.atomClass;
        }
      }
      // formAtomClass
      const formAtomClass = this.filter.formAtomClass;
      if (formAtomClass) {
        let hasValue = false;
        for (const key in formAtomClass) {
          const value = formAtomClass[key];
          // undefined/null/'', except 0/false
          if (value !== undefined && value !== null && value !== '') {
            if (typeof value === 'string') {
              options.where[`f.${key}`] = { val: value, op: 'like' };
            } else {
              options.where[`f.${key}`] = value;
            }
            hasValue = true;
          }
        }
        if (hasValue) {
          options.mode = 'search';
        }
      }
      // ok
      return params;
    },
    getItems() {
      return this.layoutComponentInstance ? this.layoutComponentInstance.getItems() : [];
    },
    _getFilterConfig() {
      // base
      const filterConfigBase = this.configAtomBase.render.list.info.filter;
      // atomClass
      const filterConfig = this.$meta.util.getProperty(this.configAtom, 'render.list.info.filter');
      // filterConfig
      return this.$meta.util.extend({}, filterConfigBase, filterConfig);
    },
    async prepareLayoutConfig() {
      // configAtomBase
      this.configAtomBase = this.$config.atom;
      // configAtom
      if (this.container.atomClass) {
        // load module
        await this.$meta.module.use(this.container.atomClass.module);
        this.configAtom = this.$meta.util.getProperty(this.$meta.config.modules[this.container.atomClass.module], `atoms.${this.container.atomClass.atomClassName}`);
      }
      // layoutConfig
      const layoutConfigBase = this.configAtomBase.render.list.layouts[this.layoutCurrent];
      const layoutConfigAtom = this.$meta.util.getProperty(this.configAtom, `render.list.layouts.${this.layoutCurrent}`);
      this.layoutConfig = this.$meta.util.extend({}, layoutConfigBase, layoutConfigAtom);
    },
    getPageTitle() {
      //
      if (this.container.params && this.container.params.pageTitle) return this.container.params.pageTitle;
      //
      const atomClass = this.getAtomClass(this.container.atomClass);
      const atomClassTitle = atomClass && atomClass.titleLocale;
      if (this.container.scene === 'select') {
        if (!atomClass) return `${this.$text('Select')} ${this.$text('Atom')}`;
        return `${this.$text('Select')} ${atomClassTitle}`;
      } else if (this.container.scene === 'selecting') {
        if (!atomClass) return `${this.$text('Selecting')} ${this.$text('Atom')}`;
        return `${this.$text('Selecting')} ${atomClassTitle}`;
      } else if (this.container.scene === 'search') {
        if (!atomClass) return `${this.$text('Search')} ${this.$text('Atom')}`;
        return `${this.$text('Search')} ${atomClassTitle}`;
      } else if (this.container.scene === 'mine') {
        return this.$text('My Atoms');
      }
      if (!atomClass) return this.$text('Atom');
      return `${this.$text('Atom')}: ${atomClassTitle}`;
    },
    getPageSubtitle() {
      const stage = this.getCurrentStage();
      if (stage === 'archive') return '';
      return this.$text(stage.replace(stage[0], stage[0].toUpperCase()));
    },
    getCurrentStage() {
      let stage = this.$meta.util.getProperty(this.filter, 'form.stage');
      if (!stage) stage = this.container.options && this.container.options.stage;
      if (!stage) stage = 'archive';
      return stage;
    },
    getLayoutComponentOptions() {
      return {
        props: {
          layoutManager: this,
          layoutConfig: this.layoutConfig,
        },
      };
    },
    _renderLayoutComponent() {
      if (!this.ready) return null;
      return <eb-component ref='layout' module={this.layoutConfig.component.module} name={this.layoutConfig.component.name} options={this.getLayoutComponentOptions()}></eb-component>;
    },
    getBlockComponentOptions({ blockConfig }) {
      return {
        props: {
          layoutManager: this,
          blockConfig,
        },
      };
    },
    _renderBlock({ blockName }) {
      if (!this.ready) return null;
      const blockConfig = this.layoutConfig.blocks[blockName];
      if (!blockConfig) return null;
      return <eb-component module={blockConfig.component.module} name={blockConfig.component.name} options={this.getBlockComponentOptions({ blockConfig })}></eb-component>;
    },
    _renderLayout() {
      return (
        <div>
          {this._renderLayoutComponent()}
          {this.order_renderPopover()}
          {this.create_renderPopoverActions()}
        </div>
      );
    },
  },
};
