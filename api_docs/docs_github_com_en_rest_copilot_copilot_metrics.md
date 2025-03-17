[Skip to main content](https://docs.github.com/en/rest/copilot/copilot-metrics?apiVersion=2022-11-28#main-content)

The REST API is now versioned.For more information, see " [About API versioning](https://docs.github.com/rest/overview/api-versions)."

# REST API endpoints for Copilot metrics

Use the REST API to view Copilot metrics.

You can use these endpoints to get a breakdown of aggregated metrics for various GitHub Copilot features. The API includes:

- Data for the last 28 days
- Numbers of active users and engaged users
- Breakdowns by language and IDE
- The option to view metrics for an enterprise, organization, or team

If you currently use the [REST API endpoints for GitHub Copilot usage metrics](https://docs.github.com/en/rest/copilot/copilot-usage), we recommend migrating to these endpoints as soon as possible.

For help getting started, see [Analyzing usage over time with the Copilot metrics API](https://docs.github.com/en/copilot/managing-copilot/managing-github-copilot-in-your-organization/reviewing-activity-related-to-github-copilot-in-your-organization/analyzing-usage-over-time-with-the-copilot-metrics-api).

Note

The Copilot metrics endpoints are **not** available for GitHub Enterprise Cloud with data residency on GHE.com.

## [Get Copilot metrics for an organization](https://docs.github.com/en/rest/copilot/copilot-metrics?apiVersion=2022-11-28\#get-copilot-metrics-for-an-organization)

Use this endpoint to see a breakdown of aggregated metrics for various GitHub Copilot features. See the response schema tab for detailed metrics definitions.

Note

This endpoint will only return results for a given day if the organization contained **five or more members with active Copilot licenses** on that day, as evaluated at the end of that day.

The response contains metrics for up to 28 days prior. Metrics are processed once per day for the previous day,
and the response will only include data up until yesterday. In order for an end user to be counted towards these metrics,
they must have telemetry enabled in their IDE.

To access this endpoint, the Copilot Metrics API access policy must be enabled for the organization.
Only organization owners and owners and billing managers of the parent enterprise can view Copilot metrics.

OAuth app tokens and personal access tokens (classic) need either the `manage_billing:copilot`, `read:org`, or `read:enterprise` scopes to use this endpoint.

### [Fine-grained access tokens for "Get Copilot metrics for an organization"](https://docs.github.com/en/rest/copilot/copilot-metrics?apiVersion=2022-11-28\#get-copilot-metrics-for-an-organization--fine-grained-access-tokens)

This endpoint works with the following fine-grained token types:

- [GitHub App user access tokens](https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/generating-a-user-access-token-for-a-github-app)
- [GitHub App installation access tokens](https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/generating-an-installation-access-token-for-a-github-app)
- [Fine-grained personal access tokens](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-fine-grained-personal-access-token)

The fine-grained token must have at least one of the following permission sets:

- "GitHub Copilot Business" organization permissions (read)
- "Administration" organization permissions (read)

### [Parameters for "Get Copilot metrics for an organization"](https://docs.github.com/en/rest/copilot/copilot-metrics?apiVersion=2022-11-28\#get-copilot-metrics-for-an-organization--parameters)

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

### [HTTP response status codes for "Get Copilot metrics for an organization"](https://docs.github.com/en/rest/copilot/copilot-metrics?apiVersion=2022-11-28\#get-copilot-metrics-for-an-organization--status-codes)

| Status code | Description |
| --- | --- |
| `200` | OK |
| `403` | Forbidden |
| `404` | Resource not found |
| `422` | Copilot Usage Merics API setting is disabled at the organization or enterprise level. |
| `500` | Internal Error |

### [Code samples for "Get Copilot metrics for an organization"](https://docs.github.com/en/rest/copilot/copilot-metrics?apiVersion=2022-11-28\#get-copilot-metrics-for-an-organization--code-samples)

#### Request example

get/orgs/{org}/copilot/metrics

Copy to clipboard curl request example

`curl -L \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: Bearer <YOUR-TOKEN>" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
https://api.github.com/orgs/ORG/copilot/metrics`

#### Response

`Status: 200`

`[\
{\
    "date": "2024-06-24",\
    "total_active_users": 24,\
    "total_engaged_users": 20,\
    "copilot_ide_code_completions": {\
      "total_engaged_users": 20,\
      "languages": [\
        {\
          "name": "python",\
          "total_engaged_users": 10\
        },\
        {\
          "name": "ruby",\
          "total_engaged_users": 10\
        }\
      ],\
      "editors": [\
        {\
          "name": "vscode",\
          "total_engaged_users": 13,\
          "models": [\
            {\
              "name": "default",\
              "is_custom_model": false,\
              "custom_model_training_date": null,\
              "total_engaged_users": 13,\
              "languages": [\
                {\
                  "name": "python",\
                  "total_engaged_users": 6,\
                  "total_code_suggestions": 249,\
                  "total_code_acceptances": 123,\
                  "total_code_lines_suggested": 225,\
                  "total_code_lines_accepted": 135\
                },\
                {\
                  "name": "ruby",\
                  "total_engaged_users": 7,\
                  "total_code_suggestions": 496,\
                  "total_code_acceptances": 253,\
                  "total_code_lines_suggested": 520,\
                  "total_code_lines_accepted": 270\
                }\
              ]\
            }\
          ]\
        },\
        {\
          "name": "neovim",\
          "total_engaged_users": 7,\
          "models": [\
            {\
              "name": "a-custom-model",\
              "is_custom_model": true,\
              "custom_model_training_date": "2024-02-01",\
              "languages": [\
                {\
                  "name": "typescript",\
                  "total_engaged_users": 3,\
                  "total_code_suggestions": 112,\
                  "total_code_acceptances": 56,\
                  "total_code_lines_suggested": 143,\
                  "total_code_lines_accepted": 61\
                },\
                {\
                  "name": "go",\
                  "total_engaged_users": 4,\
                  "total_code_suggestions": 132,\
                  "total_code_acceptances": 67,\
                  "total_code_lines_suggested": 154,\
                  "total_code_lines_accepted": 72\
                }\
              ]\
            }\
          ]\
        }\
      ]\
    },\
    "copilot_ide_chat": {\
      "total_engaged_users": 13,\
      "editors": [\
        {\
          "name": "vscode",\
          "total_engaged_users": 13,\
          "models": [\
            {\
              "name": "default",\
              "is_custom_model": false,\
              "custom_model_training_date": null,\
              "total_engaged_users": 12,\
              "total_chats": 45,\
              "total_chat_insertion_events": 12,\
              "total_chat_copy_events": 16\
            },\
            {\
              "name": "a-custom-model",\
              "is_custom_model": true,\
              "custom_model_training_date": "2024-02-01",\
              "total_engaged_users": 1,\
              "total_chats": 10,\
              "total_chat_insertion_events": 11,\
              "total_chat_copy_events": 3\
            }\
          ]\
        }\
      ]\
    },\
    "copilot_dotcom_chat": {\
      "total_engaged_users": 14,\
      "models": [\
        {\
          "name": "default",\
          "is_custom_model": false,\
          "custom_model_training_date": null,\
          "total_engaged_users": 14,\
          "total_chats": 38\
        }\
      ]\
    },\
    "copilot_dotcom_pull_requests": {\
      "total_engaged_users": 12,\
      "repositories": [\
        {\
          "name": "demo/repo1",\
          "total_engaged_users": 8,\
          "models": [\
            {\
              "name": "default",\
              "is_custom_model": false,\
              "custom_model_training_date": null,\
              "total_pr_summaries_created": 6,\
              "total_engaged_users": 8\
            }\
          ]\
        },\
        {\
          "name": "demo/repo2",\
          "total_engaged_users": 4,\
          "models": [\
            {\
              "name": "a-custom-model",\
              "is_custom_model": true,\
              "custom_model_training_date": "2024-02-01",\
              "total_pr_summaries_created": 10,\
              "total_engaged_users": 4\
            }\
          ]\
        }\
      ]\
    }\
}\
]`

## [Get Copilot metrics for a team](https://docs.github.com/en/rest/copilot/copilot-metrics?apiVersion=2022-11-28\#get-copilot-metrics-for-a-team)

Use this endpoint to see a breakdown of aggregated metrics for various GitHub Copilot features. See the response schema tab for detailed metrics definitions.

Note

This endpoint will only return results for a given day if the team had **five or more members with active Copilot licenses** on that day, as evaluated at the end of that day.

The response contains metrics for up to 28 days prior. Metrics are processed once per day for the previous day,
and the response will only include data up until yesterday. In order for an end user to be counted towards these metrics,
they must have telemetry enabled in their IDE.

To access this endpoint, the Copilot Metrics API access policy must be enabled for the organization containing the team within GitHub settings.
Only organization owners for the organization that contains this team and owners and billing managers of the parent enterprise can view Copilot metrics for a team.

OAuth app tokens and personal access tokens (classic) need either the `manage_billing:copilot`, `read:org`, or `read:enterprise` scopes to use this endpoint.

### [Fine-grained access tokens for "Get Copilot metrics for a team"](https://docs.github.com/en/rest/copilot/copilot-metrics?apiVersion=2022-11-28\#get-copilot-metrics-for-a-team--fine-grained-access-tokens)

This endpoint works with the following fine-grained token types:

- [GitHub App user access tokens](https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/generating-a-user-access-token-for-a-github-app)
- [GitHub App installation access tokens](https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/generating-an-installation-access-token-for-a-github-app)
- [Fine-grained personal access tokens](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-fine-grained-personal-access-token)

The fine-grained token must have at least one of the following permission sets:

- "GitHub Copilot Business" organization permissions (read)
- "Administration" organization permissions (read)

### [Parameters for "Get Copilot metrics for a team"](https://docs.github.com/en/rest/copilot/copilot-metrics?apiVersion=2022-11-28\#get-copilot-metrics-for-a-team--parameters)

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

### [HTTP response status codes for "Get Copilot metrics for a team"](https://docs.github.com/en/rest/copilot/copilot-metrics?apiVersion=2022-11-28\#get-copilot-metrics-for-a-team--status-codes)

| Status code | Description |
| --- | --- |
| `200` | OK |
| `403` | Forbidden |
| `404` | Resource not found |
| `422` | Copilot Usage Merics API setting is disabled at the organization or enterprise level. |
| `500` | Internal Error |

### [Code samples for "Get Copilot metrics for a team"](https://docs.github.com/en/rest/copilot/copilot-metrics?apiVersion=2022-11-28\#get-copilot-metrics-for-a-team--code-samples)

#### Request example

get/orgs/{org}/team/{team\_slug}/copilot/metrics

Copy to clipboard curl request example

`curl -L \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: Bearer <YOUR-TOKEN>" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
https://api.github.com/orgs/ORG/team/TEAM_SLUG/copilot/metrics`

#### Response

`Status: 200`

`[\
{\
    "date": "2024-06-24",\
    "total_active_users": 24,\
    "total_engaged_users": 20,\
    "copilot_ide_code_completions": {\
      "total_engaged_users": 20,\
      "languages": [\
        {\
          "name": "python",\
          "total_engaged_users": 10\
        },\
        {\
          "name": "ruby",\
          "total_engaged_users": 10\
        }\
      ],\
      "editors": [\
        {\
          "name": "vscode",\
          "total_engaged_users": 13,\
          "models": [\
            {\
              "name": "default",\
              "is_custom_model": false,\
              "custom_model_training_date": null,\
              "total_engaged_users": 13,\
              "languages": [\
                {\
                  "name": "python",\
                  "total_engaged_users": 6,\
                  "total_code_suggestions": 249,\
                  "total_code_acceptances": 123,\
                  "total_code_lines_suggested": 225,\
                  "total_code_lines_accepted": 135\
                },\
                {\
                  "name": "ruby",\
                  "total_engaged_users": 7,\
                  "total_code_suggestions": 496,\
                  "total_code_acceptances": 253,\
                  "total_code_lines_suggested": 520,\
                  "total_code_lines_accepted": 270\
                }\
              ]\
            }\
          ]\
        },\
        {\
          "name": "neovim",\
          "total_engaged_users": 7,\
          "models": [\
            {\
              "name": "a-custom-model",\
              "is_custom_model": true,\
              "custom_model_training_date": "2024-02-01",\
              "languages": [\
                {\
                  "name": "typescript",\
                  "total_engaged_users": 3,\
                  "total_code_suggestions": 112,\
                  "total_code_acceptances": 56,\
                  "total_code_lines_suggested": 143,\
                  "total_code_lines_accepted": 61\
                },\
                {\
                  "name": "go",\
                  "total_engaged_users": 4,\
                  "total_code_suggestions": 132,\
                  "total_code_acceptances": 67,\
                  "total_code_lines_suggested": 154,\
                  "total_code_lines_accepted": 72\
                }\
              ]\
            }\
          ]\
        }\
      ]\
    },\
    "copilot_ide_chat": {\
      "total_engaged_users": 13,\
      "editors": [\
        {\
          "name": "vscode",\
          "total_engaged_users": 13,\
          "models": [\
            {\
              "name": "default",\
              "is_custom_model": false,\
              "custom_model_training_date": null,\
              "total_engaged_users": 12,\
              "total_chats": 45,\
              "total_chat_insertion_events": 12,\
              "total_chat_copy_events": 16\
            },\
            {\
              "name": "a-custom-model",\
              "is_custom_model": true,\
              "custom_model_training_date": "2024-02-01",\
              "total_engaged_users": 1,\
              "total_chats": 10,\
              "total_chat_insertion_events": 11,\
              "total_chat_copy_events": 3\
            }\
          ]\
        }\
      ]\
    },\
    "copilot_dotcom_chat": {\
      "total_engaged_users": 14,\
      "models": [\
        {\
          "name": "default",\
          "is_custom_model": false,\
          "custom_model_training_date": null,\
          "total_engaged_users": 14,\
          "total_chats": 38\
        }\
      ]\
    },\
    "copilot_dotcom_pull_requests": {\
      "total_engaged_users": 12,\
      "repositories": [\
        {\
          "name": "demo/repo1",\
          "total_engaged_users": 8,\
          "models": [\
            {\
              "name": "default",\
              "is_custom_model": false,\
              "custom_model_training_date": null,\
              "total_pr_summaries_created": 6,\
              "total_engaged_users": 8\
            }\
          ]\
        },\
        {\
          "name": "demo/repo2",\
          "total_engaged_users": 4,\
          "models": [\
            {\
              "name": "a-custom-model",\
              "is_custom_model": true,\
              "custom_model_training_date": "2024-02-01",\
              "total_pr_summaries_created": 10,\
              "total_engaged_users": 4\
            }\
          ]\
        }\
      ]\
    }\
}\
]`

REST API endpoints for Copilot metrics - GitHub Docs