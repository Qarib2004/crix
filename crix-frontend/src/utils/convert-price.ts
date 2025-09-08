export function convertPrice(price: number) {
    return price.toLocaleString('az-AZ', {
        style: 'currency',
        currency: 'AZN'
    })
}
