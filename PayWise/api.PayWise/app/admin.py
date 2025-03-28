from django.contrib import admin
from unfold.admin import ModelAdmin
from .models import FlaggedAccount, FlaggedUpi, NonFlaggedUpi
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib import admin
from django.contrib.auth.models import User, Group

admin.site.unregister(User)
admin.site.unregister(Group)

@admin.register(FlaggedAccount)
class FlaggedAccount(ModelAdmin):
    pass

@admin.register(FlaggedUpi)
class FlaggedUpi(ModelAdmin):
    pass

@admin.register(NonFlaggedUpi)
class NonFlaggedUpi(ModelAdmin):
    pass