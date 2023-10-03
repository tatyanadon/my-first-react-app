import { useCallback, useEffect } from "react";
import classNames from "classnames";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import classes from "./UserForm.module.scss";

export const UserForm = ({ editingUser = null, onCancel }) => {
  const queryClient = useQueryClient()
  
  const { mutate: createUser } = useMutation((user) =>
    axios.post(import.meta.env.VITE_API_URL + "/user", user),
  {
    onSuccess: () => {
      queryClient.invalidateQueries('users')
    }
  }
);

const { mutate: updateUser } = useMutation((user) =>
axios.put(import.meta.env.VITE_API_URL + "/user", user),
{
onSuccess: () => {
  queryClient.invalidateQueries('users')
}
}
);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm({
    defaultValues: {
      firstName: editingUser?.firstName,
      lastName: editingUser?.lastName,
      age: editingUser?.age,
    },
  });

  useEffect(() => {
    reset({
      firstName: editingUser?.firstName,
      lastName: editingUser?.lastName,
      age: editingUser?.age,
    })
  }, [reset, editingUser])

  watch(['firstName', 'lastName', 'age'])

  const onSubmit = useCallback((data) => {
    if (!editingUser) return createUser(data)
    updateUser({ ...data, id: editingUser.user })
  }, [editingUser, createUser, updateUser]);

  return (
    <form className={classes.UserForm} onSubmit={handleSubmit(onSubmit)}>
      <h2>{editingUser ? 'Edit User' : 'Create User'}</h2>
      <div className={classes.UserForm_InputContainer}>
        <Controller
          name="firstName"
          rules={{ required: true }}
          control={control}
          render={({ field, fieldState }) => (
            <span className="p-float-label">
              <InputText
                id={field.name}
                name={field.name}
                ref={field.ref}
                value={field.value}
                onBlur={field.onBlur}
                onChange={(e) => field.onChange(e)}
                className={classNames({ "p-invalid": fieldState.error })}
              />
              {errors.firstName}
              <label htmlFor={field.name}>First name</label>
            </span>
          )}
        />
      </div>
      <div className={classes.UserForm_InputContainer}>
        <Controller
          name="lastName"
          rules={{ required: true }}
          control={control}
          render={({ field, fieldState }) => (
            <span className="p-float-label">
              <InputText
                id={field.name}
                name={field.name}
                ref={field.ref}
                value={field.value}
                onBlur={field.onBlur}
                onChange={(e) => field.onChange(e)}
                className={classNames({ "p-invalid": fieldState.error })}
              />
              {errors.lastName}
              <label htmlFor={field.name}>Last name</label>
            </span>
          )}
        />
      </div>
      <div className={classes.UserForm_InputContainer}>
        <Controller
          name="age"
          rules={{ required: true }}
          control={control}
          render={({ field, fieldState }) => (
            <span className="p-float-label">
              <InputNumber
                id={field.name}
                name={field.name}
                ref={field.ref}
                value={field.value}
                onBlur={field.onBlur}
                onChange={(e) => field.onChange(e.originalEvent)}
                className={classNames({ "p-invalid": fieldState.error })}
              />
              {errors.age}
              <label htmlFor={field.name}>Age</label>
            </span>
          )}
        />
      </div>
      <div className={classes.UserForm_Buttons}>
        <Button type="submit" label={editingUser ? "Confirm" : "Create user"} />
        {editingUser && onCancel && <Button onClick={onCancel} label="cancel editing" severity="warn" />}
      </div>
    </form>
  );
};
