import google.generativeai as genai
from flask import Flask 
from flask import request
from flask import jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication with backend

# Set up Gemini AI key
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=GEMINI_API_KEY)

# Store transcripts temporarily
transcripts = {}

# Temporary storage for user moods (for tracking trends
user_moods = {}

@app.route('/upload_transcript', methods=['POST'])
def upload_transcript():
    """Uploads and processes the transcript to generate questions."""
    data = request.json
    user_id = data.get("user_id", "default_user")
    transcript_text = data.get("transcript", "")

    # Generate related questions
    prompt = f"Read the following lecture transcript and generate a list of key topics and possible student questions:\n\n{transcript_text}\n\nQuestions:"
    response = genai.GenerativeModel("gemini-pro").generate_content(prompt)

    questions = response.text.strip().split("\n")
    transcripts[user_id] = {"transcript": transcript_text, "questions": questions}

    return jsonify({"message": "Transcript processed successfully!", "questions": questions})

@app.route('/ask_transcript', methods=['POST'])
def ask_transcript():
    """Answers user questions based on the uploaded lecture transcript."""
    data = request.json
    user_id = data.get("user_id", "default_user")
    question = data.get("question", "")

    if user_id not in transcripts:
        return jsonify({"error": "No transcript found. Please upload one first."})

    transcript_text = transcripts[user_id]["transcript"]

    # Improved prompt for more accurate answers
    prompt = f"""
    You are an AI assistant helping a student understand a lecture. 
    Use the following transcript to answer their question accurately.
    
    --- Transcript Start ---
    {transcript_text}
    --- Transcript End ---

    The student has a question related to this lecture:
    {question}

    If the transcript explicitly answers this question, provide a direct answer. 
    If it is not explicitly mentioned, use insights from the transcript to infer the best possible answer.
    """

    response = genai.GenerativeModel("gemini-pro").generate_content(prompt)

    return jsonify({"answer": response.text})

@app.route('/edubot', methods=['POST'])
def edubot():
    """Suggests learning resources based on job role."""
    data = request.json
    job_role = data.get("job_role", "")

    prompt = f"Suggest top 3 learning resources for a {job_role}."

    response = genai.GenerativeModel("gemini-pro").generate_content(prompt)

    return jsonify({"resources": response.text})

@app.route('/jobmate', methods=['POST'])
def jobmate():
    """Analyzes resume and generates key bullet points."""
    data = request.json
    resume_text = data.get("resume", "")

    if not resume_text.strip():
        return jsonify({"error": "No resume provided"}), 400

    prompt = f"Extract the most important skills and achievements from this resume:\n{resume_text}"

    response = genai.GenerativeModel("gemini-pro").generate_content(prompt)

    return jsonify({"resume_bullets": response.text})


@app.route('/wellness', methods=['POST'])
def wellness():
    """Performs sentiment analysis for mental wellness check."""
    data = request.json
    user_text = data.get("text", "")

    prompt = f"Analyze the sentiment of the following text and determine the stress level:\n{user_text}"

    response = genai.GenerativeModel("gemini-pro").generate_content(prompt)

    return jsonify({"sentiment": response.text})

@app.route('/chatbot', methods=['POST'])
def chatbot():
    """Handles user queries using NLP."""
    data = request.json
    user_message = data.get("message", "")

    prompt = f"You are an AI assistant. Answer the following user query in a friendly and helpful way:\n\nUser: {user_message}\n\nAssistant:"

    response = genai.GenerativeModel("gemini-pro").generate_content(prompt)

    return jsonify({"response": response.text})

@app.route('/debug_code', methods=['POST'])
def debug_code():
    """Analyzes and improves the given code."""
    data = request.json
    code = data.get("code", "")

    if not code.strip():
        return jsonify({"error": "No code provided"}), 400

    prompt = f"""
    You are an AI code debugger and optimizer. 
    Analyze the following code for syntax errors and performance improvements.
    
    --- Code Start ---
    {code}
    --- Code End ---

    1. If there are syntax errors, correct them.
    2. If there are performance improvements, suggest optimized code.
    3. If the code is already optimal, confirm that it's correct.
    4. Provide an explanation of any issues found and how they were fixed.
    
    Response format:
    - Issues found (if any)
    - Optimized code (if needed)
    """

    response = genai.GenerativeModel("gemini-pro").generate_content(prompt)
    
    return jsonify({"debugged_code": response.text})

@app.route('/generate_code', methods=['POST'])
def generate_code():
    """Generates code based on a user prompt."""
    data = request.json
    prompt_text = data.get("prompt", "")

    if not prompt_text.strip():
        return jsonify({"error": "No prompt provided"}), 400

    prompt = f"""
    You are an AI code generator.
    Based on the following description, generate a well-structured code snippet:
    
    {prompt_text}
    """

    response = genai.GenerativeModel("gemini-pro").generate_content(prompt)
    
    return jsonify({"generated_code": response.text})

@app.route('/ask_code_question', methods=['POST'])
def ask_code_question():
    """Allows users to ask questions about their code."""
    data = request.json
    code = data.get("code", "")
    question = data.get("question", "")
    language = data.get("language", "Python")  # Default to Python

    if not code.strip():
        return jsonify({"error": "No code provided"}), 400
    if not question.strip():
        return jsonify({"error": "No question provided"}), 400

    prompt = f"""
    You are an AI assistant specialized in programming. 
    The user has provided the following {language} code:

    --- Code Start ---
    {code}
    --- Code End ---

    The user has a question related to this code:
    {question}

    Provide a detailed yet concise answer to help the user understand their code better.
    """

    response = genai.GenerativeModel("gemini-pro").generate_content(prompt)
    
    return jsonify({"answer": response.text})

@app.route('/analyze_mood', methods=['POST'])
def analyze_mood():
    """Analyzes mood based on user text or speech input."""
    data = request.json
    user_id = data.get("user_id", "default_user")
    user_input = data.get("text", "").strip()

    if not user_input:
        return jsonify({"error": "No input provided"}), 400

    prompt = f"""
    Analyze the emotional state of the user based on the following text.
    Categorize their mood as Happy, Neutral, Stressed, or Depressed.
    Also, suggest a short advice based on their mood.

    --- User Input ---
    {user_input}
    ------------------

    Response format:
    Mood: [Happy/Neutral/Stressed/Depressed]
    Advice: [Short personalized advice]
    """

    response = genai.GenerativeModel("gemini-pro").generate_content(prompt)
    result = response.text.strip()

    # Store mood trend
    if user_id not in user_moods:
        user_moods[user_id] = []
    user_moods[user_id].append(result)

    return jsonify({"mood_analysis": result})


@app.route('/get_therapy', methods=['POST'])
def get_therapy():
    """Provides AI-powered therapy recommendations based on user's mood."""
    try:
        data = request.json
        user_mood = data.get("mood", "").strip()

        if not user_mood:
            return jsonify({"error": "Mood not provided"}), 400

        prompt = f"""
        Provide personalized therapy recommendations for someone who is feeling {user_mood}.
        Include simple self-care activities and mental well-being exercises.
        """

        response = genai.GenerativeModel("gemini-pro").generate_content(prompt)

        if not response.text:
            return jsonify({"error": "No therapy recommendations generated"}), 500

        return jsonify({"therapy_recommendations": response.text})

    except Exception as e:
        print(f"Error in get_therapy: {e}")  # Log the error
        return jsonify({"error": "Internal Server Error"}), 500


@app.route('/emergency_check', methods=['POST'])
def emergency_check():
    """Detects high-risk situations and suggests emergency actions."""
    data = request.json
    user_id = data.get("user_id", "default_user")
    user_input = data.get("text", "").strip()

    if not user_input:
        return jsonify({"error": "No input provided"}), 400

    prompt = f"""
    Analyze the user's text to detect if they are in emotional distress.
    If they show signs of severe stress or suicidal thoughts, recommend emergency contact steps.
    
    --- User Input ---
    {user_input}
    ------------------

    Response format:
    Risk Level: [Low/Moderate/High]
    Emergency Advice: [If high risk, suggest contacting a professional or a helpline]
    """

    response = genai.GenerativeModel("gemini-pro").generate_content(prompt)
    
    return jsonify({"risk_analysis": response.text})


if __name__ == '__main__':
    app.run(debug=True)

