"use client"

import { useState, useEffect, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import galleryData from "@/data/gallery.json"

type GalleryItem = {
  title: string
  domain: string
  description: string
}

type Category = {
  name: string
  items: GalleryItem[]
}

export function GalleryContent() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const [filteredItems, setFilteredItems] = useState<GalleryItem[]>([])

  // Use useMemo to avoid recreating these arrays on every render
  const categories = useMemo(() => galleryData.categories as Category[], [])
  const allItems = useMemo(() => categories.flatMap((category) => category.items), [categories])

  // Filter items based on search query and active category
  useEffect(() => {
    let results = [...allItems] // Create a new array to avoid reference issues

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      results = results.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.domain.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query),
      )
    }

    // Filter by category
    if (activeCategory !== "all") {
      const categoryItems = categories.find((cat) => cat.name === activeCategory)?.items || []
      const categoryDomains = new Set(categoryItems.map((item) => item.domain))
      results = results.filter((item) => categoryDomains.has(item.domain))
    }

    setFilteredItems(results)
  }, [searchQuery, activeCategory, allItems, categories]) // These dependencies are now stable

  return (
    <div className="space-y-6">
      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          type="text"
          placeholder="Search by name, domain, or description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Category tabs */}
      <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList className="w-full overflow-x-auto flex-nowrap justify-start">
          <TabsTrigger value="all" className="flex-shrink-0">
            All
          </TabsTrigger>
          {categories.map((category) => (
            <TabsTrigger key={category.name} value={category.name} className="flex-shrink-0">
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeCategory} className="mt-6">
          {filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No items found matching your search criteria.</p>
              {searchQuery && (
                <Button variant="outline" className="mt-4" onClick={() => setSearchQuery("")}>
                  Clear Search
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredItems.map((item, index) => (
                <Link key={`${item.domain}-${index}`} href={`/${item.domain}`} passHref>
                  <Card className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4 flex items-start gap-3">
                      <div className="relative w-10 h-10 rounded-md overflow-hidden flex-shrink-0 bg-muted flex items-center justify-center">
                        <Image
                          src={`https://www.google.com/s2/favicons?domain=${item.domain}&sz=64`}
                          alt={`${item.title} favicon`}
                          width={24}
                          height={24}
                          className="object-contain"
                          onError={(e) => {
                            // Fallback to Globe icon if favicon fails to load
                            e.currentTarget.style.display = "none"
                            const parent = e.currentTarget.parentElement
                            if (parent) {
                              const fallback = document.createElement("div")
                              fallback.innerHTML =
                                '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-globe"><circle cx="12" cy="12" r="10"/><line x1="2" x2="22" y1="12" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>'
                              parent.appendChild(fallback)
                            }
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-base truncate">{item.title}</h3>
                        <p className="text-sm text-muted-foreground truncate">{item.domain}</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Category sections for "all" view */}
      {activeCategory === "all" && searchQuery === "" && (
        <div className="space-y-8 mt-4">
          {categories.map((category) => (
            <div key={category.name} className="space-y-4">
              <h2 className="text-xl font-semibold">{category.name}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.items.map((item, index) => (
                  <Link key={`${category.name}-${item.domain}-${index}`} href={`/${item.domain}`} passHref>
                    <Card className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-4 flex items-start gap-3">
                        <div className="relative w-10 h-10 rounded-md overflow-hidden flex-shrink-0 bg-muted flex items-center justify-center">
                          <Image
                            src={`https://www.google.com/s2/favicons?domain=${item.domain}&sz=64`}
                            alt={`${item.title} favicon`}
                            width={24}
                            height={24}
                            className="object-contain"
                            onError={(e) => {
                              // Fallback to Globe icon if favicon fails to load
                              e.currentTarget.style.display = "none"
                              const parent = e.currentTarget.parentElement
                              if (parent) {
                                const fallback = document.createElement("div")
                                fallback.innerHTML =
                                  '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-globe"><circle cx="12" cy="12" r="10"/><line x1="2" x2="22" y1="12" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>'
                                parent.appendChild(fallback)
                              }
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-base truncate">{item.title}</h3>
                          <p className="text-sm text-muted-foreground truncate">{item.domain}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
