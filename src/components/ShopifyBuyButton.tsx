"use client";
import { useEffect, useRef } from "react";

interface ShopifyBuyButtonProps {
  productId: string;
  domain: string;
  storefrontAccessToken: string;
}

declare global {
  interface Window {
    ShopifyBuy?: {
      buildClient: (config: { domain: string; storefrontAccessToken: string }) => unknown;
      UI: {
        onReady: (client: unknown) => Promise<{ createComponent: (type: string, opts: unknown) => void }>;
      };
    };
  }
}

export default function ShopifyBuyButton({
  productId,
  domain,
  storefrontAccessToken,
}: ShopifyBuyButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;

    function initButton() {
      if (!window.ShopifyBuy || !containerRef.current) return;
      initialized.current = true;

      const client = window.ShopifyBuy.buildClient({
        domain,
        storefrontAccessToken,
      });

      window.ShopifyBuy.UI.onReady(client).then((ui) => {
        ui.createComponent("product", {
          id: productId,
          node: containerRef.current,
          moneyFormat: "%24%7B%7Bamount%7D%7D",
          options: {
            product: {
              styles: {
                product: {
                  "@media (min-width: 601px)": {
                    "max-width": "100%",
                    "margin-left": "0",
                  },
                },
                button: {
                  "font-family": "inherit",
                  "font-size": "11px",
                  "padding-top": "14px",
                  "padding-bottom": "14px",
                  "letter-spacing": "0.3em",
                  "text-transform": "uppercase",
                  color: "#000000",
                  "background-color": "#ffffff",
                  ":hover": { "background-color": "#e0e0e0" },
                  ":focus": { "background-color": "#e0e0e0" },
                  "border-radius": "0",
                },
                title: {
                  "font-family": "inherit",
                  "font-size": "24px",
                  color: "#ffffff",
                  "font-weight": "300",
                  "letter-spacing": "0.1em",
                },
                price: {
                  "font-family": "inherit",
                  color: "#aaaaaa",
                  "font-weight": "300",
                  "font-size": "18px",
                },
                compareAtPrice: { color: "#555555" },
                unitPrice: { color: "#555555" },
                description: {
                  color: "#666666",
                  "font-family": "inherit",
                },
              },
              text: {
                button: "Add to Cart",
              },
            },
            cart: {
              styles: {
                button: {
                  "font-family": "inherit",
                  color: "#000",
                  "background-color": "#fff",
                  ":hover": { "background-color": "#e0e0e0" },
                  "border-radius": "0",
                  "letter-spacing": "0.3em",
                  "text-transform": "uppercase",
                  "font-size": "11px",
                },
                cart: { background: "#111111" },
                header: { color: "#ffffff" },
                lineItems: { color: "#ffffff" },
                subtotalText: { color: "#aaaaaa" },
                subtotal: { color: "#ffffff" },
                notice: { color: "#aaaaaa" },
                currency: { color: "#aaaaaa" },
                close: { color: "#aaaaaa", ":hover": { color: "#ffffff" } },
                empty: { color: "#555555" },
                noteDescription: { color: "#aaaaaa" },
                discountText: { color: "#aaaaaa" },
                discountIcon: { fill: "#aaaaaa" },
                discountAmount: { color: "#aaaaaa" },
              },
              text: {
                total: "Subtotal",
                button: "Checkout",
              },
              popup: true,
            },
            toggle: {
              styles: {
                toggle: { "background-color": "#111111", ":hover": { "background-color": "#1a1a1a" } },
                count: { color: "#ffffff" },
                iconPath: { fill: "#ffffff" },
              },
            },
          },
        });
      });
    }

    const scriptId = "shopify-buy-btn-script";
    if (document.getElementById(scriptId)) {
      initButton();
      return;
    }

    const script = document.createElement("script");
    script.id = scriptId;
    script.src = "https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js";
    script.async = true;
    script.onload = initButton;
    document.head.appendChild(script);
  }, [productId, domain, storefrontAccessToken]);

  return <div ref={containerRef} id="shopify-product-component" />;
}
