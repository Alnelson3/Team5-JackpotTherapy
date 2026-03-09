from django.urls import path
from . import views

urlpatterns = [
    path('',          views.title,        name='title'),
    path('game/',     views.game,         name='game'),
    path('gameover/', views.game_over,    name='game_over'),
    path('credits/',  views.credits_view, name='credits'),

    # API endpoints
    path('api/spin/',         views.spin,            name='spin'),
    path('api/loan/',         views.loan,            name='loan'),
    path('api/save-profile/', views.save_profile,    name='save_profile'),
    path('api/reset/',        views.reset_game,      name='reset_game'),
    path('api/quit/',         views.quit_game,       name='quit_game'),
    path('api/recovery/',     views.check_recovery,  name='check_recovery'),
]