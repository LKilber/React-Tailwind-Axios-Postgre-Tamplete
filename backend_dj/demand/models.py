from django.db import models

# Create your models here.
class Pricing(models.Model):
    is_educational_group = models.BooleanField(default=False)
    educational_group_name = models.TextField(blank=True, null=True)
    priced_units_quantity = models.IntegerField(blank=True, null=True)
    pricing_type = models.TextField(blank=True, null=True)
    school_cnpj = models.TextField(blank=True, null=True)
    trade_name = models.TextField(blank=True, null=True)
    corporate_name = models.TextField(blank=True, null=True)
    inep_code = models.TextField(blank=True, null=True)
    postal_code = models.TextField(blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    data_attachment = models.FileField(upload_to='attachments/data/', blank=True, null=True)
    contract_attachment = models.FileField(upload_to='attachments/contract/', blank=True, null=True)
    physical_structure_attachment = models.FileField(upload_to='attachments/physical_structure/', blank=True, null=True)
    history = models.TextField(blank=True, null=True)
    partner_confirmation = models.TextField(blank=True, null=True)
    updated = models.DateTimeField(auto_now=True)
    created = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return f"Ticket {self.id} - {self.trade_name or self.corporate_name}"