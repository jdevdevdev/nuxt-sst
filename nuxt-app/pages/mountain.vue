<script setup lang="ts">
    const { data: mountain } = await useFetch('/api/mountain')
</script>
  
<template>
    <div>
        <NuxtExampleLayout example="server/routes">
            <p>Fetched from <pre>/api/mountain</pre>: {{ mountain }}</p>
        </NuxtExampleLayout>
    </div>
</template>