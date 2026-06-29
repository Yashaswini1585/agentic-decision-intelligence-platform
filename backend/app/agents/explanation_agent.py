from app.services.explanation_service import ExplanationService


class ExplanationAgent:
    """
    Explanation Agent

    Generates explanations for
    recommendations.
    """

    def __init__(self):
        self.service = ExplanationService()

    def generate(
        self,
        meeting_summary,
        extracted_entities,
        identified_risks,
        recommendation,
        confidence,
        retrieved_documents
    ):

        explanation = self.service.generate(
            meeting_summary=meeting_summary,
            extracted_entities=extracted_entities,
            identified_risks=identified_risks,
            recommendation=recommendation,
            confidence=confidence,
            retrieved_documents=retrieved_documents
        )

        return {
            "status": "success",
            "explanation": explanation
        }