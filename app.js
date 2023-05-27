const itemForm = document.getElementById('item-form')
const itemInput = document.getElementById('item-input')
const itemList = document.getElementById('item-list')
const clearBtn = document.getElementById('clear')
const filter = document.querySelector('.filter')
let isEditMode = false
// Element Creators
const createButton = (classes) => {
  const button = document.createElement('button')
  button.className = classes
  const icon = createIcon('fa-solid fa-xmark')
  button.appendChild(icon)
  return button
}

const createIcon = (classes) => {
  const icon = document.createElement('i')
  icon.className = classes
  return icon
}
// Event Handelars
const displayItems = () => {
  const items = getItemsFromStorage()
  items.forEach((item) => {
    addItemToDOM(item)
    checkUI()
  })
}
// check if item already exist

const checkIfItemExist = (item) => {
  const itemsFromLocalStorage = getItemsFromStorage()
  return itemsFromLocalStorage.includes(item)
}

const addItemOnSubmit = (e) => {
  e.preventDefault()
  const newItem = itemInput.value
  if (newItem === '') {
    alert('Add an item please')
  } else {
    if (isEditMode) {
      const itemToEdit = itemList.querySelector('.edit-mode')
      removeFromLocalStorage(itemToEdit.textContent)
      itemToEdit.classList.remove('edit-mode')
      itemToEdit.remove()
      isEditMode = false
    } else {
      if (checkIfItemExist(newItem)) {
        alert('item already exists')
        return
      }
    }
    addItemToDOM(newItem)
    addItemToLocalStorage(newItem)
    checkUI()
    itemInput.value = ''
  }
}
// Adding item to dom
const addItemToDOM = (item) => {
  // creating list item
  const li = document.createElement('li')
  li.appendChild(document.createTextNode(item))
  const button = createButton('remove-item btn-link text-red')

  li.appendChild(button)
  itemList.appendChild(li)
}
// get items from storage

const getItemsFromStorage = () => {
  let itemsFromLocalStorage
  if (localStorage.getItem('items') === null) {
    itemsFromLocalStorage = []
  } else {
    itemsFromLocalStorage = JSON.parse(localStorage.getItem('items'))
  }
  return itemsFromLocalStorage
}

// adding item to localStortage

const addItemToLocalStorage = (item) => {
  const itemsFromLocalStorage = getItemsFromStorage()
  itemsFromLocalStorage.push(item)
  // conver to string and adding to local storage
  localStorage.setItem('items', JSON.stringify(itemsFromLocalStorage))
}

const onClickItem = (e) => {
  if (e.target.parentElement.classList.contains('remove-item')) {
    removeItem(e.target.parentElement.parentElement)
  } else {
    const listItems = itemList.querySelectorAll('li')
    listItems.forEach((item) => item.classList.remove('edit-mode'))

    isEditMode = true
    e.target.classList.add('edit-mode')
    const editBtn = itemForm.querySelector('button')
    editBtn.style.background = 'green'
    editBtn.innerHTML = '<i class="fa-solid fa-pen"></> update item'
    itemInput.value = e.target.textContent
  }
}

const removeFromLocalStorage = (item) => {
  const getItems = getItemsFromStorage()
  const updatedItemsForLocalStorage = getItems.filter((i) => i !== item)

  localStorage.setItem('items', JSON.stringify(updatedItemsForLocalStorage))
}

const removeItem = (item) => {
  // Remove item from DOM
  item.remove()
  // Remove from the local storage
  removeFromLocalStorage(item.textContent)
  checkUI()
}

const clearItems = () => {
  while (itemList.firstChild) {
    itemList.removeChild(itemList.firstChild)
  }
  localStorage.removeItem('items')
  checkUI()
}

const checkUI = () => {
  const listItem = itemList.querySelectorAll('li')
  if (listItem.length === 0) {
    clearBtn.style.display = 'none'
    filter.style.display = 'none'
  } else {
    clearBtn.style.display = 'block'
    filter.style.display = 'block'
  }

  const formBtn = itemForm.querySelector('button')
  formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item'
  formBtn.style.background = '#333'
  isEditMode = false
}

const filterItems = (e) => {
  let input = e.target.value.toLowerCase()
  const listItems = itemList.querySelectorAll('li')
  listItems.forEach((item) => {
    const itemText = item.firstChild.textContent.toLocaleLowerCase()
    if (itemText.indexOf(input) !== -1) {
      item.style.display = 'flex'
    } else {
      item.style.display = 'none'
    }
  })
}

// init App

const init = () => {
  // Event Listeners
  itemForm.addEventListener('submit', addItemOnSubmit)
  itemList.addEventListener('click', onClickItem)
  clearBtn.addEventListener('click', clearItems)
  filter.addEventListener('input', filterItems)
  window.addEventListener('DOMContentLoaded', displayItems)
  checkUI()
}

init()
