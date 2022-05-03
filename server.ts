import "./fetch-polyfill.js";
import express from "express";
// import * as trpc from "@trpc/server";
// import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
	createContext,
	createRouter,
	getNodeTypeParams,
	port,
} from "./utils";
import * as trpcExpress from "@trpc/server/adapters/express";
import { say_hello } from "./client";

export const appRouter = createRouter().query("hello", {
	input: z.string().nullish(),
	resolve: ({ input, ctx }) => {
		return `hello ${input ?? ctx.user?.name ?? "world"}`;
	},
});

const app = express();

app.use(
	"/trpc",
	trpcExpress.createExpressMiddleware({
		router: appRouter,
		createContext,
	})
);

app.get("/", (_req, res) => {
	res.send("Hello from apod");
});

(function run() {
	const [nodeType, _bootPort] = getNodeTypeParams();
	app.listen(port, async () => {
		console.log(`apod listening at http://localhost:${port}`);
		if (nodeType == "normal") {
			await say_hello();
		}
	});
})();
