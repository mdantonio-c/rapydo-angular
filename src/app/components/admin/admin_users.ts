import {
  Component,
  ViewChild,
  TemplateRef,
  Input,
  Injector,
} from "@angular/core";

import { BasePaginationComponent } from "@rapydo/components/base.pagination.component";
import { AdminUser } from "@rapydo/types";

@Component({
  templateUrl: "admin_users.html",
})
export class AdminUsersComponent extends BasePaginationComponent<AdminUser> {
  @ViewChild("dataActive", { static: false }) public dataActive: TemplateRef<
    any
  >;
  @ViewChild("dataRoles", { static: false }) public dataRoles: TemplateRef<any>;
  @ViewChild("dataGroup", { static: false }) public dataGroup: TemplateRef<any>;
  @ViewChild("dataName", { static: false }) public dataName: TemplateRef<any>;
  @ViewChild("dataDate", { static: false }) public dataDate: TemplateRef<any>;
  @ViewChild("controlsCell", { static: false })
  public controlsCell: TemplateRef<any>;
  @ViewChild("emptyHeader", { static: false }) public emptyHeader: TemplateRef<
    any
  >;

  constructor(protected injector: Injector) {
    super(injector);

    let endpoint = "admin/users";

    // let user = this.auth.getUser();
    // if (user && user.isCoordinator && !user.isAdmin) {
    //   endpoint = "group/users";
    // }

    this.init("user", endpoint, "AdminUsers");
    this.initPaging();
    this.list();
  }

  public ngAfterViewInit(): void {
    this.columns = [];
    this.columns.push({
      name: "",
      prop: "is_active",
      cellTemplate: this.dataActive,
      flexGrow: 0.1,
    });
    this.columns.push({ name: "Email", prop: "email", flexGrow: 1.0 });
    /*this.columns.push({name: 'Name', prop: "name", flexGrow: 0.8});*/
    /*this.columns.push({name: 'Surname', prop: "surname", flexGrow: 0.8});*/
    this.columns.push({
      name: "Name",
      prop: "surname",
      flexGrow: 1.0,
      cellTemplate: this.dataName,
    });

    this.columns.push({
      name: "Group",
      prop: "group",
      cellTemplate: this.dataGroup,
      flexGrow: 0.3,
    });

    const custom = this.customization.custom_user_data();
    if (custom) {
      for (let field of custom) {
        this.columns.push(field);
      }
    }

    this.columns.push({
      name: "Roles",
      prop: "roles",
      cellTemplate: this.dataRoles,
      sortable: false,
      flexGrow: 0.9,
    });
    this.columns.push({
      name: "First<br>Login",
      prop: "first_login",
      flexGrow: 0.5,
      cellTemplate: this.dataDate,
    });
    this.columns.push({
      name: "Last<br>Login",
      prop: "last_login",
      flexGrow: 0.5,
      cellTemplate: this.dataDate,
    });
    this.columns.push({
      name: "Password<br>Change",
      prop: "last_password_change",
      flexGrow: 0.5,
      cellTemplate: this.dataDate,
    });
    this.columns.push({
      name: "controls",
      prop: "controls",
      cellTemplate: this.controlsCell,
      headerTemplate: this.emptyHeader,
      sortable: false,
      flexGrow: 0.2,
      minWidth: 60,
    });
  }

  filter(data_filter) {
    return this.unfiltered_data.filter(function (d) {
      if (d.email.toLowerCase().indexOf(data_filter) !== -1) {
        return true;
      }
      if (d.name.toLowerCase().indexOf(data_filter) !== -1) {
        return true;
      }
      if (d.surname.toLowerCase().indexOf(data_filter) !== -1) {
        return true;
      }

      return false;
    });
  }
}
