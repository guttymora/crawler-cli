[Skip to main content](https://docs.github.com/en/rest/copilot/copilot-usage?apiVersion=2022-11-28#main-content)

The REST API is now versioned.For more information, see " [About API versioning](https://docs.github.com/rest/overview/api-versions)."

# REST API endpoints for GitHub Copilot usage metrics

Use the REST API to access Copilot usage metrics for an enterprise, an organization, or a team.

Warning

These endpoints are retired. Use the [REST API endpoints for Copilot metrics](https://docs.github.com/en/rest/copilot/copilot-metrics) endpoints instead.

## [Get a summary of Copilot usage for organization members](https://docs.github.com/en/rest/copilot/copilot-usage?apiVersion=2022-11-28\#get-a-summary-of-copilot-usage-for-organization-members)

Note

This endpoint is closing down. It will be accessible throughout February 2025, but will not return any new data after February 1st.

You can use this endpoint to see a daily breakdown of aggregated usage metrics for Copilot completions and Copilot Chat in the IDE
across an organization, with a further breakdown of suggestions, acceptances, and number of active users by editor and language for each day.
See the response schema tab for detailed metrics definitions.

The response contains metrics for up to 28 days prior. Usage metrics are processed once per day for the previous day,
and the response will only include data up until yesterday. In order for an end user to be counted towards these metrics,
they must have telemetry enabled in their IDE.

Organization owners, and owners and billing managers of the parent enterprise, can view Copilot usage metrics.

OAuth app tokens and personal access tokens (classic) need either the `manage_billing:copilot`, `read:org`, or `read:enterprise` scopes to use this endpoint.

### [Fine-grained access tokens for "Get a summary of Copilot usage for organization members"](https://docs.github.com/en/rest/copilot/copilot-usage?apiVersion=2022-11-28\#get-a-summary-of-copilot-usage-for-organization-members--fine-grained-access-tokens)

This endpoint works with the following fine-grained token types:

- [GitHub App user access tokens](https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/generating-a-user-access-token-for-a-github-app)
- [GitHub App installation access tokens](https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/generating-an-installation-access-token-for-a-github-app)
- [Fine-grained personal access tokens](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-fine-grained-personal-access-token)

The fine-grained token must have at least one of the following permission sets:

- "GitHub Copilot Business" organization permissions (read)
- "Administration" organization permissions (read)

### [Parameters for "Get a summary of Copilot usage for organization members"](https://docs.github.com/en/rest/copilot/copilot-usage?apiVersion=2022-11-28\#get-a-summary-of-copilot-usage-for-organization-members--parameters)

| Name, Type, Description |
| --- |
| `accept` string<br>Setting to `application/vnd.github+json` is recommended. |

Headers

| Name, Type, Description |
| --- |
| `org` stringRequired<br>The organization name. The name is not case sensitive. |

Path parameters

| Name, Type, Description |
| --- |
| `since` string<br>Show usage metrics since this date. This is a timestamp in [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format ( `YYYY-MM-DDTHH:MM:SSZ`). Maximum value is 28 days ago. |
| `until` string<br>Show usage metrics until this date. This is a timestamp in [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format ( `YYYY-MM-DDTHH:MM:SSZ`) and should not preceed the `since` date if it is passed. |
| `page` integer<br>The page number of the results to fetch. For more information, see " [Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."<br>Default: `1` |
| `per_page` integer<br>The number of days of metrics to display per page (max 28). For more information, see " [Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."<br>Default: `28` |

Query parameters

### [HTTP response status codes for "Get a summary of Copilot usage for organization members"](https://docs.github.com/en/rest/copilot/copilot-usage?apiVersion=2022-11-28\#get-a-summary-of-copilot-usage-for-organization-members--status-codes)

| Status code | Description |
| --- | --- |
| `200` | OK |
| `401` | Requires authentication |
| `403` | Forbidden |
| `404` | Resource not found |
| `500` | Internal Error |

### [Code samples for "Get a summary of Copilot usage for organization members"](https://docs.github.com/en/rest/copilot/copilot-usage?apiVersion=2022-11-28\#get-a-summary-of-copilot-usage-for-organization-members--code-samples)

#### Request example

get/orgs/{org}/copilot/usage

Copy to clipboard curl request example

`curl -L \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: Bearer <YOUR-TOKEN>" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
https://api.github.com/orgs/ORG/copilot/usage`

#### Response

`Status: 200`

`[\
{\
    "day": "2023-10-15",\
    "total_suggestions_count": 1000,\
    "total_acceptances_count": 800,\
    "total_lines_suggested": 1800,\
    "total_lines_accepted": 1200,\
    "total_active_users": 10,\
    "total_chat_acceptances": 32,\
    "total_chat_turns": 200,\
    "total_active_chat_users": 4,\
    "breakdown": [\
      {\
        "language": "python",\
        "editor": "vscode",\
        "suggestions_count": 300,\
        "acceptances_count": 250,\
        "lines_suggested": 900,\
        "lines_accepted": 700,\
        "active_users": 5\
      },\
      {\
        "language": "python",\
        "editor": "jetbrains",\
        "suggestions_count": 300,\
        "acceptances_count": 200,\
        "lines_suggested": 400,\
        "lines_accepted": 300,\
        "active_users": 2\
      },\
      {\
        "language": "ruby",\
        "editor": "vscode",\
        "suggestions_count": 400,\
        "acceptances_count": 350,\
        "lines_suggested": 500,\
        "lines_accepted": 200,\
        "active_users": 3\
      }\
    ]\
},\
{\
    "day": "2023-10-16",\
    "total_suggestions_count": 800,\
    "total_acceptances_count": 600,\
    "total_lines_suggested": 1100,\
    "total_lines_accepted": 700,\
    "total_active_users": 12,\
    "total_chat_acceptances": 57,\
    "total_chat_turns": 426,\
    "total_active_chat_users": 8,\
    "breakdown": [\
      {\
        "language": "python",\
        "editor": "vscode",\
        "suggestions_count": 300,\
        "acceptances_count": 200,\
        "lines_suggested": 600,\
        "lines_accepted": 300,\
        "active_users": 2\
      },\
      {\
        "language": "python",\
        "editor": "jetbrains",\
        "suggestions_count": 300,\
        "acceptances_count": 150,\
        "lines_suggested": 300,\
        "lines_accepted": 250,\
        "active_users": 6\
      },\
      {\
        "language": "ruby",\
        "editor": "vscode",\
        "suggestions_count": 200,\
        "acceptances_count": 150,\
        "lines_suggested": 200,\
        "lines_accepted": 150,\
        "active_users": 3\
      }\
    ]\
}\
]`

## [Get a summary of Copilot usage for a team](https://docs.github.com/en/rest/copilot/copilot-usage?apiVersion=2022-11-28\#get-a-summary-of-copilot-usage-for-a-team)

Note

This endpoint is closing down. It will be accessible throughout February 2025, but will not return any new data after February 1st.

You can use this endpoint to see a daily breakdown of aggregated usage metrics for Copilot completions and Copilot Chat in the IDE
for users within a team, with a further breakdown of suggestions, acceptances, and number of active users by editor and language for each day.
See the response schema tab for detailed metrics definitions.

The response contains metrics for up to 28 days prior. Usage metrics are processed once per day for the previous day,
and the response will only include data up until yesterday. In order for an end user to be counted towards these metrics,
they must have telemetry enabled in their IDE.

Note

This endpoint will only return results for a given day if the team had five or more members with active Copilot licenses, as evaluated at the end of that day.

Organization owners for the organization that contains this team, and owners and billing managers of the parent enterprise can view Copilot usage metrics for a team.

OAuth app tokens and personal access tokens (classic) need either the `manage_billing:copilot`, `read:org`, or `read:enterprise` scopes to use this endpoint.

### [Fine-grained access tokens for "Get a summary of Copilot usage for a team"](https://docs.github.com/en/rest/copilot/copilot-usage?apiVersion=2022-11-28\#get-a-summary-of-copilot-usage-for-a-team--fine-grained-access-tokens)

This endpoint works with the following fine-grained token types:

- [GitHub App user access tokens](https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/generating-a-user-access-token-for-a-github-app)
- [GitHub App installation access tokens](https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/generating-an-installation-access-token-for-a-github-app)
- [Fine-grained personal access tokens](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-fine-grained-personal-access-token)

The fine-grained token must have at least one of the following permission sets:

- "GitHub Copilot Business" organization permissions (read)
- "Administration" organization permissions (read)

### [Parameters for "Get a summary of Copilot usage for a team"](https://docs.github.com/en/rest/copilot/copilot-usage?apiVersion=2022-11-28\#get-a-summary-of-copilot-usage-for-a-team--parameters)

| Name, Type, Description |
| --- |
| `accept` string<br>Setting to `application/vnd.github+json` is recommended. |

Headers

| Name, Type, Description |
| --- |
| `org` stringRequired<br>The organization name. The name is not case sensitive. |
| `team_slug` stringRequired<br>The slug of the team name. |

Path parameters

| Name, Type, Description |
| --- |
| `since` string<br>Show usage metrics since this date. This is a timestamp in [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format ( `YYYY-MM-DDTHH:MM:SSZ`). Maximum value is 28 days ago. |
| `until` string<br>Show usage metrics until this date. This is a timestamp in [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format ( `YYYY-MM-DDTHH:MM:SSZ`) and should not preceed the `since` date if it is passed. |
| `page` integer<br>The page number of the results to fetch. For more information, see " [Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."<br>Default: `1` |
| `per_page` integer<br>The number of days of metrics to display per page (max 28). For more information, see " [Using pagination in the REST API](https://docs.github.com/rest/using-the-rest-api/using-pagination-in-the-rest-api)."<br>Default: `28` |

Query parameters

### [HTTP response status codes for "Get a summary of Copilot usage for a team"](https://docs.github.com/en/rest/copilot/copilot-usage?apiVersion=2022-11-28\#get-a-summary-of-copilot-usage-for-a-team--status-codes)

| Status code | Description |
| --- | --- |
| `200` | OK |
| `401` | Requires authentication |
| `403` | Forbidden |
| `404` | Resource not found |
| `500` | Internal Error |

### [Code samples for "Get a summary of Copilot usage for a team"](https://docs.github.com/en/rest/copilot/copilot-usage?apiVersion=2022-11-28\#get-a-summary-of-copilot-usage-for-a-team--code-samples)

#### Request example

get/orgs/{org}/team/{team\_slug}/copilot/usage

Copy to clipboard curl request example

`curl -L \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: Bearer <YOUR-TOKEN>" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
https://api.github.com/orgs/ORG/team/TEAM_SLUG/copilot/usage`

#### Response

`Status: 200`

`[\
{\
    "day": "2023-10-15",\
    "total_suggestions_count": 1000,\
    "total_acceptances_count": 800,\
    "total_lines_suggested": 1800,\
    "total_lines_accepted": 1200,\
    "total_active_users": 10,\
    "total_chat_acceptances": 32,\
    "total_chat_turns": 200,\
    "total_active_chat_users": 4,\
    "breakdown": [\
      {\
        "language": "python",\
        "editor": "vscode",\
        "suggestions_count": 300,\
        "acceptances_count": 250,\
        "lines_suggested": 900,\
        "lines_accepted": 700,\
        "active_users": 5\
      },\
      {\
        "language": "python",\
        "editor": "jetbrains",\
        "suggestions_count": 300,\
        "acceptances_count": 200,\
        "lines_suggested": 400,\
        "lines_accepted": 300,\
        "active_users": 2\
      },\
      {\
        "language": "ruby",\
        "editor": "vscode",\
        "suggestions_count": 400,\
        "acceptances_count": 350,\
        "lines_suggested": 500,\
        "lines_accepted": 200,\
        "active_users": 3\
      }\
    ]\
},\
{\
    "day": "2023-10-16",\
    "total_suggestions_count": 800,\
    "total_acceptances_count": 600,\
    "total_lines_suggested": 1100,\
    "total_lines_accepted": 700,\
    "total_active_users": 12,\
    "total_chat_acceptances": 57,\
    "total_chat_turns": 426,\
    "total_active_chat_users": 8,\
    "breakdown": [\
      {\
        "language": "python",\
        "editor": "vscode",\
        "suggestions_count": 300,\
        "acceptances_count": 200,\
        "lines_suggested": 600,\
        "lines_accepted": 300,\
        "active_users": 2\
      },\
      {\
        "language": "python",\
        "editor": "jetbrains",\
        "suggestions_count": 300,\
        "acceptances_count": 150,\
        "lines_suggested": 300,\
        "lines_accepted": 250,\
        "active_users": 6\
      },\
      {\
        "language": "ruby",\
        "editor": "vscode",\
        "suggestions_count": 200,\
        "acceptances_count": 150,\
        "lines_suggested": 200,\
        "lines_accepted": 150,\
        "active_users": 3\
      }\
    ]\
}\
]`

REST API endpoints for GitHub Copilot usage metrics - GitHub Docs