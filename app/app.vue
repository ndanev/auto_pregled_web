<script setup lang="ts">
// Naslov u tabu browsera i u Google-u: "<naslov stranice> — Autoskop".
// Stranice postavljaju samo svoj deo naslova (useSeoMeta({ title })), a ime sajta se dodaje ovde.
// Stranica bez naslova (npr. početna) dobija "Autoskop — AI analiza polovnih automobila".
useHead({
  titleTemplate: (pageTitle) => (pageTitle ? `${pageTitle} — ${SITE_NAME}` : `${SITE_NAME} — ${SITE_TAGLINE}`),
  // SVG ikonica; stariji browseri bez podrške za SVG sami traže /favicon.ico
  link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
