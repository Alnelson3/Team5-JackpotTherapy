import json
import random
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.contrib.auth import logout
from .models import PlayerProfile


def get_or_create_profile(user):
    profile, _ = PlayerProfile.objects.get_or_create(user=user)
    return profile


def title(request):
    """Title / landing screen."""
    if request.user.is_authenticated:
        return redirect('game')
    return render(request, 'game/title.html')


@login_required
def game(request):
    """Main game screen."""
    profile = get_or_create_profile(request.user)
    return render(request, 'game/game.html', {'profile': profile})


@login_required
def game_over(request):
    """Game-over / stats screen shown when player goes broke."""
    profile = get_or_create_profile(request.user)
    return render(request, 'game/game_over.html', {'profile': profile})


@login_required
def credits_view(request):
    """End credits screen."""
    return render(request, 'game/credits.html')


@login_required
@require_POST
def spin(request):
    """
    API endpoint: perform a spin.
    Expects JSON body: { "bet": <int or "ALL IN"> }
    Returns JSON: { "slots": [...], "result": "...", "balance": int, "winnings": int }
    """
    profile = get_or_create_profile(request.user)
    data = json.loads(request.body)
    bet_raw = data.get('bet', 100)

    bet = profile.balance if bet_raw == 'ALL IN' else int(bet_raw)

    if bet <= 0 or bet > profile.balance:
        return JsonResponse({'error': 'Invalid bet'}, status=400)

    # Deduct bet
    profile.balance -= bet
    profile.total_spins += 1
    profile.total_losses += bet

    # Roll reels
    slots = [random.randint(1, 10) for _ in range(3)]
    a, b, c = slots

    winnings = 0
    result = 'lose'

    if a == b == c:
        winnings = bet * 10
        result = 'jackpot'
        profile.jackpots_hit += 1
    elif a == b or b == c or a == c:
        winnings = bet * 2
        result = 'two_of_a_kind'

    profile.balance += winnings
    profile.total_winnings += winnings
    profile.save()

    return JsonResponse({
        'slots': slots,
        'result': result,
        'winnings': winnings,
        'balance': profile.balance,
        'debt': profile.debt,
    })


@login_required
@require_POST
def loan(request):
    """API endpoint: take or repay a loan."""
    profile = get_or_create_profile(request.user)
    data = json.loads(request.body)
    action = data.get('action', 'take')

    if action == 'take':
        profile.balance += 500
        profile.debt += 750
    elif action == 'repay' and profile.balance >= profile.debt:
        profile.balance -= profile.debt
        profile.debt = 0

    profile.save()
    return JsonResponse({'balance': profile.balance, 'debt': profile.debt})


@login_required
@require_POST
def save_profile(request):
    """API endpoint: save avatar selection."""
    profile = get_or_create_profile(request.user)
    data = json.loads(request.body)
    avatar = data.get('avatar', 1)
    profile.avatar = max(1, min(10, int(avatar)))
    profile.save()
    return JsonResponse({'avatar': profile.avatar})


@login_required
@require_POST
def reset_game(request):
    """Reset balance for a fresh game (start over)."""
    profile = get_or_create_profile(request.user)
    profile.balance = 1000
    profile.debt = 0
    profile.total_spins = 0
    profile.total_winnings = 0
    profile.total_losses = 0
    profile.jackpots_hit = 0
    profile.save()
    return redirect('game')


@login_required
def quit_game(request):
    """Save & quit — logs the user out and redirects to title."""
    logout(request)
    return redirect('title')