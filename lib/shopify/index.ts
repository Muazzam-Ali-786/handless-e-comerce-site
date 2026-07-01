import { ShopifyFetchParams, Product, Collection, Cart, Connection } from "@/types/shopify";
import { getProductQuery, getProductsQuery, getCollectionProductsQuery, getCollectionsQuery, getCartQuery, getCustomerQuery } from "./queries";
import { createCartMutation, addToCartMutation, removeFromCartMutation, updateCartMutation, customerCreateMutation, customerAccessTokenCreateMutation } from "./mutations";

const domain = process.env.SHOPIFY_STORE_DOMAIN
  ? process.env.SHOPIFY_STORE_DOMAIN.includes("://")
    ? process.env.SHOPIFY_STORE_DOMAIN
    : `https://${process.env.SHOPIFY_STORE_DOMAIN}`
  : "";

const endpoint = `${domain}/api/2024-01/graphql.json`;
const key = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN || "";

// ==========================================
// HIGH-END PREMIUM MOCK DATA FALLBACKS
// ==========================================

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "mock-p1",
    handle: "double-breasted-wool-trench-coat",
    availableForSale: true,
    title: "Double-Breasted Wool Trench Coat",
    description: "Expertly tailored from premium Italian wool blend, this classic double-breasted trench coat features a relaxed silhouette, structured shoulders, and an adjustable waist belt. Fully lined with signature silk-blend lining, it combines traditional sophistication with modern styling.",
    descriptionHtml: "<p>Expertly tailored from premium Italian wool blend, this classic double-breasted trench coat features a relaxed silhouette, structured shoulders, and an adjustable waist belt. Fully lined with signature silk-blend lining, it combines traditional sophistication with modern styling.</p>",
    options: [
      { id: "opt-p1-size", name: "Size", values: ["S", "M", "L"] },
      { id: "opt-p1-color", name: "Color", values: ["Camel", "Obsidian Black"] }
    ],
    priceRange: {
      minVariantPrice: { amount: "380.00", currencyCode: "USD" },
      maxVariantPrice: { amount: "380.00", currencyCode: "USD" }
    },
    featuredImage: {
      url: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800&auto=format&fit=crop",
      altText: "Double-Breasted Wool Trench Coat in Camel",
      width: 800,
      height: 1000
    },
    images: {
      edges: [
        {
          node: {
            url: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800&auto=format&fit=crop",
            altText: "Double-Breasted Wool Trench Coat in Camel",
            width: 800,
            height: 1000
          }
        },
        {
          node: {
            url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=800&auto=format&fit=crop",
            altText: "Double-Breasted Wool Trench Coat details",
            width: 800,
            height: 1000
          }
        }
      ]
    },
    variants: {
      edges: [
        {
          node: {
            id: "mock-v1-camel-s",
            title: "Camel / S",
            availableForSale: true,
            selectedOptions: [
              { name: "Size", value: "S" },
              { name: "Color", value: "Camel" }
            ],
            price: { amount: "380.00", currencyCode: "USD" },
            compareAtPrice: { amount: "460.00", currencyCode: "USD" }
          }
        },
        {
          node: {
            id: "mock-v1-camel-m",
            title: "Camel / M",
            availableForSale: true,
            selectedOptions: [
              { name: "Size", value: "M" },
              { name: "Color", value: "Camel" }
            ],
            price: { amount: "380.00", currencyCode: "USD" },
            compareAtPrice: null
          }
        },
        {
          node: {
            id: "mock-v1-black-m",
            title: "Obsidian Black / M",
            availableForSale: true,
            selectedOptions: [
              { name: "Size", value: "M" },
              { name: "Color", value: "Obsidian Black" }
            ],
            price: { amount: "380.00", currencyCode: "USD" },
            compareAtPrice: null
          }
        }
      ]
    },
    seo: {
      title: "Double-Breasted Wool Trench Coat | Maison",
      description: "Tailored from premium Italian wool with a modern relaxed fit."
    },
    tags: ["outerwear", "winter", "coat", "wool"],
    updatedAt: "2026-06-01T00:00:00Z"
  },
  {
    id: "mock-p2",
    handle: "classic-leather-aviator-jacket",
    availableForSale: true,
    title: "Classic Leather Aviator Jacket",
    description: "Constructed from thick, supple full-grain lambskin leather that develops a unique patina over time. It features a detachable shearling collar, heavy-duty silver brass hardware, ribbed storm cuffs, and multiple functional utility pockets.",
    descriptionHtml: "<p>Constructed from thick, supple full-grain lambskin leather that develops a unique patina over time. It features a detachable shearling collar, heavy-duty silver brass hardware, ribbed storm cuffs, and multiple functional utility pockets.</p>",
    options: [
      { id: "opt-p2-size", name: "Size", values: ["S", "M", "L"] },
      { id: "opt-p2-color", name: "Color", values: ["Vintage Black", "Dark Walnut"] }
    ],
    priceRange: {
      minVariantPrice: { amount: "450.00", currencyCode: "USD" },
      maxVariantPrice: { amount: "450.00", currencyCode: "USD" }
    },
    featuredImage: {
      url: "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800&auto=format&fit=crop",
      altText: "Classic Leather Aviator Jacket in Vintage Black",
      width: 800,
      height: 1000
    },
    images: {
      edges: [
        {
          node: {
            url: "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800&auto=format&fit=crop",
            altText: "Classic Leather Aviator Jacket in Vintage Black",
            width: 800,
            height: 1000
          }
        }
      ]
    },
    variants: {
      edges: [
        {
          node: {
            id: "mock-v2-black-s",
            title: "Vintage Black / S",
            availableForSale: true,
            selectedOptions: [
              { name: "Size", value: "S" },
              { name: "Color", value: "Vintage Black" }
            ],
            price: { amount: "450.00", currencyCode: "USD" },
            compareAtPrice: null
          }
        },
        {
          node: {
            id: "mock-v2-black-m",
            title: "Vintage Black / M",
            availableForSale: true,
            selectedOptions: [
              { name: "Size", value: "M" },
              { name: "Color", value: "Vintage Black" }
            ],
            price: { amount: "450.00", currencyCode: "USD" },
            compareAtPrice: { amount: "520.00", currencyCode: "USD" }
          }
        }
      ]
    },
    seo: {
      title: "Classic Leather Aviator Jacket | Maison",
      description: "Buy full grain lambskin leather aviator jacket with detachable shearling collar."
    },
    tags: ["outerwear", "leather", "jacket"],
    updatedAt: "2026-06-01T00:00:00Z"
  },
  {
    id: "mock-p3",
    handle: "oversized-shearling-coat",
    availableForSale: true,
    title: "Oversized Shearling Coat",
    description: "An absolute luxury statement piece. Crafted with a plush shearling interior and soft suede exterior, this oversized coat offers incomparable warmth and comfort. Designed with drop shoulders, extra-wide lapels, and deep patch pockets.",
    descriptionHtml: "<p>An absolute luxury statement piece. Crafted with a plush shearling interior and soft suede exterior, this oversized coat offers incomparable warmth and comfort. Designed with drop shoulders, extra-wide lapels, and deep patch pockets.</p>",
    options: [
      { id: "opt-p3-size", name: "Size", values: ["XS-S", "M-L"] },
      { id: "opt-p3-color", name: "Color", values: ["Sand Beige"] }
    ],
    priceRange: {
      minVariantPrice: { amount: "520.00", currencyCode: "USD" },
      maxVariantPrice: { amount: "520.00", currencyCode: "USD" }
    },
    featuredImage: {
      url: "https://images.unsplash.com/photo-1544923246-77307dd654cb?q=80&w=800&auto=format&fit=crop",
      altText: "Oversized Shearling Coat in Sand Beige",
      width: 800,
      height: 1000
    },
    images: {
      edges: [
        {
          node: {
            url: "https://images.unsplash.com/photo-1544923246-77307dd654cb?q=80&w=800&auto=format&fit=crop",
            altText: "Oversized Shearling Coat",
            width: 800,
            height: 1000
          }
        }
      ]
    },
    variants: {
      edges: [
        {
          node: {
            id: "mock-v3-sand-xs-s",
            title: "Sand Beige / XS-S",
            availableForSale: true,
            selectedOptions: [
              { name: "Size", value: "XS-S" },
              { name: "Color", value: "Sand Beige" }
            ],
            price: { amount: "520.00", currencyCode: "USD" },
            compareAtPrice: null
          }
        },
        {
          node: {
            id: "mock-v3-sand-m-l",
            title: "Sand Beige / M-L",
            availableForSale: true,
            selectedOptions: [
              { name: "Size", value: "M-L" },
              { name: "Color", value: "Sand Beige" }
            ],
            price: { amount: "520.00", currencyCode: "USD" },
            compareAtPrice: null
          }
        }
      ]
    },
    seo: {
      title: "Oversized Shearling Coat | Maison",
      description: "Ultra luxury oversized shearling coat for ultimate winter warmth."
    },
    tags: ["outerwear", "shearling", "winter"],
    updatedAt: "2026-06-01T00:00:00Z"
  },
  {
    id: "mock-p4",
    handle: "pure-cashmere-turtleneck",
    availableForSale: true,
    title: "Pure Cashmere Turtleneck Sweater",
    description: "An essential layering foundation, knitted from ultra-soft, grade-A 100% Mongolian cashmere. Extremely lightweight yet providing exceptional thermal regulation. Finished with elegant ribbed cuffs, collar, and hem.",
    descriptionHtml: "<p>An essential layering foundation, knitted from ultra-soft, grade-A 100% Mongolian cashmere. Extremely lightweight yet providing exceptional thermal regulation. Finished with elegant ribbed cuffs, collar, and hem.</p>",
    options: [
      { id: "opt-p4-size", name: "Size", values: ["S", "M", "L", "XL"] },
      { id: "opt-p4-color", name: "Color", values: ["Oatmeal Beige", "Heather Grey", "Ivory"] }
    ],
    priceRange: {
      minVariantPrice: { amount: "220.00", currencyCode: "USD" },
      maxVariantPrice: { amount: "220.00", currencyCode: "USD" }
    },
    featuredImage: {
      url: "https://images.unsplash.com/photo-1574169208507-84376144848b?q=80&w=800&auto=format&fit=crop",
      altText: "Pure Cashmere Turtleneck Sweater in Oatmeal Beige",
      width: 800,
      height: 1000
    },
    images: {
      edges: [
        {
          node: {
            url: "https://images.unsplash.com/photo-1574169208507-84376144848b?q=80&w=800&auto=format&fit=crop",
            altText: "Pure Cashmere Turtleneck Sweater",
            width: 800,
            height: 1000
          }
        }
      ]
    },
    variants: {
      edges: [
        {
          node: {
            id: "mock-v4-oat-s",
            title: "Oatmeal Beige / S",
            availableForSale: true,
            selectedOptions: [
              { name: "Size", value: "S" },
              { name: "Color", value: "Oatmeal Beige" }
            ],
            price: { amount: "220.00", currencyCode: "USD" },
            compareAtPrice: null
          }
        },
        {
          node: {
            id: "mock-v4-oat-m",
            title: "Oatmeal Beige / M",
            availableForSale: true,
            selectedOptions: [
              { name: "Size", value: "M" },
              { name: "Color", value: "Oatmeal Beige" }
            ],
            price: { amount: "220.00", currencyCode: "USD" },
            compareAtPrice: null
          }
        },
        {
          node: {
            id: "mock-v4-grey-m",
            title: "Heather Grey / M",
            availableForSale: true,
            selectedOptions: [
              { name: "Size", value: "M" },
              { name: "Color", value: "Heather Grey" }
            ],
            price: { amount: "220.00", currencyCode: "USD" },
            compareAtPrice: null
          }
        }
      ]
    },
    seo: {
      title: "Pure Cashmere Turtleneck Sweater | Maison",
      description: "Indulge in 100% Mongolian Cashmere Turtleneck sweaters."
    },
    tags: ["knitwear", "cashmere", "sweater"],
    updatedAt: "2026-06-01T00:00:00Z"
  },
  {
    id: "mock-p5",
    handle: "ribbed-mohair-cardigan",
    availableForSale: true,
    title: "Ribbed Mohair Cardigan",
    description: "Spun from a delicate blend of fluffy kid mohair and fine merino wool, this open-front cardigan features a rich chunky ribbed texture, tortoise-shell buttons, and a slightly cropped, voluminous sleeve silhouette.",
    descriptionHtml: "<p>Spun from a delicate blend of fluffy kid mohair and fine merino wool, this open-front cardigan features a rich chunky ribbed texture, tortoise-shell buttons, and a slightly cropped, voluminous sleeve silhouette.</p>",
    options: [
      { id: "opt-p5-size", name: "Size", values: ["S", "M", "L"] },
      { id: "opt-p5-color", name: "Color", values: ["Charcoal Grey", "Desert Rose"] }
    ],
    priceRange: {
      minVariantPrice: { amount: "240.00", currencyCode: "USD" },
      maxVariantPrice: { amount: "240.00", currencyCode: "USD" }
    },
    featuredImage: {
      url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=800&auto=format&fit=crop",
      altText: "Ribbed Mohair Cardigan in Charcoal Grey",
      width: 800,
      height: 1000
    },
    images: {
      edges: [
        {
          node: {
            url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=800&auto=format&fit=crop",
            altText: "Ribbed Mohair Cardigan in Charcoal Grey",
            width: 800,
            height: 1000
          }
        }
      ]
    },
    variants: {
      edges: [
        {
          node: {
            id: "mock-v5-charcoal-s",
            title: "Charcoal Grey / S",
            availableForSale: true,
            selectedOptions: [
              { name: "Size", value: "S" },
              { name: "Color", value: "Charcoal Grey" }
            ],
            price: { amount: "240.00", currencyCode: "USD" },
            compareAtPrice: null
          }
        },
        {
          node: {
            id: "mock-v5-charcoal-m",
            title: "Charcoal Grey / M",
            availableForSale: true,
            selectedOptions: [
              { name: "Size", value: "M" },
              { name: "Color", value: "Charcoal Grey" }
            ],
            price: { amount: "240.00", currencyCode: "USD" },
            compareAtPrice: null
          }
        }
      ]
    },
    seo: {
      title: "Chunky Ribbed Mohair Cardigan | Maison",
      description: "Luxury open cardigan in soft fluffy mohair blend."
    },
    tags: ["knitwear", "mohair", "cardigan"],
    updatedAt: "2026-06-01T00:00:00Z"
  },
  {
    id: "mock-p6",
    handle: "chunky-cable-knit-sweater",
    availableForSale: true,
    title: "Chunky Cable-Knit Wool Sweater",
    description: "Embodying a heritage spirit with a contemporary cut. This chunky cable-knit sweater is spun from 100% thick, insulating Highland wool. Designed with high-relief honeycomb and cable patterns for a heavy, comforting feel.",
    descriptionHtml: "<p>Embodying a heritage spirit with a contemporary cut. This chunky cable-knit sweater is spun from 100% thick, insulating Highland wool. Designed with high-relief honeycomb and cable patterns for a heavy, comforting feel.</p>",
    options: [
      { id: "opt-p6-size", name: "Size", values: ["S", "M", "L"] },
      { id: "opt-p6-color", name: "Color", values: ["Cream White", "Moss Green"] }
    ],
    priceRange: {
      minVariantPrice: { amount: "180.00", currencyCode: "USD" },
      maxVariantPrice: { amount: "180.00", currencyCode: "USD" }
    },
    featuredImage: {
      url: "https://images.unsplash.com/photo-1614975058789-41316d0e2e9c?q=80&w=800&auto=format&fit=crop",
      altText: "Chunky Cable-Knit Wool Sweater in Cream White",
      width: 800,
      height: 1000
    },
    images: {
      edges: [
        {
          node: {
            url: "https://images.unsplash.com/photo-1614975058789-41316d0e2e9c?q=80&w=800&auto=format&fit=crop",
            altText: "Chunky Cable-Knit Wool Sweater in Cream White",
            width: 800,
            height: 1000
          }
        }
      ]
    },
    variants: {
      edges: [
        {
          node: {
            id: "mock-v6-cream-m",
            title: "Cream White / M",
            availableForSale: true,
            selectedOptions: [
              { name: "Size", value: "M" },
              { name: "Color", value: "Cream White" }
            ],
            price: { amount: "180.00", currencyCode: "USD" },
            compareAtPrice: null
          }
        }
      ]
    },
    seo: {
      title: "Heritage Chunky Cable-Knit Wool Sweater | Maison",
      description: "Authentic heavy cable knit wool sweater."
    },
    tags: ["knitwear", "wool", "sweater"],
    updatedAt: "2026-06-01T00:00:00Z"
  },
  {
    id: "mock-p7",
    handle: "premium-leather-weekend-bag",
    availableForSale: true,
    title: "Premium Leather Weekend Bag",
    description: "The ultimate travel companion. Crafted from water-resistant, vegetable-tanned Italian calfskin leather. Features a spacious main compartment lined with durable cotton canvas, inside zip compartments, and a removable padded shoulder strap.",
    descriptionHtml: "<p>The ultimate travel companion. Crafted from water-resistant, vegetable-tanned Italian calfskin leather. Features a spacious main compartment lined with durable cotton canvas, inside zip compartments, and a removable padded shoulder strap.</p>",
    options: [
      { id: "opt-p7-size", name: "Size", values: ["One Size"] },
      { id: "opt-p7-color", name: "Color", values: ["Cognac Tan", "Ink Black"] }
    ],
    priceRange: {
      minVariantPrice: { amount: "320.00", currencyCode: "USD" },
      maxVariantPrice: { amount: "320.00", currencyCode: "USD" }
    },
    featuredImage: {
      url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop",
      altText: "Premium Leather Weekend Bag in Cognac Tan",
      width: 800,
      height: 1000
    },
    images: {
      edges: [
        {
          node: {
            url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop",
            altText: "Premium Leather Weekend Bag in Cognac Tan",
            width: 800,
            height: 1000
          }
        }
      ]
    },
    variants: {
      edges: [
        {
          node: {
            id: "mock-v7-cognac-os",
            title: "Cognac Tan / One Size",
            availableForSale: true,
            selectedOptions: [
              { name: "Size", value: "One Size" },
              { name: "Color", value: "Cognac Tan" }
            ],
            price: { amount: "320.00", currencyCode: "USD" },
            compareAtPrice: null
          }
        }
      ]
    },
    seo: {
      title: "Premium Calfskin Leather Weekend Duffel Bag | Maison",
      description: "Fine Italian leather travel weekend bag."
    },
    tags: ["accessories", "leather", "bag"],
    updatedAt: "2026-06-01T00:00:00Z"
  },
  {
    id: "mock-p8",
    handle: "fringed-cashmere-scarf",
    availableForSale: true,
    title: "Fringed Cashmere Scarf",
    description: "Wrap yourself in absolute comfort. Woven in a historic Scottish mill from pure, luxurious cashmere fibers, detailed with delicate fringes at both ends. Extra-wide width allows it to be styled as a wrap or draped elegantly.",
    descriptionHtml: "<p>Wrap yourself in absolute comfort. Woven in a historic Scottish mill from pure, luxurious cashmere fibers, detailed with delicate fringes at both ends. Extra-wide width allows it to be styled as a wrap or draped elegantly.</p>",
    options: [
      { id: "opt-p8-size", name: "Size", values: ["One Size"] },
      { id: "opt-p8-color", name: "Color", values: ["Heather Grey", "Camel"] }
    ],
    priceRange: {
      minVariantPrice: { amount: "95.00", currencyCode: "USD" },
      maxVariantPrice: { amount: "95.00", currencyCode: "USD" }
    },
    featuredImage: {
      url: "https://images.unsplash.com/photo-1520635292-a440f99693cf?q=80&w=800&auto=format&fit=crop",
      altText: "Fringed Cashmere Scarf in Heather Grey",
      width: 800,
      height: 1000
    },
    images: {
      edges: [
        {
          node: {
            url: "https://images.unsplash.com/photo-1520635292-a440f99693cf?q=80&w=800&auto=format&fit=crop",
            altText: "Fringed Cashmere Scarf in Heather Grey",
            width: 800,
            height: 1000
          }
        }
      ]
    },
    variants: {
      edges: [
        {
          node: {
            id: "mock-v8-grey-os",
            title: "Heather Grey / One Size",
            availableForSale: true,
            selectedOptions: [
              { name: "Size", value: "One Size" },
              { name: "Color", value: "Heather Grey" }
            ],
            price: { amount: "95.00", currencyCode: "USD" },
            compareAtPrice: null
          }
        }
      ]
    },
    seo: {
      title: "Scottish Woven Fringed Cashmere Scarf | Maison",
      description: "100% fine cashmere scarf woven in Scotland."
    },
    tags: ["accessories", "cashmere", "scarf"],
    updatedAt: "2026-06-01T00:00:00Z"
  }
];

export const MOCK_COLLECTIONS: Collection[] = [
  {
    handle: "outerwear",
    title: "Outerwear",
    description: "Premium coats, trench coats, shearling, and leather jackets built for structure and warmth.",
    seo: {
      title: "Premium Outerwear Collection | Maison",
      description: "Discover Italian wool coats, shearling jackets, and luxury tailored trench coats."
    },
    updatedAt: "2026-06-01T00:00:00Z",
    path: "/collections/outerwear",
    image: {
      url: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=600&auto=format&fit=crop",
      altText: "Outerwear Collection Preview",
      width: 600,
      height: 800
    }
  },
  {
    handle: "knitwear",
    title: "Knitwear",
    description: "Grade-A Mongolian cashmere, kid mohair cardigans, and chunky cable-knit sweaters.",
    seo: {
      title: "Luxury Knitwear Collection | Maison",
      description: "Discover pure cashmere, mohair, and fine merino wool sweaters."
    },
    updatedAt: "2026-06-01T00:00:00Z",
    path: "/collections/knitwear",
    image: {
      url: "https://images.unsplash.com/photo-1614975058789-41316d0e2e9c?q=80&w=600&auto=format&fit=crop",
      altText: "Knitwear Collection Preview",
      width: 600,
      height: 800
    }
  },
  {
    handle: "accessories",
    title: "Accessories",
    description: "Calfskin weekend duffels, luxury cashmere scarves, and premium wardrobe accents.",
    seo: {
      title: "Premium Accessories Collection | Maison",
      description: "Discover Italian leather travel bags and woven cashmere scarves."
    },
    updatedAt: "2026-06-01T00:00:00Z",
    path: "/collections/accessories",
    image: {
      url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600&auto=format&fit=crop",
      altText: "Accessories Collection Preview",
      width: 600,
      height: 800
    }
  }
];

// ==========================================
// API HELPER FUNCTIONS
// ==========================================

export async function shopifyFetch<T>({
  cache = "force-cache",
  query,
  tags,
  variables,
}: ShopifyFetchParams): Promise<{ status: number; body: T } | never> {
  if (!domain || !key || domain.includes("your-store-domain")) {
    throw new Error("Shopify credentials not set");
  }

  try {
    const result = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": key,
      },
      body: JSON.stringify({
        ...(query && { query }),
        ...(variables && { variables }),
      }),
      cache,
      ...(tags && { next: { tags } }),
    });

    const body = await result.json();

    if (body.errors) {
      throw new Error(body.errors[0].message);
    }

    return {
      status: result.status,
      body,
    };
  } catch (error) {
    throw {
      error,
      query,
    };
  }
}

const removeEdgesAndNodes = <T>(array: Connection<T>) => {
  if (!array || !array.edges) return [];
  return array.edges.map((edge) => edge?.node);
};

export async function getProducts({ query, sortKey, reverse }: { query?: string, sortKey?: string, reverse?: boolean } = {}): Promise<Product[]> {
  try {
    const res = await shopifyFetch<{ data: { products: Connection<Product> } }>({
      query: getProductsQuery,
      variables: { query, sortKey, reverse },
      tags: ["products"],
      cache: "no-store"
    });
    const items = removeEdgesAndNodes(res.body.data.products);
    return items.length > 0 ? items : MOCK_PRODUCTS;
  } catch (error) {
    console.warn("Failed to get products (Shopify credentials missing or invalid). Using premium fallbacks.");
    return MOCK_PRODUCTS;
  }
}

export async function getProduct(handle: string): Promise<Product | undefined> {
  try {
    const res = await shopifyFetch<{ data: { product: Product } }>({
      query: getProductQuery,
      variables: { handle },
      tags: ["products"],
      cache: "no-store"
    });
    return res.body.data.product || MOCK_PRODUCTS.find((p) => p.handle === handle);
  } catch (error) {
    console.warn(`Failed to get product ${handle}. Using premium fallbacks.`);
    return MOCK_PRODUCTS.find((p) => p.handle === handle);
  }
}

export async function getCollections(): Promise<Collection[]> {
  try {
    const res = await shopifyFetch<{ data: { collections: Connection<Collection> } }>({
      query: getCollectionsQuery,
      tags: ["collections"],
      cache: "no-store"
    });
    const items = removeEdgesAndNodes(res.body.data.collections);
    return items.length > 0 ? items : MOCK_COLLECTIONS;
  } catch (error) {
    console.warn("Failed to get collections. Using premium fallbacks.");
    return MOCK_COLLECTIONS;
  }
}

export async function getCollectionProducts(handle: string): Promise<Product[]> {
  try {
    const res = await shopifyFetch<{ data: { collection: { products: Connection<Product> } } }>({
      query: getCollectionProductsQuery,
      variables: { handle },
      tags: ["collections", "products"],
      cache: "no-store"
    });
    if (!res.body.data.collection) {
      return MOCK_PRODUCTS.filter((p) => p.tags.includes(handle));
    }
    const items = removeEdgesAndNodes(res.body.data.collection.products);
    return items.length > 0 ? items : MOCK_PRODUCTS.filter((p) => p.tags.includes(handle));
  } catch (error) {
    console.warn(`Failed to get collection products for ${handle}. Using premium fallbacks.`);
    return MOCK_PRODUCTS.filter((p) => p.tags.includes(handle));
  }
}

export async function createCart(): Promise<Cart> {
  const res = await shopifyFetch<{ data: { cartCreate: { cart: Cart } } }>({
    query: createCartMutation,
    cache: "no-store",
  });
  return res.body.data.cartCreate.cart;
}

export async function addToCart(cartId: string, lines: { merchandiseId: string; quantity: number }[]): Promise<Cart> {
  const res = await shopifyFetch<{ data: { cartLinesAdd: { cart: Cart } } }>({
    query: addToCartMutation,
    variables: { cartId, lines },
    cache: "no-store",
  });
  return res.body.data.cartLinesAdd.cart;
}

export async function removeFromCart(cartId: string, lineIds: string[]): Promise<Cart> {
  const res = await shopifyFetch<{ data: { cartLinesRemove: { cart: Cart } } }>({
    query: removeFromCartMutation,
    variables: { cartId, lineIds },
    cache: "no-store",
  });
  return res.body.data.cartLinesRemove.cart;
}

export async function updateCart(cartId: string, lines: { id: string; merchandiseId: string; quantity: number }[]): Promise<Cart> {
  const res = await shopifyFetch<{ data: { cartLinesUpdate: { cart: Cart } } }>({
    query: updateCartMutation,
    variables: { cartId, lines },
    cache: "no-store",
  });
  return res.body.data.cartLinesUpdate.cart;
}

export async function getCart(cartId: string): Promise<Cart | undefined> {
  try {
    const res = await shopifyFetch<{ data: { cart: Cart } }>({
      query: getCartQuery,
      variables: { cartId },
      cache: "no-store",
    });
    return res.body.data.cart;
  } catch (error) {
    console.warn("Failed to get cart.");
    return undefined;
  }
}

export async function createCustomer(input: any) {
  const res = await shopifyFetch<{
    data: {
      customerCreate: {
        customer: any;
        customerUserErrors: Array<{ code: string; field: string[]; message: string }>;
      };
    };
  }>({
    query: customerCreateMutation,
    variables: { input },
    cache: "no-store",
  });
  return res.body.data.customerCreate;
}

export async function createCustomerAccessToken(input: any) {
  const res = await shopifyFetch<{
    data: {
      customerAccessTokenCreate: {
        customerAccessToken: { accessToken: string; expiresAt: string } | null;
        customerUserErrors: Array<{ code: string; field: string[]; message: string }>;
      };
    };
  }>({
    query: customerAccessTokenCreateMutation,
    variables: { input },
    cache: "no-store",
  });
  return res.body.data.customerAccessTokenCreate;
}

export async function getCustomer(customerAccessToken: string) {
  const res = await shopifyFetch<{
    data: {
      customer: any;
    };
  }>({
    query: getCustomerQuery,
    variables: { customerAccessToken },
    cache: "no-store",
  });
  return res.body.data.customer;
}


