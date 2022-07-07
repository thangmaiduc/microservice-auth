const _ = require("lodash");
const { MoleculerError } = require("moleculer").Errors;
const orderContants = require("../constants/orderContants");
var moment = require("moment");
const awaitAsyncForeach = require("await-async-foreach");
let xl = require("excel4node");
const fs = require("fs");
module.exports = async function (ctx) {
  try {
    // Create a new instance of a Workbook class
    let wb = new xl.Workbook();

    // Add Worksheets to the workbook
    let ws = wb.addWorksheet("Sheet 1");
    let { fromDate, toDate } = ctx.params.body;
    if (!this.isValidDate(fromDate)) {
      throw new MoleculerError("Tham số truyền vào không hợp lệ", "422");
    }
    if (!this.isValidDate(toDate)) {
      throw new MoleculerError("Tham số truyền vào không hợp lệ", "422");
    }
    // const startDate = moment(fromDate).startOf("day").toDate();
    // const endDate = moment(toDate).endOf("day").toDate();
    // console.log(startDate, endDate);
    let userId = ctx.params.body.userId || "";
    console.log(fromDate, toDate);
    const promise1 = ctx.call(
      "paymentModel.aggregate",
      [
        [
          {
            $match: {
              createdAt: { $gte: fromDate, $lte: toDate },
            },
          },
          {
            $project: {
              orderId: 1.0,
              createdAt: {
                $dateToString: {
                  date: "$createdAt",
                  format: "%d-%m-%Y",
                },
              },
            },
          },
          {
            $lookup: {
              from: "orders",
              localField: "orderId",
              foreignField: "orderId",

              as: "order",
            },
          },
          {
            $unwind: {
              path: "$order",
            },
          },
          {
            $project: {
              state: 1.0,
              "order.userId": 1.0,
              createdAt: 1.0,
            },
          },
          userId !== ""
            ? {
                $match: {
                  "order.userId": userId,
                },
              }
            : { $match: {} },
          {
            $group: {
              _id: {
                userId: "$order.userId",
                date: "$createdAt",
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
              "_id.date": 1,
              "_id.userId": 1,
            },
          },
        ],
      ],
      { timeout: 60000 }
    );
    const promise2 = ctx.call(
      "paymentModel.aggregate",
      [
        [
          {
            $match: {
              createdAt: {
                $gte: fromDate,
                $lte: toDate,
              },
            },
          },

          {
            $lookup: {
              from: "orders",
              localField: "orderId",
              foreignField: "orderId",
              as: "order",
            },
          },
          {
            $unwind: {
              path: "$order",
            },
          },

          userId !== ""
            ? {
                $match: {
                  "order.userId": userId,
                },
              }
            : { $match: {} },
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
      ],
      { timeout: 60000 }
    );
    const promise3 = ctx.call(
      "orderModel.aggregate",
      [
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
      ],
      { timeout: 60000 }
    );
    let res = {};

    let numFail = 0;
    numCustomer = await promise3;
    let numCus;
    if (_.isArray(numCustomer)) numCus = numCustomer[0].numCustomer;

    aggregate = await promise2;

    // await data;
    aggregate.forEach((data) => {
      data.state = data._id.state;
      delete data._id;
      if (data.state !== "PENDING" && data.state !== "SUCCEEDED") {
        numFail += data.numberTransaction;
      }
    });

    aggregate = aggregate.filter((data) => {
      if (data.state === "FAILED") data.numberTransaction = numFail;
      return data.state === "PENDING" || data.state === "FAILED";
    });
    aggregate.forEach((data) => {
      res[_.camelCase("number Transaction " + data.state)] =
        data.numberTransaction;
    });

    let users = await ctx.call("userModel.findMany", [
      {},
      { id: 1, email: 1, fullName: 1 },
    ]);
    // let user =_.find(users,{id: 0})
    data = await promise1;
    await awaitAsyncForeach(data, async (piece) => {
      piece.date = piece._id.date;
      piece.userId = piece._id.userId;
      delete piece._id;
      let user = _.find(users, { id: piece.userId });
      piece.fullName = _.get(user, "fullName", "");
      piece.email = _.get(user, "email", "");
    });

    ws.cell(3, 1).string("Tổng khách hàng");
    ws.cell(3, 2).number(numCus);
    ws.cell(4, 1).string("Tên KH");
    ws.cell(4, 2).string("Mã KH");
    ws.cell(4, 3).string("Email KH");
    ws.cell(4, 4).string("Ngày Giao Dịch");
    ws.cell(4, 5).string("Số giao dịch trong ngày");
    ws.cell(4, 6).string("Số giao dịch thành công trong ngày");
    data.forEach((piece, index) => {
      let row = index + 5;
      // ws.cell(1, row).string(piece.state);
      // ws.cell(2, row).number(piece.numberTransaction);
      // ws.cell(3, row).number(piece.numberTransaction);
      ws.cell(row, 1).string(piece.fullName);
      ws.cell(row, 2).number(piece.userId);
      ws.cell(row, 3).string(piece.email);
      ws.cell(row, 4).string(piece.date);
      ws.cell(row, 5).number(piece.numberTransaction);
      ws.cell(row, 6).number(piece.numberTransactionSucceeded);
    });
    // console.log(wb);
    // console.log(ctx.locals.wb);
    let base64 = "";

    let promise = new Promise(function (resolve, reject) {
      wb.write("thong-ke-KH.xls", function (err, stats) {
        if (err) {
          console.error(err);
        } else {
          fs.readFile("thong-ke-KH.xls", "base64", function (err, data) {
            if (err) console.log(err);
            // console.log("data");
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
