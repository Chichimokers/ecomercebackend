// Import with `const Sentry = require("@sentry/nestjs");` if you are using CJS
import * as Sentry from "@sentry/nestjs"

Sentry.init({
  dsn: process.env.DSN_sentry,
  // Set sampling rate for profiling - this is evaluated only once per SDK.init
  profileSessionSampleRate: 1.0,
});