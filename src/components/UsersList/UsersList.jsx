import { Card } from "primereact/card";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "primereact/button";
import axios from "axios";
import classes from "./UsersList.module.scss";

export const UserList = ({ handleUserEditClick }) => {
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: () =>
      axios
        .get(import.meta.env.VITE_API_URL + "/users")
        .then((res) => res.data),
  });

  const { mutate: deleteUserMutate } = useMutation((user) =>
    axios.delete(import.meta.env.VITE_API_URL + "/user", {
      params: {
        id: user.id,
      },
    }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('users')
      }
    }
  );

  if (isLoading) {
    return <h2>loading...</h2>;
  }

  return (
    <div className={classes.UsersList}>
      <h2>Users list</h2>
      <div className={classes.UsersList__list}>
        {data?.map((u) => (
          <Card
            className={classes.UsersList__listItem}
            key={u.id}
            title={`${u.firstName} ${u.lastName}`}
          >
            <div className={classes.UsersList__listItemInner}>
              <p className="m-0">Hi, my age is {u.age}</p>
              <Button onClick={() => handleUserEditClick(u)} label="Edit" />
              <Button severity="danger" onClick={() => deleteUserMutate(u)} label="Delete" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
