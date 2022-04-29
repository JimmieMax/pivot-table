
# PivotTable Algorithm 数据透视表算法

Analyze the statistics by different dimensions.

## Ability

> Support row dimensions;
> Support column dimensions;
> Support sorting;
> Support column dimensions;
> Support statistic dimensions;
> Support statistic calculate mode;
> Support reset default value;

## Config/Options

dimensionRows

``` javascript
dimensionRows: [{
  id: "productId", // 字段唯一值
  key: "productName", // 展示值
  display: "商品", // 维度展示值
}]
```

dimensionColumns

``` javascript
dimensionColumns: [
  {
    id: "productId", // 字段唯一值
    key: "productName", // 展示字段值
    display: "商品", // 维度展示值
  },
]
```

statisticKeys

``` javascript
statisticKeys: [
  {
    key: "quantity", // 展示字段值
    display: "数量", // 维度展示值
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
      productId: "2",
      productName: "商品2",
      colorNumber: "a",
      colorName: "颜色-a",
      orderDate: "2022-4-1",
      quantity: 160,
      price: 1000,
    },
    {
      productId: "1",
      productName: "商品1",
      colorNumber: "b",
      colorName: "颜色-b",
      orderDate: "2022-4-1",
      quantity: 110,
      price: 800,
    },
    {
      productId: "1",
      productName: "商品1",
      colorNumber: "a",
      colorName: "颜色-a",
      orderDate: "2022-4-2",
      quantity: 100,
      price: 900,
    },
    {
      productId: "2",
      productName: "商品2",
      colorNumber: "a",
      colorName: "颜色-a",
      orderDate: "2022-4-1",
      quantity: 200,
      price: 2000,
    },
    {
      productId: "0",
      productName: "商品",
      colorNumber: "c",
      colorName: "颜色-c",
      orderDate: "2022-4-2",
      quantity: 222,
      price: 888,
    },
  ];
  const statistic = new PivotTable(simpleData, {
    dimensionRows: [
      {
        id: "productId",
        key: "productName",
        display: "商品",
      },
      {
        id: "colorNumber",
        key: "colorName",
        display: "颜色",
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
        key: "quantity",
        display: "数量",
        calculate: "mean",
      },
      {
        key: "price",
        display: "价格",
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
    header: [
      {
        dataIndex: "productName",
        key: "productName",
        title: "商品",
      },
      {
        dataIndex: "colorName",
        key: "colorName",
        title: "颜色",
      },
      {
        children: [
          {
            dataIndex: "[orderDate][2022-4-1][quantity]",
            key: "[orderDate][2022-4-1][quantity]",
            title: "数量",
          },
          {
            dataIndex: "[orderDate][2022-4-1][price]",
            key: "[orderDate][2022-4-1][price]",
            title: "价格",
          },
        ],
        key: "[orderDate][2022-4-1]",
        title: "2022-4-1",
      },
      {
        children: [
          {
            dataIndex: "[orderDate][2022-4-2][quantity]",
            key: "[orderDate][2022-4-2][quantity]",
            title: "数量",
          },
          {
            dataIndex: "[orderDate][2022-4-2][price]",
            key: "[orderDate][2022-4-2][price]",
            title: "价格",
          },
        ],
        key: "[orderDate][2022-4-2]",
        title: "2022-4-2",
      },
    ],
    data: [
      {
        "[orderDate][2022-4-1][quantity]": "-",
        "[orderDate][2022-4-1][price]": "-",
        "[orderDate][2022-4-2][quantity]": 222,
        "[orderDate][2022-4-2][price]": 888,
        colorNumber: "c",
        colorName: "颜色-c",
        productId: "0",
        productName: "商品",
      },
      {
        "[orderDate][2022-4-1][quantity]": "-",
        "[orderDate][2022-4-1][price]": "-",
        "[orderDate][2022-4-2][quantity]": 100,
        "[orderDate][2022-4-2][price]": 900,
        colorNumber: "a",
        colorName: "颜色-a",
        productId: "1",
        productName: "商品1",
      },
      {
        "[orderDate][2022-4-1][quantity]": 110,
        "[orderDate][2022-4-1][price]": 800,
        "[orderDate][2022-4-2][quantity]": "-",
        "[orderDate][2022-4-2][price]": "-",
        colorNumber: "b",
        colorName: "颜色-b",
        productId: "1",
        productName: "商品1",
      },
      {
        "[orderDate][2022-4-1][quantity]-count": 2,
        "[orderDate][2022-4-1][quantity]": 180,
        "[orderDate][2022-4-1][price]": 3000,
        "[orderDate][2022-4-2][quantity]": "-",
        "[orderDate][2022-4-2][price]": "-",
        colorNumber: "a",
        colorName: "颜色-a",
        productId: "2",
        productName: "商品2",
      },
    ]
}
```
