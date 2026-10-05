import { StrictMode, Component, type ReactNode } from "react"
import { createRoot } from "react-dom/client"

import "./index.css"
import App from "./App.tsx"

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: unknown) {
    console.error("Chase the Ace signage crashed:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            backgroundColor: "#0A0A0A",
            color: "#D4AF37",
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "sans-serif",
            padding: "2rem",
            textAlign: "center",
          }}
        >
          <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>♠ CHASE THE ACE ♠</h1>
          <p style={{ color: "#FFFFFF", fontSize: "1.2rem", marginBottom: "1rem" }}>
            Display initializing or encountered an issue.
          </p>
          <pre
            style={{
              color: "#ef4444",
              fontSize: "0.9rem",
              maxWidth: "800px",
              whiteSpace: "pre-wrap",
            }}
          >
            {this.state.error?.message}
          </pre>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: "2rem",
              padding: "0.75rem 1.5rem",
              background: "#D4AF37",
              color: "#000",
              border: "none",
              borderRadius: "4px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Reload Display
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function mount() {
  const container = document.getElementById("root");
  if (!container) return;
  (window as any).__REACT_MOUNTED__ = true;
  const root = createRoot(container);
  root.render(
    <StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </StrictMode>
  );
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", mount);
} else {
  mount();
}

