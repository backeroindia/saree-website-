import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#141414",
          backgroundImage:
            "radial-gradient(circle at 15% 20%, rgba(233,231,226,0.10) 0%, transparent 45%), radial-gradient(circle at 85% 80%, rgba(233,231,226,0.08) 0%, transparent 45%)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 120,
            height: 120,
            borderRadius: "50%",
            border: "3px solid #e9e7e2",
            marginBottom: 32,
          }}
        >
          <span style={{ fontSize: 64, fontWeight: 700, color: "#e9e7e2" }}>N</span>
        </div>
        <div style={{ display: "flex", fontSize: 76, fontWeight: 700, color: "#f2f1ee" }}>
          N.<span style={{ color: "#e9e7e2" }}>INIYAZHL</span>
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 20,
            fontSize: 28,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "#f2f1eecc",
          }}
        >
          Handloom &amp; Silk Sarees
        </div>
      </div>
    ),
    { ...size }
  );
}
