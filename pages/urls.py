from django.urls import path

from .views import homePageView, get_form_page, get_all_books, delete_one_book, save_edits_to_one_book, add_new_book

urlpatterns = [
    path("home", homePageView, name="home"),
    path("", get_form_page, name="home"),
    path("books/", get_all_books, name="GetAllBooks"),
    path("add/<str:name>/<str:author>/<str:description>/", add_new_book, name="add"),
    path("save/<int:primary_key>/<str:name>/<str:author>/<str:description>/", save_edits_to_one_book, name="save"),
    path("delete/<int:primary_key>", delete_one_book, name="delete"),
]



