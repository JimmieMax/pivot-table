
# PivotTable Algorithm 数据透视表

Analyze the statistics by different dimensions.

## Ability

> Support row dimensions;
> Support row dimension group sorting;
> Suport column dimensions;
> Support statistic dimensions;
> Support statistic calculate mode;
> Support reset default value;

## Config/Options

dimensionRows

``` javascript
dimensionRows: [{
  id: "showId", // 字段唯一值
  key: "showName", // 展示值
  display: "演出", // 维度展示值
}]
```

dimensionColumns

``` javascript
dimensionColumns: [
  {
    id: "showId", // 字段唯一值
    key: "showName", // 展示字段值
    display: "演出", // 维度展示值
  },
]
```

statisticKeys

``` javascript
statisticKeys: [
  {
    key: "ticketNo", // 展示字段值
    display: "张数", // 维度展示值
    calclate: 'sum' // 计算方式：累加
  },
  {
    key: "price",
    display: "价格",
    calclate: 'mean' // 计算方式：平均
  }
]
```

headerFieldNames

``` javascript
headerFieldNames: {
  display: 'title', // 维度展示值
  dataKey: 'dataIndex' // 展示字段值
}
```

defaultStatisticValue

``` javascript
defaultStatisticValue: '-' // 空值默认值
```

needSort

``` javascript
needSort: true // row dimension 列默认不排序，为true时会为row dimension排序
```

## Demo

If your business involves some shows and you want to analyze the sale statistics by different dimensions. you can try the following call:

``` javascript
  const simpleData = [
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
  const statistic = new PivotTable(simpleData, {
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
```

The output dataset like bottom.

``` js
{
    header: [{
        key: 'showName',
        display: '项目',
        dataKey: 'showName',
    }, {
        key: 'showSessionName',
        display: '场次',
        dataKey: 'showSessionName',
    }, {
        key: '[orderDate][3-28]',
        display: '3-28',
        children: [{
            key: '[orderDate][3-28][saleMerchant][sma]'
            display: '分销商-a',
            children: [{
                key: '[orderDate][3-28][saleMerchant][sma][ticketNo]'
                display: '张数'
                dataKey: '[orderDate][3-28][saleMerchant][sma][ticketNo]',
            }, {
                dataKey: '[orderDate][3-28][saleMerchant][sma][realPrice]',
                display: '真实票价'
            }]
        }]
    }],
    data: [{
        showName: '项目1'
    }]
}
```

### 性能压力方向猜想

> sql
> algorithm
> table

### 其它问题

## 测试

xhr time: 995.53ms;(待详细测试)

### 3个行维度，2个列维度，4个值维度

> 500条数据 运行结果

pivot table time: 7.3 ms

> 1000条数据 运行结果

pivot table time: 27.8 ms

> 2000条

pivot table time: 95.8 ms

> 5000条 页面崩溃
> 10000条 页面崩溃
