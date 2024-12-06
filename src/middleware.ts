import { NextRequest, NextResponse } from "next/server";
import { getSession } from "./utils/session";


export async function middleware(request: NextRequest) {
  const session = getSession();

  //const tenant = getTenant();

  //if(!tenant){
    //return NextResponse.redirect(new URL("/tenants", request.url));
    //await saveTenant(tenant); //salvaria numa página de tenants
  //}

  if (!(await session).token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = { matcher: ["/", "/projects/:path*"] };
