import { ImageResponse } from "next/og"
import type { NextRequest } from "next/server"

export const runtime = "edge"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const domain = searchParams.get("domain") || ""

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        fontSize: 60,
        color: "white",
        background: "linear-gradient(to bottom right, #000000, #333333)",
        width: "100%",
        height: "100%",
        padding: "50px 200px",
        textAlign: "center",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <div style={{ fontSize: 80, fontWeight: "bold", marginBottom: 40 }}>App Link Explorer</div>
      {domain ? (
        <div style={{ fontSize: 40, opacity: 0.9 }}>Exploring app links for {domain}</div>
      ) : (
        <div style={{ fontSize: 40, opacity: 0.9 }}>Discover which apps are linked to your website</div>
      )}
    </div>,
    {
      width: 1200,
      height: 630,
    },
  )
}
