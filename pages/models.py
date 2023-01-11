from django.db import models


# Create your models here.
class Book(models.Model):
    name = models.CharField(max_length=50)
    author = models.CharField(max_length=50)
    isbn = models.CharField(max_length=20)  # Created longer than the ISBN actually is as of now.
    description = models.CharField(max_length=200)

    def __str__(self):
        return self.name
