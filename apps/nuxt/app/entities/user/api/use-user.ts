import { userControllerFindUnique } from "@pkg/api/client/vue";

export function useUser(id: number) {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () =>
      userControllerFindUnique({
        where: { id },
        select: { id: true, email: true, name: true },
      }),
  });
}
