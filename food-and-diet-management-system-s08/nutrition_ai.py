from .groq_client import client


def ask_ai(prompt):

    response = client.chat.completions.create(

        model="llama-3.3-70b-versatile",

        messages=[
            {
                "role":"system",
                "content":"You are an expert nutritionist."
            },
            {
                "role":"user",
                "content":prompt
            }
        ],

        temperature=0.7

    )

    return response.choices[0].message.content