from django.db import models
from django.contrib.auth.models import User


class PlayerProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    avatar = models.IntegerField(default=1)  # 1-10
    balance = models.IntegerField(default=1000)
    debt = models.IntegerField(default=0)
    total_spins = models.IntegerField(default=0)
    total_winnings = models.IntegerField(default=0)
    total_losses = models.IntegerField(default=0)
    jackpots_hit = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.user.username}'s Profile"

    def net_profit(self):
        return self.total_winnings - self.total_losses