import multer from "multer";
import { Readable } from "stream";

const storage = multer.memoryStorage();
const upload = multer({ storage }).single("file");

const AnalyticsMiddlewares = {
  async analyticsMiddleware(req: any, res: any): Promise<void> {
    return new Promise((resolve, reject) => {
      upload(req, res, (error: any) => {
        if (error) {
          reject(error);
        } else {
          resolve(req);
        }
      });
    });
  },
  toNodeReadable(readableStream: ReadableStream, headers: Headers) {
    const reader = readableStream.getReader();

    const nodeReadable = new Readable({
      async read() {
        const { done, value } = await reader.read();
        if (done) {
          this.push(null);
        } else {
          this.push(value);
        }
      },
    });

    (nodeReadable as any).headers = Object.fromEntries(headers.entries());

    return nodeReadable;
  },
};

export { AnalyticsMiddlewares };
