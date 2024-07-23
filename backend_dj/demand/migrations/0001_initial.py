# Generated by Django 5.0.7 on 2024-07-23 14:53

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Attachment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('file', models.FileField(upload_to='attachments/')),
            ],
        ),
        migrations.CreateModel(
            name='PricingGroup',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('description', models.TextField(blank=True, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='PricingTicket',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('group', models.CharField(max_length=3)),
                ('unit_quantity', models.PositiveIntegerField()),
                ('pricing_type', models.CharField(max_length=11)),
                ('commercial_partners', models.BooleanField(null=True)),
                ('selected_group', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='demand.pricinggroup')),
            ],
        ),
        migrations.CreateModel(
            name='PricingTicketUnit',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('cnpj', models.CharField(max_length=18, null=True)),
                ('fantasy_name', models.CharField(max_length=255, null=True)),
                ('social_reason', models.CharField(max_length=255, null=True)),
                ('inep_code', models.CharField(blank=True, max_length=12, null=True)),
                ('cep', models.CharField(max_length=9, null=True)),
                ('address', models.CharField(max_length=255, null=True)),
                ('observations', models.TextField(blank=True, null=True)),
                ('history_description', models.TextField(blank=True, null=True)),
                ('partner_details', models.TextField(blank=True, null=True)),
                ('history_profile', models.TextField(blank=True, null=True)),
                ('contract_attachment', models.ManyToManyField(blank=True, related_name='contract_attachments', to='demand.attachment')),
                ('data_attachments', models.ManyToManyField(blank=True, related_name='data_attachments', to='demand.attachment')),
                ('pricing_ticket', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='units', to='demand.pricingticket')),
                ('school_structure_attachments', models.ManyToManyField(blank=True, related_name='school_structure_attachments', to='demand.attachment')),
            ],
        ),
    ]
