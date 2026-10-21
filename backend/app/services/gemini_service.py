import google.generativeai as genai

from app.core.config import GEMINI_API_KEY

genai.configure(api_key=GEMINI_API_KEY)

model = genai.GenerativeModel("gemini-2.5-flash")


def generate_itinerary(
    destination: str,
    budget: int,
    travelers: int,
    start_date: str,
    end_date: str
):

    prompt = f"""
    Create a detailed travel itinerary.

    Destination: {destination}
    Budget: ₹{budget}
    Travelers: {travelers}
    Start Date: {start_date}
    End Date: {end_date}

    Include:
    - Day wise plan
    - Tourist attractions
    - Food recommendations
    - Travel tips
    - Estimated expenses
    """

    response = model.generate_content(prompt)

    return response.text