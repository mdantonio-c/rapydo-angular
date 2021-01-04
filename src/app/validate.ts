import * as schemas from "@rapydo/../../validate.js";
import { environment } from "@rapydo/../environments/environment";

// https://stackoverflow.com/questions/6491463/accessing-nested-javascript-objects-and-arays-by-string-path
function get_value(obj: any, data_path: string): any {
  // convert indexes to properties
  data_path = data_path.replace(/\[(\w+)\]/g, ".$1");
  // strip a leading dot
  data_path = data_path.replace(/^\./, "");
  // strip a leading /
  data_path = data_path.replace(/^\//, "");

  // split on dots or slashes
  const a = data_path.split(/\.|\//);

  for (let i = 0, n = a.length; i < n; ++i) {
    let k = a[i];
    /* istanbul ignore else */
    if (k in obj) {
      obj = obj[k];
    } else {
      return;
    }
  }
  return obj;
}

export function validate(ref, data) {
  // Validation is currently not enabled in production due to limitations with CSP
  /* istanbul ignore if */
  if (environment.production) {
    return null;
  }

  const validator = schemas[ref];
  if (!validator) {
    console.warn("Validation function " + ref + " not found");
    return null;
  }

  console.warn("Validating against " + ref);
  console.warn(validator);
  const valid = validator(data);
  console.warn(valid);
  if (valid) {
    console.info("Response validated against " + ref + " schema");
    return null;
  }

  console.warn("Response does not meet " + ref + " schema");
  let errors = [];
  for (let error of validator.errors) {
    if (error.keyword === "additionalProperties") {
      const data_path =
        error.dataPath + "." + error.params["additionalProperty"];
      const value = get_value(data, data_path);
      errors.push(
        "Response contains unknown property: " + data_path + " = " + value
      );
    } else if (error.keyword === "required") {
      // Response should have required property 'xyz'
      errors.push("Response" + error.dataPath + " " + error.message);
      /* istanbul ignore else */
    } else if (error.dataPath) {
      const value = get_value(data, error.dataPath);
      errors.push(
        "Response" + error.dataPath + " = " + value + " " + error.message
      );
    } else {
      errors.push("Response " + error.message);
    }
  }
  return errors;
}
