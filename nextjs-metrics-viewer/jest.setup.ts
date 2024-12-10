import dotenv from "dotenv";

dotenv.config({ path: ".env.test.local" });

jest.spyOn(console, "error").mockImplementation(() => {});
