import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { DatabaseConnection } from "../db";
import { users } from "../db/schemas/user";
import { eq } from "drizzle-orm";

const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: SECRET_KEY,
    },
    async (payload, done) => {
      try {
        const db = DatabaseConnection.getInstance().db;
        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.email, payload.id))
          .execute();

        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      } catch (error) {
        return done(error, false);
      }
    },
  ),
);

export default passport;
