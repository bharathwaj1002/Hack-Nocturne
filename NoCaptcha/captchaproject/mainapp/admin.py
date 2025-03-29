from django.contrib import admin
from unfold.admin import ModelAdmin
from .models import *
# Register your models here.
@admin.register(InteractionData)
class ProjectAdmin(ModelAdmin):
    list_display=('client', 'ip_address')