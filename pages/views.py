from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader
from django.core.serializers import serialize
from django.core.exceptions import ObjectDoesNotExist, MultipleObjectsReturned
from pathlib import Path
import bleach

from .models import Book

def detect_malicious_html(raw_inputs: tuple) -> bool:
    for line in raw_inputs:
        sanitized_line = bleach.clean(line)
        if line != sanitized_line: return True
    return False

def get_form_page(request):
    try:
        template = loader.get_template("pages/books.html")
        path_to_script = Path(__file__).parent
        path_to_script = path_to_script / "static" / "scripts" / "book-collection" / "build" / "static" / "js"
        script_name = list(path_to_script.glob("main.*.js"))[0]
        script_name = script_name.name
        context = {
            "script_name": script_name
        }
        return HttpResponse(template.render(context, request))
    except Exception as ex:
        return HttpResponse(status=500)

def get_all_books(request):
    if request.method == "GET":
        try:
            data = serialize("json", Book.objects.all())
            return HttpResponse(data, content_type="application/json")
        except Exception as ex:
            return HttpResponse(status=500)
    else:
        return HttpResponse(400)

def add_new_book(request, name, author, description):
    if request.method == "POST":
        had_malicious_code = detect_malicious_html((name, author, description,))
        if not had_malicious_code:
            try:
                new_book = Book()
                new_book.name = name
                new_book.author = author
                new_book.description = description
                new_book.save()
                new_key = new_book.pk
                return HttpResponse(new_key, status=201)
            except Exception as ex:
                return HttpResponse(status=500)
        else:
            return HttpResponse(status=400)
    else:
        return HttpResponse(status=400)

def save_edits_to_one_book(request, primary_key, name, author, description):
    if request.method == "PUT":
        had_malicious_code = detect_malicious_html((name, author, description,))
        if not had_malicious_code:
            try:
                edited_book = Book.objects.get(pk=primary_key)
                edited_book.name = name
                edited_book.author = author
                edited_book.description = description
                edited_book.save()
                return HttpResponse(f"Saved edits successfully.:"
                                    f"\n- {edited_book.name}"
                                    f"\n- {edited_book.author}"
                                    f"\n- {edited_book.description}")
            except ObjectDoesNotExist as odnex:
                return HttpResponse("Requested item does not exist in database.", status=404)
            except Exception as ex:
                return HttpResponse(status=500)
        else:
            return HttpResponse("Your request contained injected code.", status=400) # Bad Request
    else:
        return HttpResponse(status=400)

def delete_one_book(request, primary_key):
    if request.method == "DELETE":
        try:
            deletable_book = Book.objects.get(pk=primary_key)
            name = deletable_book.name
            deletable_book.delete()
            return HttpResponse(f"Deleted '{name}' successfully.")
        except ObjectDoesNotExist as odnex:
            return HttpResponse(status=404)
        except MultipleObjectsReturned as morex:
            return HttpResponse(status=404)
        except Exception as ex:
            return HttpResponse(status=500)
    else:
        return HttpResponse(status=400)
