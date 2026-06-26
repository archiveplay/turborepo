import { userControllerFindUnique } from "@pkg/api/client/vue";

export function useUser(id: MaybeRef<number>) {
  const userId = computed(() => toValue(id));

  return useQuery({
    queryKey: computed(() => ["user", userId.value]),
    queryFn: () =>
      userControllerFindUnique({
        where: { id: userId.value },
        select: { id: true, email: true, name: true },
      }),
    enabled: computed(() => !!userId.value),
  });
}
