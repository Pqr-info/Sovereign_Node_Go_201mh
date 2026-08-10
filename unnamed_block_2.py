from google import genai
import json
import time
import threading

client = genai.Client()

def run_interaction(prompt):
    interaction = client.interactions.create(
        model="gemini-3.5-flash",
        input=prompt
    )
    return interaction.output_text