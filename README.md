# Full-Stack Assignment
This is an assignment originally made as a submission to the full-stack exercise given by a company. 
It contains a front-end implemented with React (required by the assignment) and a back-end implemented in Django.
The back-end also implements a database using MySQL.

## Description of the task directly quoted
Implement a simple single-page web application which manages a collection of books. Your
web application should have a UI consisting of a single HTML web page, and a simple
backend. The backend provides a REST API with which the UI communicates. We want the
application to have the following features:
1. When the web page is loaded, it fetches all the books to a list. The title and the
author of each book are displayed in the list.
2. When a book in the list is clicked, it is selected and its author, title and description are
displayed in a form next to the list.
3. By inputting data to the form and pressing a button labelled “save new”, the user can
add new books to the collection.
4. By editing the form data of an existing book and pressing a button labelled “save”,
the user can update the data of the book in the collection.
5. There is also a delete button that can be used to delete a selected book from the
collection.
6. All the changes that user has made to the collection must be preserved on a page
reload.
7. The application (front and backend) can be started with a single command in terminal


Use React for frontend. You can freely choose the technologies by which you are going to
implement the backend.

## How to run
The code presented here is completely functional. 
These instructions presume you have Python and pip installed.
An installation of npm might also be necessary, 
but as the required JavaScript modules are already included in the repo, 
this should not be needed.   


In the root directory of this repo, run the following command in the command-line:  
`python manage.py runserver`   
The front-end will then be available at: [127.0.0.1:8000](http://127.0.0.1:8000).  
All requirements ought to be packaged in with this repo, but if you have problems,
run this command to make sure you have everything:  
`pip install -r requirements.txt`

## To-do list
There are a number of things which currently remain unimplemented, but which I wish to add in with due time:
- Automated tests for back-end and front-end.
- Use of CSRF tokens in the form.
- Use of POST and/or PUT methods. This is related to the CSRF tokens. 
Currently, the back-end does not distinguish between HTTP methods, 
and in the front-end all calls to the back-end are implemented as GET methods.
- Counter-measures against code injection. Currently, the app takes input as it is given.
In a deployed product, this would be a critical vulnerability. 
Measures need to be implemented to at least sanitize input.
