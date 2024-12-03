import { UserModel, UserRole } from "@/users/model";

describe("UserModel", () => {
  it("should create a new user model", () => {
    const user = new UserModel({
      firstName: "John",
      lastName: "Doe",
      email: "",
      password: "password",
      role: UserRole.Regular,
    });

    expect(user).toBeInstanceOf(UserModel);
  });
});
