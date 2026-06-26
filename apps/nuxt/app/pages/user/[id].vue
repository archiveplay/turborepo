<script setup lang="ts">
import { useUser } from "~/entities/user/api/use-user";

const route = useRoute();

const id = computed(() => Number(route.params.id));

const { data, isPending, error } = useUser(id);
</script>

<template>
  <UContainer class="py-10">
    <Suspense>
      <template #default>
        <UCard class="max-w-2xl mx-auto">
          <template #header>
            <div class="flex items-center justify-between">
              <h1 class="text-xl font-semibold">User #{{ id }}</h1>

              <UBadge color="neutral" variant="soft"> Profile </UBadge>
            </div>
          </template>

          <!-- Loading state -->
          <div v-if="isPending" class="space-y-3">
            <USkeleton class="h-5 w-1/3" />
            <USkeleton class="h-4 w-full" />
            <USkeleton class="h-4 w-5/6" />
          </div>

          <!-- Error state -->
          <UAlert
            v-else-if="error"
            color="error"
            variant="soft"
            title="Failed to load user"
            :description="String(error)"
          />

          <!-- Success state -->
          <div v-else class="space-y-4">
            <div class="grid gap-2">
              <p class="text-sm text-gray-500">Raw data</p>
              <UTextarea
                :model-value="JSON.stringify(data, null, 2)"
                readonly
                autoresize
              />
            </div>
          </div>

          <template #footer>
            <div class="flex justify-between items-center">
              <NuxtLink to="/">
                <UButton variant="ghost" size="sm"> ← Back </UButton>
              </NuxtLink>

              <UBadge variant="soft" color="primary"> id: {{ id }} </UBadge>
            </div>
          </template>
        </UCard>
      </template>

      <!-- Suspense fallback (extra safety layer) -->
      <template #fallback>
        <UCard class="max-w-2xl mx-auto">
          <USkeleton class="h-6 w-1/2 mb-4" />
          <USkeleton class="h-4 w-full" />
          <USkeleton class="h-4 w-2/3 mt-2" />
        </UCard>
      </template>
    </Suspense>
  </UContainer>
</template>
