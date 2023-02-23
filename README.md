# Create T3 App

This is a highly opinionated version of a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.

It is configured to use MongoDB, JWTs for auth, and vitest + supertest for testing. It also includes extra TS goodies such as `@total-typescript/ts-reset` and other overrides.

## IMPORTANT NOTES

- This template includes an opinionated `prettier.config.cjs` which inserts semi-colons, avoids arrow parenthesis, and adds trailing commas.
- If you are familiar with the usual T3 setup, note that the tRPC client exported as `api` from `src/utils/api.ts` is now exported from `src/client/sdk.ts` as `sdk`.

## What's next? How do I make an app with this?

If you are not familiar with the different technologies used in this project, please refer to the respective docs. If you still are in the wind, please join the [T3 Discord](https://t3.gg/discord) and ask for help.

- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)

## Learn More

To learn more about the [T3 Stack](https://create.t3.gg/), take a look at the following resources:

- [Documentation](https://create.t3.gg/)
- [Learn the T3 Stack](https://create.t3.gg/en/faq#what-learning-resources-are-currently-available) — Check out these awesome tutorials

You can check out the [create-t3-app GitHub repository](https://github.com/t3-oss/create-t3-app) — your feedback and contributions are welcome!

## How do I deploy this?

Follow our deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel), [Netlify](https://create.t3.gg/en/deployment/netlify) and [Docker](https://create.t3.gg/en/deployment/docker) for more information.
