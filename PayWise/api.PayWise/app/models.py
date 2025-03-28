from django.db import models

# Create your models here.
class FlaggedAccount(models.Model):
    banking_name = models.CharField(max_length=100)
    account_number = models.CharField(max_length=18)
    limit = models.IntegerField()
    reason = models.TextField()
    flagged_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.account_number

class FlaggedUpi(models.Model):
    upi_id = models.CharField(max_length=100)
    account = models.ForeignKey(FlaggedAccount, on_delete=models.CASCADE, related_name='upis')
    flagged_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.upi_id
    
class NonFlaggedUpi(models.Model):
    upi_id = models.CharField(max_length=100)
    account_number = models.CharField(max_length=18)
    flagged_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.upi_id