<script setup lang="ts">
import { useUser } from '@/entities/user/model/use-user'

const { id } = defineProps<{
  id: number
}>()

const { data, isPending, error } = useUser(id)
</script>

<template>
  <h1>User</h1>

  <div v-if="isPending">Loading...</div>

  <div v-else-if="error">Error: {{ error }}</div>

  <pre v-else>
    {{ data }}
  </pre>
</template>
