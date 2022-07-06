const _ = require("lodash");
const { MoleculerError } = require("moleculer").Errors;
const orderContants = require("../constants/orderContants");
var moment = require("moment");
const awaitAsyncForeach = require("await-async-foreach");

module.exports = async function (ctx) {
  try {
    let { fromDate, toDate } = ctx.params.body;
    // const startDate = moment(fromDate).startOf("day").toDate();
    // const endDate = moment(toDate).endOf("day").toDate();
    // console.log(startDate, endDate);
    let userId = ctx.params.body.userId || "";
    console.log(fromDate, toDate);
    let aggregate = await ctx.call("orderModel.aggregate", [
      [
        userId
          ? {
              $match: {
                createdAt: { $gte: fromDate, $lte: toDate },
                userId,
              },
            }
          : {
              $match: {
                createdAt: { $gte: fromDate, $lte: toDate },
              },
            },
        {
          $group: {
            _id: {
              state: "$state",
            },
            numberTransaction: {
              $count: {},
            },
          },
        },
      ],
    ]);
    let res = {};

    let numFail = 0;
    aggregate.forEach((data) => {
      data.state = data._id.state;
      delete data._id;
      if (data.state !== "PENDING" && data.state !== "SUCCEEDED") {
        numFail += data.numberTransaction;
      }
    });
    const data = await ctx.call("orderModel.aggregate", [
      [
        userId
          ? {
              $match: {
                createdAt: { $gte: fromDate, $lte: toDate },
                userId,
              },
            }
          : {
              $match: {
                createdAt: { $gte: fromDate, $lte: toDate },
              },
            },
        {
          $group: {
            _id: {
              userId: "$userId",
              date: {
                $dayOfMonth: "$createdAt",
              },
              month: {
                $month: "$createdAt",
              },
              year: {
                $year: "$createdAt",
              },
            },
            numberTransaction: {
              $count: {},
            },
            numberTransactionSucceeded: {
              $accumulator: {
                init: `function () {
                  return { count: 0 };
                }`,
                accumulate: `function (state, numSucceeded) {
                  return {
                    count:
                      numSucceeded === "SUCCEEDED"
                        ? state.count + 1
                        : state.count,
                  };
                }`,
                accumulateArgs: ["$state"], // Argument required by the accumulate function
                merge: `function (state1, state2) {
                  // When the operator performs a merge,
                  return {
                    // add the fields from the two states
                    count: state1.count + state2.count,
                  };
                }`,
                finalize: `function (state) {
                  // After collecting the results from all documents,
                  return state.count; // calculate the average
                }`,
                lang: "js",
              },
            },
          },
        },
        {
          $sort: {
            "_id.year": 1,
            "_id.month": 1,
            "_id.date": 1,
            "_id.userId": 1
          },
        },
      ],
    ]);
    aggregate = aggregate.filter((data) => {
      if (data.state === "FAILED") data.numberTransaction = numFail;
      return data.state === "PENDING" || data.state === "FAILED";
    });
    aggregate.forEach((data) => {
      res[data.state] = data.numberTransaction;
    });

    let numCustomer = await ctx.call("orderModel.aggregate", [
      [
        userId
          ? {
              $match: {
                createdAt: { $gte: fromDate, $lte: toDate },
                userId,
              },
            }
          : {
              $match: {
                createdAt: { $gte: fromDate, $lte: toDate },
              },
            },
        {
          $group: {
            _id: {
              userId: "$userId",
            },
          },
        },
        {
          $count: "numCustomer",
        },
      ],
    ]);
    let numCus;
    if (_.isArray(numCustomer)) numCus = numCustomer[0].numCustomer;
    let users =await  ctx.call("userModel.findMany", [{},{id:1, email:1, fullName:1}]);
    // let user =_.find(users,{id: 0})
    await awaitAsyncForeach(data, async (piece) => {
      piece.date = new Date(
        piece._id.year,
        piece._id.month - 1,
        piece._id.date
      );
      piece.date.setMinutes(
        piece.date.getMinutes() - piece.date.getTimezoneOffset()
      );
      piece.date = moment(piece.date).format("DD-MM-YYYY");
      piece.userId = piece._id.userId;
      delete piece._id;
      let user =_.find(users,{id: piece.userId})
      // console.log(user);
      piece.fullName = _.get(user, "fullName", "");
      piece.email = _.get(user, "email", "");
    });
    res.numCustomer = numCus;
    res.data = data;
    return res;
  } catch (err) {
    console.log(err);
    return ctx.params;
  }
};
