const sp = supabase.createClient('https://lcryqlqpdqdowkvbpbfw.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxjcnlxbHFwZHFkb3drdmJwYmZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODA3Mjg0OTcsImV4cCI6MTk5NjMwNDQ5N30.mSExOgnGEFt207qykfP6hzIiQ7k9z642ZDR-ucVy4eg')

const itemData = []
const recommendations = []

async function getProduct() {
  const {
    data: product,
    error: productError
  } = await sp.from('items').select('*, type (name)').eq('id', localStorage.getItem('currentItem'))
  itemData.push(...product)
  setItemData()
}

function setItemData() {
  const name = document.querySelector('.name')
  const type = document.querySelector('.type')
  const price = document.querySelector('.price > h2')
  const composition = document.querySelector('.composition')
  const image = document.querySelector('.image-block > img')

  name.textContent = `»${itemData[0].name}«`
  type.textContent = itemData[0].type.name
  price.textContent = itemData[0].price
  composition.textContent = `100% ${itemData[0].composition}`
  image.setAttribute('src', itemData[0].imgPath)
}

function plusAmmount() {
  const input = document.querySelector('.ammount_input')
  if (input.value < 9) {
    input.value = Number(input.value) + 1
  }
}

function minusAmmount() {
  const input = document.querySelector('.ammount_input')
  if (input.value > 1) {
    input.value = Number(input.value) - 1
  }
}

const favouriteBtn = document.querySelector('.favouriteBtn')

async function isFavourite() {
  const { data: { user } } = await sp.auth.getUser()
  if(user != null) {
    const { data: favourite_item, error: favourite_item_error} = await sp.from('favourites').select('*').eq('user_id', user.id).eq('item', localStorage.getItem('currentItem'))
    if(favourite_item.length > 0) {
      favouriteBtn.classList.add('inFavourite')
    }
  }
}

const itemList = document.querySelector('.recommendations_list')

async function getRandomRecomendations() {
  const nums = getRandomNumber()
  const {
    data: recommendation_one,
    error: recommendation_oneError
  } = await sp.from('items').select('*, type (name)').eq('id', nums[0])
  const {
    data: recommendation_two,
    error: recommendation_twoError
  } = await sp.from('items').select('*, type (name)').eq('id', nums[1])
  const {
    data: recommendation_three,
    error: recommendation_threeError
  } = await sp.from('items').select('*, type (name)').eq('id', nums[2])
  recommendations.push(...recommendation_one)
  recommendations.push(...recommendation_two)
  recommendations.push(...recommendation_three)
  generateRecommendations()
}

function getRandomNumber() {
  const numbers = [];
  
  while (numbers.length < 3) {
    const randomNumber = Math.floor(Math.random() * 10) + 1;
    if (!numbers.includes(randomNumber)) {
      numbers.push(randomNumber);
    }
  }
  
  return numbers;
}

function generateRecommendations() {
  recommendations.forEach((elem) => {
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

    item.setAttribute('code', elem.id)

    img.setAttribute('src', `${elem.imgPath}`)

    img.setAttribute('alt', `${elem.type.name} ${elem.name}`)
    type.textContent = `${elem.type.name}`

    title.textContent = `»${elem.name}«`

    p.textContent = elem.price

    price.append(p, ruble)
    text.append(title, type, price)
    imageBlock.append(img)
    item.append(imageBlock, text)
    itemList.append(item)

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

async function setFavourite(elem) {
  const { data: {user} } = await sp.auth.getUser()

  if(user != null) {
    if(elem.classList.contains('inFavourite')) {
      const { error } = await sp.from('favourites').delete().eq('user_id', user.id).eq('item', localStorage.getItem('currentItem'))
      if(error == null) {
        favouriteBtn.classList.remove('inFavourite')
      }
    }else {
      const { error } = await sp.from('favourites').insert({ user_id: user.id, item: localStorage.getItem('currentItem') })
      if(error == null) {
        favouriteBtn.classList.add('inFavourite')
      }
    }
  }else {
    window.location.replace('/profile.html')
  }

}

const sizes = document.querySelectorAll('.size')
function setSize(size) {
  sizes.forEach((elem) => {
    elem.classList.remove('clicked')
  })
  size.classList.add('clicked')
  
}

function addToCart() {
  const amount = document.querySelector('.ammount_input')
  sizes.forEach((elem) => {
    if(elem.classList.contains('clicked')) {
      let cart = []
      let item = {item: Number(localStorage.getItem('currentItem')), amount: Number(amount.value)}
      if(localStorage.getItem('cart')) {
        let old_cart = JSON.parse(localStorage.getItem('cart'))
        old_cart.push(item)
        localStorage.setItem('cart', JSON.stringify(old_cart))
      }else {
        cart.push(item)
        localStorage.setItem('cart', JSON.stringify(cart))
      }
    }else {
      console.log('empty');
    }
  })
}




addEventListener('DOMContentLoaded', getProduct(), isFavourite(), getRandomRecomendations(), generateRecommendations())