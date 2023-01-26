import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import Cookies from 'js-cookie'
// import './index.css';

const csrftoken = Cookies.get('csrftoken');

function selectionEntry(book) {
    let newElement = document.createElement("option");
    newElement.innerHTML = book.fields.name + " - " + book.fields.author;
    newElement.onclick = () => {
        console.log(book.pk);
        return book.pk;
    };
    return newElement;
}

async function renderSelection() {
    const allBooks = await getBookList();
    let newSelection = document.createElement("select");
    allBooks.forEach(book => {
        newSelection.appendChild(selectionEntry(book));
    });
    return newSelection;
}

class BookCollectionForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            author: '',
            description: '',
            allBooks: [],
            bookInFocus: null,
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    nullSelection() {
        const nameInput = document.getElementById("input-title");
        const authorInput = document.getElementById("input-author");
        const descriptionInput = document.getElementById("input-description");
        nameInput.value = "";
        authorInput.value = "";
        descriptionInput.value = "";
        this.setState({bookInFocus: null});
    }

    handleChange(event) {
        const name = event.target.name;
        const value = event.target.value;
        this.setState(
            {
                [name]: value,
            }
        );
    }

    handleSubmit(event) {
        const submitterName = event.nativeEvent.submitter.name;
        if (submitterName === "Save New") {
            this.saveNewBook();
        } else if (submitterName === "Save") {
            this.saveEdits();
        } else if (submitterName === "Delete") {
            this.deleteBook();
        } else {
            alert("ERROR: Unknown submitter!")
        }
        event.preventDefault();
    }

    refreshAllBooks(){        
        (async () => {
            const bookList = document.getElementById("book_list_box");
            const selectionPromise = getBookList()
                .then(newSelection => {
                    while (bookList.lastChild) {
                        bookList.removeChild(bookList.lastChild);
                    }

                    this.setState({allBooks: newSelection});
                    console.log("newSelection");
                    console.log(newSelection);
                    let counter = 0;
                    newSelection.forEach(book => {
                        const entry = selectionEntry(book);
                        const indexKey = counter;
                        entry.onclick = () => {
                            this.loadItemToDialogue(indexKey);
                            this.setState({bookInFocus: indexKey});
                            console.log("In focus index: " + indexKey);
                            console.log(this.state.allBooks[indexKey]);
                            return book.pk;
                        };
                        bookList.appendChild(entry);
                        counter += 1;
                    });
                })
                .catch(error => {
                    console.log(error);
                });
        })();
    }

    saveNewBook() {
        console.log("saveNewBook()");
        const nameInput = document.getElementById("input-title");
        const authorInput = document.getElementById("input-author");
        const descriptionInput = document.getElementById("input-description");

        const name = nameInput.value;
        const author = authorInput.value;
        const description = descriptionInput.value;


        const savePromise = axios.post("/add/" + name + "/" + author + "/" + description + "/", 0, {
            headers: {
                'X-CSRFToken': csrftoken,
            }
        })
            .then(response => {
                console.log(response);
                console.log("New book index:");
                const newIndex = this.state.allBooks.length;
                console.log(newIndex);
                this.setState({bookInFocus: newIndex});
            })
            .catch(error => {
                console.error(error);
            })
            .then(() => {
                console.log("All done adding.");
                this.refreshAllBooks();
            });
    }

    saveEdits() {
        if (this.state.bookInFocus) {
            const nameInput = document.getElementById("input-title");
            const authorInput = document.getElementById("input-author");
            const descriptionInput = document.getElementById("input-description");
    
            const primaryKey = this.state.allBooks[this.state.bookInFocus].pk;

            const name = nameInput.value;
            const author = authorInput.value;
            const description = descriptionInput.value;
    
            const savePromise = axios.put("/save/" + primaryKey + "/" + name + "/" + author + "/" + description + "/",
                0, {
                    headers: {
                        'X-CSRFToken': csrftoken,
                    }
                })
                .then(response => {
                    console.log(response);
                })
                .catch(error => {
                    console.log(error);
                })
                .then(() => {
                    this.refreshAllBooks();
                });
        }
    }

    deleteBook() {
        console.log("Delete( " + this.state.bookInFocus + " )");
        if (this.state.bookInFocus) {
            const primaryKey = this.state.allBooks[this.state.bookInFocus].pk;
            const savePromise = axios.delete("/delete/" + primaryKey, {
                    headers: {
                        'X-CSRFToken': csrftoken,
                    }
                })
                .then(response => {
                    console.log(response);
                    this.nullSelection();
                })
                .catch(error => {
                    console.error(error);
                })
                .then(() => {
                    console.log("All done deleting.");
                    this.refreshAllBooks();
                });
        }
    }

    loadItemToDialogue(private_key) {
        const nameInput = document.getElementById("input-title");
        const authorInput = document.getElementById("input-author");
        const descriptionInput = document.getElementById("input-description");
        
        const index_key = private_key;
        const book = this.state.allBooks[index_key];
        nameInput.value = book.fields.name;
        authorInput.value = book.fields.author;
        descriptionInput.value = book.fields.description;   
    }

    componentDidMount() {
        this.refreshAllBooks();
    }

    render() {
        console.log("BookCollectionForm.render()");
        
        return (
            <form onSubmit={this.handleSubmit}>
                <div class="dialogue-block">
                    <p>Hello Buutti, I am app!</p>
                    <div class="dialogue-input-block">
                        <p>Title</p>
                        <input
                            type="text"
                            id="input-title"
                            name="title"
                            onChange={this.handleChange}
                        />
                        <p>Author</p>
                        <input
                            type="text"
                            id="input-author"
                            name="author"
                            onChange={this.handleChange}
                        />
                        <p>Description</p>
                        <textarea
                            id="input-description"
                            name="description"
                            onChange={this.handleChange}
                        />
                    </div>
                    <div class="dialogue-buttons-block">
                        <input
                            type="submit"
                            value="Save New"
                            name="Save New"
                        />
                        <input
                            type="submit"
                            value="Save"
                            name="Save"
                        />
                        <input
                            type="submit"
                            value="Delete"
                            name="Delete"
                        />
                    </div>
                </div>
                <div>
                    {/* {renderSelection()} */}
                    <select id="book_list_box" size="10">
                    </select>
                </div>
            </form>
        );
    }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<BookCollectionForm />);


async function getBookList() {
    let allBooks;
    await axios.get("/books")
        .then(response => {
            allBooks = response.data;
            console.log("allBooks done.");
        })
        .catch(error => {
            console.log("Error block");
            console.log(error);
        });
        return allBooks;
}
