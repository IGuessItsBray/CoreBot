// Import with `import * as Sentry from "@sentry/node"` if you are using ESM
const Sentry = require("@sentry/node");
const { nodeProfilingIntegration } = require("@sentry/profiling-node");

Sentry.init({
  dsn: "https://9e4eb9f47d50a4185dc54d27a49202a8@o4504280228626432.ingest.us.sentry.io/4507334278971392",
  integrations: [nodeProfilingIntegration()],
  // Performance Monitoring
  tracesSampleRate: 1.0, //  Capture 100% of the transactions

  // Set sampling rate for profiling - this is relative to tracesSampleRate
  profilesSampleRate: 1.0,


});
Sentry.startSpan(
  {
    op: "test",
    name: "My First Test Span",
  },
  () => {
    try {
      foo();
    } catch (e) {
      Sentry.captureException(e);
    }
  }
);
