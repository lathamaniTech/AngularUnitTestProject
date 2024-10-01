import { CommonModule } from "@angular/common";
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from "@angular/core";
import {
  ChartSelectionChangedEvent,
  ChartType,
  GoogleChartsModule,
  Row,
} from "angular-google-charts";
import {
  ChartConfiguration,
  ChartEventEmitOnSelect,
} from "../../Utils/ChartConfiguration";
import { TaskService } from "../../services/tasks/task.service";
import {
  DynamicFieldsConfiguration,
  DynamicFieldsData,
  SelectedFieldValueEmit,
  SetDataOption,
  testFieldData,
} from "../../Utils/DynamicFieldsConfiguration";
import { PostService } from "../../services/posts/post.service";
import { MapDataToDynamicFieldService } from "../../services/dynamicForm/map-data-to-dynamic-field.service";
import { DynamicFormComponent } from "../dynamic-form/dynamic-form.component";
import { NgChartsComponent } from "../ng-charts/ng-charts.component";

import {
  DynamicCardsConfiguration,
  NgxSuperDashboardModule,
} from "ngx-super-dashboard";

import { DynamicCardsData } from "../../Utils/CardsConfiguration";

declare const google: any;

@Component({
  selector: "app-dashboard-lend",
  standalone: true,
  imports: [
    CommonModule,
    GoogleChartsModule,
    DynamicFormComponent,
    NgChartsComponent,
    NgxSuperDashboardModule,
  ],
  templateUrl: "./dashboard-lend.component.html",
  styleUrl: "./dashboard-lend.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardLendComponent implements OnInit, AfterViewInit {
  searchFormFields: DynamicFieldsData[] = DynamicFieldsConfiguration(testFieldData);;
  columnChartType = ChartType.ComboChart;
  piChart = ChartType.PieChart;

  countCardsListData: DynamicCardsData[] = [
    { title: "Total Proposals", value: 700 },
    { title: "On Process", value: 230 },
    { title: "Sanctioned", value: 300 },
    { title: "Rejected", value: 254 },
    { title: "Opened prending for > 30 days", value: 143 },
    { title: "Disbursed", value: 120 },
  ];

  columnChartOptions = {
    myColumns: ["Year", "Retail", "Agri", "MSME", "Gold", "Corp"],

    chartOptions: {
      title: `Monthly Wise`,
      chartArea: { width: "50%" },
      hAxis: {
        title: `Modules`,
        minValue: 0,
      },
      vAxis: {
        title: "No. Of Amount",
      },
      seriesType: "bars",
      // series: { 4: { type: "line" } },
    },
  };

  pieChartOptions = {
    myColumns: [
      ["Retail", "Agri", "MSME", "GOLD", "CORP"],
      "Leads Count",
      { role: "style" },
    ],
    chartOptions: {
      title: `Sanctioned Amount`,
      chartArea: { width: "50%" },
      slices: {
        0: { color: "#622248" },
        1: { color: "#109618" },
        2: { color: "#3366cc" },
        3: { color: "red" },
        4: { color: "#ff9900" },
      },
      // hAxis: {
      //   title: `Quantity`,
      //   minValue: 0,
      // },
      // vAxis: {
      //   title: "Module",
      // },
    },
  };

  myData!: Row[];
  taskservice = inject(TaskService);

  // chartData$ = this.taskservice.fetchComboChartsData("module", true);
  chartData$ = [
    // ["Month", "Retail", "Agri", "MSME", "Gold", "CORP"],
    // ["2004/05", 165, 938, 522, 998, 450],
    // ["2005/06", 135, 1120, 599, 1268, 288],
    // ["2006/07", 157, 1167, 587, 807, 397],
    // ["2007/08", 139, 1110, 615, 968, 215],
    // ["2008/09", 136, 691, 629, 1026, 569.6],
    ["2023/05", 50, 33, 24.5, 33, 22],
    ["2024/05", 23, 41, 22.5, 22, 2],
    ["2021/05", 44, 82, 13, 43, 12],
    ["2023/05", 19, 33, 23, 21, 89],
    ["2022/05", 30, 20, 12, 34, 22],
  ];
  pieChartData$ = this.taskservice.fetchChartsData("module", true);

  branchesData = [
    {
      orgName: "Chennai",
      retail: "849",
      agri: "599",
      msme: "500",
      gold: "200",
    },
    { orgName: "Delhi", retail: "200", agri: "300", msme: "400", gold: "150" },
    { orgName: "Tnagar", retail: "849", agri: "480", msme: "250", gold: "600" },
    {
      orgName: "Poonamale",
      retail: "940",
      agri: "234",
      msme: "700",
      gold: "400",
    },
  ];

  modifiedLovData: any = {};
  allProductsSchemeDataList: any = [];
  loanTypeList: any = [];

  constructor(
    private apiService: PostService,
    private dynamicFormService: MapDataToDynamicFieldService
  ) {}

  ngOnInit() {
    this.getZoneDropDownsData();
    this.getBranchDropDownsData();
    this.getTeamsDropDownsData();
    this.getProductDropDownsData();
    this.getListOfProducts();
  }

  ngAfterViewInit() {}

  getTot(rec: any) {
    let val =
      Number(rec.retail) +
      Number(rec.agri) +
      Number(rec.gold) +
      Number(rec.msme);
    return val ? val : "";
  }
  getListOfProducts() {
    this.apiService.getDataFromLocal("geoData").subscribe((dataList: any) => {
      this.allProductsSchemeDataList =
        dataList && dataList.listofTeamProduct
          ? dataList.listofTeamProduct
          : [];

      this.allProductsSchemeDataList = this.allProductsSchemeDataList.reduce(
        (loanGroup: any, item: any) => {
          const { tpmPrdCode } = item;
          loanGroup[tpmPrdCode] = loanGroup[tpmPrdCode] || [];
          loanGroup[tpmPrdCode].push(item);
          return loanGroup;
        },
        {}
      );
      console.log(this.allProductsSchemeDataList);
    });
  }

  onSelectChart(ev: ChartEventEmitOnSelect) {
    console.log(ev);
  }

  getZoneDropDownsData() {
    // get data from extenal service for field dropdown data
    this.apiService
      .getDataFromLocal("data/zoneleadsummary")
      .subscribe((dataList: any) => {
        this.modifiedLovData.zoneList = dataList ? dataList.data : "";
        // assign lov data to dynamic field and add same properties for all dynamic field lovdata for unique select values:
        // example: {optCode:1, optDesc: 'latha'}
        if (
          this.modifiedLovData.zoneList &&
          this.modifiedLovData.zoneList.length > 0
        ) {
          this.assignFetchedLOVDataToDynamicFields("zone", "zoneList");
        }
      });
  }

  getBranchDropDownsData() {
    // get data from extenal service for field dropdown data
    this.apiService
      .getDataFromLocal("data/branchleadsummary")
      .subscribe((dataList: any) => {
        this.modifiedLovData.branchList = dataList ? dataList.data : "";
        // assign lov data to dynamic field and add same properties for all dynamic field lovdata for unique select values:
        // example: {optCode:1, optDesc: 'latha'}
        if (
          this.modifiedLovData.branchList &&
          this.modifiedLovData.branchList.length > 0
        ) {
          this.assignFetchedLOVDataToDynamicFields("branch", "branchList");
        }
      });
  }
  getTeamsDropDownsData() {
    // get data from extenal service for field dropdown data
    this.apiService
      .getDataFromLocal("data/teamsleadsummary")
      .subscribe((dataList: any) => {
        this.modifiedLovData.teamsList = dataList ? dataList.data : "";
        console.log(dataList);
        // assign lov data to dynamic field and add same properties for all dynamic field lovdata for unique select values:
        // example: {optCode:1, optDesc: 'latha'}
        if (
          this.modifiedLovData.teamsList &&
          this.modifiedLovData.teamsList.length > 0
        ) {
          this.assignFetchedLOVDataToDynamicFields("teams", "teamsList");
        }
      });
  }
  getProductDropDownsData() {
    // get data from extenal service for field dropdown data
    this.apiService
      .getDataFromLocal("data/productleadsummary")
      .subscribe((dataList: any) => {
        this.modifiedLovData.productList = dataList ? dataList.data : "";
        if (this.modifiedLovData.productList.length > 0) {
          this.assignFetchedLOVDataToDynamicFields("product", "productList");
        }
      });
  }

  assignFetchedLOVDataToDynamicFields(type: string, arraylistKey: string) {
    try {
      this.searchFormFields.forEach(async (item: DynamicFieldsData) => {
        if (item.formControlKey == type) {
          if (
            "value" in this.modifiedLovData[arraylistKey][0] &&
            "name" in this.modifiedLovData[arraylistKey][0]
          ) {
            item.lovDataList = this.modifiedLovData[arraylistKey];
          } else {
            let option: SetDataOption = {
              fetchLovData: this.modifiedLovData[arraylistKey],
              value: "usrId",
              name: "usrFirstname",
            };
            item.lovDataList = await this.dynamicFormService.setLovPropertyKeys(
              option
            );
          }
        }
      });
      console.log(this.searchFormFields);
    } catch (err) {
      console.log(err);
    }
  }

  // get selected field dropDown value and formcontrol name

  OnSelected(ev: { fieldControlName: string; selectedValue: any }) {
    if (ev.fieldControlName == "zonal") {
      let zonalOrgCode = this.modifiedLovData.listOfZonal.find((val: any) => {
        return val.value == ev.selectedValue;
      }).orgCode;
      if (zonalOrgCode) {
        let branchData = this.modifiedLovData.organisationsList.filter(
          (val: any) => {
            return val.zonalCode == zonalOrgCode;
          }
        );
        this.assignFilteredDataToChildDropdown(branchData);
      }
    }
  }

  assignFilteredDataToChildDropdown(
    filterData: Record<string, string | number | null | undefined>
  ) {
    this.searchFormFields.forEach((item: any) => {
      item.formControlKey == "branch" ? (item.lovDataList = filterData) : "";
    });
  }

  OnSearchSubmit(formData: any) {
    console.log(formData);
  }
}
