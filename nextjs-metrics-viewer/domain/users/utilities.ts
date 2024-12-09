import bcrypt from "bcrypt";

type PasswordVerificationProps = {
  inputPassword: string;
  hashedPassword: string;
};

export const UserUtilities = {
  async encryptPassword(password: string): Promise<string> {
    const SALT_ROUNDS = 10;
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    return hashedPassword;
  },

  async verifyPassword(props: PasswordVerificationProps): Promise<boolean> {
    const isMatch = await bcrypt.compare(
      props.inputPassword,
      props.hashedPassword,
    );
    return isMatch;
  },
};

export default UserUtilities;
