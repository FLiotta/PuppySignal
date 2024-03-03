// @ Packages
import { jwtDecode } from "jwt-decode";
import dayjs from "dayjs";

export const isAuthTokenExpired = (token: string) => {
  const decodedToken = jwtDecode(token);

  if (!decodedToken.exp) {
    throw new Error("JWT Token doesn't contain an expiration field (???)");
  }

  return dayjs().unix() > decodedToken.exp;
}
