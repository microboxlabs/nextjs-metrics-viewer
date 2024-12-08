// Get the products from the api ./products/route.ts

export const getProducts = async () => {
  try {
    const response = await fetch('/products')
    const data = await response.json()
    return data
  } catch (error) {
    console.log('Ha ocurrido un error al obtener la data', error);
    return null;
  }
}