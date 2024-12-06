import { revalidatePath, revalidateTag } from "next/cache";
import { getSession, getUser } from "../../../../utils/session";
//itau
//microsoft
//totvs

// jira.com - login


export async function getTasks(projectId: any) {
  console.log(projectId);
  const session = await getSession();
  const user = await getUser();
  const response = await fetch(
    `http://localhost:8000/projects/${projectId}/tasks`,
    {
      headers: {
        Authorization: `Bearer ${session.token}`,
        "X-Tenant-Id": user!.tenantId,
      },
      cache: "force-cache",
      next: {
        tags: [`project-${projectId}-tasks`],
      },
      // next: {
      //   revalidate: 10 // segundos
      // }
    }
  );

  //console.log(await response.text());

  return response.json();
}
// 100000 - 1 chamada pra API
//14 to 15
//14 - cacheable por default
//15 - not cacheable por default
// revalidate on demand
export async function addTaskAction(formData: FormData) {
  "use server";

  const { projectId, title, description } = Object.fromEntries(formData);
  const session = await getSession();
  await fetch(`http://localhost:8000/projects/${projectId}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.token}`,
    },
    body: JSON.stringify({ title, description }),
  });
  //revalidatePath(`/projects/${projectId}/tasks`);
  revalidateTag(`project-${projectId}-tasks`);
}

export async function TasksPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const tasks = await getTasks(projectId);
  return (
    <div className="m-4">
      <h1 className="text-2xl font-bold mb-4">Tasks</h1>
      <ul className="space-y-2">
        {tasks.map((task: any) => (
          <li key={task.id} className="border p-2">
            <a href={`/tasks/${task.id}`} className="text-blue-600 underline">
              {task.title}
            </a>
          </li>
        ))}
      </ul>
      <form action={addTaskAction} className="mt-4 space-y-2">
        <input type="hidden" name="projectId" value={projectId} />
        <div>
          <label>Title</label>
          <input name="title" type="text" className="border p-2 w-full" />
        </div>
        <div>
          <label>Description</label>
          <textarea name="description" className="border p-2 w-full"></textarea>
        </div>
        <button type="submit" className="bg-green-500 text-white px-4 py-2">
          Add Task
        </button>
      </form>
    </div>
  );
}

export default TasksPage;
