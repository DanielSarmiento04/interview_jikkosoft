"""
Configuration management for the Interview Challenge 3 application.

Hey there! This is our central configuration hub. I'm using Pydantic Settings
here because it gives us type safety, validation, and automatic environment
variable loading out of the box. Much cleaner than manually parsing env vars!

The neat thing about this approach is that we can have different settings
for different environments (dev, staging, prod) and they'll all be validated
the same way. Plus, the IDE gets full autocomplete on our settings.
"""

import secrets
from typing import Literal, Optional, List, Union
from functools import lru_cache

from pydantic import Field, field_validator, AnyHttpUrl, PostgresDsn
from pydantic_settings import BaseSettings, SettingsConfigDict
import os


class Settings(BaseSettings):
    """
    Application settings with environment variable support.
    
    This class automatically loads configuration from environment variables,
    .env files, and provides sensible defaults for development.

    

    """
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore"
    )
    
    # Application settings

    database_url: PostgresDsn


@lru_cache()
def get_settings() -> Settings:
    """
    Get cached application settings.
    
    Using lru_cache here means we only create the settings object once
    and reuse it throughout the application lifecycle. This is both
    more efficient and ensures consistency.
    """

    database_url = os.getenv("PG_CONNECTION_STRING", None)
    if not database_url:
        raise ValueError("PG_CONNECTION_STRING environment variable is not set")


    return Settings(
        database_url=PostgresDsn(database_url)
    )


# Global settings instance for easy importing
settings = get_settings()