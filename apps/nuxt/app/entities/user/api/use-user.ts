import { userControllerFindUnique } from "@pkg/api/client/vue";

export function useUser(id: MaybeRef<number>) {
  const userId = toValue(id);

  return useQuery({
    queryKey: ["user", userId],
    queryFn: () =>
      userControllerFindUnique({
        where: { id: userId },
        select: { id: true, email: true, name: true },
      }),
  });
}
