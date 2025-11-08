import math
from typing import Annotated

from fastapi import Query, Request, Response

Limit = Annotated[int, Query(ge=1, le=200, description="Max items to return (1-200)")]
Offset = Annotated[int, Query(ge=0, description="Number of items to skip")]


def add_pagination_headers(
    *,
    response: Response,
    request: Request,
    total: int,
    limit: int,
    offset: int,
) -> None:
    """Attach RFC 8288 Link headers + helpful count headers."""
    links: list[str] = []

    def url_with(new_offset: int, new_limit: int | None = None) -> str:
        return str(
            request.url.include_query_params(
                offset=new_offset,
                limit=new_limit if new_limit is not None else limit,
            )
        )

    # next
    if offset + limit < total:
        links.append(f'<{url_with(offset + limit)}>; rel="next"')

    # prev
    if offset > 0:
        prev_offset = max(0, offset - limit)
        links.append(f'<{url_with(prev_offset)}>; rel="prev"')

    # first & last
    links.append(f'<{url_with(0)}>; rel="first"')
    last_offset = 0 if total == 0 else max(0, (math.ceil(total / limit) - 1) * limit)
    links.append(f'<{url_with(last_offset)}>; rel="last"')

    if links:
        response.headers["Link"] = ", ".join(links)

    response.headers["X-Total-Count"] = str(total)
    response.headers["X-Limit"] = str(limit)
    response.headers["X-Offset"] = str(offset)
