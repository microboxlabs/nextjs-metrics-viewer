export enum UserRole {
  Admin = "admin",
  Regular = "regular",
}

export type UserModelProps = {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

export class UserModel {
  private readonly __id?: string;
  private readonly __firstName: string;
  private readonly __lastName: string;
  private readonly __email: string;
  private readonly __password?: string;
  private readonly __role: UserRole;
  private readonly __isActive?: boolean;
  private readonly __createdAt?: Date;
  private readonly __updatedAt?: Date;

  constructor(props: UserModelProps) {
    this.__id = props.id;
    this.__firstName = props.firstName;
    this.__lastName = props.lastName;
    this.__email = props.email;
    this.__password = props.password;
    this.__role = props.role;
    this.__isActive = props.isActive;
    this.__createdAt = props.createdAt;
    this.__updatedAt = props.updatedAt;
  }

  get id(): string | undefined {
    return this.__id;
  }

  get role(): UserRole {
    return this.__role;
  }

  get email(): string {
    return this.__email;
  }

  get isActive(): boolean {
    return this.__isActive || false;
  }

  get createdAt(): Date | undefined {
    return this.__createdAt;
  }

  get updatedAt(): Date | undefined {
    return this.__updatedAt;
  }

  get fullName(): string {
    return `${this.__firstName} ${this.__lastName}`;
  }

  public activateUser() {
    return new UserModel({
      id: this.__id,
      firstName: this.__firstName,
      lastName: this.__lastName,
      email: this.__email,
      password: this.__password!,
      role: this.__role,
      isActive: true,
      createdAt: this.__createdAt,
      updatedAt: this.__updatedAt,
    });
  }
}
