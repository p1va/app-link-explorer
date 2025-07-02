"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"
import { cn } from "@/lib/utils"

interface CodeBlockProps {
  code: string
  language?: string
  className?: string
}

export function CodeBlock({ code, language = "json", className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Simple syntax highlighting for JSON
  const highlightJson = (json: string) => {
    return json
      .replace(/"([^"]+)":/g, '<span class="text-blue-500 dark:text-blue-400">"$1"</span>:')
      .replace(/: ("[^"]+")/g, ': <span class="text-green-500 dark:text-green-400">$1</span>')
      .replace(/: (true|false)/g, ': <span class="text-yellow-500 dark:text-yellow-400">$1</span>')
      .replace(/: (\d+)/g, ': <span class="text-purple-500 dark:text-purple-400">$1</span>')
      .replace(/null/g, '<span class="text-red-500 dark:text-red-400">null</span>')
  }

  return (
    <div className={cn("relative group", className)}>
      <div
        className="absolute right-2 top-2 p-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity bg-muted hover:bg-muted/80 cursor-pointer"
        onClick={copyToClipboard}
      >
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </div>
      <pre className="bg-muted p-4 rounded-md overflow-auto text-xs font-mono cursor-pointer" onClick={copyToClipboard}>
        {language === "json" ? <div dangerouslySetInnerHTML={{ __html: highlightJson(code) }} /> : code}
      </pre>
    </div>
  )
}
