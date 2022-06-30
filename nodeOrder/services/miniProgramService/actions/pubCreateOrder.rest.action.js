module.exports =async (ctx) => {
  let body = ctx.params.body;
  body.userId=ctx.meta.userId;
  for(let  i=0; i< 20; i++)
  res = await ctx.call("miniProgram.rest.conCreateOrder.async", {
    params: {
      body,
    },
  });
  return {
    successed: res
  }
 
};
