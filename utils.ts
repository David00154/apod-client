import * as trpcExpress from "@trpc/server/adapters/express";
import { appRouter } from "./server";
import * as trpc from "@trpc/server";
export const createContext = ({
	req,
	res,
}: trpcExpress.CreateExpressContextOptions) => {
	const getUser = () => {
		if (req.headers.authorization !== "secret") {
			return null;
		}
		return {
			name: "alex",
		};
	};

	return {
		req,
		res,
		user: getUser(),
	};
};

export type AppRouter = typeof appRouter;

export function getPort(): number {
	const argv = process.argv;
	let PORT: number = 0;
	for (let index = 0; index < argv.length; index++) {
		const element = argv[index];
		if (element != "--port") {
			continue;
		} else if (element == "--port") {
			PORT = parseInt(argv[index + 1]);
			break;
		} else {
			PORT = parseInt(process.env.PORT!) || 3245;
			break;
		}
	}
	return PORT;
}

export function getNodeTypeParams(): [string, number] {
	let nodeType: string = "normal";
	let bootNodeForPort: number = 0;
	const argv = process.argv;

	enum NodeType {
		normal = "normal",
		bootNode = "boot-node",
	}
	for (let index = 0; index < argv.length; index++) {
		const element = argv[index];
		switch (element) {
			case "--boot-node-port":
				bootNodeForPort = parseInt(argv[index + 1]);
				continue;
			case "--node-type":
				nodeType = argv[index + 1];
			default:
				break;
		}
	}

	if (nodeType == "normal" && bootNodeForPort == 0) {
		throw new Error(
			"You are running a normal node so it is expected of you to add --boot-node-port[number] at the parameters level."
		);
	}
	switch (nodeType) {
		case "boot-node":
		case "normal":
			return [nodeType, bootNodeForPort];
		default:
			throw new Error(
				`Parameter "--node-type", should be a value of "${Object.values(
					NodeType
				)}"`
			);
	}
}

export const port = getPort();
export function createRouter() {
	return trpc.router<Context>();
}
export type Context = trpc.inferAsyncReturnType<
	typeof createContext
>;
