import datetime as dt


def get_current_datetime() -> dt.datetime:
    return dt.datetime.now(dt.timezone.utc)
