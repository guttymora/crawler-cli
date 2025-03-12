import axios from 'axios';

enum MetricType {
  Set = 'Set',
  Gauge = 'Gauge',
  Counter = 'Counter',
  Distribution = 'Distribution',
  Histogram = 'Histogram'
}

interface Metric {
  name: string;
  value: number;
  type: MetricType;
  timestamp: Date;
  tags: string[];
}

interface CopilotMetricsResponse {
  date: string;
  total_active_users: number;
  total_engaged_users: number;
  copilot_ide_code_completions: {
    total_engaged_users: number;
    languages: { name: string, total_engaged_users: number }[];
    editors: {
      name: string;
      total_engaged_users: number;
      models: {
        name: string;
        is_custom_model: boolean;
        custom_model_training_date: string | null;
        total_engaged_users: number;
        languages: {
          name: string;
          total_engaged_users: number;
          total_code_suggestions: number;
          total_code_acceptances: number;
          total_code_lines_suggested: number;
          total_code_lines_accepted: number;
        }[];
      }[];
    }[];
  };
  copilot_ide_chat: {
    total_engaged_users: number;
    editors: {
      name: string;
      total_engaged_users: number;
      models: {
        name: string;
        is_custom_model: boolean;
        custom_model_training_date: string | null;
        total_engaged_users: number;
        total_chats: number;
        total_chat_insertion_events: number;
        total_chat_copy_events: number;
      }[];
    }[];
  };
  copilot_dotcom_chat: {
    total_engaged_users: number;
    models: {
      name: string;
      is_custom_model: boolean;
      custom_model_training_date: string | null;
      total_engaged_users: number;
      total_chats: number;
    }[];
  };
  copilot_dotcom_pull_requests: {
    total_engaged_users: number;
    repositories: {
      name: string;
      total_engaged_users: number;
      models: {
        name: string;
        is_custom_model: boolean;
        custom_model_training_date: string | null;
        total_pr_summaries_created: number;
        total_engaged_users: number;
      }[];
    }[];
  };
}

const API_BASE_URL = 'https://api.github.com';
const AUTH_TOKEN = '<YOUR-TOKEN>';
const ORG_NAME = '<ORG-NAME>';
const TEAM_SLUG = '<TEAM-SLUG>';

async function* getCopilotMetrics(url: string): AsyncGenerator<CopilotMetricsResponse> {
  let page = 1;
  let hasMore = true;
  while (hasMore) {
    const response = await axios.get<CopilotMetricsResponse[]>(`${url}?page=${page}`, {
      headers: { Authorization: `Bearer ${AUTH_TOKEN}` }
    });
    for (const data of response.data) {
      yield data;
    }
    hasMore = response.data.length > 0;
    page++;
  }
}

async function fetchAndMapCopilotMetricsForOrg() {
  const metrics = [];
  for await (const data of getCopilotMetrics(`${API_BASE_URL}/orgs/${ORG_NAME}/copilot/metrics`)) {
    metrics.push(...mapToMetrics(data));
  }
  return metrics;
}

async function fetchAndMapCopilotMetricsForTeam() {
  const metrics = [];
  for await (const data of getCopilotMetrics(`${API_BASE_URL}/orgs/${ORG_NAME}/team/${TEAM_SLUG}/copilot/metrics`)) {
    metrics.push(...mapToMetrics(data));
  }
  return metrics;
}

function mapToMetrics(data: CopilotMetricsResponse): Metric[] {
  const timestamp = new Date(data.date);
  const metrics: Metric[] = [];

  metrics.push({ name: 'totalActiveUsers', value: data.total_active_users, type: MetricType.Gauge, timestamp, tags: [] });
  metrics.push({ name: 'totalEngagedUsers', value: data.total_engaged_users, type: MetricType.Gauge, timestamp, tags: [] });

  const extractMetricsRecursively = (parentKey: string, obj: any, tags: string[] = []) => {
    Object.entries(obj).forEach(([key, value]) => {
      if (typeof value === 'number') {
        metrics.push({
          name: `${parentKey}.${key}`,
          value: value,
          type: MetricType.Gauge,
          timestamp,
          tags
        });
      } else if (typeof value === 'object' && value !== null) {
        extractMetricsRecursively(`${parentKey}.${key}`, value, tags);
      }
    });
  };

  extractMetricsRecursively('copilotIDECodeCompletions', data.copilot_ide_code_completions);
  extractMetricsRecursively('copilotIDEChat', data.copilot_ide_chat);
  extractMetricsRecursively('copilotDotcomChat', data.copilot_dotcom_chat);
  extractMetricsRecursively('copilotDotcomPullRequests', data.copilot_dotcom_pull_requests);

  return metrics;
}

(async () => {
  const orgMetrics = await fetchAndMapCopilotMetricsForOrg();
  console.log('Org Metrics:', orgMetrics);

  const teamMetrics = await fetchAndMapCopilotMetricsForTeam();
  console.log('Team Metrics:', teamMetrics);
})();