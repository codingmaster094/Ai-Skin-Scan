import { NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import path from 'path'

export const config = {
  api: {
    bodyParser: false,
  },
}

const CONDITIONS = [
  'Blackheads',
  'Whiteheads',
  'Pustules',
  'Papules',
  'Cystic Acne',
  'Nodular Acne',
  'Post-Acne Marks',
  'Melasma',
  'Sun Spots',
  'Freckles',
  'PIH',
  'Hypopigmentation',
  'Roughness',
  'Enlarged Pores',
  'Clogged Pores',
  'Milia/Bumpy Skin',
  'Flakiness',
  'Fine Lines',
  'Wrinkles',
  'Sagging Skin',
  'Crow’s Feet',
  'Smile Lines',
  'Uneven Skin Tone',
  'Dullness',
  'Redness',
  'Yellow Skin',
  'Oily Skin',
  'Dry/Dehydrated Skin',
  'Combination Skin',
  'Seborrheic Zones',
  'Irritation / Red Patches',
  'Rosacea (early)',
  'Contact Dermatitis',
  'Barrier Damage'
]

// Dummy product suggestions (can be expanded later)
const PRODUCT_MAP = {
  'Blackheads': ['Charcoal Cleanser', 'BHA Exfoliant'],
  'Whiteheads': ['Gentle Exfoliating Scrub'],
  'Pustules': ['Benzoyl Peroxide Gel'],
  'Papules': ['Niacinamide Serum'],
  'Cystic Acne': ['Retinol Treatment', 'Clay Mask'],
  'Nodular Acne': ['Prescription Spot Treatment'],
  'Post-Acne Marks': ['Vitamin C Serum', 'Niacinamide Toner'],
  'Melasma': ['Brightening Cream', 'Sunscreen SPF 50+'],
  'Sun Spots': ['Retinol Cream', 'Dark Spot Corrector'],
  'Freckles': ['SPF Sunscreen', 'Brightening Essence'],
  'PIH': ['Azelaic Acid Serum'],
  'Hypopigmentation': ['Hydrating Barrier Cream'],
  'Roughness': ['Lactic Acid Exfoliant'],
  'Enlarged Pores': ['Pore-Minimizing Toner', 'Niacinamide Booster'],
  'Clogged Pores': ['Salicylic Acid Cleanser'],
  'Milia/Bumpy Skin': ['Exfoliating Pads'],
  'Flakiness': ['Hydrating Moisturizer'],
  'Fine Lines': ['Peptide Serum'],
  'Wrinkles': ['Retinol Serum', 'Anti-aging Night Cream'],
  'Sagging Skin': ['Firming Moisturizer'],
  'Crow’s Feet': ['Eye Cream with Retinol'],
  'Smile Lines': ['Plumping Serum'],
  'Uneven Skin Tone': ['Vitamin C + E Serum'],
  'Dullness': ['Glow Booster Serum'],
  'Redness': ['Soothing Aloe Gel'],
  'Yellow Skin': ['Brightening Mask'],
  'Oily Skin': ['Oil-Control Gel', 'Clay Cleanser'],
  'Dry/Dehydrated Skin': ['Hyaluronic Acid Serum'],
  'Combination Skin': ['Balanced Moisturizer'],
  'Seborrheic Zones': ['Zinc Pyrithione Cream'],
  'Irritation / Red Patches': ['Barrier Repair Cream'],
  'Rosacea (early)': ['Gentle Calming Cream'],
  'Contact Dermatitis': ['Fragrance-Free Moisturizer'],
  'Barrier Damage': ['Ceramide Repair Balm']
}

function getRandomConditions() {
  const selected = []
  const count = Math.floor(Math.random() * 5) + 3
  while (selected.length < count) {
    const cond = CONDITIONS[Math.floor(Math.random() * CONDITIONS.length)]
    if (!selected.includes(cond)) selected.push(cond)
  }
  return selected
}

export async function POST(req) {
  const data = await req.formData()
  const file = data.get('image')

  // Optional: save file to public (just for mock)
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  const filename = `${Date.now()}_${file.name}`
  await writeFile(path.join(process.cwd(), 'public', filename), buffer)

  const conditions = getRandomConditions()

  const products = []
  conditions.forEach((cond) => {
    if (PRODUCT_MAP[cond]) {
      products.push(...PRODUCT_MAP[cond])
    }
  })

  return NextResponse.json({
    conditions,
    products: [...new Set(products)] // unique list
  })
}
