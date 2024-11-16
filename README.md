# My First TS/React App

Following the [Next.js demo](https://nextjs.org/learn/dashboard-app) for now to get familiar with TypeScript and React.

## Partial Pre-Rendering (PPR)

Search for `experimental` and remove the config option and component flag references shown below to disable any PPR if desired.

```ts
// In next.config.mjs
const nextConfig = { experimental: { ppr: "incremental" } };

// In components etc
export const experimental_ppr = true;
```
