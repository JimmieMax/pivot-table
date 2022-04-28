import { PivotTable } from "./pivot-table";
import { expect } from "chai";
import { describe, it } from "mocha";
const simpleDataA = [
  {
    showId: "2",
    showName: "项目2",
    sessionId: "a",
    sessionName: "场次-a",
    orderDate: "2022-4-1",
    ticketNo: 160,
    ticketPrice: 1000,
  },
  {
    showId: "1",
    showName: "项目1",
    sessionId: "b",
    sessionName: "场次-b",
    orderDate: "2022-4-1",
    ticketNo: 110,
    ticketPrice: 800,
  },
  {
    showId: "1",
    showName: "项目1",
    sessionId: "a",
    sessionName: "场次-a",
    orderDate: "2022-4-2",
    ticketNo: 100,
    ticketPrice: 900,
  },
  {
    showId: "2",
    showName: "项目2",
    sessionId: "a",
    sessionName: "场次-a",
    orderDate: "2022-4-1",
    ticketNo: 200,
    ticketPrice: 2000,
  },
  {
    showId: "0",
    showName: "项目",
    sessionId: "c",
    sessionName: "场次-c",
    orderDate: "2022-4-2",
    ticketNo: 222,
    ticketPrice: 888,
  },
];
describe("PivotTable", () => {
  const statistic = new PivotTable(simpleDataA, {
    dimensionRows: [
      {
        id: "showId",
        key: "showName",
        display: "项目",
      },
      {
        id: "sessionId",
        key: "sessionName",
        display: "场次",
      },
    ],
    dimensionColumns: [
      {
        id: "orderDate",
        key: "orderDate",
        display: "日期",
      },
    ],
    statisticKeys: [
      {
        key: "ticketNo",
        display: "张数",
        calculate: "mean",
      },
      {
        key: "ticketPrice",
        display: "实际金额",
      },
    ],
    headerFieldNames: {
      display: "title",
      dataKey: "dataIndex",
    },
    defaultStatisticValue: "-",
    needSort: true,
  });
  it("should pivotTable to table result", () => {
    expect(statistic.header).to.deep.equal([
      {
        dataIndex: "showName",
        key: "showName",
        title: "项目",
      },
      {
        dataIndex: "sessionName",
        key: "sessionName",
        title: "场次",
      },
      {
        children: [
          {
            dataIndex: "[orderDate][2022-4-1][ticketNo]",
            key: "[orderDate][2022-4-1][ticketNo]",
            title: "张数",
          },
          {
            dataIndex: "[orderDate][2022-4-1][ticketPrice]",
            key: "[orderDate][2022-4-1][ticketPrice]",
            title: "实际金额",
          },
        ],
        key: "[orderDate][2022-4-1]",
        title: "2022-4-1",
      },
      {
        children: [
          {
            dataIndex: "[orderDate][2022-4-2][ticketNo]",
            key: "[orderDate][2022-4-2][ticketNo]",
            title: "张数",
          },
          {
            dataIndex: "[orderDate][2022-4-2][ticketPrice]",
            key: "[orderDate][2022-4-2][ticketPrice]",
            title: "实际金额",
          },
        ],
        key: "[orderDate][2022-4-2]",
        title: "2022-4-2",
      },
    ]);
    expect(statistic.data).to.deep.equal([
      {
        "[orderDate][2022-4-1][ticketNo]": "-",
        "[orderDate][2022-4-1][ticketPrice]": "-",
        "[orderDate][2022-4-2][ticketNo]": 222,
        "[orderDate][2022-4-2][ticketPrice]": 888,
        sessionId: "c",
        sessionName: "场次-c",
        showId: "0",
        showName: "项目",
      },
      {
        "[orderDate][2022-4-1][ticketNo]": "-",
        "[orderDate][2022-4-1][ticketPrice]": "-",
        "[orderDate][2022-4-2][ticketNo]": 100,
        "[orderDate][2022-4-2][ticketPrice]": 900,
        sessionId: "a",
        sessionName: "场次-a",
        showId: "1",
        showName: "项目1",
      },
      {
        "[orderDate][2022-4-1][ticketNo]": 110,
        "[orderDate][2022-4-1][ticketPrice]": 800,
        "[orderDate][2022-4-2][ticketNo]": "-",
        "[orderDate][2022-4-2][ticketPrice]": "-",
        sessionId: "b",
        sessionName: "场次-b",
        showId: "1",
        showName: "项目1",
      },
      {
        "[orderDate][2022-4-1][ticketNo]-count": 2,
        "[orderDate][2022-4-1][ticketNo]": 180,
        "[orderDate][2022-4-1][ticketPrice]": 3000,
        "[orderDate][2022-4-2][ticketNo]": "-",
        "[orderDate][2022-4-2][ticketPrice]": "-",
        sessionId: "a",
        sessionName: "场次-a",
        showId: "2",
        showName: "项目2",
      },
    ]);
  });
});
