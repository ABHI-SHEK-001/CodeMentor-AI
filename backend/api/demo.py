"""Secret-link demo login: lets you share one URL that signs a guest in."""

import hmac
import os

from django.contrib.auth.models import User
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken


@api_view(["POST"])
@permission_classes([AllowAny])
def demo_login(request):
    """Return JWT tokens for the shared guest account if the key matches.

    Set DEMO_ACCESS_KEY on the backend to enable. Remove or change it to
    switch every existing demo link off.
    """
    expected = os.getenv("DEMO_ACCESS_KEY", "")
    given = str(request.data.get("key", ""))
    if not expected or not hmac.compare_digest(given.encode(), expected.encode()):
        return Response({"detail": "Invalid or disabled demo link."}, status=403)

    user, created = User.objects.get_or_create(username="demo_guest")
    if created:
        user.set_unusable_password()
        user.save()

    refresh = RefreshToken.for_user(user)
    return Response({"access": str(refresh.access_token), "refresh": str(refresh)})
