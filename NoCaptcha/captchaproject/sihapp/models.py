from django.db import models

class InteractionData(models.Model):
    mouse_movements = models.JSONField()  # Stores mouse movements data as JSON
    click_intervals = models.JSONField()  # Stores click intervals data as JSON
    keypress_intervals = models.JSONField()  # Stores keypress intervals data as JSON
    scroll_positions = models.JSONField(default=list)  # Stores scroll positions data as JSON
    idle_times = models.JSONField(default=list)  # Stores idle times data as JSON
    color_depth = models.CharField(max_length=10)  # Stores color depth
    os = models.CharField(max_length=20)  # Stores screen resolution
    browser = models.CharField(max_length=20)  # Stores screen resolution
    screen_resolution = models.CharField(max_length=20)  # Stores screen resolution
    installed_plugins = models.JSONField(default=list)  # Stores installed plugins as JSON
    installed_extensions = models.JSONField(default=list)  # Stores installed extensions as JSON
    browser_rendering_engine = models.CharField(max_length=50)  # Stores browser rendering engine
    client = models.CharField(max_length=5)
    ip_address = models.GenericIPAddressField()  # Stores the IP address of the client

    def __str__(self):
        return f'{self.client} Interaction {self.id} from {self.ip_address}'
    
    class Meta:
        verbose_name = "Interaction Data"
        verbose_name_plural = "Interaction Data"