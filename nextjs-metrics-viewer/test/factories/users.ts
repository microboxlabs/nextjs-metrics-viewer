import { faker } from "@faker-js/faker";
import * as Factory from "factory.ts";
import { v4 as uuidv4 } from "uuid";

export const UserFactory = {
  validUser() {
    return Factory.Sync.makeFactory({
      id: uuidv4(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      role: "regular",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  },
  validUserForCreate() {
    return Factory.Sync.makeFactory({
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      role: "regular",
    });
  },
  notActiveUser() {
    return Factory.Sync.makeFactory({
      id: uuidv4(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      role: "regular",
      isActive: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  },
  invalidUser() {
    return Factory.Sync.makeFactory({
      firstName: null,
      lastName: null,
      email: null,
      password: null,
      role: "other",
    });
  },
};
