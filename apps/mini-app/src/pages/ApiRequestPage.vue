<script setup lang="ts">
import { useUserControllerFindUnique } from '@pkg/api/client/vue';

const query = useUserControllerFindUnique()

query.mutate({
  data: {
    where: { id: 1 },
    select: {
      id: true,
      email: true,
      name: true,
    },
  },
})

const { data } = query
</script>

<template>
  <pre>
    {{ data }}
  </pre>
</template>
