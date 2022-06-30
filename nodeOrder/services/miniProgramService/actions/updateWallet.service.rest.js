module.exports = async function (ctx) {
  let unlock;
  try {
    const { userId, balance, amount } = ctx.params;
    unlock = await this.broker.cacher.lock(`updateWallet_userId_${userId}`);

    let wallet = await ctx.call("walletModel.findOneAndUpdate", [
      { userId },
      { balance: balance - amount },
      { new: true },
    ]);
    this.logger.info("no caching", { userId, balance, amount });
    return wallet;
  } catch (err) {
    console.log(err);
    throw new MoleculerError(err.message, err.code, null, null);
  } finally {
    await unlock();
  }
};
