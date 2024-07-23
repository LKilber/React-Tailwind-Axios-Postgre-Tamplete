from django.db import models

class PricingGroup(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name

class PricingTicket(models.Model):
    GROUP_CHOICES = [
        ('yes', 'Yes'),
        ('no', 'No'),
    ]
    PRICING_TYPE_CHOICES = [
        ('Agrupada', 'Taxa Agrupada'),
        ('Por Unidade', 'Taxa por Unidade'),
    ]

    group = models.CharField(max_length=3, choices=GROUP_CHOICES)
    selected_group = models.ForeignKey(PricingGroup, on_delete=models.SET_NULL, null=True, blank=True)
    unit_quantity = models.PositiveIntegerField()
    pricing_type = models.CharField(max_length=11, choices=PRICING_TYPE_CHOICES)

    def __str__(self):
        return f"Pricing Ticket {self.id}"

class SchoolUnit(models.Model):
    pricing_ticket = models.ForeignKey(PricingTicket, related_name='units', on_delete=models.CASCADE)
    cnpj = models.CharField(max_length=18)
    fantasy_name = models.CharField(max_length=255)
    social_reason = models.CharField(max_length=255)
    inep_code = models.CharField(max_length=12, blank=True, null=True)
    cep = models.CharField(max_length=9)
    address = models.CharField(max_length=255)
    observations = models.TextField(blank=True, null=True)
    history_description = models.TextField(blank=True, null=True)
    commercial_partners = models.BooleanField()
    partner_details = models.TextField(blank=True, null=True)
    history_profile = models.TextField(blank=True, null=True)
    data_attachments = models.FileField(upload_to='data_attachments/', blank=True, null=True)
    contract_attachment = models.FileField(upload_to='contract_attachments/', blank=True, null=True)
    school_structure_attachments = models.FileField(upload_to='school_structure_attachments/', blank=True, null=True)

    def __str__(self):
        return f"School Unit {self.fantasy_name} for Ticket {self.pricing_ticket.id}"