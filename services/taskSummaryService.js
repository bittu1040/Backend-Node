const { GoogleGenerativeAI } = require("@google/generative-ai");

class TaskSummaryService {
    constructor() {
        const apiKey = process.env.GEMINI_API_KEY || "AIzaSyCGJDWiogRyMjvg4prfOPCi3bLWWpKf-UI";
        this.genAI = new GoogleGenerativeAI(apiKey);
        this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
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

            const result = await this.model.generateContent(prompt);
            const summary = result.response.text().trim();
            
            return {
                success: true,
                summary: summary,
                task_count: tasks.length
            };
        } catch (error) {
            return {
                success: false,
                error: `Error generating summary: ${error.message}`
            };
        }
    }
}

module.exports = TaskSummaryService;