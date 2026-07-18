import React from "react";

type State = { hasError: boolean; message?: string };

// Never show a blank white screen: if anything crashes, render a friendly
// recovery screen with a reload button instead.
export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: unknown): State {
    return { hasError: true, message: error instanceof Error ? error.message : String(error) };
  }

  componentDidCatch(error: unknown, info: unknown) {
    console.error("App crashed:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: "100vh", display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", padding: 24,
          textAlign: "center", gap: 12, fontFamily: "system-ui, sans-serif",
        }}>
          <div style={{ fontSize: 40 }}>🌈</div>
          <h1 style={{ fontSize: 20, fontWeight: 700 }}>Something went wrong</h1>
          <p style={{ color: "#666", maxWidth: 360 }}>
            Sorry — that wasn't meant to happen. Reloading usually fixes it.
          </p>
          {this.state.message && (
            <code style={{
              background: "#f4f4f5", padding: "6px 10px", borderRadius: 6,
              fontSize: 12, color: "#991b1b", maxWidth: 360, overflowWrap: "break-word",
            }}>
              {this.state.message}
            </code>
          )}
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: 8, padding: "10px 20px", borderRadius: 9999,
              border: "none", color: "white", fontWeight: 600, cursor: "pointer",
              background: "linear-gradient(45deg, #FF5757, #FF914D, #FFDE59, #70CE88, #5E9CF5, #9B87F5)",
            }}
          >
            Reload the app
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
