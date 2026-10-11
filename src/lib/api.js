const API_ENDPOINTS = [
  "https://openapi.programming-hero.com/api/bazardor",
  "https://api.api-store.workers.dev/api/bazardor",
  "https://api.abcz.workers.dev/api/bazardor",
];

export async function fetchBazarApi(path) {
  let lastError = null;

  for (const baseUrl of API_ENDPOINTS) {
    try {
      const url = `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
      const res = await fetch(url, {
        next: { revalidate: 60 },
      });

      if (!res.ok) {
        if (res.status === 429) {
          console.warn(`Rate limited on ${baseUrl}, trying next endpoint...`);
          continue;
        }
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      if (data && data.error) {
        throw new Error(data.error);
      }
      return data;
    } catch (err) {
      lastError = err;
      // try next fallback
    }
  }

  throw lastError || new Error("Failed to fetch from all API endpoints");
}

export async function getCategories() {
  try {
    const data = await fetchBazarApi("/categories");
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }
}

export async function getCategoryBySlug(slug) {
  try {
    const categories = await getCategories();
    return categories.find((c) => c.slug === slug || c.id === slug) || null;
  } catch (error) {
    console.error("Failed to get category by slug:", error);
    return null;
  }
}

export async function getProducts() {
  try {
    const data = await fetchBazarApi("/products");
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return [];
  }
}

export async function getProductsByCategory(categorySlug) {
  try {
    const data = await fetchBazarApi(`/products?category=${encodeURIComponent(categorySlug)}`);
    if (Array.isArray(data) && data.length > 0) {
      return data;
    }
    // Fallback: filter from all products
    const allProducts = await getProducts();
    return allProducts.filter((p) => p.category === categorySlug);
  } catch (error) {
    console.error(`Failed to fetch products for category ${categorySlug}:`, error);
    // Fallback
    const allProducts = await getProducts();
    return allProducts.filter((p) => p.category === categorySlug);
  }
}

export async function getProductByIdOrSlug(idOrSlug) {
  try {
    // If numeric id
    if (!isNaN(idOrSlug)) {
      try {
        const single = await fetchBazarApi(`/products/${idOrSlug}`);
        if (single && single.nameBn) return single;
      } catch {
        // Fall back to searching list
      }
    }

    // Find in all products
    const allProducts = await getProducts();
    const found = allProducts.find(
      (p) =>
        p.id?.toString() === idOrSlug?.toString() ||
        p.slug === idOrSlug ||
        encodeURIComponent(p.slug) === idOrSlug
    );

    return found || null;
  } catch (error) {
    console.error(`Failed to fetch product for ${idOrSlug}:`, error);
    return null;
  }
}
