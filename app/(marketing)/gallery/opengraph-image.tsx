import { ImageResponse } from "next/og"

export const runtime = "edge"

export const alt = "App Link Gallery - Browse websites with Universal Links and App Links"
export const size = {
  width: 1200,
  height: 630,
}

export default function Image() {
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
      <div style={{ fontSize: 80, fontWeight: "bold", marginBottom: 40 }}>App Link Gallery</div>
      <div style={{ fontSize: 40, opacity: 0.9 }}>Browse websites with Universal Links and App Links</div>
    </div>,
    {
      ...size,
    },
  )
}
