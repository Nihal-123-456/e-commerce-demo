import { NextRequest } from "next/server";

export function isInternalRequestAuthorized(req: NextRequest) {
    const secret = process.env.SOCKET_SERVER_SECRET
    if (!secret) return false
    const provided = req.headers.get("x-socket-server-secret")
    return provided === secret
}
