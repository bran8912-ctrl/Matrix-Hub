// Note: React, WalletConnect, and GameTabs are imported but not currently used
// These are placeholder imports for future casino bundle implementation
// import React from "react";
// import { createRoot } from "react-dom/client";
// import WalletConnect from "./components/WalletConnect";
// import GameTabs from "./casino/_legacy/ui/GameTabs";

export const MTXCasino = {
  mount(domNode) {
    if (!domNode) return;
    console.log('MTXCasino mount called - implementation pending');
    // Future implementation:
    // const root = createRoot(domNode);
    // root.render(
    //   <div>
    //     <WalletConnect />
    //     <div style={{ marginTop: 32 }}>
    //       <GameTabs />
    //     </div>
    //   </div>
    // );
  }
};

// Expose globally for loader
window.MTXCasino = MTXCasino;
