import { useMemo, useRef, useCallback } from "react";

export default function ESGContainer() {
  const iframeRef = useRef(null);

  const esgUrl = useMemo(() => {
    return import.meta.env.VITE_ESG_URL || "http://localhost:5174";
  }, []);

  // Extrai o origin correto (http://localhost:5174)
  const esgOrigin = useMemo(() => {
    try {
      return new URL(esgUrl).origin;
    } catch {
      return "*";
    }
  }, [esgUrl]);

  const handleLoad = useCallback(() => {
    const token = localStorage.getItem("riosf5_token");
    if (!token) return;

    const win = iframeRef.current?.contentWindow;
    if (!win) return;

    // ✅ Evita erro caso iframe esteja em outra origem
    try {
      if (esgOrigin !== "*" && new URL(esgUrl).origin !== esgOrigin) return;
    } catch (_) {}

    try {
      win.postMessage({ type: "AUTH_TOKEN", token }, esgOrigin);
    } catch (e) {
      console.warn("postMessage bloqueado (origem diferente):", e);
    }
  }, [esgOrigin, esgUrl]);

  return (
    <div className="w-full h-full">
      <iframe
        ref={iframeRef}
        src={esgUrl}
        title="ESG"
        onLoad={handleLoad}
        className="w-full h-full border-0"
      />
    </div>
  );
}
