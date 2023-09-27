import * as https from "node:https";

export class APIError extends Error {
    body: string;
    method: string;
    override name = "APIError";
    path: string;
    status: number;
    constructor(status: number, path: string, method: string, body: string) {
        super(`Unexpected ${status} on ${method.toUpperCase()} ${path}: ${body}`);
        this.status = status;
        this.path = path;
        this.method = method;
        this.body = body;
    }

    override toString() {
        return `APIError[${this.method} ${this.path}]`;
    }
}

export default async function Request<R extends Record<string, unknown> | string>(path: string, method: "GET" | "POST", body: Record<string, unknown> | null, apiKey: string, userAgent: string, followRedirects = true) {
    return new Promise<R>((resolve, reject) => {
        const req = https
            .request({
                host:     "api.chewey-bot.top",
                port:     443,
                protocol: "https:",
                path,
                headers:  {
                    "Host":          "api.chewey-bot.top",
                    "User-Agent":    userAgent,
                    "Authorization": apiKey,
                    "Accept":        "application/json",
                    ...(method === "POST" ? {
                        "Content-Type": "application/json"
                    } : {})
                },
                method
            }, res => {
                const data = [] as Array<Buffer>;

                res
                    .on("error", err => reject(err))
                    .on("data", (d: Buffer) => data.push(d))
                    .on("end", () => {
                        if (res.statusCode) {
                            if (res.statusCode >= 400) {
                                throw new APIError(res.statusCode, path, "GET", Buffer.concat(data).toString());
                            } else if (res.statusCode >= 300) {
                                if (followRedirects) {
                                    Request<R>(res.headers.location ?? "", "GET", body, apiKey, userAgent, false)
                                        .then(resolve)
                                        .catch(reject);
                                } else {
                                    if (res.headers.location) {
                                        resolve(res.headers.location as R);
                                    } else {
                                        reject(new Error("No location header"));
                                    }
                                }
                            }
                        }
                        resolve(JSON.parse(Buffer.concat(data).toString()) as R);
                    });
            });
        if (method === "POST" && body) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            req.write(JSON.stringify(body, (k, v) => typeof v === "bigint" ? String(v) : v));
        }
        req.end();
    });
}
