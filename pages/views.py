from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader
from django.core.serializers import serialize

from .models import Book

def homePageView(request):
    return HttpResponse("Hello, World!")


def get_form_page(request):
    template = loader.get_template("pages/books.html")
    book_collections = Book.objects.order_by("name")
    context = {
        "book_collection": book_collections
    }
    return HttpResponse(template.render(context, request))

def get_all_books(request):
    data = serialize("json", Book.objects.all())
    return HttpResponse(data, content_type="application/json")

def add_new_book(request, name, author, description):
    new_book = Book()
    new_book.name = name
    new_book.author = author
    new_book.description = description
    new_book.save()
    new_key = new_book.pk
    # return HttpResponse(f"Added a new book successfully.:\n- {name}\n- {author}\n- {description}")
    return HttpResponse(new_key)

def save_edits_to_one_book(request, primary_key, name, author, description):
    correct_index = primary_key
    edited_book = Book.objects.get(pk=correct_index)
    # return HttpResponse(f"Saved edits successfully.:\n- {primary_key}\n- {name}\n- {author}\n- {description}")
    edited_book.name = name
    edited_book.author = author
    edited_book.description = description
    edited_book.save()
    return HttpResponse(f"Saved edits successfully.:"
                        f"\n- {edited_book.name}"
                        f"\n- {edited_book.author}"
                        f"\n- {edited_book.description}")

def delete_one_book(request, primary_key):
    deletable_book = Book.objects.get(pk=primary_key)
    name = deletable_book.name
    deletable_book.delete()
    return HttpResponse(f"Deleted '{name}' successfully.")
