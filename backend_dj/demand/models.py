from django.db import models

class PricingGroup(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name

class PricingTicket(models.Model):
    group = models.CharField(max_length=3)
    selected_group = models.ForeignKey(PricingGroup, on_delete=models.SET_NULL, null=True, blank=True)
    unit_quantity = models.PositiveIntegerField()
    pricing_type = models.CharField(max_length=11)
    commercial_partners = models.BooleanField(null=True)

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
    contract_attachment = models.ManyToManyField(Attachment, related_name='contract_attachments', blank=True)
    school_structure_attachments = models.ManyToManyField(Attachment, related_name='school_structure_attachments', blank=True)

    def __str__(self):
        return f"Unit {self.id} for Pricing Ticket {self.pricing_ticket.id}"

class Comment(models.Model):
    pricing_ticket = models.ForeignKey(PricingTicket, related_name='comments', on_delete=models.CASCADE)
    user = models.CharField(max_length=255)
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Comment {self.id} on Unit {self.pricing_ticket.id}"