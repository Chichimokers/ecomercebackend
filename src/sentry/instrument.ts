// Import with `const Sentry = require("@sentry/nestjs");` if you are using CJS
import * as Sentry from "@sentry/nestjs"
import { Integrations } from '@sentry/tracing';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
Sentry.init({
    dsn: process.env.DSN_sentry, 
    integrations: [
        nodeProfilingIntegration(), // Integración para el perfilado
        // Otras integraciones si las hay
      ],// Tu DSN de Sentry Cloud
    tracesSampleRate: 0.5, // % de transacciones capturadas (0.5 = 50%)
    environment: process.env.NODE_ENV || "development",
  });