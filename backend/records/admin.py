from django.contrib import admin
from .models import AccessAuditLog


@admin.register(AccessAuditLog)
class AccessAuditLogAdmin(admin.ModelAdmin):

    list_display = (
        "get_actor",      # 👈 instead of doctor
        "patient",
        "record",
        "action",
        "accessed_at",
        "ip_address"
    )

    # 🔥 SHOW "Self" FOR PATIENT
    def get_actor(self, obj):
        if obj.doctor:
            return f"Dr. {obj.doctor.name}"
        return "Self 👤"

    get_actor.short_description = "Actor"