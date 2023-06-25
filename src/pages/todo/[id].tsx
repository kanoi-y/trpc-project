import { trpc } from "../../utils/trpc";

import { useRouter } from "next/router";
import { ChangeEvent, useState } from "react";

export default function Page() {
  const router = useRouter();
  const updateMutation = trpc.todo.updateTodo.useMutation();
  const [title, setTitle] = useState<string>("");
  const [body, setBody] = useState<string>("");
  const id = Number(router.query.id);

  const { data } = trpc.todo.getTodoById.useQuery({
    id,
  });
  if (!data) {
    return;
  }

  const handleUpdateTodo = async () => {
    try {
      if (title && body) {
        await updateMutation.mutateAsync({ id, title, body });
        setTitle("");
        setBody("");
        alert("更新しました");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div>
        <p>タイトル: {data.title}</p>
        <p>本文: {data.body}</p>
      </div>
      <div className="update-container">
        <p>更新</p>
        <div className="title">
          <label>タイトル</label>
          <input
            type="text"
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setTitle(e.target.value);
            }}
            value={title}
          />
        </div>
        <div className="body">
          <label>本文</label>
          <input
            type="text"
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setBody(e.target.value);
            }}
            value={body}
          />
        </div>
        <button onClick={handleUpdateTodo}>更新</button>
      </div>
    </>
  );
}
