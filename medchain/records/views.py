from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from accounts.models import User
from .models import MedicalRecord
from storage.ipfs import upload_to_ipfs
from blockchain.contract import add_record_on_chain

class UploadMedicalRecord(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        doctor = request.user

        if doctor.role != "DOCTOR":
            return Response({"error": "Only doctors can upload"}, status=403)

        patient_wallet = request.data.get("patient_wallet")
        file = request.FILES.get("file")

        patient = User.objects.get(wallet_address=patient_wallet)

        cid, file_hash = upload_to_ipfs(file)

        tx_hash = add_record_on_chain(
            patient.wallet_address,
            doctor.wallet_address,
            cid,
            file_hash
        )

        record = MedicalRecord.objects.create(
            patient=patient,
            doctor=doctor,
            ipfs_cid=cid,
            file_hash=file_hash
        )

        return Response({
            "message": "Record added",
            "record_id": record.id,
            "tx_hash": tx_hash
        })


class PatientRecords(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, wallet):
        requester = request.user
        patient = User.objects.get(wallet_address=wallet)

        records = MedicalRecord.objects.filter(patient=patient)

        if requester.role == "DOCTOR":
            from permissions.models import RecordAccess

            allowed = RecordAccess.objects.filter(
                patient=patient,
                doctor=requester
            ).exists()

            records = records.filter(is_visible=True) if not allowed else records

        return Response([
            {
                "cid": r.ipfs_cid,
                "hash": r.file_hash,
                "doctor": r.doctor.username,
                "created": r.created_at
            }
            for r in records
        ])
    
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import MedicalRecord

class ToggleVisibility(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, id):
        user = request.user

        try:
            record = MedicalRecord.objects.get(id=id)
        except MedicalRecord.DoesNotExist:
            return Response({"error": "Record not found"}, status=404)

        # ONLY patient can change visibility
        if record.patient != user:
            return Response(
                {"error": "Only patient can change visibility"},
                status=403
            )

        record.is_visible = not record.is_visible
        record.save()

        return Response({
            "record_id": record.id,
            "new_visibility": record.is_visible
        })