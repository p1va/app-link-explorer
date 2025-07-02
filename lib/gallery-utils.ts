import galleryData from "@/data/gallery.json"

export type GalleryItem = {
  title: string
  domain: string
  description: string
}

export type Category = {
  name: string
  items: GalleryItem[]
}

export function getAllGalleryItems(): GalleryItem[] {
  const categories = galleryData.categories as Category[]
  return categories.flatMap((category) => category.items)
}

export function getItemsByCategory(categoryName: string): GalleryItem[] {
  const categories = galleryData.categories as Category[]
  const category = categories.find((cat) => cat.name === categoryName)
  return category?.items || []
}

export function searchGalleryItems(query: string): GalleryItem[] {
  const allItems = getAllGalleryItems()
  const searchTerm = query.toLowerCase()

  return allItems.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm) ||
      item.domain.toLowerCase().includes(searchTerm) ||
      item.description.toLowerCase().includes(searchTerm),
  )
}

export function getAllCategories(): string[] {
  const categories = galleryData.categories as Category[]
  return categories.map((category) => category.name)
}
