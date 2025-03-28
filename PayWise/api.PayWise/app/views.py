import json
from rest_framework.response import Response
from rest_framework.decorators import api_view
from app.models import FlaggedAccount, FlaggedUpi, NonFlaggedUpi
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
@api_view(['POST'])  # This makes sure the view handles POST requests
def check_upi(request):
    # Access the parsed JSON data from request.data instead of request.body
    data = request.data  # This is parsed automatically by DRF
    upi_id = data.get('upiId')  # Safely access 'upiId' from the data
    print("UPI ID:", upi_id)
    
    # Check if the UPI ID is flagged
    if FlaggedUpi.objects.filter(upi_id=upi_id).exists():
        return Response({"isSuspicious": True})
    
    # Check if the UPI ID is non-flagged but the associated account is flagged
    non_flagged_upi = NonFlaggedUpi.objects.filter(upi_id=upi_id).first()
    if non_flagged_upi:
        non_flagged_upi_account_number = non_flagged_upi.account_number
        if FlaggedAccount.objects.filter(account_number=non_flagged_upi_account_number).exists():
            return Response({"isSuspicious": True})
    
    # If neither condition is met, the UPI ID is safe
    return Response({"isSuspicious": False})
