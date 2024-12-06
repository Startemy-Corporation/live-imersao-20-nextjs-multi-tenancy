import { revalidatePath, unstable_cache } from "next/cache";
import { getSession, getUser } from "../utils/session";
import Link from "next/link";

// class ProjectHttp{

// }

// class TasksHttp {

// }

export async function getProjects(token: string, tenantId: any) {
  const response = await fetch("http://localhost:8000/projects", {
    headers: {
      Authorization: `Bearer ${token}`,
      //não precisa ser enviado se o usuário está relacionado com apenas um tenant
      //fizemos o cache usando o unstable_cache
      "X-Tenant-Id": tenantId,
    },
  });

  return response.json();
}

export async function addProjectAction(formData: FormData) {
  "use server";

  const name = formData.get("name");
  const session = await getSession();
  await fetch("http://localhost:8000/projects", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.token}`,
      //'X-Tenant-Id': await getTenant()
    },
    body: JSON.stringify({ name }),
  });
  revalidatePath("/");
}

export async function DashboardPage() {
  const session = await getSession();
  const user = await getUser();
  const getCachedProjects = unstable_cache(
    async () => getProjects(session.token, user!.tenantId),
    [`projects-${user!.tenantId}`],
    { tags: [`projects-${user!.tenantId}`] }
  );
  const projects = await getCachedProjects();
  return (
    <div className="m-4">
      <h1 className="text-2xl font-bold mb-4">Projects</h1>
      <ul className="space-y-2">
        {projects.map((project: any) => (
          <li key={project.id}>
            <Link
              href={`/projects/${project.id}/tasks`}
              className="text-blue-600 underline"
            >
              {project.name}
            </Link>
          </li>
        ))}
      </ul>
      <form action={addProjectAction} className="mt-4 space-y-2">
        <div>
          <label>Name</label>
          <input name="name" type="text" className="border p-2 w-full" />
        </div>
        <button type="submit" className="bg-green-500 text-white px-4 py-2">
          Add Project
        </button>
      </form>
    </div>
  );
}

export default DashboardPage;
