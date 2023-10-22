//Tüm elementleri seçme

const form = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo");
const todoList = document.querySelector(".list-group"); 
const firstCardBody = document.querySelectorAll(".card-body")[0];
const secondCardBody = document.querySelectorAll(".card-body")[1];
const filter = document.querySelector("#filter");
const clearButton = document.querySelector("#clear-todos");

eventListeners();

function eventListeners(){//Tüm event Listenerlaar
    form.addEventListener("submit",addTodo);
    document.addEventListener("DOMContentLoaded",loadAllTodosToUI)
    secondCardBody.addEventListener("click",deleteTodo);
    filter.addEventListener("keyup",filterTodos);
    clearButton.addEventListener("click",clearAllTodos);
}

function clearAllTodos(e){
    //todoları arayüzden temizleme
    if (confirm("Tüm todoları silmek istediğinize emin misiniz ?")) {
        // todoList.innerHTML = "" //yavaş yöntem
        while (todoList.firstElementChild != null) {
            todoList.removeChild(todoList.firstElementChild);
        }
        localStorage.removeItem("todos");
    }
}

function filterTodos(e){
    const filterValue = e.target.value.toLowerCase();
    const listItems = document.querySelectorAll(".list-group-item");

    listItems.forEach(function(listItem){
        const text = listItem.textContent.toLowerCase();
        if (text.indexOf(filterValue) == -1) {
            //Bulamadı
            listItem.setAttribute("style","display : none !important");
        }
        else{
            listItem.setAttribute("style","display : block");
        }

    })
}

function deleteTodo(e){
    if (e.target.className === "fa fa-remove") {
        e.target.parentElement.parentElement.remove();
        deleteTodoFromStorage(e.target.parentElement.parentElement.textContent);
        showAlert("success","Todo başarıyla silindi..");
    }
}

function loadAllTodosToUI(){
    let todos = getTodosFromStorage();

    todos.forEach(function(todo){
        addTodoToUI(todo);
    });

}

function deleteTodoFromStorage(deleteTodo){
    let todos = getTodosFromStorage();
    
    todos.forEach(function(todo,index){
        if (todo === deleteTodo) {
            todos.splice(index,1); // todoyu storage dan silme
        }    
    });

    localStorage.setItem("todos",JSON.stringify(todos));
}

function addTodo(e){
    const newTodo = todoInput.value.trim();

    if (newTodo == "") {
        showAlert("danger","Lütfen bir todo giriniz!");
    }
    else {   
        addTodoToUI(newTodo);
        addTodoToStorage(newTodo);
        showAlert("success","Todo başariyla girildi.");

    }

    e.preventDefault();
}

function showAlert(type,message){
    const alert = document.createElement("div");

    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    firstCardBody.appendChild(alert);

    // setTimeout (program çalıştıktan 3 saniye sonra fonksiyonu çalıştır demek için)
    setTimeout(function(){
        alert.remove();
    },3000);
}

function getTodosFromStorage(){ //storage'dan todoları alma
    let todos;
    if (localStorage.getItem("todos") == null) {
        todos = [];
    }
    else{
        todos = JSON.parse(localStorage.getItem("todos"));  
    }
    return todos;
}

function addTodoToStorage(newTodo){

    let todos = getTodosFromStorage();
    todos.push(newTodo);
    localStorage.setItem("todos",JSON.stringify(todos));

}


function addTodoToUI(newTodo){//string değerini List item olarak UI a ekler

    /*<li class="list-group-item d-flex justify-content-between">
                            Todo 1
                            <a href = "#" class ="delete-item">
                                <i class = "fa fa-remove"></i>
                            </a>

        </li>*/

    //list item oluşturma
    const listItem = document.createElement("li");
    //link oluşturma
    const link = document.createElement("a");
    link.href = "#";
    link.className = "delete-item";
    link.innerHTML = "<i class = 'fa fa-remove'></i>";
 
    listItem.className = "list-group-item d-flex justify-content-between";
    //Text Node ekleme
    listItem.appendChild(document.createTextNode(newTodo));
    listItem.appendChild(link);

    //Todo liste list itemi ekleme
    todoList.appendChild(listItem);
    todoInput.value = "";
}