export interface LineFriend {
  id: number
  title: string
  body_html: string
  vendor: string
  product_type: string
  created_at: Date
  handle: string
  updated_at: Date
  published_at: Date
  template_suffix: string
  published_scope: string
  tags: string
  variants: Variant[]
  options: Option[]
  images: Image[]
  image: Image
}

export interface Image {
  id: number
  product_id: number
  position: number
  created_at: Date
  updated_at: Date
  alt: null
  width: number
  height: number
  src: string
  variant_ids: any[]
}

export interface Option {
  id: number
  product_id: number
  name: string
  position: number
  values: string[]
}

export interface Variant {
  id: number
  product_id: number
  title: string
  price: string
  sku: string
  position: number
  compare_at_price: string
  fulfillment_service: string
  inventory_management: string
  option1: string
  option2: null
  option3: null
  created_at: Date
  updated_at: Date
  taxable: boolean
  barcode: string
  grams: number
  image_id: null
  weight: number
  weight_unit: string
  requires_shipping: boolean
}

// const fileRaw = await Deno.readFile('line_friends.json')
// const file = new TextDecoder().decode(fileRaw)
const
const data: LineFriend[] = JSON.parse(file)

const removeHtml = (str: string) => str.replace(/(<([^>]+)>)/gi, '')

const result = data.map(d => {
  const overview = removeHtml(d.body_html)
    .replace(/\n/g, ' ')
    .replace(/&amp;/g, '&')
    .replace('Overview:', '')
    .replace(/\s\s+/g, ' ')
    .trim()
  return [
    d.id,
    d.title,
    d.image.src.replace(/\.jpg.*/, "_600x.jpg"),
    d.variants[0]?.price.replace('.', '') || '0',
    overview,
  ]
})
console.log(JSON.stringify(result, null, 2))

// console.log('<ul>')
// console.log(result.map(x => {
//   return `
// <li>
// <img src="${x[2]}"" />
// <div>${x[1]}</div>
// <div>${x[3]}</div>
// <div>${x[4]}</div>
// </li>`
// }).join("\n"))

// console.log('</ul>')
