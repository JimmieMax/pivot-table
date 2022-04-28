// 输入维度模型
export interface InputDimension {
  id: string;
  key: string;
  display: string;
}

// 模版节点字段名
export interface HeaderFieldNames {
  key: string;
  display: string;
  dataKey: string;
  children: string;
}

// 模版节点模型
export interface HeaderDimension {
  // key: string,
  // display: string | number,
  // dataKey?: string,
  // children?: HeaderDimension[]
  [key: string]: any;
}

// 数据模型
export interface StatisticKey {
  key: string;
  display: string;
  calculate?: "sum" | "mean";
}

// 输出组数据
export interface Group {
  [key: string]: string | number;
}

// 模版记录Map
interface HeaderColumnMap {
  [key: string]: HeaderDimension;
}

export class PivotTable {
  private dimensionRows: InputDimension[] = [];

  private dimensionColumns: InputDimension[] = [];

  private statisticKeys: Array<StatisticKey> = [];

  private headerColumnMap: HeaderColumnMap = {};

  private headerFieldNames: HeaderFieldNames = {
    key: "key",
    display: "display",
    dataKey: "dataKey",
    children: "children",
  };

  private defaultStatisticGroup: Group = {};

  private defaultStatisticValue: string | number = 0;

  private originalData: Record<string, unknown>[];

  private needSort = false;

  public header: HeaderDimension[] = [];

  public data: Group[] = [];

  /**
   * 初始化数据并直接计算结果
   * @param data
   * @param options
   */
  constructor(
    data: Record<string, unknown>[],
    options: {
      statisticKeys: Array<InputDimension | StatisticKey>;
      dimensionRows: InputDimension[];
      dimensionColumns?: InputDimension[];
      headerFieldNames?: {
        key?: string;
        display?: string;
        dataKey?: string;
        children?: string;
      };
      defaultStatisticValue?: string | number;
      needSort?: boolean;
    }
  ) {
    const {
      statisticKeys,
      dimensionRows,
      dimensionColumns,
      headerFieldNames,
      defaultStatisticValue,
      needSort,
    } = options;
    if (!dimensionRows?.length) {
      throw new Error("Error: dimensionRows can not be empty!");
    }
    if (!statisticKeys?.length) {
      throw new Error("Error: statisticKeys can not be empty!");
    }
    if (headerFieldNames) {
      this.headerFieldNames = {
        ...this.headerFieldNames,
        ...headerFieldNames,
      } as HeaderFieldNames;
    }
    if (defaultStatisticValue !== undefined) {
      this.defaultStatisticValue = defaultStatisticValue;
    }
    if (needSort) {
      this.needSort = true;
    }
    this.dimensionRows = dimensionRows;
    this.dimensionColumns = dimensionColumns ?? [];
    this.statisticKeys = statisticKeys;
    this.originalData = data;
    this.organize();
  }

  /**
   * 组织数据结构
   * @param originalData
   */
  private organize() {
    // 1.init header row template;
    this.initHeaderRows();
    // 2.organize original data;
    this.grouping();
    // 3.Insert default statistic;
    this.insertDefaultStatistic();
  }

  /**
   * 初始化header模版行维度
   */
  private initHeaderRows() {
    const {
      key: fieldKey,
      display: fieldDisplay,
      dataKey: fieldDataKey,
    } = this.headerFieldNames;
    // Init header row dimension
    this.dimensionRows.forEach(({ key, display }) => {
      // Init header row dimension
      this.header.push({
        [fieldKey]: key,
        [fieldDisplay]: display,
        [fieldDataKey]: key,
      });
    });
  }

  /**
   * 组织基本数据
   * @param originalData
   */
  private grouping() {
    if (this.needSort) {
      this.sortGrouping();
    } else {
      this.normalGrouping();
    }
  }

  private normalGrouping() {
    let currentGroup: Group | null = null;
    let i = 0;
    while (i < this.originalData.length) {
      const record = this.originalData[i];
      if (!currentGroup) {
        currentGroup = this.createNewGroup({}, record);
        i++;
      } else {
        const isSameGroup = this.isSameGroup(currentGroup, record);
        if (isSameGroup) {
          this.createColumn(currentGroup, record);
          i++;
        } else {
          // 把上一组数据加入groups，继续循环
          this.data.push(currentGroup);
          currentGroup = null;
        }
      }
    }
    // 最后一个不要漏了
    if (currentGroup) {
      this.data.push(currentGroup);
    }
  }

  private sortGrouping() {
    const groupMap: { [key: string]: Group } = {};
    let currentGroup: Group | null = null;
    let i = 0;
    while (i < this.originalData.length) {
      const record = this.originalData[i];
      const groupMapKey = this.dimensionRows.reduce(
        (last, { id }) => `${last ? `${last}>` : ""}${record[id]}`,
        ""
      );
      currentGroup = groupMap[groupMapKey];
      if (!currentGroup) {
        currentGroup = this.createNewGroup({}, record);
        const insertIndex = this.findInsertGroupIndex(currentGroup);
        groupMap[groupMapKey] = currentGroup;
        this.data.splice(insertIndex, 0, currentGroup);
      } else {
        this.createColumn(currentGroup, record);
      }
      i++;
    }
  }

  private findInsertGroupIndex(insertGroup: Group): number {
    let i = 0;
    let currentRowDimensionIndex = 0;
    while (i < this.data.length) {
      const currentRowDimensionKey =
        this.dimensionRows[currentRowDimensionIndex].key;
      const currentGroupDisplay = String(
        this.data[i][currentRowDimensionKey]
      ).toUpperCase();
      const insertGroupDisplay = String(
        insertGroup[currentRowDimensionKey]
      ).toUpperCase();
      if (insertGroupDisplay < currentGroupDisplay) {
        break;
      }
      if (insertGroupDisplay === currentGroupDisplay) {
        currentRowDimensionIndex++;
      } else {
        i++;
        currentRowDimensionIndex = 0;
      }
    }
    return i;
  }

  /**
   * 创建一个新的组
   * @param group
   * @param record
   * @returns
   */
  private createNewGroup(group: Group, record: Record<string, unknown>): Group {
    this.createRow(group, record);
    this.createColumn(group, record);
    return group;
  }

  /**
   * 创建列维度模版及数据
   * @param group
   * @param record
   */
  private createRow(group: Group, record: Record<string, unknown>) {
    this.dimensionRows.forEach(({ id, key, display }) => {
      // Init group row key-value
      if (group[id] === undefined) {
        group[id] = record[id] as string | number;
        group[key] = record[key] as string | number;
      }
    });
  }

  /**
   * 创建列维度模版及数据
   * @param group
   * @param record
   */
  private createColumn(group: Group, record: Record<string, unknown>) {
    const {
      key: fieldKey,
      display: fieldDisplay,
      children: fieldChildren,
    } = this.headerFieldNames;
    let i = 0;
    let currentList = this.header;
    let parent: HeaderDimension | null = null;
    if (this.dimensionColumns.length === 0) {
      this.createStatisticColumn(parent, group, record);
    }
    while (i < this.dimensionColumns.length) {
      const { id, key } = this.dimensionColumns[i];
      const display = record[key] as string | number;
      const currentKey = `${parent ? `${parent[fieldKey]}` : ""}[${key}][${
        record[id]
      }]` as string;
      let current: HeaderDimension = this.headerColumnMap[currentKey];
      if (!current) {
        current = {
          [fieldKey]: currentKey,
          [fieldDisplay]: display,
          [fieldChildren]: [],
        };
        this.headerColumnMap[currentKey] = current;
        const insertIndex = this.findInsertIndex(currentList, current);
        currentList.splice(insertIndex, 0, current);
      }
      if (i === this.dimensionColumns.length - 1) {
        // 如果是叶子结点，更新数据
        this.createStatisticColumn(current, group, record);
        break;
      }
      i++;
      parent = current;
      currentList = parent[fieldChildren] as HeaderDimension[];
    }
  }

  /**
   * 创建值维度
   * @param parent
   * @param group
   * @param record
   */
  private createStatisticColumn(
    parent: HeaderDimension | null,
    group: Group,
    record: Record<string, unknown>
  ) {
    const {
      key: fieldKey,
      display: fieldDisplay,
      children: fieldChildren,
      dataKey: fieldDataKey,
    } = this.headerFieldNames;
    const parentKey = parent ? parent[fieldKey] : "";
    const children = parent ? parent[fieldChildren] : this.header;
    this.statisticKeys.forEach(({ key: statisticKey, display, calculate }) => {
      const dataKey = `${parentKey}[${statisticKey}]`;
      if (
        (parent && children.length < this.statisticKeys.length) ||
        (!parent &&
          children.length <
            this.dimensionRows.length + this.statisticKeys.length)
      ) {
        children.push({
          [fieldKey]: dataKey,
          [fieldDisplay]: display,
          [fieldDataKey]: dataKey,
        });
      }
      if (group[dataKey] !== undefined) {
        this.updateStatistic(group, record[statisticKey], dataKey, calculate);
      } else {
        this.insertStatistics(group, record[statisticKey], dataKey);
      }
    });
  }

  /**
   * 插入数据
   * @param group
   * @param statisticValue
   * @param dataKey
   */
  private insertStatistics(
    group: Group,
    statisticValue: number | unknown,
    dataKey: string
  ) {
    this.defaultStatisticGroup[dataKey] = this.defaultStatisticValue;
    group[dataKey] = Number(statisticValue);
  }

  /**
   * 更新数据
   * @param group
   * @param statisticValue
   * @param dataKey
   * @param calculate
   */
  private updateStatistic(
    group: Group,
    statisticValue: number | unknown,
    dataKey: string,
    calculate = "sum"
  ) {
    const sum = Number(group[dataKey]) + Number(statisticValue);
    if (calculate === "sum") {
      group[dataKey] = sum;
    } else if (calculate === "mean") {
      const countFieldName = `${dataKey}-count`;
      if (group[countFieldName]) {
        (group[countFieldName] as number)++;
      } else {
        group[countFieldName] = 2;
      }
      group[dataKey] = sum / Number(group[countFieldName]);
    }
  }

  /**
   * 查找插入点索引
   * @param list
   * @param insertItem
   * @returns
   */
  private findInsertIndex(
    list: HeaderDimension[],
    insertItem: HeaderDimension
  ) {
    const { display: fieldDisplay } = this.headerFieldNames;
    const newList =
      list === this.header ? list.slice(this.dimensionRows.length) : list;
    let insertIndex = 0;
    if (newList.length) {
      insertIndex = newList.findIndex((item) => {
        const itemString = String(item[fieldDisplay]).toUpperCase(); // ignore upper and lowercase
        const insertItemString = String(insertItem[fieldDisplay]).toUpperCase();
        if (insertItemString <= itemString) {
          return true;
        }
        return false;
      });
      if (insertIndex === -1) {
        insertIndex = newList.length;
      }
    }
    if (list === this.header) {
      insertIndex += this.dimensionRows.length;
    }
    return insertIndex;
  }

  /**
   * 判断是否是同一个组的数据
   * @param saleModel
   * @returns
   */
  private isSameGroup(group: Group, record: Record<string, unknown>): boolean {
    return this.dimensionRows.every(({ id }) => group[id] === record[id]);
  }

  /**
   * 插入默认数据
   */
  private insertDefaultStatistic() {
    this.data = this.data.map((item) => ({
      ...this.defaultStatisticGroup,
      ...item,
    }));
  }
}
