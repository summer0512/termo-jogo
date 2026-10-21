// src/components/ads/adsterra-banner.tsx

type Props = {
  width: number;
  height: number;
  keyId: string;
  scriptSrc: string;
  label?: string;
};

export default function AdsterraBanner({
  width,
  height,
  keyId,
  scriptSrc,
  label = "Ad",
}: Props) {
  const isDevelopment = process.env.NODE_ENV === "development";

  if (isDevelopment) {
    return (
      <div
        style={{
          width,
          height,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1px dashed #d1d5db",
          background: "#f3f4f6",
          color: "#9ca3af",
          fontSize: 12,
          borderRadius: 4,
        }}
      >
        {label} · {width}×{height}
      </div>
    );
  }

  const srcDoc = `
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      html, body {
        margin: 0;
        padding: 0;
        width: ${width}px;
        height: ${height}px;
        overflow: hidden;
        background: transparent;
      }
    </style>
  </head>

  <body>
    <script>
      atOptions = {
        'key': '${keyId}',
        'format': 'iframe',
        'height': ${height},
        'width': ${width},
        'params': {}
      };
    </script>

    <script src="${scriptSrc}"></script>
  </body>
</html>
`;

  return (
    <iframe
      title="Advertisement"
      srcDoc={srcDoc}
      width={width}
      height={height}
      scrolling="no"
      style={{
        display: "block",
        width,
        height,
        border: 0,
        overflow: "hidden",
        background: "transparent",
      }}
    />
  );
}