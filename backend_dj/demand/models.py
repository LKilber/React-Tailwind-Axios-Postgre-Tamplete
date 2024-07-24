from django.db import models
from django.utils import timezone
import uuid

class DemandType(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name

class Demand(models.Model):
    demand_type = models.ForeignKey(DemandType, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.CharField(max_length=255)
    responsible = models.CharField(max_length=255, null=True)
    responsible_sector = models.CharField(max_length=255, null=True)
    status = models.CharField(max_length=50, null=True, blank=True)


    def __str__(self):
        return f"Demand {self.ticket_id} - {self.demand_type.name}"

    def save(self, *args, **kwargs):
        if not self.responsible_sector:
            self.responsible_sector = "Preço&Risco"
        if not self.status:
            self.status = "Aberto"
        super().save(*args, **kwargs)


class SchoolGroup(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name

class TicketChangeHistory(models.Model):
    ticket = models.ForeignKey(Demand, related_name='history', on_delete=models.CASCADE)
    change_date = models.DateTimeField(default=timezone.now)
    change_description = models.TextField()

    def __str__(self):
        return f"History for Demand {self.ticket.ticket_id} at {self.change_date}"

class PricingTicket(models.Model):
    ticket = models.ForeignKey(Demand, related_name='pricing', on_delete=models.CASCADE)
    group = models.CharField(max_length=3)
    selected_group = models.ForeignKey(SchoolGroup, on_delete=models.SET_NULL, null=True, blank=True)
    unit_quantity = models.PositiveIntegerField()
    pricing_type = models.CharField(max_length=11)
    commercial_partners = models.BooleanField(null=True)

    def save(self, *args, **kwargs):        
        if self.pk:
            old_instance = PricingTicket.objects.get(pk=self.pk)
            changes = []

            for field in self._meta.fields:
                field_name = field.name
                old_value = getattr(old_instance, field_name)
                new_value = getattr(self, field_name)
                if old_value != new_value:
                    changes.append(f"{field_name}: {old_value} -> {new_value}")

            if changes:
                change_description = "; ".join(changes)
                TicketChangeHistory.objects.create(ticket=self.ticket, change_description=change_description)

        super().save(*args, **kwargs)

    def __str__(self):
        return f"Pricing Ticket {self.id}"


    def __str__(self):
        return f"Pricing Ticket {self.id}"

class Attachment(models.Model):
    file = models.FileField(upload_to='attachments/')

class PricingTicketUnit(models.Model):
    pricing_ticket = models.ForeignKey(PricingTicket, related_name='units', on_delete=models.CASCADE)
    cnpj = models.CharField(max_length=18, null=True)
    fantasy_name = models.CharField(max_length=255, null=True)
    social_reason = models.CharField(max_length=255, null=True)
    inep_code = models.CharField(max_length=12, blank=True, null=True)
    cep = models.CharField(max_length=9, null=True)
    address = models.CharField(max_length=255, null=True)
    observations = models.TextField(blank=True, null=True)
    history_description = models.TextField(blank=True, null=True)
    partner_details = models.TextField(blank=True, null=True)
    history_profile = models.TextField(blank=True, null=True)
    data_attachments = models.ManyToManyField(Attachment, related_name='data_attachments', blank=True)
    contract_attachments = models.ManyToManyField(Attachment, related_name='contract_attachments', blank=True)
    school_structure_attachments = models.ManyToManyField(Attachment, related_name='school_structure_attachments', blank=True)

    def __str__(self):
        return f"Unit {self.id} for Pricing Ticket {self.pricing_ticket.id}"

class Comment(models.Model):
    ticket = models.ForeignKey(Demand, related_name='comments', on_delete=models.CASCADE)
    user = models.CharField(max_length=255)
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Comment {self.id} on Demand {self.ticket.ticket_id}"