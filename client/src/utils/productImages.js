const STATIC_PRODUCT_IMAGES_BY_ID = {
  1: '/DarkSideOfTheMoon.png',
  2: '/IntoTheVoid.png',
  3: '/BackInBlack.jpg',
  4: '/Adele30.png',
  5: '/FutureNostalgia.png',
}

const STATIC_PRODUCT_IMAGES_BY_NAME = {
  '30': '/Adele30.png',
  'dark side of the moon': '/DarkSideOfTheMoon.png',
  'into the void': '/IntoTheVoid.png',
  'back in black': '/BackInBlack.jpg',
  'future nostalgia': '/FutureNostalgia.png',
}

function getBase64ImageSrc(base64) {
  if (!base64) return null
  if (base64.startsWith('/9j/')) return `data:image/jpeg;base64,${base64}`
  if (base64.startsWith('iVBORw')) return `data:image/png;base64,${base64}`
  if (base64.startsWith('UklGR')) return `data:image/webp;base64,${base64}`
  return `data:image/jpeg;base64,${base64}`
}

export function getProductImageSrc(product) {
  const base64Image = getBase64ImageSrc(product?.fotos?.[0]?.imagen)
  if (base64Image) return base64Image

  if (product?.id && STATIC_PRODUCT_IMAGES_BY_ID[product.id]) {
    return STATIC_PRODUCT_IMAGES_BY_ID[product.id]
  }

  const normalizedName = product?.nombre?.trim().toLowerCase()
  if (normalizedName && STATIC_PRODUCT_IMAGES_BY_NAME[normalizedName]) {
    return STATIC_PRODUCT_IMAGES_BY_NAME[normalizedName]
  }

  return null
}
