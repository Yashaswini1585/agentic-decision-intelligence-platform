import os
import json
import logging
import google.generativeai as genai

logger = logging.getLogger("adip_backend_explanation_service")

class ExplanationService:
    """
    Generates structured, dynamic, context-aware explanations
    for recommendations using Gemini or a rule-based fallback.
    """

    def generate(
        self,
        meeting_summary,
        extracted_entities,
        identified_risks,
        recommendation,
        confidence,
        retrieved_documents
    ):
        api_key = os.getenv("GEMINI_API_KEY")
        
        # Fall back if API key is not set or is the default placeholder
        if not api_key or api_key == "your_actual_gemini_api_key_here":
            logger.warning("GEMINI_API_KEY is not configured or is the default placeholder. Falling back to rule-based explanation.")
            return self._fallback_generate(
                meeting_summary,
                extracted_entities,
                identified_risks,
                recommendation,
                confidence,
                retrieved_documents
            )
            
        try:
            genai.configure(api_key=api_key)
            model = genai.GenerativeModel("gemini-1.5-flash")
            
            prompt = f"""
            You are the Explanation Agent for the Agentic Decision Intelligence Platform.
            Your task is to generate a dynamic, context-aware decision justification for the selected business recommendations.

            Context:
            1. Meeting Summary: {meeting_summary}
            2. Extracted Entities: {json.dumps(extracted_entities)}
            3. Identified Risks: {json.dumps(identified_risks)}
            4. Selected Recommendations: {json.dumps(recommendation)}
            5. Confidence Level: {confidence}
            6. Retrieved Playbooks: {json.dumps(retrieved_documents)}

            Create a justification that answers:
            - What information from the meeting was important?
            - What customer pain points were identified?
            - What risks were detected?
            - Which evidence supports the recommendation?
            - Why is this recommendation better than other possible actions?
            - How does this decision reduce business risk or improve business value?

            You MUST reference actual meeting content instead of generic text.
            If any of the context fields are empty or unavailable, do NOT mention them, and do not use generic placeholder text.

            You MUST return ONLY a valid JSON object matching this schema:
            {{
                "meeting_evidence": ["bullet point 1 describing meeting details", "bullet point 2 describing meeting details", ...],
                "risks": ["risk 1", "risk 2", ...],
                "reasoning": "Detailed paragraph explaining the logic.",
                "why_this_recommendation": "Detailed paragraph explaining why the selected action is optimal compared to alternative options.",
                "business_impact": ["impact 1", "impact 2", ...],
                "confidence": "e.g. 92%",
                "sources": ["source 1", "source 2", ...]
            }}
            Do not include any markdown fences or extra text around the JSON block. Return ONLY the JSON object.
            """
            
            response = model.generate_content(
                prompt,
                generation_config={"response_mime_type": "application/json"}
            )
            
            result_text = response.text.strip()
            explanation_data = json.loads(result_text)
            
            # Sanity field checks
            explanation_data["meeting_evidence"] = explanation_data.get("meeting_evidence", [])
            explanation_data["risks"] = explanation_data.get("risks", [])
            explanation_data["reasoning"] = explanation_data.get("reasoning", "")
            explanation_data["why_this_recommendation"] = explanation_data.get("why_this_recommendation", "")
            explanation_data["business_impact"] = explanation_data.get("business_impact", [])
            explanation_data["confidence"] = explanation_data.get("confidence", confidence)
            explanation_data["sources"] = explanation_data.get("sources", ["Meeting Notes"])
            
            return explanation_data
            
        except Exception as e:
            logger.error(f"Gemini API execution failed: {e}. Falling back to rule-based explanation.")
            return self._fallback_generate(
                meeting_summary,
                extracted_entities,
                identified_risks,
                recommendation,
                confidence,
                retrieved_documents
            )

    def _fallback_generate(
        self,
        meeting_summary,
        extracted_entities,
        identified_risks,
        recommendation,
        confidence,
        retrieved_documents
    ):
        customer_name = extracted_entities.get("customer_name", "Acme Global Conglomerate Inc.")
        
        meeting_evidence = []
        if meeting_summary and meeting_summary != "Unknown":
            meeting_evidence.append(f"Meeting notes for {customer_name}: {meeting_summary}")
        else:
            meeting_evidence.append(f"Reviewed active client profile and meeting logs for {customer_name}.")
            
        participants = extracted_entities.get("participants", [])
        if participants:
            meeting_evidence.append(f"Participants involved: {', '.join(participants)}")
            
        # Extract risks
        risks_list = identified_risks.get("meeting_risks", [])
        if not risks_list:
            risk_level = identified_risks.get("risk_level", "Medium")
            risks_list = [f"General operational bottleneck risk", f"Elevated {risk_level} customer risk score"]
            
        reasoning = f"The uploaded meeting notes for {customer_name} indicate that addressing pricing, stability, or logistics constraints is the primary concern while maintaining long-term supplier relationships is a business priority. The Analysis Agent identified a {identified_risks.get('risk_level', 'Medium')} risk profile if pricing concerns remain unresolved."
        
        # Recommendations
        rec_titles = [r.get("title") for r in recommendation] if isinstance(recommendation, list) else []
        rec_names = ", ".join(rec_titles) if rec_titles else "the proposed business action"
        why_rec = f"The Recommendation Agent selected '{rec_names}' because it minimizes customer churn risk while staying within approved financial limits. Alternative actions such as delaying negotiations or escalating immediately would either increase customer dissatisfaction or create unnecessary operational delays."
        
        impact_list = [
            "Reduced supplier/customer churn risk",
            "Higher contract renewal probability",
            "Lower procurement disruption",
            "Controlled financial exposure"
        ]
        
        sources_list = ["Uploaded Meeting Notes", "Customer History"]
        if retrieved_documents:
            sources_list.append("Internal Playbooks & Policy guidelines")
            
        return {
            "meeting_evidence": meeting_evidence,
            "risks": risks_list,
            "reasoning": reasoning,
            "why_this_recommendation": why_rec,
            "business_impact": impact_list,
            "confidence": confidence,
            "sources": sources_list
        }