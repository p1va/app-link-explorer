export function generateAppLinkToolStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "App Link Explorer",
    description:
      "A tool to discover which iOS and Android apps are linked to websites through Universal Links and App Links.",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "Check Android App Links configuration",
      "Verify iOS Universal Links setup",
      "Discover connected mobile apps",
      "View technical implementation details",
    ],
  }
}

export function generateBreadcrumbStructuredData(domain?: string) {
  const items = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://app-link-explorer.vercel.app",
    },
  ]

  if (domain) {
    items.push({
      "@type": "ListItem",
      position: 2,
      name: domain,
      item: `https://app-link-explorer.vercel.app/${domain}`,
    })
  }

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items,
  }
}
