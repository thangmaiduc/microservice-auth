const _ = require("lodash");
const { MoleculerError } = require("moleculer").Errors;
const orderContants = require("../constants/orderContants");
let xl = require("excel4node");
const fs = require("fs");

let moment = require("moment");
module.exports = async function (ctx) {
  try {
    let wb = new xl.Workbook();

    // Add Worksheets to the workbook
    let ws = wb.addWorksheet("Sheet 1");
    let { fromDate, toDate } = ctx.params.body;
    let method = ctx.params.body.method || "";
    console.log(method);
    let aggregate = await ctx.call("orderModel.aggregate", [
      [
        method!=""
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
    const orderAggre = await ctx.call("orderModel.aggregate", [
      [
        method!=""
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
    aggregate.forEach((piece, index) => {
      let row = index + 1;
      ws.cell(row, 1).string("PAYMENT" + piece.state);
      ws.cell(row, 2).number(piece.numberTransaction);
    });
    console.log(aggregate);
    orderAggre.forEach((data) => {
      data.date = new Date(data._id.year, data._id.month - 1, data._id.date);
      data.date.setMinutes(
        data.date.getMinutes() - data.date.getTimezoneOffset()
      );
      data.date = moment(data.date).format("DD-MM-YYYY");
      delete data._id;
    });

    ws.cell(4, 1).string("Ngày");
    ws.cell(4, 2).string("Số giao dịch trong ngày");
    ws.cell(4, 3).string("Số giao dịch thành công trong ngày");
    orderAggre.forEach((piece, index) => {
      let row = index + 5;
      ws.cell(row, 1).string(piece.date);
      ws.cell(row, 2).number(piece.numberTransaction);
      ws.cell(row, 3).number(piece.numberTransactionSucceeded);
    });
    let base64 = "";

    let promise = new Promise(function (resolve, reject) {
      wb.write("thong-ke-GD.xls", function (err, stats) {
        if (err) {
          console.error(err);
        } else {
          fs.readFile("thong-ke-GD.xls", "base64", function (err, data) {
            if (err) console.log(err);
            resolve(data);
          });
        }
      });
    });
    base64 = await promise;
    return {
      data: base64,
    };
  } catch (err) {
    console.log(err);
    return ctx.params;
  }
};
