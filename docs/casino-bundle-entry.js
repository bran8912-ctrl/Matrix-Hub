import React from "react";
import { createRoot } from "react-dom/client";
import WalletConnect from "./components/WalletConnect";
import GameTabs from "./casino/ui/GameTabs";

function mountMTXCasino(domNode) {
  if (!domNode) return;
  const root = createRoot(domNode);
  root.render(
    React.createElement(
      'div',
      null,
      React.createElement(WalletConnect, null),
      React.createElement('div', { style: { marginTop: 32 } },
        React.createElement(GameTabs, null)
      )
    )
  );
}

window.MTXCasino = { mount: mountMTXCasino };
