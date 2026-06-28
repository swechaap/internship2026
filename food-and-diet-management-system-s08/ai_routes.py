from flask import Blueprint,request,jsonify
from .nutrition_ai import ask_ai

ai=Blueprint("ai",__name__)


@ai.route("/chat",methods=["POST"])

def chat():

    data=request.json

    question=data["question"]

    answer=ask_ai(question)

    return jsonify({

        "answer":answer

    })