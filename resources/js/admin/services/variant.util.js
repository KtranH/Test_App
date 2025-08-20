export const cartesianProduct = (arrays) => {
  if (!arrays || arrays.length === 0) return []
  return arrays.reduce((acc, curr) => {
    if (acc.length === 0) return curr.map((v) => [v])
    const next = []
    for (const a of acc) {
      for (const b of curr) next.push([...a, b])
    }
    return next
  }, [])
}

export const generateVariantsFromMap = (productId, attributeToValueIds) => {
  const entries = Object.entries(attributeToValueIds || {}).filter(([, v]) => Array.isArray(v) && v.length)
  if (!entries.length) return []
  const valueLists = entries.map(([, v]) => v)
  const combos = cartesianProduct(valueLists)
  return combos.map((valueIds, idx) => {
    const options = {}
    entries.forEach(([attrId], i) => { options[attrId] = valueIds[i] })
    return {
      productId,
      sku: `P${String(productId).slice(-6).toUpperCase()}-${idx + 1}`,
      price: 0,
      options,
    }
  })
}


