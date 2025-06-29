import { isIP } from "net";

export function getIp(headers: Headers): string {
  const forwardedFor = headers.get("x-forwarded-for");
  const realIp = headers.get("x-real-ip");

  if (forwardedFor) {
    const firstIp = forwardedFor.split(",")[0]?.trim();
    if (firstIp && isIP(firstIp)) {
      return firstIp;
    }
  }

  if (realIp) {
    const trimmedIp = realIp.trim();
    if (isIP(trimmedIp)) {
      return trimmedIp;
    }
  }

  return "127.0.0.1";
}
