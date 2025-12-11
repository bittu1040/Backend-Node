import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

class TaskSummaryService {
    constructor() {
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
            console.warn('TaskSummaryService: OPENAI_API_KEY is not set. Summary generation will be disabled.');
            this.openai = null;
        } else {
            this.openai = new OpenAI({ apiKey });
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

            if (!this.openai) {
                return {
                    success: false,
                    error: 'Missing OpenAI API key. Please set OPENAI_API_KEY in your environment.'
                };
            }

            const completion = await this.openai.chat.completions.create({
                model: "gpt-4.1-mini",
                messages: [
                    { role: "system", content: "You are a helpful assistant that generates concise task summaries." },
                    { role: "user", content: prompt }
                ],
                max_tokens: 150,
                temperature: 0.7
            });

            const summary = completion.choices?.[0]?.message?.content?.trim() || '';

            return {
                success: true,
                summary,
                task_count: tasks.length
            };
        } catch (error) {
            const msg = error?.message || String(error);
            console.error('TaskSummaryService.generateSummary error:', error);

            let userMessage = 'Error generating summary. Please try again later.';

            const status = error?.response?.status || error?.status || null;

            if (status === 429 || /too many requests|rate limit|429/i.test(msg)) {
                userMessage = 'API limit reached. Please wait and try again later.';
            }
            else if (status === 401 || /unauthorized|invalid api key|401/i.test(msg)) {
                userMessage = 'Invalid API key. Please check your OpenAI API configuration.';
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
