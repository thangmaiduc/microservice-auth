const { MoleculerError } = require("moleculer").Errors;
const moment = require('moment')
module.exports = {
  methods: {
   async checkIsAuthenticated(ctx) {
    //   console.log("authorization checking");
      let userAgent = ctx.meta.auth.credentials.userAgent;
      if (userAgent !== ctx.meta.userAgent)
        throw new MoleculerError("INVALID_TOKEN", 401, null, null);
      let now =new Date();
      let token =await ctx.call('tokenModel.findOne', [{token: ctx.meta.token}])
      if(moment(now).isAfter(token.expiredAt)){
        throw new MoleculerError('token het han', 401,null, null)
      }


    },
  },
};
