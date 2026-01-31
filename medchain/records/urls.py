from django.urls import path
from .views import ToggleVisibility

urlpatterns = [
    path("records/<int:id>/visibility", ToggleVisibility.as_view()),
]
