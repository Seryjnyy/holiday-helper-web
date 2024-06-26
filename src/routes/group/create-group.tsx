import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const CreateGroupSchema = z.object({
  temp: z.string().min(10, "More!!!").max(20, "Less!!!"),
});

type CreateGroupSchemaType = z.infer<typeof CreateGroupSchema>;

export default function CreateGroup() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateGroupSchemaType>({
    resolver: zodResolver(CreateGroupSchema),
  });

  return (
    <>
      <form onSubmit={handleSubmit((d) => console.log(d))}>
        <input {...register("temp")} />
        {errors.temp?.message && <p>{errors.temp?.message}</p>}
        <button>submit</button>
      </form>
    </>
  );
}
