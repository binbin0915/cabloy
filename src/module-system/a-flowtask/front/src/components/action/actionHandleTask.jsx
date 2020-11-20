export default {
  data() {
    return {
      flowLayoutManager: null,
      flowTaskId: 0,
      action: null,
      remark: '',
      callback: null,
    };
  },
  methods: {
    onFormSubmit() {
      // this.$refs.buttonSubmit.onClick();
    },
    async onSubmit(event, status) {
      // close
      this.$refs.sheet.f7Sheet.close(false);
      // callback
      await this.callback(event, async data => {
        // prompt
        await this.$view.dialog.confirm(this.$text(status === 1 ? 'TaskPassPrompt' : 'TaskRejectPrompt'));
        // params
        const params = {
          flowTaskId: this.flowTaskId,
          handle: {
            status,
            remark: this.remark,
          },
        };
        if (status === 1 && data && data.formAtom) {
          params.formAtom = data.formAtom;
        }
        // complete
        await this.$api.post('/a/flowtask/task/complete', params);
        // load flow
        await this.flowLayoutManager.base_loadData();
        // back
        if (this.$f7route.path === '/a/flowtask/flowTaskAtom') {
          this.$f7router.back();
        }
      });
    },
    open({ flowLayoutManager, flowTaskId, action, callback }) {
      this.flowLayoutManager = flowLayoutManager;
      this.flowTaskId = flowTaskId;
      this.action = action;
      this.callback = callback;
      this.$refs.sheet.f7Sheet.open();
    },
  },
  render() {
    let domButtonPass;
    if (this.action && this.action.options.allowPassTask) {
      domButtonPass = (
        <eb-link ref="buttonSubmitPass" propsOnPerform={event => this.onSubmit(event, 1)}>{this.$text('Pass')}</eb-link>
      );
    }
    let domButtonReject;
    if (this.action && this.action.options.allowRejectTask) {
      domButtonReject = (
        <eb-link ref="buttonSubmitReject" propsOnPerform={event => this.onSubmit(event, 2)}>{this.$text('Reject')}</eb-link>
      );
    }
    return (
      <f7-sheet ref="sheet" fill>
        <f7-toolbar>
          <div class="left">
          </div>
          <div class="right display-flex align-items-center">
            {domButtonPass}
            {domButtonReject}
          </div>
        </f7-toolbar>
        <f7-page-content>
          <eb-list form inline-labels no-hairlines-md onSubmit={event => this.onFormSubmit(event)}>
            <eb-list-input label={this.$text('Remark')} type="text" clear-button placeholder={this.$text('Remark')} v-model={this.remark}>
            </eb-list-input>
          </eb-list>
        </f7-page-content>
      </f7-sheet>
    );
  },
};