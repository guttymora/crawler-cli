const getSchemaPrompt = (context: string): string => `
You are an experienced software engineer with a huge background on API development and TDD 
(Technical Development Document) generation and you were provided with this context:

${context}

Having the above API documentation, I want you to list me all the possible endpoints I could consume to 
get metrics (not logs) from their side. In the list I want a json file with the following:
- Communication protocol: http rest (with method), graphql or any other you detect
- Full endpoint url (letting path and query params as variables)
- Authentication protocol to make the request and how to use it
- Check if the endpoint is paginated and return it as a field with a boolean value and specify the pagination type:
page-based pagination, cursor-based pagination or so
- If exists, a response schema that is returned by each endpoint

Don't hallucinate and your response should be only in a json format. Avoid comments and side notes.
`;

const getCodePrompt = (context: string): string => `
You are an experienced software engineer with a huge background on API development, Node.JS with Typescript
and amazing skills in business analytics with previous experience manipulating data and generating metrics 
who currently works in the SaaS Integration team at Datadog and you have been provided with the following context:

${context}

Having the above endpoint schema specification list, write me the method (or methods) to consume those 
endpoints (mocking all the possible variables) using 'axios' library and handle the response of each endpoint to 
map the result into metrics following these requirements:
- It's mandatory to understand the response schema to understand how to iterate over the multiple fields, nested objects
and rest of elements inside each endpoint response.
- Understand which endpoints are deprecated or not in order to know which to use.
- Extract all the possible values that can be treated as metrics. Be exhaustive and Iterate over deeper metrics. 
Remember we need as much data as possible. Remember that the value of a metric is a number always.
- Each metric has its own name and should be enough mnemonic to relate each value to a human reasoning name. If you deduce
a metric should have nesting levels, the convention of nesting is by dots. You should use the pattern: level1.level2.level3 
and so on.
- Each metric has its type which defines how the metric behaves. The all possible metric types are:
Set, Gauge, Counter, Distribution, Histogram. You have to set a type to each metric and these types should be an enum.
- Also, each metric has a timestamp. This timestamp value should be extract from the response and, in case it does not
exist, generate it using the current date.
- Based on the result, you should also understand and extract a list of tags to be included in each metric. This can
depend on multiple factors such as the dimension or belonging of each metric with respect to the general result or 
resource and if you detect something that should be a tag, don't include it inside the metric name. Remember, 
the timestamp is NOT a tag.
- In terms of performance, the endpoint calls should be generator functions (async generators) which return a 
response of each iteration for paginated requests or if the volume of data is huge.
- The code should have a final part at the end to be executable running the file isolated

It's important to define all the interfaces and types because you're working with Typescript and we all want (you included)
our code strictly typed to keep safeness and consistency. You need to keep special attention on how's the endpoints
return their responses, if the fields are in snake case, camel case or pascal case in order to generate proper types and being
able to map the objects according to this.
Also, each variable that the user should replace or input keep them separated to easily access them and replace them
with the real value such as query params, path params, secrets, tokens and so on.

Don't hallucinate and only reply with your typescript code. Avoid comments and side notes.
`;

export const prompts = {
    getSchemaPrompt,
    getCodePrompt,
};
