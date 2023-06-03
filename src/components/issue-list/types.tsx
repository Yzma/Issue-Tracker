import { Project, User } from "@/types/types";
import { Label } from "@prisma/client";

export type Issue = {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  labels: Pick<Label, "name" | "description" | "color">[];
  user: {
    username: string;
  }
  project: {
    name: string;
    namespace: {
      name: string;
    }
  }
}
