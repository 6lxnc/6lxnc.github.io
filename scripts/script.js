const sp = supabase.createClient('https://lcryqlqpdqdowkvbpbfw.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxjcnlxbHFwZHFkb3drdmJwYmZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODA3Mjg0OTcsImV4cCI6MTk5NjMwNDQ5N30.mSExOgnGEFt207qykfP6hzIiQ7k9z642ZDR-ucVy4eg')

const itemList = document.querySelector('.items-list')

async function fetchItems ()
{
  const { data } = await sp
    .from('items')
    .select("id, name, imgPath, price, composition, ammount, sale, type (name)")
    .order('id')

  data.forEach(dataItem =>
  {
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

    item.setAttribute('code', dataItem.id)

    img.setAttribute('src', `${dataItem.imgPath}`)

    img.setAttribute('alt', `${dataItem.type.name} ${dataItem.name}`)
    type.textContent = `${dataItem.type.name}`

    title.textContent = `»${dataItem.name}«`

    p.textContent = dataItem.price

    if (dataItem.ammount == 0) {
      item.classList.add('sold-out')
    }

    if (dataItem.sale != null || dataItem.sale == 0 && dataItem.ammount >= 1) {
      item.classList.add('sale')
      imageBlock.setAttribute('data-sale', `sale ${dataItem.sale}%`)
      p.setAttribute('data-price', `${dataItem.price}`)
      p.textContent = Math.round(Number(dataItem.price.replace(/\s+/g, '')) - Number(dataItem.price.replace(/\s+/g, '')) * dataItem.sale / 100)
      let salePrice = document.createElement('span')
      let lowerRuble = ruble.cloneNode(false)
      lowerRuble.classList.add('lower-ruble')
      salePrice.classList.add('sale-price')
      salePrice.textContent = dataItem.price
      salePrice.append(lowerRuble)
      price.append(salePrice)
    }

    price.append(p, ruble)
    text.append(title, type, price)
    imageBlock.append(img)
    item.append(imageBlock, text)
    itemList.append(item)

    function setCurrentItem(item) {
      localStorage.setItem('currentItem', item)
    }
    
    item.addEventListener('click', (elem) => {
      if(!item.classList.contains('sold-out')) {
        setCurrentItem(elem.target.parentNode.getAttribute('code'))
        if(elem.target.parentNode.classList.contains('product')) {
          window.location.replace('/product.html')
        }
      }
    })
  })
}

addEventListener('DOMContentLoaded', fetchItems)

