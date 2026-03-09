from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone


class PlayerProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    avatar = models.IntegerField(default=1)
    balance = models.IntegerField(default=1000)
    debt = models.IntegerField(default=0)
    total_spins = models.IntegerField(default=0)
    total_winnings = models.IntegerField(default=0)
    total_losses = models.IntegerField(default=0)
    jackpots_hit = models.IntegerField(default=0)
    last_recovery_check = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.user.username}'s Profile"

    def net_profit(self):
        return self.total_winnings - self.total_losses

    def apply_recovery(self):
        """If balance is 0, grant $150 for every 30 minutes passed since last check."""
        if self.balance > 0:
            self.last_recovery_check = timezone.now()
            self.save()
            return

        now = timezone.now()
        minutes_passed = (now - self.last_recovery_check).total_seconds() / 60
        intervals = int(minutes_passed // 30)

        if intervals > 0:
            self.balance += intervals * 150
            self.last_recovery_check = now
            self.save()