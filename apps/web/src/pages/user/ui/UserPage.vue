<script setup lang="ts">
import { onMounted } from 'vue'
import { useUserControllerFindUnique } from '@pkg/api/client/vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const { mutate, data, isPending, error } = useUserControllerFindUnique()

onMounted(() => {
  if (route.params.id)
    mutate({
      data: {
        where: { id: +route.params.id },
        select: {
          id: true,
          email: true,
          name: true,
        },
      },
    })
})
</script>

<template>
  <h1>User</h1>

  <div v-if="isPending">Loading...</div>

  <div v-else-if="error">Error: {{ error }}</div>

  <pre v-else>
    {{ data }}
  </pre>
</template>
