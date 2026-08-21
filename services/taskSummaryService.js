import dotenv from 'dotenv';

dotenv.config();

class TaskSummaryService {
    constructor() {
        const apiKey = process.env.OPENROUTER_API_KEY;
        if (!apiKey) {
            console.warn('TaskSummaryService: OPENROUTER_API_KEY is not set. Summary generation will be disabled.');
            this.apiKey = null;
        } else {
            this.apiKey = apiKey;
        }
    }

    formatTasks(tasks) {
        if (!tasks || tasks.length === 0) return "No tasks found.";
        
        return tasks.map((task, i) => {
            const title = task.title || 'No title';
            const owner = task.owner || task.user || 'Unassigned';
            const dueDate = task.dueDate || task.due_date || 'No date';
            const priority = task.priority || 'None';
            const description = task.description || task.notes || '';
            
            let taskStr = `${i+1}. ${title} - ${owner} - Due: ${dueDate} - Priority: ${priority}`;
            if (description.trim()) {
                taskStr += ` (${description})`;
            }
            return taskStr;
        }).join('\n');
    }

    async generateSummary(tasks) {
        try {
            const formattedTasks = this.formatTasks(tasks);
            
            const prompt = `Generate a brief task summary in 2-3 lines only.

Tasks:
${formattedTasks}

Provide a concise summary covering: total tasks, priorities, upcoming deadlines, and any urgent items. Keep it short and actionable.`;

            if (!this.apiKey) {
                return {
                    success: false,
                    error: 'Missing OpenRouter API key. Please set OPENROUTER_API_KEY in your environment.'
                };
            }

            const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`,
                    'HTTP-Referer': process.env.APP_URL || 'http://localhost',
                    'X-Title': 'Task Summary Service'
                },
                body: JSON.stringify({
                    model: "openai/gpt-4-turbo",
                    messages: [
                        { role: "system", content: "You are a helpful assistant that generates concise task summaries." },
                        { role: "user", content: prompt }
                    ],
                    max_tokens: 150,
                    temperature: 0.7
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const status = response.status;
                throw {
                    status,
                    message: errorData.error?.message || `HTTP ${status}`,
                    response: errorData
                };
            }

            const data = await response.json();
            const summary = data.choices?.[0]?.message?.content?.trim() || '';

            return {
                success: true,
                summary,
                task_count: tasks.length
            };
        } catch (error) {
            const msg = error?.message || String(error);
            console.error('TaskSummaryService.generateSummary error:', error);

            let userMessage = 'Error generating summary. Please try again later.';

            const status = error?.status || null;

            if (status === 429 || /too many requests|rate limit|429/i.test(msg)) {
                userMessage = 'API limit reached. Please wait and try again later.';
            }
            else if (status === 401 || /unauthorized|invalid api key|401/i.test(msg)) {
                userMessage = 'Invalid API key. Please check your OpenRouter API configuration.';
            }

            const result = { success: false, error: userMessage };
            if (process.env.NODE_ENV !== 'production') {
                result.debug = { message: msg, status };
            }
            return result;
        }
    }
}

export default TaskSummaryService;
