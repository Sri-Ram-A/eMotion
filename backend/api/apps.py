from django.apps import AppConfig


class ApiConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "api"
    ###Below added my me
    def ready(self):
        import api.signals  # <== THIS LINE IS CRITICAL