const OpenAI = require("openai");

class TaskSummaryService {
    constructor() {
        const apiKey = process.env.OPENAI_API_KEY;
        this.openai = new OpenAI({ apiKey });
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

            const completion = await this.openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: "You are a helpful assistant that generates concise task summaries." },
                    { role: "user", content: prompt }
                ],
                max_tokens: 150,
                temperature: 0.7
            });
            
            const summary = completion.choices[0].message.content.trim();
            
            return {
                success: true,
                summary: summary,
                task_count: tasks.length
            };
        } catch (error) {
            let userMessage = "Error generating summary. Please try again later.";
console.log('error', error);
            if (error.message && error.message.includes("429 Too Many Requests")) {
                userMessage = "You have reached the daily limit for summary generation. Please try again tomorrow or check your API quota.";
            } else if (error.status === 401) {
                userMessage = "Invalid API key. Please check your OpenAI API configuration.";
            }
            return {
                success: false,
                error: userMessage
            };
        }
    }
}

module.exports = TaskSummaryService;
