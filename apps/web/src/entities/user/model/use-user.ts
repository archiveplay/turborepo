import { useUserControllerFindUnique } from '@pkg/api/client/vue'

export function useUser(id: number) {
  const query = useUserControllerFindUnique()

  query.mutate({
    data: {
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
      },
    },
  })

  return query
}
