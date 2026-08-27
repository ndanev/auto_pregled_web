interface CompareItem {
  slug: string
  label: string
}

export function useCompare() {
  const selected = useState<CompareItem[]>('compare-selected', () => [])

  function toggle(item: CompareItem) {
    const exists = selected.value.some((s) => s.slug === item.slug)
    if (exists) {
      selected.value = selected.value.filter((s) => s.slug !== item.slug)
    } else if (selected.value.length >= 2) {
      selected.value = [selected.value[1], item]
    } else {
      selected.value = [...selected.value, item]
    }
  }

  function isSelected(slug: string): boolean {
    return selected.value.some((s) => s.slug === slug)
  }

  function clear() {
    selected.value = []
  }

  return { selected, toggle, isSelected, clear }
}