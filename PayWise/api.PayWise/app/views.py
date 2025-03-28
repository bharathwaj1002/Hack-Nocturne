import json
from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from app.models import FlaggedAccount, FlaggedUpi, NonFlaggedUpi
from django.views.decorators.csrf import csrf_exempt

# Create your views here.
@csrf_exempt
def check_upi(request):
    print("REQUEST BODY", request.body)
    data = json.loads(request.body)
    upi_id = data.get('upiId')
    print("UPI ID:", upi_id)
    
    if (FlaggedUpi.objects.filter(upi_id=upi_id).exists()):
        return Response({"isSuspicious": True})
    
    elif not (FlaggedUpi.objects.filter(upi_id=upi_id).exists()):
        print("ALL UNFLAGGED UPI:", NonFlaggedUpi.objects.filter(upi_id=upi_id).first())
        non_flagged_upi = NonFlaggedUpi.objects.filter(upi_id=upi_id).first()
        non_flagged_upi_acccount_number = non_flagged_upi.account_number
        if FlaggedAccount.objects.filter(account_number=non_flagged_upi_acccount_number).exists():
            return Response({"isSuspicious": True})
        else:
            return Response({"isSuspicious": False})
    else:
        return Response({"isSuspicious": False})