import { redirect } from "next/navigation";
import { destroySession, getUser } from "../utils/session";

export async function logoutAction() {
  "use server";
  await destroySession();
  redirect("/login");
}

export async function Navbar() {
  const user = await getUser();
  return (
    <nav className="bg-gray-800 p-4 flex justify-between items-center">
      <div className="text-white font-bold text-lg">Next.js - Full Cycle</div>
      <div className="flex items-center gap-4">
        {user && (
          <>
            <span className="text-gray-300">
              Tenant: <strong>{user.tenantId}</strong>
            </span>
            <span className="text-gray-300">
              User: <strong>{user.username}</strong>
            </span>
            <form action={logoutAction}>
              <button className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">
                Logout
              </button>
            </form>
          </>
        )}
      </div>
    </nav>
  );
}
