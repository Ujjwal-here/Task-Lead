import "./global.css";

// Patch ResizeObserver methods to avoid 'ResizeObserver loop completed with undelivered notifications' noisy warnings
if (typeof window !== "undefined" && (window as any).ResizeObserver) {
  try {
    const RO: any = (window as any).ResizeObserver;
    const proto = RO.prototype;
    const origObserve = proto.observe;
    const origUnobserve = proto.unobserve;
    const origDisconnect = proto.disconnect;

    proto.observe = function (target: Element, options?: any) {
      try {
        return origObserve.call(this, target, options);
      } catch (e) {
        // suppress errors from ResizeObserver in some browsers/extensions
        return null;
      }
    };

    proto.unobserve = function (target: Element) {
      try {
        return origUnobserve.call(this, target);
      } catch (e) {
        return null;
      }
    };

    proto.disconnect = function () {
      try {
        return origDisconnect.call(this);
      } catch (e) {
        return null;
      }
    };
  } catch (e) {
    // ignore patching errors
  }
}

import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AppLayout from "@/components/layout/AppLayout";

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<AppLayout><Index /></AppLayout>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

createRoot(document.getElementById("root")!).render(<App />);
