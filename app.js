// Storage Controller
const StorageCtrl = (function(){
  // Public methods
  return {
    storeItem: (item) => {
      let items;
      // Check if there are items in local storage
      if(localStorage.getItem('items') === null){
          items = [];
          // Add new item into the array
          items.push(item);
          // Set local storage
          localStorage.setItem('items', JSON.stringify(items));
      } else {
          // Get what there is already in local storage
          items = JSON.parse(localStorage.getItem('items'));
          // Add new item into the array
          items.push(item);
          // Re-Set local storage
          localStorage.setItem('items', JSON.stringify(items));
      }
    },
    getItemsFromLocalStorage: () =>{
      let items;
      // Check if there are items in local storage
      if(localStorage.getItem('items') === null){
        items = [];
        
      } else {
          // Get what there is already in local storage
          items = JSON.parse(localStorage.getItem('items'));
        
      }
      return items;
    },
    updateItemInLocalStorage: (item) => {
       let items = JSON.parse(localStorage.getItem('items'));
       items.forEach((i, index) => {
         if(item.id === i.id){
           items.splice(index, 1, item);
         }
       });
        // Re-Set local storage
        localStorage.setItem('items', JSON.stringify(items)); 
    },
    deleteItemFromLocalStorage: (id) => {
        let items = JSON.parse(localStorage.getItem('items'));
        items.forEach((item, index) => {
          if(id === item.id){
            items.splice(index, 1);
          }
        });
          // Re-Set local storage
          localStorage.setItem('items', JSON.stringify(items));
    }
  }
})();

// Item Controller
const ItemCtrl = (function(){
  // Item Constructor
  const Item = function(id, name, calories){
    this.id = id;
    this.name = name;
    this.calories = calories;
  }

  // Data Structure / State
  const data = {
    // items: [],
    items: StorageCtrl.getItemsFromLocalStorage(),
    currentItem: null,
    totalCalories: 0
  }

  // Public methods
  return {
    getItems: function(){
      return data.items;
    },
    addItem: function(name, calories){
      let ID;
      // Create ID
      if(data.items.length > 0){
        ID = data.items[data.items.length-1].id + 1;
      } else {
        ID = 0;
      }

      // Calories to number
      calories = parseInt(calories);

      // Create new item
      newItem = new Item(ID, name, calories);

      // Add to items array
      data.items.push(newItem);

      return newItem;
    },
    setCurrentItem: function(item){
      data.currentItem = item;
    },
    deleteAllItems: () => {
      data.items = [];
    },
    getCurrentItem: () => {
      return data.currentItem;
    },
    getTotalCalories: function(){
      let total = 0;

      // Loop through items and add cals
      data.items.forEach(function(item){
        total += item.calories;
      });

      // Set total cal in data structure
      data.totalCalories = total;

      // Return total
      return data.totalCalories;
    },
    getItemById: function(id){
      let found = null;

      data.items.forEach((item) => {
        if(item.id === id){
          found = item;
        }       
      });    
      return found;
    },
    updateItem: (name, calories) => {
      // Calories to number
      calories = parseInt(calories);
      let found = null;

      data.items.forEach((item) => {
        if(item.id === data.currentItem.id){
          found = item;
          found.name = name;
          found.calories = calories;
        }
      });
      return found;
    },
    deleteItem: (id) => {
      // Get Ids
      const ids = data.items.map((item) => {
        return item.id;
      })

      // Get index
      const index = ids.indexOf(id);

      // Remove item from items list
      data.items.splice(index, 1);
    },
    logData: function(){
      return data;
    }
  }
})();



// UI Controller
const UICtrl = (function(){
  const UISelectors = {
    itemList: '#item-list',
    listItems: '#item-list li',
    addBtn: '.add-btn',
    updateBtn: '.upd-btn',
    deleteBtn: '.dlt-btn',
    backBtn: '.bck-btn',
    clearBtn: '.clr-btn',
    itemNameInput: '#item-name',
    itemCaloriesInput: '#item-calories',
    totalCalories: '.total-calories'
  }
  
  // Public methods
  return {
    populateItemList: function(items){
      let html = '';

      items.forEach(function(item){
        html += `<li class="collection-item" id="item-${item.id}">
        <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
        <a href="#" class="secondary-content">
          <i class="edit-item fa fa-edit"></i>
        </a>
      </li>`;
      });

      // Insert list items
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },
    getItemInput: function(){
      return {
        name:document.querySelector(UISelectors.itemNameInput).value,
        calories:document.querySelector(UISelectors.itemCaloriesInput).value
      }
    },
    addListItem: function(item){
      // Show the list
      document.querySelector(UISelectors.itemList).style.display = 'block';
      // Create li element
      const li = document.createElement('li');
      // Add class
      li.className = 'collection-item';
      // Add ID
      li.id = `item-${item.id}`;
      // Add HTML
      li.innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
      <a href="#" class="secondary-content">
        <i class="edit-item fa fa-edit"></i>
      </a>`;
      // Insert item
      document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);
    },
    clearInput: function(){
      document.querySelector(UISelectors.itemNameInput).value = '';
      document.querySelector(UISelectors.itemCaloriesInput).value = '';
    },
    hideList: function(){
      document.querySelector(UISelectors.itemList).style.display = 'none';
    },
    showTotalCalories: function(totalCalories){
      document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
    },
    clearEditState: function(){
      UICtrl.clearInput();
      document.querySelector(UISelectors.addBtn).style.display = 'inline';
      document.querySelector(UISelectors.updateBtn).style.display = 'none';
      document.querySelector(UISelectors.deleteBtn).style.display = 'none';
      document.querySelector(UISelectors.backBtn).style.display = 'none';
    },
    showEditState: () => {
      document.querySelector(UISelectors.addBtn).style.display = 'none';
      document.querySelector(UISelectors.updateBtn).style.display = 'inline';
      document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
      document.querySelector(UISelectors.backBtn).style.display = 'inline';
    },
    addItemToForm: () => {
      document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
      document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
      UICtrl.showEditState();
    },
    updateListItem: (item) => {
     
      // Get all the li elements
      let listItems = document.querySelectorAll(UISelectors.listItems);

      // Convert Node list into an array
      listItems = Array.from(listItems);

      listItems.forEach((listItem) => {
        const itemID = listItem.getAttribute('id');
        if(itemID === `item-${item.id}`){
          document.querySelector(`#${itemID}`).innerHTML = `
            <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content">
              <i class="edit-item fa fa-edit"></i>
            </a>
          `;
        }
      });

    },
    deleteListItem: (id) => {
      const itemID = `#item-${id}`;
      const item = document.querySelector(itemID);
      item.remove();
    },
    getSelectors: function(){
      return UISelectors;
    }
  }
})();

// App Controller
const App = (function(StorageCtrl, ItemCtrl, UICtrl){
  // Load event listeners
  const loadEventListeners = function(){
    // Get UI selectors
    const UISelectors = UICtrl.getSelectors();

    // Add item event
    document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

    // Disable submit on enter keypress
    document.addEventListener('keypress', function(e){
      if(e.keyCode === 13 || e.which === 13){
        e.preventDefault();
        return false;
      }
    });

    // Edit icon click event
    document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);

    // Update item click event
    document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);

    // Back button click event
    document.querySelector(UISelectors.backBtn).addEventListener('click', backToAddState);

    // Delete button click event
    document.querySelector(UISelectors.deleteBtn).addEventListener('click', deleteItemSubmit)

    // Clear all button click event
    document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItems)
  }

  // Add item submit
  const itemAddSubmit = function(e){
    // Get form input from UI Controller
    const input = UICtrl.getItemInput();

    // Check for name and calorie input
    if(input.name !== '' && input.calories !== ''){
      // Add item
      const newItem = ItemCtrl.addItem(input.name, input.calories);

      // Add item to UI list
      UICtrl.addListItem(newItem);

      // Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();
      // Add total calories to UI
      UICtrl.showTotalCalories(totalCalories);

      // Save in Local Storage
      StorageCtrl.storeItem(newItem);

      // Clear fields
      UICtrl.clearInput();
    }

    e.preventDefault();
  }

  // Edit item click
  const itemEditClick = function(e){
    if(e.target.classList.contains('edit-item')){
      // Get list item id
      const listID = e.target.parentNode.parentNode.id;
      // Break item id into an array
      const listIDArray = listID.split('-');
      // Get just the number(item in position[1] of the array)
      const id = parseInt(listIDArray[1]);
      // Get item to edit
      const itemToEdit = ItemCtrl.getItemById(id);
      // Set current item with the item to edit
      ItemCtrl.setCurrentItem(itemToEdit);
      // Add item to form for edit
      UICtrl.addItemToForm();
    }
    e.preventDefault();
  }

  // Item update click
  const itemUpdateSubmit = (e) => {
    // Get item input
    const input = UICtrl.getItemInput();
    // Update item
    const updatedItem = ItemCtrl.updateItem(input.name, input.calories);
    // Update UI
    UICtrl.updateListItem(updatedItem);
    // Update Local storage
    StorageCtrl.updateItemInLocalStorage(updatedItem);

    // Clear input, hide the edit state(3 buttons hided and add button revealed) and recalculate calories
    UICtrl.clearEditState();
    UICtrl.showTotalCalories(ItemCtrl.getTotalCalories());

    e.preventDefault();
  }

  // Back button click
  const backToAddState = (e) => {
      UICtrl.clearEditState();
    e.preventDefault();
  }

  // Delete button click
  const deleteItemSubmit = (e) => {
      // Get current item
      const itemToDelete = ItemCtrl.getCurrentItem();
      // Delete item from state
      ItemCtrl.deleteItem(itemToDelete.id);
      // Delete item from UI list
      UICtrl.deleteListItem(itemToDelete.id);
      // Delete item from local storage
      StorageCtrl.deleteItemFromLocalStorage(itemToDelete.id);
      // Clear input, hide the edit state(3 buttons hided and add button revealed) and recalculate calories
      UICtrl.clearEditState();
      UICtrl.showTotalCalories(ItemCtrl.getTotalCalories());

    e.preventDefault();
  }

  // Clear all button click
  const clearAllItems = (e) => {
    // Delete all items from state
    ItemCtrl.deleteAllItems();
    // Delete all items from local storage
    localStorage.clear();
    // Clear input, hide the list and the edit state(3 buttons hided and add button revealed) and recalculate calories
    UICtrl.clearEditState();
    UICtrl.showTotalCalories(ItemCtrl.getTotalCalories());
    UICtrl.hideList();

    e.preventDefault();
  }

  // Public methods 
  return {
    init: function(){
      // Set initial State
      UICtrl.clearEditState();

      // Fetch items from data structure
      const items = ItemCtrl.getItems();

      // Check if any items
      if(items.length === 0){
        UICtrl.hideList();
      } else {
        // Populate list with items
        UICtrl.populateItemList(items);
      }

      // Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();
      // Add total calories to UI
      UICtrl.showTotalCalories(totalCalories);

      // Load event listeners
      loadEventListeners();
    }
  }
  
})(StorageCtrl, ItemCtrl, UICtrl);

// Initialize App
App.init();