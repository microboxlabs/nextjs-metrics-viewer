import { UpdateUser } from "@/actions/user";
import { describe, expect, test } from "@jest/globals";

test("Update user info", async () => {
  const user = {
    name: "Javier",
    lastname: "Gonzalez",
    email: "javiergonzaleze98@gmail.com",
    password: "LoremIpsum",
    confirmPassword: "LoremIpsum",
  };
  expect(await UpdateUser(5, user)).toBe({ success: true });
});
