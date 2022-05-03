import { createTRPCClient } from "@trpc/client";
import { httpBatchLink } from "@trpc/client/links/httpBatchLink";
// import { loggerLink } from "@trpc/client/links/loggerLink";
// import * as fetch from "node-fetch";
import { AppRouter, getNodeTypeParams, port } from "./utils";

// (async function main() {
const [nodeType, bootPort] = getNodeTypeParams();
const _port = nodeType == "normal" ? bootPort : port;
const url = `http://localhost:${_port}/trpc`;
const client = createTRPCClient<AppRouter>({
	links: [
		//   () =>
		//     ({ op, prev, next }) => {
		//       console.log('->', op.type, op.path, op.input);

		//       return next(op, (result) => {
		//         console.log('<-', op.type, op.path, op.input, ':', result);
		//         prev(result);
		//       });
		//     },
		httpBatchLink({ url }),
	],
});

export const say_hello = async (): Promise<void> => {
	console.log(await client.query("hello"));
};
// })()
