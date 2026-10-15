export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Use POST." });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: "GEMINI_API_KEY is missing in Vercel Environment Variables."
    });
  }

  const { action, level, problem, userAnswer } = req.body || {};

  if (!["generate", "hint", "explain", "check"].includes(action) ||
      ![1, 2, 3].includes(Number(level))) {
    return res.status(400).json({
      error: "Invalid action or level."
    });
  }

  const levels = {
    1: "FOUNDATION: Use simple sequences, small numbers, direct hints, and step-by-step guidance.",
    2: "STANDARD: Use missing terms, common differences, and nth-term formula problems.",
    3: "ADVANCED: Use multi-step problems, arithmetic series, and real-life applications."
  };

  const systemPrompt = `
You are a careful arithmetic sequence mathematics tutor.
Adapt your response to this level: ${levels[level]}

Formulas:
nth term: a_n = a_1 + (n - 1)d
sum: S_n = n(a_1 + a_n) / 2

Check all calculations carefully.
Return ONLY valid JSON with these string fields:
problem, answer, hint, explanation, feedback.
Use empty strings for unused fields.
A hint must not reveal the final answer.
Explain solutions in clear, student-friendly English.
`;

  let task;

  if (action === "generate") {
    task = `Create one new arithmetic sequence question for level ${level}.
Include its correct answer, a helpful hint, a step-by-step explanation,
and feedback. Ensure all calculations are correct.`;
  } else if (action === "hint") {
    task = `Give a hint without revealing the answer.
Existing problem: ${JSON.stringify(problem || {})}`;
  } else if (action === "explain") {
    task = `Explain the solution step by step.
Existing problem: ${JSON.stringify(problem || {})}`;
  } else {
    task = `Check the student's answer and give encouraging feedback.
Existing problem: ${JSON.stringify(problem || {})}
Student answer: ${String(userAnswer || "")}
Say whether the answer is correct and explain any mistake.`;
  }

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: systemPrompt }]
          },
          contents: [{
            role: "user",
            parts: [{ text: task }]
          }],
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.3
          }
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini API error:", JSON.stringify(data));
      return res.status(response.status).json({
        error: data.error?.message || "Gemini API request failed."
      });
    }

    const text = data.candidates?.[0]?.content?.parts
      ?.map(part => part.text || "")
      .join("");

    if (!text) {
      return res.status(502).json({
        error: "Gemini returned an empty response. Please try again."
      });
    }

    const result = JSON.parse(text);

    return res.status(200).json({
      problem: result.problem || "",
      answer: result.answer || "",
      hint: result.hint || "",
      explanation: result.explanation || "",
      feedback: result.feedback || ""
    });

  } catch (error) {
    console.error("Tutor error:", error.message);
    return res.status(500).json({
      error: "Tutor error: " + error.message
    });
  }
}
