const sp = supabase.createClient('https://lcryqlqpdqdowkvbpbfw.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxjcnlxbHFwZHFkb3drdmJwYmZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODA3Mjg0OTcsImV4cCI6MTk5NjMwNDQ5N30.mSExOgnGEFt207qykfP6hzIiQ7k9z642ZDR-ucVy4eg')

const wrapper = document.querySelector('.wrapper')

async function getUser() {
    const { data: { user } } = await sp.auth.getUser()
    if(user == null) {
        window.location.replace('/login')
    }
}

const favourites = []
const history = []
const favourites_list = document.querySelector('.favourites_list')
const history_list = document.querySelector('.order_history_list')
const emptyFavourites = document.querySelector('.e-favourites')
const emptyHistory = document.querySelector('.e-history')

async function getFavourites() {
  const {data: {user}} = await sp.auth.getUser()

  const { data: favourite_items, error: favourite_items_error} = await sp.from('favourites').select('item(*, type (name))').eq('user_id', user.id)
  favourites.push(...favourite_items)
  if(favourite_items.length > 0) {
    generateFavourites()
  }else {
    emptyFavourites.classList.add('true')
  }
}

async function getHistory() {
  const {data: {user}} = await sp.auth.getUser()

  const { data: historys_item, error: historys_item_error} = await sp.from('orders_history').select('item (*, type (name)), status (name), amount, total').eq('user_id', user.id)
  console.log(historys_item);
  history.push(...historys_item)
  if(historys_item.length > 0) {
    generateHistory()
  }else {
    emptyHistory.classList.add('true')
  }
}

function generateFavourites() {
  favourites.forEach((elem) => {
    let item = document.createElement('div')
    let imageBlock = document.createElement('div')
    let text = document.createElement('div')
    let img = document.createElement('img')
    let title = document.createElement('h3')
    let type = document.createElement('span')
    let price = document.createElement('div')
    let p = document.createElement('p')
    let ruble = document.createElement('img')

    ruble.setAttribute('src', "/assets/icons/ruble.svg")
    ruble.setAttribute('alt', "Знак рубля")

    item.classList.add('product')
    text.classList.add('text')
    imageBlock.classList.add('image-block')
    title.classList.add('title')
    price.classList.add('price')

    item.setAttribute('code', elem.item.id)

    img.setAttribute('src', `${elem.item.imgPath}`)

    img.setAttribute('alt', `${elem.item.type.name} ${elem.item.name}`)
    type.textContent = `${elem.item.type.name}`

    title.textContent = `»${elem.item.name}«`

    p.textContent = elem.item.price

    price.append(p, ruble)
    text.append(title, type, price)
    imageBlock.append(img)
    item.append(imageBlock, text)
    favourites_list.append(item)

    function setCurrentItem(item) {
      localStorage.setItem('currentItem', item)
    }
    
    item.addEventListener('click', (elem) => {
      setCurrentItem(elem.target.parentNode.getAttribute('code'))
      if(elem.target.parentNode.classList.contains('product')) {
        window.location.replace('/product.html')
      }
    })
  })
}

function generateHistory() {
  history.forEach((elem) => {
    let order_item = document.createElement('div')
    let item_info = document.createElement('div')
    let image_block = document.createElement('div')
    let image_block_image = document.createElement('img')
    let text = document.createElement('div')
    let text_p = document.createElement('p')
    let details = document.createElement('div')
    let details_p = document.createElement('p')
    let details_price = document.createElement('div')
    let details_price_p = document.createElement('p')
    let details_price_img = document.createElement('img')
    let order_info = document.createElement('div')
    let status = document.createElement('p')
    let amount = document.createElement('p')
    let order_price = document.createElement('div')
    let order_price_p = document.createElement('p')
    let order_price_img = document.createElement('img')

    order_item.classList.add('order-item')
    item_info.classList.add('item-info')
    image_block.classList.add('image-block')
    text.classList.add('text')
    details.classList.add('details')
    details_price.classList.add('price')
    order_info.classList.add('order-info')
    order_price.classList.add('price')

    image_block_image.setAttribute('src', elem.item.imgPath)
    text_p.textContent = `»${elem.item.name}«`
    details_p.textContent = elem.item.type.name
    details_price_p.textContent = elem.item.price
    details_price_img.setAttribute('src', "/assets/icons/ruble.svg")
    details_price_img.setAttribute('alt', "Знак рубля")
    order_price_img.setAttribute('src', "/assets/icons/ruble.svg")
    order_price_img.setAttribute('alt', "Знак рубля")
    status.textContent = elem.status.name
    amount.textContent = `${elem.amount} шт.`
    order_price_p.textContent = elem.total

    image_block.append(image_block_image)
    details_price.append(details_price_p, details_price_img)
    details.append(details_p, details_price)
    text.append(text_p, details)
    item_info.append(image_block, text)
    order_price.append(order_price_p, order_price_img)
    order_info.append(status, amount, order_price)

    order_item.append(item_info, order_info)
    history_list.append(order_item)
  })}

async function signOut() {
  const { error } = await sp.auth.signOut()
  window.location.replace('/')
}

addEventListener('DOMContentLoaded', getUser(), getFavourites(), getHistory())
