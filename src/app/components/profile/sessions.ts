import {
  Component,
  ViewChild,
  TemplateRef,
  Input,
  Injector,
} from "@angular/core";

import { Session } from "@rapydo/types";
import { ExcelService } from "@rapydo/services/excel";

import { BasePaginationComponent } from "@rapydo/components/base.pagination.component";

import { environment } from "@rapydo/../environments/environment";
import * as moment from "moment";

@Component({
  templateUrl: "sessions.html",
})
export class SessionsComponent extends BasePaginationComponent<Session> {
  @ViewChild("dataToken", { static: false }) public dataToken: TemplateRef<any>;
  @ViewChild("dataDate", { static: false }) public dataDate: TemplateRef<any>;
  @ViewChild("dataRevoke", { static: false }) public revoke: TemplateRef<any>;

  public currentToken: string;

  constructor(protected injector: Injector, private excel: ExcelService) {
    super(injector);
    this.init("token", "/auth/tokens", "Sessions");
    this.initPaging();
    this.list();

    this.currentToken = this.auth.getToken();
  }

  public ngAfterViewInit(): void {
    this.columns = [];
    this.columns.push({ name: "IP", prop: "IP", flexGrow: 0.5 });
    this.columns.push({ name: "Location", prop: "location", flexGrow: 0.5 });
    this.columns.push({
      name: "Emitted",
      prop: "emitted",
      flexGrow: 0.5,
      cellTemplate: this.dataDate,
    });
    this.columns.push({
      name: "Last access",
      prop: "last_access",
      flexGrow: 0.5,
      cellTemplate: this.dataDate,
    });
    this.columns.push({
      name: "Expiration",
      prop: "expiration",
      flexGrow: 0.5,
      cellTemplate: this.dataDate,
    });
    this.columns.push({
      name: "Close",
      prop: "id",
      flexGrow: 0.2,
      cellTemplate: this.revoke,
    });
    this.columns.push({
      name: "Copy",
      prop: "token",
      flexGrow: 0.2,
      cellTemplate: this.dataToken,
    });
  }

  filter(data_filter) {
    return this.unfiltered_data.filter(function (d) {
      if (d.IP !== null && d.IP.toLowerCase().indexOf(data_filter) !== -1) {
        return true;
      }
      if (
        d.location !== null &&
        d.location.toLowerCase().indexOf(data_filter) !== -1
      ) {
        return true;
      }
      if (d.token.toLowerCase().indexOf(data_filter) !== -1) {
        return true;
      }

      return false;
    });
  }

  /* istanbul ignore next */
  public copied(event) {
    if (event["isSuccess"]) {
      this.notify.showSuccess("Token successfully copied");
    }
  }

  download() {
    const m = moment().format("YYYYMMDD_HHmmss");
    const filename = `${environment.projectName}_sessions_${m}.xlsx`;

    const headers = [
      "IP",
      "Location",
      "Emitted",
      "Last access",
      "Expiration",
      "Token",
    ];
    let download_data = [];

    for (let t of this.unfiltered_data) {
      download_data.push([
        t["IP"],
        t["location"],
        { t: "d", v: moment(t["emitted"]).format("YYYY-MM-DD HH:mm:ss") },
        { t: "d", v: moment(t["last_access"]).format("YYYY-MM-DD HH:mm:ss") },
        { t: "d", v: moment(t["expiration"]).format("YYYY-MM-DD HH:mm:ss") },
        t["token"],
      ]);
    }

    const workbook = this.excel.createWorkbook();
    this.excel.addWorksheet(workbook, "Sessions", headers, download_data);
    this.excel.saveAs(workbook, filename);
  }
}
