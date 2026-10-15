import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const levelInstructions = {
  1: `FOUNDATION: Use small positive integers and simple sequences.
Give one clear step at a time, simple vocabulary, and direct hints.
Focus on identifying the common difference and finding the next term.`,
  2: `STANDARD: Use grade-level questions about common differences,
missing terms, nth terms, and arithmetic sequence formulas.
Give a useful hint and show the calculation in the solution.`,
  3: `ADVANCED: Use multi-step reasoning, arithmetic series, or realistic
applications. Include a challenge requiring more than one calculation.
Give strategic hints before showing a complete solution.`
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Use POST." });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({
      error: "OPENAI_API_KEY is not configured."
    });
  }

  const { action, level, problem, userAnswer } = req.body || {};

  if (!["generate", "hint", "explain", "check"].includes(action) ||
      ![1, 2, 3].includes(Number(level))) {
    return res.status(400).json({ error: "Invalid action or level." });
  }

  const systemPrompt = `
You are a careful mathematics tutor specializing in arithmetic sequences.
Adapt your teaching to this level:
${levelInstructions[level]}

Math facts:
- An arithmetic sequence has a constant difference between terms.
- nth term: a_n = a_1 + (n - 1)d.
- Sum of first n terms: S_n = n(a_1 + a_n)/2.

Always verify the arithmetic before answering.
Never change the existing question except when generating a new one.
Use clear, student-friendly English.
Return ONLY valid JSON with these string fields:
problem, answer, hint, explanation, feedback.
For unused fields return an empty string.
The answer field must contain the correct final answer.
Do not reveal the final answer in a hint.
`;

  const taskPrompt = action === "generate"
    ? `Create one new arithmetic sequence problem for level ${level}.
Include a clear question. Supply its correct answer, a tailored hint,
and a step-by-step solution.`
    : `Action: ${action}
Existing problem data: ${JSON.stringify(problem || {})}
Student answer: ${String(userAnswer || "")}
For hint: give a helpful hint without the final answer.
For explain: give the correct step-by-step solution.
For check: compare the student's answer with the correct answer.
Be encouraging and explain any error. Tolerate equivalent numeric forms.
Return the requested content in the JSON fields.`;

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: taskPrompt }
      ],
      temperature: 0.4
    });

    const result = JSON.parse(
      completion.choices[0].message.content
    );

    return res.status(200).json(result);
  } catch (error) {
    console.error("Tutor API error:", error.message);
    return res.status(500).json({
      error: "The AI tutor could not answer. Please try again."
    });
  }
}
