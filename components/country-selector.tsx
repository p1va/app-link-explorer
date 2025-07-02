"use client"
import {
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

// Country data with ISO 3166-1 alpha-2 codes and emojis
// US as default, followed by European countries, then the rest
export const countries = [
  // Default - US
  { code: "us", name: "United States", emoji: "🇺🇸" },

  // European countries
  { code: "gb", name: "United Kingdom", emoji: "🇬🇧" },
  { code: "de", name: "Germany", emoji: "🇩🇪" },
  { code: "fr", name: "France", emoji: "🇫🇷" },
  { code: "it", name: "Italy", emoji: "🇮🇹" },
  { code: "es", name: "Spain", emoji: "🇪🇸" },
  { code: "nl", name: "Netherlands", emoji: "🇳🇱" },
  { code: "ch", name: "Switzerland", emoji: "🇨🇭" },
  { code: "se", name: "Sweden", emoji: "🇸🇪" },
  { code: "no", name: "Norway", emoji: "🇳🇴" },
  { code: "dk", name: "Denmark", emoji: "🇩🇰" },
  { code: "fi", name: "Finland", emoji: "🇫🇮" },
  { code: "at", name: "Austria", emoji: "🇦🇹" },
  { code: "be", name: "Belgium", emoji: "🇧🇪" },
  { code: "ie", name: "Ireland", emoji: "🇮🇪" },
  { code: "pt", name: "Portugal", emoji: "🇵🇹" },
  { code: "gr", name: "Greece", emoji: "🇬🇷" },

  // Rest of the world (major markets)
  { code: "ca", name: "Canada", emoji: "🇨🇦" },
  { code: "au", name: "Australia", emoji: "🇦🇺" },
  { code: "nz", name: "New Zealand", emoji: "🇳🇿" },
  { code: "jp", name: "Japan", emoji: "🇯🇵" },
  { code: "kr", name: "South Korea", emoji: "🇰🇷" },
  { code: "cn", name: "China", emoji: "🇨🇳" },
  { code: "in", name: "India", emoji: "🇮🇳" },
  { code: "br", name: "Brazil", emoji: "🇧🇷" },
  { code: "mx", name: "Mexico", emoji: "🇲🇽" },
  { code: "za", name: "South Africa", emoji: "🇿🇦" },
  { code: "ru", name: "Russia", emoji: "🇷🇺" },
  { code: "sg", name: "Singapore", emoji: "🇸🇬" },
  { code: "ae", name: "United Arab Emirates", emoji: "🇦🇪" },
]

export function getCountryByCode(code: string) {
  return countries.find((country) => country.code === code) || countries[0]
}

interface CountrySelectorContentProps {
  onSelect: (countryCode: string) => void
}

export function CountrySelectorContent({ onSelect }: CountrySelectorContentProps) {
  return (
    <DropdownMenuContent className="w-56 max-h-80 overflow-y-auto">
      <DropdownMenuLabel>Select Country</DropdownMenuLabel>
      <DropdownMenuSeparator />

      {/* US - Default */}
      <DropdownMenuGroup>
        <DropdownMenuItem onClick={() => onSelect(countries[0].code)}>
          <span className="mr-2">{countries[0].emoji}</span>
          <span>{countries[0].name}</span>
        </DropdownMenuItem>
      </DropdownMenuGroup>

      <DropdownMenuSeparator />
      <DropdownMenuLabel>Europe</DropdownMenuLabel>
      <DropdownMenuGroup>
        {countries.slice(1, 17).map((country) => (
          <DropdownMenuItem key={country.code} onClick={() => onSelect(country.code)}>
            <span className="mr-2">{country.emoji}</span>
            <span>{country.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuGroup>

      <DropdownMenuSeparator />
      <DropdownMenuLabel>Rest of the World</DropdownMenuLabel>
      <DropdownMenuGroup>
        {countries.slice(17).map((country) => (
          <DropdownMenuItem key={country.code} onClick={() => onSelect(country.code)}>
            <span className="mr-2">{country.emoji}</span>
            <span>{country.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuGroup>
    </DropdownMenuContent>
  )
}
