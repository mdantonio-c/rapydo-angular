import { environment as base } from "/tmp/environment.variables";

export const environment = {
  production: true,
  apiUrl: base.apiUrl,
  authApiUrl: base.authApiUrl,
  projectVersion: base.projectVersion,
  rapydoVersion: base.rapydoVersion,
  projectTitle: base.projectTitle,
  projectDescription: base.projectDescription,
  enableFooter: base.enableFooter,
  allowRegistration: base.allowRegistration,
  allowPasswordReset: base.allowPasswordReset,
  allowTermsOfUse: base.allowTermsOfUse,
  websocketsUrl: base.websocketsUrl,
  SENTRY_URL: base.SENTRY_URL,
  GA_TRACKING_CODE: base.GA_TRACKING_CODE,
  ALL: {},
};

for (let key in base) {
  environment["ALL"][key] = base[key];
}
