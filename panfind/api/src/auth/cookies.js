import crypto from "node:crypto";
import { signSessionToken, verifySessionToken } from "./crypto.js";

const TOKEN_COOKIE = "pf_token";
const CLIENT_COOKIE = "pf_cid";
const MAX_AGE_MS = 7 * 86400000;

export function parseCookieHeader(header) {
  const out = {};
  if (!header) return out;
  for (const part of String(header).split(";")) {
    const [k, ...rest] = part.trim().split("=");
    if (!k) continue;
    out[k] = decodeURIComponent(rest.join("=") || "");
  }
  return out;
}

export function getSessionFromRequest(req) {
  const cookies = parseCookieHeader(req.headers.cookie);
  const token = cookies[TOKEN_COOKIE];
  const user = verifySessionToken(token);
  return user;
}

export function getOrCreateClientId(req, res) {
  const cookies = parseCookieHeader(req.headers.cookie);
  let cid =
    (req.headers["x-panfind-client"] && String(req.headers["x-panfind-client"]).trim()) ||
    cookies[CLIENT_COOKIE] ||
    "";
  if (!cid || cid.length > 64) {
    cid = crypto.randomUUID();
  }
  if (res && cookies[CLIENT_COOKIE] !== cid) {
    res.append(
      "Set-Cookie",
      `${CLIENT_COOKIE}=${encodeURIComponent(cid)}; Path=/; Max-Age=${365 * 86400}; SameSite=Lax; HttpOnly`
    );
  }
  return cid;
}

export function setSessionCookie(res, user) {
  const token = signSessionToken({ uid: user.id, email: user.email }, MAX_AGE_MS);
  res.append(
    "Set-Cookie",
    `${TOKEN_COOKIE}=${encodeURIComponent(token)}; Path=/; Max-Age=${Math.floor(MAX_AGE_MS / 1000)}; SameSite=Lax; HttpOnly`
  );
}

export function clearSessionCookie(res) {
  res.append("Set-Cookie", `${TOKEN_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax; HttpOnly`);
}
