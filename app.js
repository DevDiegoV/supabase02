const productList = document.querySelector('#products');
const addProductForm = document.querySelector('#add-product-form');
const updateProductName = document.getElementById('name');
const updateProductPrice = document.getElementById('price');
const updateProductDescription = document.getElementById('description');
const updateProductFormTitle = document.getElementById('form-title');
const updateProductSubmitButton = document.getElementById('submit-button');
let updateProductId;

// Function to fetch all products from the server
async function fetchProducts() {
  const response = await fetch('http://3.135.211.240:3000/products');
  const products = await response.json();

  // Clear product list
  productList.innerHTML = '';

  // Add each product to the list
  products.forEach(product => {
    const li = document.createElement('li');
    li.innerHTML = `${product.id} - ${product.name} - $${product.price} - ${product.description}`;

    // Add delete button for each product
    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = 'Delete';
    deleteButton.className = 'delete-button';
    deleteButton.addEventListener('click', async () => {
      await deleteProduct(product.id);
      await fetchProducts();
    });
    li.appendChild(deleteButton);

    // Add update button for each product
    const updateButton = document.createElement('button');
    updateButton.innerHTML = 'Update';
    updateButton.className = 'update-button';
    updateButton.addEventListener('click', async () => {
      updateProductName.value = product.name;
      updateProductPrice.value = product.price;
      updateProductDescription.value = product.description;
      updateProductFormTitle.innerHTML = "Update Product";
      updateProductSubmitButton.innerHTML = "Update";
      updateProductId = product.id;
    });
    li.appendChild(updateButton);

    productList.appendChild(li);
  });
}


// Event listener for Add Product form submit button
addProductForm.addEventListener('submit', async event => {
  event.preventDefault();
  const name = addProductForm.elements['name'].value;
  const price = addProductForm.elements['price'].value;
  const description = addProductForm.elements['description'].value;
  if(updateProductFormTitle.innerHTML === "Update Product"){
    await updateProduct(updateProductId, name, price, description);
  } else {
    await addProduct(name, price, description);
  }
  addProductForm.reset();
  fetchProducts();
});

addProductForm.addEventListener('reset', async event => {
  event.preventDefault();
  updateProductName.value = '';
  updateProductPrice.value = '';
  updateProductDescription.value = '';
  updateProductFormTitle.innerHTML = "Add Product";
  updateProductSubmitButton.innerHTML = "Add";
  fetchProducts();
});

// Function to add a new product
async function addProduct(name, price, description) {
  const response = await fetch('http://3.135.211.240:3000/products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name, price, description })
  });
  return response;
}

// Function to delete a new product
async function deleteProduct(id) {
  const response = await fetch('http://3.135.211.240:3000/products/' + id, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
  });
  return response;
}

// Function to update a new product
async function updateProduct(id, name, price, description) {
  const response = await fetch('http://3.135.211.240:3000/products/' + id, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name, price, description })
  });
  return response;
}
