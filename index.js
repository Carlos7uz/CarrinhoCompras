import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    projectId: "meu-carrinho-ee4f2",
    databaseUrl: "https://meu-carrinho-ee4f2-default-rtdb.firebaseio.com/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const produtosInDB = ref(database, "Produtos")


const inputFieldEl = document.getElementById("input-field")
const addButtonEl = document.getElementById("add-button")
const shoppingListEl = document.getElementById("shopping-list")

addButtonEl.addEventListener("click", function(){
    let inputValue = inputFieldEl.value
    
    push(produtosInDB, inputValue)
    
    clearInputFieldEl();
})

onValue(produtosInDB, function(snapshot){
    if(snapshot.exists()){
        let productsArray = Object.entries(snapshot.val())
    
        clearProductsListEl()
    
        for(let i = 0; i < productsArray.length; i++){
            let currentProduct = productsArray[i]
    
            let currentProductId = currentProduct[0]
            let currentProductValue = currentProduct[1]
    
            addInputValueEl(currentProduct)
        }
    } else {
        shoppingListEl.innerHTML = "Sem itens aqui... ainda"
    }

})

function clearInputFieldEl(){
    inputFieldEl.value = "";
}

function clearProductsListEl(){
    shoppingListEl.innerHTML = "";
}

function addInputValueEl(product){
    //shoppingListEl.innerHTML += `<li>${product}</li>`
    let productId = product[0]
    let productValue = product[1]

    let newEl = document.createElement("li")

    newEl.textContent = productValue

    let tapTimeout

    newEl.addEventListener("click", function(event){
        if (tapTimeout) {
            clearTimeout(tapTimeout);
            tapTimeout = null;
    
            // Double tap detected, remove the product
            let exactProductinDB = ref(database, `Produtos/${productId}`)
            remove(exactProductinDB)
        } else {
            tapTimeout = setTimeout(function() {
                tapTimeout = null;
            }, 300); // 300ms delay
        }
    }) 

    shoppingListEl.appendChild(newEl)
}