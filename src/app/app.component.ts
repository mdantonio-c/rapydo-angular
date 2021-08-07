import { Component, OnInit, ViewChild } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { DeviceDetectorService } from "ngx-device-detector";

import { environment } from "@rapydo/../environments/environment";

import { AuthService } from "@rapydo/services/auth";
import { ApiService } from "@rapydo/services/api";
import { NavbarComponent } from "@rapydo/components/navbar/navbar";
import { NotificationService } from "@rapydo/services/notification";
import { ProjectOptions } from "@app/customization";

@Component({
  selector: "rapydo",
  templateUrl: "app.component.html",
})
export class AppComponent implements OnInit {
  @ViewChild("cookieLaw", { static: false }) private cookieLawEl: any;

  public cookieLawText: string;
  public cookieLawButton: string;
  public enableFooter: boolean = false;

  constructor(
    public api: ApiService,
    private auth: AuthService,
    private titleService: Title,
    private customization: ProjectOptions,
    private notify: NotificationService,
    private deviceService: DeviceDetectorService
  ) {
    this.enableFooter = environment.enableFooter;
    this.cookieLawText = this.customization.cookie_law_text();
    this.cookieLawButton = this.customization.cookie_law_button();

    let deviceInfo = deviceService.getDeviceInfo();

    let browser = deviceInfo.browser;
    let version = deviceInfo.browser_version;
    let os = deviceInfo.os;
    let os_version = deviceInfo.os_version;
    let compatibilityCheck = this.checkCompatibility(
      browser,
      version,
      os,
      os_version
    );

    let device = "";

    /* istanbul ignore if */
    if (deviceService.isMobile()) {
      device = "mobile";
    }
    /* istanbul ignore if */
    if (deviceService.isTablet()) {
      device = "tablet";
    }
    /* istanbul ignore else */
    if (deviceService.isDesktop()) {
      device = "desktop";
    }

    console.info(
      browser +
        " (" +
        version +
        ") on " +
        os +
        " " +
        device +
        " (" +
        os_version +
        ")"
    );

    /* istanbul ignore if */
    if (!compatibilityCheck) {
      this.notify.showError(
        "You are using " +
          browser +
          " " +
          version +
          " on " +
          os +
          ". We apologize, but your browser is not fully compatible with this website and some or all functionalities may not work."
      );
    }
  }
  private checkCompatibility(
    browser: string,
    version: string,
    os: string,
    os_version: string
  ): boolean {
    /* istanbul ignore if */
    if (browser === "IE") {
      if (parseFloat(version) <= 10) {
        return false;
      }
    }
    return true;
  }

  public ngOnInit(): void {
    let t = environment.projectTitle;
    t = t.replace(/^'/, "");
    t = t.replace(/'$/, "");
    this.titleService.setTitle(t);
  }

  public dismissCookieLaw(): void {
    this.cookieLawEl.dismiss();
  }

  public refresh(): void {
    window.location.reload();
  }
}
