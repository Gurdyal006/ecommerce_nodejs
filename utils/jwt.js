import JWT from "jsonwebtoken";

export const createJWTToken = async (_id) => {
  return JWT.sign({ _id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};
