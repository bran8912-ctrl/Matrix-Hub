import React from "react";
import { createRoot } from "react-dom/client";
import WalletConnect from "../src/components/WalletConnect";
import GameTabs from "../src/casino/ui/GameTabs";

export const MTXCasino = {
  mount(domNode) {
    if (!domNode) return;
    const root = createRoot(domNode);
    root.render(
      <div>
        <WalletConnect />
        <div style={{ marginTop: 32 }}>
          <GameTabs />
        </div>
      </div>
    );
  }
};

// Expose globally for loader
window.MTXCasino = MTXCasino;
