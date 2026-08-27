<template>
  <header class="sticky top-0 z-10 bg-canvas/90 backdrop-blur border-b border-white/10">
    <div class="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
      <NuxtLink to="/" class="font-display font-extrabold uppercase text-display-sm text-ink">
        Auto Pregled
      </NuxtLink>
      <nav class="flex items-center gap-6">
        <NuxtLink to="/cars" class="font-mono text-eyebrow uppercase text-ink/60 hover:text-amber transition-colors">
          Automobili
        </NuxtLink>
        <NuxtLink to="/brands" class="font-mono text-eyebrow uppercase text-ink/60 hover:text-amber transition-colors">
          Marke
        </NuxtLink>
      </nav>
    </div>
  </header>
</template>