import { NextResponse } from 'next/server'
import formidable from 'formidable'
import { Readable } from 'stream'

// Disable default body parsing
export const config = {
  api: {
    bodyParser: false,
  },
}

// Skin conditions and mapped product names
const CONDITIONS = [
  'Blackheads', 'Whiteheads', 'Pustules', 'Papules', 'Cystic Acne',
  'Nodular Acne', 'Post-Acne Marks', 'Melasma', 'Sun Spots', 'Freckles',
  'PIH', 'Hypopigmentation', 'Roughness', 'Enlarged Pores', 'Clogged Pores',
  'Milia/Bumpy Skin', 'Flakiness', 'Fine Lines', 'Wrinkles', 'Sagging Skin',
  'Crow’s Feet', 'Smile Lines', 'Uneven Skin Tone', 'Dullness', 'Redness',
  'Yellow Skin', 'Oily Skin', 'Dry/Dehydrated Skin', 'Combination Skin',
  'Seborrheic Zones', 'Irritation / Red Patches', 'Rosacea (early)',
  'Contact Dermatitis', 'Barrier Damage',
]

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
  'Barrier Damage': ['Ceramide Repair Balm'],
}

// Full product data (title, desc, price, usage, image)
const FULL_PRODUCT_CATALOG = {
  'Charcoal Cleanser': {
    title: 'Charcoal Detox Cleanser',
    description: 'Deep cleans pores and removes excess oil.',
    price: 22.0,
    usage: ['Morning'],
    image: 'https://via.placeholder.com/80x80?text=Charcoal',
  },
  'BHA Exfoliant': {
    title: '2% BHA Liquid Exfoliant',
    description: 'Unclogs pores and smooths skin texture.',
    price: 32.0,
    usage: ['Evening'],
    image: 'https://via.placeholder.com/80x80?text=BHA',
  },
  'Benzoyl Peroxide Gel': {
    title: 'Benzoyl Peroxide Spot Gel',
    description: 'Targets acne-causing bacteria effectively.',
    price: 25.0,
    usage: ['Morning', 'Evening'],
    image: 'https://via.placeholder.com/80x80?text=BPO',
  },
  'Clinique Take The Day Off™ Cleansing Balm': {
    title: 'Clinique Take The Day Off™ Cleansing Balm',
    description: 'Gently removes makeup, sunscreen, and impurities.',
    price: 38.4,
    usage: ['Evening'],
    image: 'https://via.placeholder.com/80x80?text=Clinique',
  },
  'Avocado Ceramide Moisture Barrier Cleanser': {
    title: 'Avocado Ceramide Moisture Barrier Cleanser',
    description: 'Cleans deeply while maintaining skin’s balance.',
    price: 28.0,
    usage: ['Morning', 'Evening'],
    image: 'https://via.placeholder.com/80x80?text=Avocado',
  },
  'Retinol Treatment': {
    title: 'Advanced Retinol Night Treatment',
    description: 'Fights wrinkles and fine lines overnight.',
    price: 45.0,
    usage: ['Evening'],
    image: 'https://via.placeholder.com/80x80?text=Retinol',
  },
  'Clay Mask': {
    title: 'Oil-Absorbing Clay Mask',
    description: 'Removes impurities and tightens pores.',
    price: 18.0,
    usage: ['Evening'],
    image: 'https://via.placeholder.com/80x80?text=ClayMask',
  },
  'Niacinamide Serum': {
    title: 'Niacinamide 10% Brightening Serum',
    description: 'Improves skin texture and tone.',
    price: 27.5,
    usage: ['Morning', 'Evening'],
    image: 'https://via.placeholder.com/80x80?text=Niacinamide',
  },
  'Vitamin C Serum': {
    title: 'Vitamin C Radiance Serum',
    description: 'Brightens and reduces dark spots.',
    price: 34.99,
    usage: ['Morning'],
    image: 'https://via.placeholder.com/80x80?text=Vit+C',
  },
  'Niacinamide Toner': {
    title: 'Pore Refining Niacinamide Toner',
    description: 'Minimizes pores and balances skin.',
    price: 21.0,
    usage: ['Morning', 'Evening'],
    image: 'https://via.placeholder.com/80x80?text=Toner',
  },
  'Brightening Cream': {
    title: 'Melasma Brightening Cream',
    description: 'Targets melasma and hyperpigmentation.',
    price: 39.0,
    usage: ['Evening'],
    image: 'https://via.placeholder.com/80x80?text=Bright',
  },
  'Sunscreen SPF 50+': {
    title: 'Broad Spectrum SPF 50+ Sunscreen',
    description: 'Protects against harmful UV rays.',
    price: 19.99,
    usage: ['Morning'],
    image: 'https://via.placeholder.com/80x80?text=SPF50',
  },
  'Azelaic Acid Serum': {
    title: 'Azelaic Acid 10% Refining Serum',
    description: 'Fades post-inflammatory pigmentation.',
    price: 30.0,
    usage: ['Evening'],
    image: 'https://via.placeholder.com/80x80?text=Azelaic',
  },
  'Lactic Acid Exfoliant': {
    title: 'Lactic Acid 5% Gentle Exfoliant',
    description: 'Improves skin roughness and tone.',
    price: 23.0,
    usage: ['Evening'],
    image: 'https://via.placeholder.com/80x80?text=Lactic',
  },
  'Pore-Minimizing Toner': {
    title: 'Daily Pore-Minimizing Toner',
    description: 'Refines and tightens enlarged pores.',
    price: 20.0,
    usage: ['Morning'],
    image: 'https://via.placeholder.com/80x80?text=Pores',
  },
  'Salicylic Acid Cleanser': {
    title: '2% Salicylic Acid Cleanser',
    description: 'Deep cleans pores and prevents acne.',
    price: 24.0,
    usage: ['Morning', 'Evening'],
    image: 'https://via.placeholder.com/80x80?text=SA+Cleanser',
  },
  'Exfoliating Pads': {
    title: 'Glycolic Acid Exfoliating Pads',
    description: 'Removes dead skin and smooths texture.',
    price: 29.0,
    usage: ['Evening'],
    image: 'https://via.placeholder.com/80x80?text=Pads',
  },
  'Hydrating Moisturizer': {
    title: 'Intense Hydration Moisturizer',
    description: 'Nourishes and restores dry skin.',
    price: 26.0,
    usage: ['Morning', 'Evening'],
    image: 'https://via.placeholder.com/80x80?text=Hydrate',
  },
  'Peptide Serum': {
    title: 'Firming Peptide Serum',
    description: 'Boosts collagen and elasticity.',
    price: 40.0,
    usage: ['Evening'],
    image: 'https://via.placeholder.com/80x80?text=Peptides',
  },
  'Anti-aging Night Cream': {
    title: 'Night Renewal Anti-aging Cream',
    description: 'Reduces wrinkles and nourishes overnight.',
    price: 42.0,
    usage: ['Evening'],
    image: 'https://via.placeholder.com/80x80?text=AntiAge',
  },
  'Ceramide Repair Balm': {
    title: 'Ceramide Barrier Repair Balm',
    description: 'Rebuilds and protects the skin barrier.',
    price: 35.0,
    usage: ['Evening'],
    image: 'https://via.placeholder.com/80x80?text=Ceramide',
  },
  'Glow Booster Serum': {
    title: 'Glow Booster Serum',
    description: 'Revives dull and tired-looking skin.',
    price: 30.0,
    usage: ['Morning'],
    image: 'https://via.placeholder.com/80x80?text=Glow',
  },
}


// Convert the Next.js request to a Node.js Readable stream
async function streamToNodeReadable(webRequest) {
  const reader = webRequest.body.getReader()
  const stream = new Readable({
    async read() {
      const { done, value } = await reader.read()
      if (done) this.push(null)
      else this.push(value)
    },
  })
  return stream
}

// Main POST handler
export async function POST(req) {
  try {
    const contentType = req.headers.get('content-type')
    const contentLength = req.headers.get('content-length')

    if (!contentType?.includes('multipart/form-data')) {
      return NextResponse.json({ error: 'Unsupported content-type' }, { status: 400 })
    }

    const nodeReadable = await streamToNodeReadable(req)

    nodeReadable.headers = {
      'content-type': contentType,
      'content-length': contentLength,
    }

    const form = formidable({ multiples: false, keepExtensions: true })

    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(nodeReadable, (err, fields, files) => {
        if (err) reject(err)
        else resolve({ fields, files })
      })
    })

    const image = files.image
    if (!image) throw new Error('No image uploaded')

    // Select random conditions and related product names
    const shuffled = CONDITIONS.sort(() => 0.5 - Math.random())
    const selectedConditions = shuffled.slice(0, Math.floor(Math.random() * 3) + 2)

    const flatProducts = selectedConditions.flatMap(condition => PRODUCT_MAP[condition] || [])
    const uniqueProducts = Array.from(new Set(flatProducts))

    const recommendedProducts = uniqueProducts.map((name, index) => {
      const productData = FULL_PRODUCT_CATALOG[name] || {
        title: name,
        description: 'No description available.',
        price: 20.0,
        usage: ['Morning'],
        image: 'https://via.placeholder.com/80x80?text=Product',
      }

      const stepTitle = name.toLowerCase().includes('cleanser')
        ? 'Cleanser'
        : index === 0
        ? 'Make up remover'
        : `Step ${index + 1}`

      return {
        stepTitle,
        description: productData.description,
        product: {
          name: productData.title,
          image: productData.image,
          price: productData.price.toFixed(2),
          timeOfDay: productData.usage.join(' • '),
        },
      }
    })

    return NextResponse.json({
      analysis: selectedConditions.map(condition => ({
        name: condition,
        status: ['Bad', 'Average', 'Good'][Math.floor(Math.random() * 3)],
        score: Math.floor(Math.random() * 41) + 60,
      })),
      recommendations: recommendedProducts,
    })
  } catch (err) {
    return NextResponse.json({ error: 'Upload failed: ' + err.message }, { status: 500 })
  }
}
