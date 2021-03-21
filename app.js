// Book Class : represents a book (everytime we create a book its going to instantiate a book object)
class Book {
    constructor(title, author, isbn) {
       this.title = title; // this.title vai ser o value que é passado do titulo pelo utilizador
       this.author = author;
       this.isbn = isbn;
    }
}


// UI Class : Handle UI Tasks (tudo na interface do utilizador, quando um livro aparece na tabela ou é removido ou mostrado um alert)
class UI {
    static displayBooks() {
        // const StoredBooks = [
        //     { // hard code por agora enquanto nas se usa o local storage
        //         title: 'Book One',
        //         author: 'John Doe',
        //         isbn: '34355665'
        //     },
        //     {
        //         title: 'Book Two',
        //         author: 'Fruj Dart',
        //         isbn: '1251667'
        //     }
        // ];

        // const books = StoredBooks; deixando de ser hardcode já nao é assim
        const books = Store.getBooks();

        // loop through all the book that are in this array and then call the method add book to list (está no ui porque é o responsavel por adicionar há lista do interface)
        books.forEach((book) => UI.addBookToList(book));
        
    }
        //com este metodo aqui a funcao de cima vai adicionar os livros à interface
        static addBookToList(book) {
           const list = document.querySelector('#book-list'); //ir buscar o table toby do html

           const row = document.createElement('tr');
           row.innerHTML = `
           <td>${book.title}</td>
           <td>${book.author}</td>
           <td>${book.isbn}</td>
           <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
           `;

           list.appendChild(row);
        }

        static deleteBook(el) {
           if(el.classList.contains('delete')){//se o que eu cliquei contem a class delete
             el.parentElement.parentElement.remove();//precisamos de fazer duas vezes porque o parent element da tag 'a' que contem o delete é a tag 'td' e nos queremos remover a row toda que é o pai da td
           }
        }

        static showAlert(message, className) { //uma mensagem e um classname para o caso de ser por exemplo verde ou vermelho
           const div = document.createElement('div');
           div.className = `alert alert-${className}`; //desta maneira podemos variar o tipo e alerta
           div.appendChild(document.createTextNode(message));
           const container = document.querySelector('.container');
           const form = document.querySelector('#book-form');
           container.insertBefore(div, form); //insert the div before the form (escolher o sitio onde vai aparecer o alert)
           //alert desaparece em 3 segundos
           setTimeout(() =>
               document.querySelector('.alert').remove(),3000);
        }

        static clearFields() {
            document.querySelector('#title').value = '';
            document.querySelector('#author').value = '';
            document.querySelector('#isbn').value = '';
        }
}


// Store Class : Handles Storage (localstorage)
class Store {
    static getBooks() {
       let books;
       if(localStorage.getItem('books') === null) {
         books = [];
       }else{
         books = JSON.parse(localStorage.getItem('books'));
       }

       return books;
    }
    static addBook(book) {
       const books = Store.getBooks();

       books.push(book);

       localStorage.setItem('books', JSON.stringify(books)); //como books é um array de objetos e o localstorage so aceita strings temos de fazer stringify nos books
    }
    static removeBook(isbn){
       const books = Store.getBooks();

       books.forEach((book, index) => {
           if(book.isbn === isbn) {
             books.splice(index, 1);
           }
       });

       localStorage.setItem('books', JSON.stringify(books));
    }
}

// Events : Display Books (mostrar os livros na table)
document.addEventListener('DOMContentLoaded', UI.displayBooks); // as soon as the content loads we want to call ui.displaybooks


// Event : Add a book
document.querySelector('#book-form').addEventListener('submit', (e) =>{

    e.preventDefault();

    //Get form values
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;

    // Validate
    if(title === '' || author === '' || isbn === '') {
      UI.showAlert('Please fill in all fields', 'danger');
    } else {

     // Instatiate a book
    const book = new Book(title, author, isbn);

    // Add Book to UI
    UI.addBookToList(book);
    // Add Book to Store localstorage
    Store.addBook(book);

    // Show sucess message after book added
    UI.showAlert('Book Added', 'success');

    // Clear fields
    UI.clearFields();
    }

   
});


// Event : Remove a book
document.querySelector('#book-list').addEventListener('click', (e) =>{
    console.log(e.target) // target each element individually

    // remove book form UI
    UI.deleteBook(e.target);
    // Remove book from the store
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent); //e.target.parentElement vai ate à tag 'td' mas nos queremos o terceiro td das 4 tds existentes (title,author,isbn,button) o previousElementSibling permite nos chegar a esse terceiro td

    // remove book message
    UI.showAlert('Book Removed', 'info');
})