module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class IOChannel extends ctx.app.meta.IOChannelBase(ctx) {

    async onPush({ content /* options, message, messageSync, messageClass*/ }) {
      // userIds / roleIds
      const userIds = content.userIds;
      const roleIds = content.roleIds;
      // message
      const message = {
        ... content.data,
      };
      // agentid
      const config = ctx.config.module(moduleInfo.relativeName).account.wxwork;
      message.agentid = config.apps.selfBuilt.agentid;
      // userIds
      if (userIds && userIds.length > 0) {
        const modelMember = ctx.model.module(moduleInfo.relativeName).member;
        const list = await modelMember.select({
          where: { userId: userIds },
          columns: [ 'memberId' ],
        });
        message.touser = list.map(item => item.memberId).join('|');
      }
      // roleIds
      if (roleIds && roleIds.length > 0) {
        const modelDepartment = ctx.model.module(moduleInfo.relativeName).department;
        const list = await modelDepartment.select({
          where: { roleId: roleIds },
          columns: [ 'departmentId' ],
        });
        message.toparty = list.map(item => item.departmentId).join('|');
      }
      // send
      await ctx.bean.wxwork.app.selfBuilt.sendMessage(message);
      // done
      return true;
    }

  }
  return IOChannel;
};
