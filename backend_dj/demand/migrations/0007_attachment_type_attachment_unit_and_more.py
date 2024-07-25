# Generated by Django 5.0.7 on 2024-07-25 20:37

import datetime
import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('demand', '0006_remove_pricingticketunit_contract_attachments_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='attachment',
            name='type',
            field=models.CharField(default=4, max_length=11),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='attachment',
            name='unit',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='attachments', to='demand.pricingticketunit'),
        ),
        migrations.AlterField(
            model_name='demand',
            name='duration',
            field=models.DurationField(default=datetime.timedelta(days=1, seconds=21600)),
        ),
    ]
