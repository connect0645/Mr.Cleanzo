export const WHATSAPP_NUMBER = "919919046633"
export const whatsappLink = (message: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
export const money = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount)

export const categories = [
  "All items",
  "Daily laundry",
  "Men’s wear",
  "Women’s wear",
  "Curtains & linens",
  "Shoe spa",
]
export const catalog = [
  {
    id: "laundry",
    name: "Wash, dry & fold / press",
    price: 89,
    unit: "kg",
    category: "Daily laundry",
  },
  {
    id: "blazer",
    name: "Coat / blazer",
    price: 250,
    unit: "piece",
    category: "Men’s wear",
  },
  {
    id: "sherwani",
    name: "Sherwani",
    price: 250,
    unit: "piece",
    category: "Men’s wear",
  },
  {
    id: "shirt",
    name: "Shirt / kurta",
    price: 90,
    unit: "piece",
    category: "Men’s wear",
  },
  {
    id: "trousers",
    name: "Pants / trousers",
    price: 70,
    unit: "piece",
    category: "Men’s wear",
  },
  {
    id: "jacket",
    name: "Leather jacket",
    price: 350,
    unit: "piece",
    category: "Men’s wear",
  },
  {
    id: "saree",
    name: "Plain saree / Charak",
    price: 200,
    unit: "piece",
    category: "Women’s wear",
  },
  {
    id: "heavy-saree",
    name: "Heavy saree",
    price: 250,
    unit: "piece",
    category: "Women’s wear",
  },
  {
    id: "lehenga",
    name: "Heavy lehenga",
    price: 330,
    unit: "piece",
    category: "Women’s wear",
  },
  {
    id: "kurta",
    name: "Women’s kurta",
    price: 140,
    unit: "piece",
    category: "Women’s wear",
  },
  {
    id: "blouse",
    name: "Blouse",
    price: 50,
    unit: "piece",
    category: "Women’s wear",
  },
  {
    id: "double-blanket",
    name: "Double blanket",
    price: 500,
    unit: "item",
    category: "Curtains & linens",
  },
  {
    id: "single-blanket",
    name: "Single blanket",
    price: 400,
    unit: "item",
    category: "Curtains & linens",
  },
  {
    id: "curtain",
    name: "Curtain dry cleaning",
    price: 140,
    unit: "curtain",
    category: "Curtains & linens",
  },
  {
    id: "bedsheet",
    name: "Bedsheet",
    price: 60,
    unit: "piece",
    category: "Curtains & linens",
  },
  {
    id: "sneakers",
    name: "Sneaker deep clean",
    price: 200,
    unit: "pair",
    category: "Shoe spa",
  },
  {
    id: "leather-shoes",
    name: "Leather shoe care",
    price: 350,
    unit: "pair",
    category: "Shoe spa",
  },
]

export function calculateEstimate(quantities: Record<string, number>) {
  return catalog.reduce(
    (total, item) => total + item.price * Math.max(0, quantities[item.id] || 0),
    0,
  )
}
