import * as https from "https";

export class APIError extends Error {
	name = "APIError";
	status: number;
	path: string;
	method: string;
	body: string;
	constructor(status: number, path: string, method: string, body: string) {
		super(`Unexpected ${status} on ${method.toUpperCase()} ${path}: ${body}`);
		this.status = status;
		this.path = path;
		this.method = method;
		this.body = body;
	}

	toString() { return `APIError[${this.method} ${this.path}]`; }
}

export default async function Request<R extends Record<string, unknown>>(path: string, method: "GET" | "POST", body: Record<string, unknown> | null, apiKey: string, userAgent: string) {
	return new Promise<R>((resolve, reject) => {
		const req = https
			.request({
				host: "api.chewey-bot.top",
				port: 443,
				protocol: "https:",
				path,
				headers: {
					"Host": "api.chewey-bot.top",
					"User-Agent": userAgent,
					"Authorization": apiKey,
					"Accept": "application/json",
					...(method === "POST" ? {
						"Content-Type": "application/json"
					} : {})
				},
				method
			}, (res) => {
				const data = [] as Array<Buffer>;

				res
					.on("error", (err) => reject(err))
					.on("data", (d) => data.push(d))
					.on("end", () => {
						if (res.statusCode && res.statusCode !== 200) throw new APIError(res.statusCode, path, "GET", Buffer.concat(data).toString());
						else return resolve(JSON.parse(Buffer.concat(data).toString()));
					});
			});
			// eslint-disable-next-line @typescript-eslint/no-unsafe-return
		if (method === "POST" && body) req.write(JSON.stringify(body, (k, v) => typeof v === "bigint" ? String(v) : v));
		req.end();
	});
}
