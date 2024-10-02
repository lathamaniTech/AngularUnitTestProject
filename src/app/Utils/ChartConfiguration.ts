export const ChartConfiguration: ChartConfig = {
  Colors: ["#b87333", "silver", "gold", "#e5e4e2", "yellow", "#434343", "#777"],

  SearchCriterias: ["zone", "branch", "teams", "product"],
};

export interface ChartConfig {
  Colors?: string[];
  SearchCriterias: string[];
}

export interface ChartEventEmitOnSelect {
  ev: any;
  chartType: string;
}

export interface ChartEventValue {
  row: number | null;
  column: number | null;
}

export interface DashardCardConfig {
  type: any | string;
  chartOptionData: ChartOptionsConfig;
  chartData: any[];
  cardTitle?: string;
  className?: string;
}

export interface ChartOptionsConfig {
  myColumns: any[];
  chartOptions: ChartAxisData;
}

export interface ChartAxisData {
  title: string;
  chartArea: { width?: string | number; height?: string | number };
  slices?: object | null;
  hAxis?: AxisVlaues;
  vAxis?: AxisVlaues;
  seriesType?: string;
  series?: object | null;
}

export interface AxisVlaues {
  title?: string;
  minValue?: number;
}

export interface CardTableDataConfig {
  cardTitle?: string;
  tableColumnHeadings: string[];
  tableDataKey: string[];
  tableData: any[];
  className?: string;
}
