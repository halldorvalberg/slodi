"""
Configuration module that provides access to application settings.
This module re-exports the settings instance for use in the auth module.
"""

from app.settings import settings

__all__ = ["settings"]
