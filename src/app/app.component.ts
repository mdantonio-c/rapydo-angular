import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { DeviceDetectorService } from 'ngx-device-detector';

import { environment } from '@rapydo/../environments/environment';

import { AuthService } from '@rapydo/services/auth';
import { ApiService} from '@rapydo/services/api';
import { NavbarComponent } from '@rapydo/components/navbar/navbar';
import { NotificationService} from '@rapydo/services/notification';
import { ProjectOptions } from '@app/custom.project.options';

@Component({
  selector: 'rapydo',
  providers: [AuthService, ApiService, NavbarComponent],
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit {

  @ViewChild('cookieLaw', { static: false }) private cookieLawEl: any;
  // public loading: boolean = false;
  // public user: any;

  public cookieLawText:string;
  public cookieLawButton:string;


  constructor(
      public api: ApiService,
      private auth: AuthService,
      private titleService: Title,
      private customization: ProjectOptions,
      private notify: NotificationService,
      private deviceService: DeviceDetectorService
      ) {

    //this.loading = true;

    this.cookieLawText = this.customization.get_option('cookie_law_text');
    this.cookieLawButton = this.customization.get_option('cookie_law_button');

    let deviceInfo = deviceService.getDeviceInfo();

    let browser = deviceInfo.browser;
    let version =deviceInfo.browser_version;
    let os = deviceInfo.os;
    let os_version = deviceInfo.os_version;
    let compatibilityCheck = this.checkCompatibility(browser, version, os, os_version);

    console.log(browser + " (" + version + ") on " + os + " (" + os_version + ")");

    if (deviceService.isMobile()) {
      console.log("Running on mobile with compatibility = " + compatibilityCheck);
    }
    if (deviceService.isTablet()) {
      console.log("Running on tablet with compatibility = " + compatibilityCheck);
    }
    if (deviceService.isDesktop()) {
      console.log("Running on desktop with compatibility = " + compatibilityCheck);
    }

    if (!compatibilityCheck) {
      this.notify.showError("You are using "+browser+" "+version+" on "+os+". We apologize, but your browser is not fully compatible with this website and some or all functionalities may not work.");
    }

  }
  private checkCompatibility(browser, version, os, os_version) {
    if (browser == 'IE') {
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

}
