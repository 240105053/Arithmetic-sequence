AI-Powered Arithmetic Sequence Tutor
1. Project Overview

The Arithmetic Sequence AI Tutor is an interactive educational website designed to help students learn arithmetic sequences at three different difficulty levels. Students can generate questions, request hints, check their answers, and receive step-by-step explanations.

2. AI Integration

The project uses the OpenAI API with the gpt. The AI generates mathematics problems, hints, answers, and explanations based on the student's selected difficulty level. The API key is stored securely as a server-side environment variable.

System Prompt:

"You are a mathematics tutor specializing in arithmetic sequences. Generate mathematically correct questions, hints, answers, and explanations. Adapt the difficulty, vocabulary, and amount of guidance to the student's selected level. Verify calculations and provide clear, student-friendly explanations."

3. Three Levels of Differentiation
Level 1 — Foundation: Students work with simple number sequences and small numbers. They receive direct hints and step-by-step guidance to identify the common difference and find the next term.
Level 2 — Standard: Students solve curriculum-level problems involving missing terms, common differences, and the nth-term formula.
Level 3 — Advanced: Students solve multi-step problems, arithmetic series questions, and real-world applications. They receive strategic hints and detailed solutions.

The AI adapts the generated tasks and feedback according to the selected level.

4. Technologies Used

The website uses HTML, CSS, and JavaScript for the user interface. A Vercel serverless function connects the website to the OpenAI API. The responsive design supports computers and mobile devices.

5. Testing and Evaluation

The application should be tested at all three difficulty levels. Testing includes generating questions, checking correct and incorrect answers, requesting hints, and viewing explanations. Generated answers should be verified using arithmetic sequence formulas because AI models can occasionally make calculation errors.

6. Conclusion

The AI-Powered Arithmetic Sequence Tutor demonstrates how artificial intelligence can support personalized mathematics education. It provides students with different levels of difficulty, instant feedback, and explanations suited to their learning needs. Future improvements could include progress tracking, student accounts, and teacher dashboards.
