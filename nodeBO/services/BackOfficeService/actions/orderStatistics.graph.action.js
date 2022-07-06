const _ = require("lodash");
const { MoleculerError } = require("moleculer").Errors;
const orderContants = require("../constants/orderContants");
const utilDate = require("../util/date");
let moment = require("moment");
module.exports = async function (ctx) {
  try {
    let { fromDate, toDate } = ctx.params.body;
    console.log(fromDate, toDate);
    let method = ctx.params.body.method || "";
    let aggregate = await ctx.call("orderModel.aggregate", [
      [
        method != ""
          ? {
              $match: {
                createdAt: { $gte: fromDate, $lte: toDate },
                payMethod:method,
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
    console.log(aggregate);
    const numberTransaction1 = await ctx.call("orderModel.aggregate", [
      [
        method != ""
          ? {
              $match: {
                createdAt: { $gte: fromDate, $lte: toDate },
                payMethod:method,
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
    console.log(aggregate);
    aggregate = aggregate.filter((data) => {
      if (data.state === "FAILED") data.numberTransaction = numFail;
      return (
        data.state === "PENDING" ||
        data.state === "SUCCEEDED" ||
        data.state === "FAILED"
      );
    });
    console.log(aggregate);
    aggregate.forEach((data) => {
      res[_.camelCase('number Transaction '+data.state)] = data.numberTransaction;
    });
    console.log(aggregate);
    numberTransaction1.forEach((data) => {
      data.date = new Date(data._id.year, data._id.month - 1, data._id.date);
      data.date.setMinutes(
        data.date.getMinutes() - data.date.getTimezoneOffset()
      );
      data.date = moment(data.date).format("DD-MM-YYYY");
      delete data._id;
    });

    res.data = numberTransaction1;
    return res;
  } catch (err) {
    console.log(err);
    return ctx.params;
  }
};

