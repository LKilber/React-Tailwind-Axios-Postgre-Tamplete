# Generated by Django 5.0.7 on 2024-07-24 18:49

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('demand', '0002_alter_demand_ticket_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='pricingticketunit',
            name='pricing_ticket',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='units', to='demand.pricingticket'),
        ),
    ]
