const sp = supabase.createClient('https://lcryqlqpdqdowkvbpbfw.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxjcnlxbHFwZHFkb3drdmJwYmZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODA3Mjg0OTcsImV4cCI6MTk5NjMwNDQ5N30.mSExOgnGEFt207qykfP6hzIiQ7k9z642ZDR-ucVy4eg')


const cart_page = document.querySelector('.cart_page')
const emptyCart = document.querySelector('.e-cart')
const delivery_methods = document.querySelectorAll('.delivery_method_btn')
const items = []

async function getCart() {
    if(localStorage.getItem('cart')) {
      let cart = JSON.parse(localStorage.getItem('cart'))
      let promises = cart.map(async (cart_item) => {
        const { data: item, error: items_error } = await sp.from('items').select('*, type (name)').eq('id', cart_item.item);
        return { item, cart_item }
      });
      let results = await Promise.all(promises)
      items.push(...results)
      generateCartItems(items)
    } else {
        cart_page.classList.add('hide')
        emptyCart.classList.add('true')
    }
}

const cart_list = document.querySelector('.cart_items_list')

const total = document.querySelector('.total > p')
const delivery_price = document.querySelector('.delivery_info > .price > p')
const items_total = document.querySelector('.items_total > .price > p')

function generateCartItems(items) {
    cart_list.innerHTML = ''

    if(items.length > 0) {
        let total_price = 0
        items.forEach((element, index) => {
            let cart_item = document.createElement('div')
            let controls = document.createElement('div')
            let content = document.createElement('div')
            let image_block = document.createElement('div')
            let image = document.createElement('img')
            let text = document.createElement('div')
            let text_p = document.createElement('p')
            let details = document.createElement('div')
            let details_type = document.createElement('p')
            let details_amount = document.createElement('p')
            let price = document.createElement('div')
            let price_p = document.createElement('p')
            let price_img = document.createElement('img')
            let delete_button = document.createElement('button')
        
            cart_item.classList.add('cart_item')
            image_block.classList.add('image-block')
            text.classList.add('text')
            details.classList.add('details')
            price.classList.add('price')
            controls.classList.add('controls')
            content.classList.add('content')
        
            image.setAttribute('src', element.item[0].imgPath)
            text_p.textContent = `»${element.item[0].name}«`
            details_type.textContent = element.item[0].type.name
            details_amount.textContent = `${element.cart_item.amount} шт.`
            price_img.setAttribute('src', "/assets/icons/ruble.svg")
            delete_button.textContent = 'Удалить'
            delete_button.setAttribute('code', index)
            price_p.setAttribute('id', 'item-price')
            
            if(element.item[0].sale == null) {
                price_p.textContent = element.item[0].price
                total_price += Number(element.item[0].price)
            }else {
                price_p.textContent = Math.round(Number(element.item[0].price.replace(/\s+/g, '')) - Number(element.item[0].price.replace(/\s+/g, '')) * element.item[0].sale / 100)
                total_price += Number(price_p.textContent)
            }

            image_block.append(image)
            price.append(price_p, price_img)
            details.append(details_type, details_amount, price)
            text.append(text_p, details)
            content.append(image_block, text)
            controls.append(delete_button)
            
            cart_item.append(content, controls)
            cart_list.append(cart_item)
    
            function deleteItem(elem) {
                const code = elem.getAttribute('code')
                let cart = JSON.parse(localStorage.getItem('cart'))
                cart.splice(code, 1)
                localStorage.setItem('cart', JSON.stringify(cart))
                items.splice(code, 1) 
                generateCartItems(items) 
            }
            delete_button.addEventListener('click', () => {deleteItem(delete_button)})
            
            localStorage.setItem('total', total_price)
            items_total.textContent = total_price
            delivery_price.textContent = localStorage.getItem('delivery_price')
            
            document.querySelectorAll('.delivery_method_btn').forEach((elem) => {
                if(elem.classList.contains('clicked')) {
                    localStorage.setItem('delivery_price', elem.getAttribute('price'))
                }
            })
            updateTotal()
        })
    }else {
        cart_page.classList.add('hide');
        emptyCart.classList.add('true');
    }
}

function setDeliveryMethod(elem) {
    delivery_methods.forEach((btns) => {
        btns.classList.remove('clicked')
    })
    elem.classList.add('clicked')
    localStorage.setItem('delivery_price', Number(elem.getAttribute('price')))
    delivery_price.textContent = localStorage.getItem('delivery_price')
    updateTotal()
}

function updateTotal() {
    total.textContent = Number(delivery_price.textContent) + Number(items_total.textContent)
}

addEventListener('DOMContentLoaded', getCart)