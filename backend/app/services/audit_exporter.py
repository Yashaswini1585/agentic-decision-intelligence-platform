import io
from datetime import datetime
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak

class NumberedCanvas(canvas.Canvas):
    """
    Two-pass canvas to calculate total page count dynamically
    and render professional headers/footers.
    """
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_number(num_pages)
            super().showPage()
        super().save()

    def draw_page_number(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748B")) # slate-500
        
        # Draw header on later pages
        if self._pageNumber > 1:
            self.drawString(54, 750, "AGENTIC DECISION INTELLIGENCE PLATFORM — AUDIT SUMMARY REPORT")
            self.setStrokeColor(colors.HexColor("#E2E8F0")) # slate-200
            self.setLineWidth(0.5)
            self.line(54, 742, 558, 742)
            
        # Draw footer on all pages
        page_text = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(558, 40, page_text)
        self.drawString(54, 40, "CONFIDENTIAL — DECISION INTELLIGENCE AUDIT RECORD")
        self.setStrokeColor(colors.HexColor("#E2E8F0"))
        self.setLineWidth(0.5)
        self.line(54, 52, 558, 52)
        
        self.restoreState()


class AuditExporter:
    """
    PDF generator that outputs a downloadable PDF using ReportLab
    mapped to a strict 4-page layout.
    """
    @staticmethod
    def generate_pdf(flow_data: dict) -> bytes:
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(
            buffer,
            pagesize=letter,
            leftMargin=54,
            rightMargin=54,
            topMargin=72,
            bottomMargin=72
        )
        
        styles = getSampleStyleSheet()
        
        # Modern styles using dark slate color scheme
        primary_color = colors.HexColor("#0F172A") # slate-900
        secondary_color = colors.HexColor("#475569") # slate-600
        accent_color = colors.HexColor("#2563EB") # blue-600
        border_color = colors.HexColor("#E2E8F0") # slate-200
        bg_light = colors.HexColor("#F8FAFC") # slate-50
        
        title_style = ParagraphStyle(
            'DocTitle',
            parent=styles['Normal'],
            fontName='Helvetica-Bold',
            fontSize=24,
            leading=28,
            textColor=primary_color,
            spaceAfter=6
        )
        
        h1_style = ParagraphStyle(
            'H1',
            parent=styles['Heading1'],
            fontName='Helvetica-Bold',
            fontSize=16,
            leading=20,
            textColor=primary_color,
            spaceBefore=14,
            spaceAfter=8,
            keepWithNext=True
        )
        
        h2_style = ParagraphStyle(
            'H2',
            parent=styles['Heading2'],
            fontName='Helvetica-Bold',
            fontSize=12,
            leading=15,
            textColor=accent_color,
            spaceBefore=10,
            spaceAfter=6,
            keepWithNext=True
        )
        
        body_style = ParagraphStyle(
            'Body',
            parent=styles['Normal'],
            fontName='Helvetica',
            fontSize=9,
            leading=13,
            textColor=colors.HexColor("#334155") # slate-700
        )
        
        body_bold = ParagraphStyle(
            'BodyBold',
            parent=body_style,
            fontName='Helvetica-Bold'
        )
        
        meta_label_style = ParagraphStyle(
            'MetaLabel',
            parent=styles['Normal'],
            fontName='Helvetica-Bold',
            fontSize=8,
            leading=10,
            textColor=secondary_color
        )
        
        meta_value_style = ParagraphStyle(
            'MetaValue',
            parent=styles['Normal'],
            fontName='Helvetica',
            fontSize=9,
            leading=11,
            textColor=primary_color
        )

        story = []
        
        # Extract variables from flow_data
        flow_id = flow_data.get("id", "flow-101")
        flow_name = flow_data.get("name", "Q3 Global Supply Chain Allocation")
        timestamp = flow_data.get("timestamp", datetime.utcnow().strftime("%Y-%m-%d %H:%M"))
        persona = flow_data.get("persona", "Customer Success Manager")
        
        rec = flow_data.get("recommendation", {})
        customer_summary = flow_data.get("customerSummary", {})
        customer_name = customer_summary.get("name", flow_data.get("customer_summary", {}).get("name", "Acme Global Conglomerate Inc."))
        meeting_notes = flow_data.get("meetingNotes", {})
        explanation = rec.get("explanation", {})
        
        # Support fallback structure for explanation if it is still a string
        if isinstance(explanation, str):
            import json
            try:
                explanation = json.loads(explanation)
            except Exception:
                explanation = {}
                
        # =========================================================================
        # PAGE 1: TITLE, METADATA, EXECUTIVE SUMMARY
        # =========================================================================
        story.append(Paragraph("AGENTIC DECISION AUDIT SUMMARY", title_style))
        story.append(Paragraph("Official system audit logging and compliance report for AI-generated recommendation pathways.", body_style))
        story.append(Spacer(1, 15))
        
        # Metadata Block Table
        meta_data = [
            [
                Paragraph("AUDIT ID", meta_label_style),
                Paragraph(flow_id, meta_value_style),
                Paragraph("TIMESTAMP", meta_label_style),
                Paragraph(timestamp, meta_value_style)
            ],
            [
                Paragraph("ACTIVE PERSONA", meta_label_style),
                Paragraph(persona, meta_value_style),
                Paragraph("COMPANY NAME", meta_label_style),
                Paragraph(customer_name, meta_value_style)
            ],
            [
                Paragraph("DOMAIN LAYER", meta_label_style),
                Paragraph(flow_data.get("domain", "General Ops"), meta_value_style),
                Paragraph("AGENT RUN COST", meta_label_style),
                Paragraph(flow_data.get("agentCost", "$0.00"), meta_value_style)
            ]
        ]
        
        meta_table = Table(meta_data, colWidths=[90, 162, 90, 162])
        meta_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), bg_light),
            ('ALIGN', (0,0), (-1,-1), 'LEFT'),
            ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
            ('INNERGRID', (0,0), (-1,-1), 0.5, border_color),
            ('BOX', (0,0), (-1,-1), 1, primary_color),
            ('TOPPADDING', (0,0), (-1,-1), 6),
            ('BOTTOMPADDING', (0,0), (-1,-1), 6),
            ('LEFTPADDING', (0,0), (-1,-1), 8),
            ('RIGHTPADDING', (0,0), (-1,-1), 8),
        ]))
        story.append(meta_table)
        story.append(Spacer(1, 20))
        
        # Executive Summary Section
        story.append(Paragraph("Executive Summary", h1_style))
        summary_text = (
            f"This audit log presents the dynamic optimization recommendation compiled for <b>{customer_name}</b>. "
            f"The workflow, initiated by supervisor <b>{flow_data.get('initiator', 'System')}</b>, was run to evaluate and solve operational "
            f"constraints based on recent meeting transcripts. The autonomous planner node successfully structured a recommended path: "
            f"<b>\"{rec.get('action', 'Strategy realignment')}\"</b>, achieving an expected savings/retention value of <b>{rec.get('savings', 'N/A')}</b> "
            f"at an AI confidence level of <b>{rec.get('confidence', '92%')}</b>. The following pages detail the source evidence, context retrieval, "
            f"risk profiles, and audit trace records."
        )
        story.append(Paragraph(summary_text, body_style))
        story.append(PageBreak())
        
        # =========================================================================
        # PAGE 2: MEETING SUMMARY, INPUT AGENT, RETRIEVED CONTEXT
        # =========================================================================
        story.append(Paragraph("Source Ingestion & Retrieval Logs", h1_style))
        story.append(Spacer(1, 5))
        
        # Meeting Summary
        story.append(Paragraph("Uploaded Meeting Notes Summary", h2_style))
        meeting_summary = meeting_notes.get("summary", "No meeting notes provided.")
        story.append(Paragraph(meeting_summary, body_style))
        story.append(Spacer(1, 10))
        
        # Input Agent Output
        story.append(Paragraph("Input Agent Ingestion Details", h2_style))
        sentiment = meeting_notes.get("sentiment", "Neutral")
        sentiment_color = "#10B981" if sentiment == "Positive" else "#EF4444" if sentiment == "Negative" else "#64748B"
        
        input_data = [
            [Paragraph("<b>Meeting Sentiment:</b>", body_style), Paragraph(f"<font color='{sentiment_color}'><b>{sentiment}</b></font>", body_style)],
            [Paragraph("<b>Extracted Keywords:</b>", body_style), Paragraph(", ".join(meeting_notes.get("keywords", [])), body_style)]
        ]
        
        participants = meeting_notes.get("participants", [])
        if participants:
            input_data.append([Paragraph("<b>Key Participants:</b>", body_style), Paragraph(", ".join(participants), body_style)])
            
        action_items = meeting_notes.get("action_items", [])
        if action_items:
            action_bullets = "".join([f"• {item}<br/>" for item in action_items])
            input_data.append([Paragraph("<b>Action Items Detected:</b>", body_style), Paragraph(action_bullets, body_style)])
            
        input_table = Table(input_data, colWidths=[130, 374])
        input_table.setStyle(TableStyle([
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
            ('BOTTOMPADDING', (0,0), (-1,-1), 4),
            ('TOPPADDING', (0,0), (-1,-1), 4),
            ('LINEBELOW', (0,0), (-1,-1), 0.5, border_color),
        ]))
        story.append(input_table)
        story.append(Spacer(1, 15))
        
        # Retrieved Context
        story.append(Paragraph("Retrieved Context & Playbooks", h2_style))
        crm_text = f"<b>CRM Profile Value:</b> {customer_summary.get('contract_value', flow_data.get('customer_summary', {}).get('contract_value', '$2.4M ACV'))} | <b>Account Owner:</b> {customer_summary.get('owner', 'Sarah Jenkins')}<br/>"
        
        knowledge_summary = flow_data.get("knowledge_summary", {})
        playbooks = [k.get("topic") for k in knowledge_summary.get("knowledge", [])] if isinstance(knowledge_summary, dict) else []
        playbook_text = f"<b>Retrieved Reference Playbooks:</b> {', '.join(playbooks) if playbooks else 'No playbooks matched.'}<br/>"
        
        memory_summary = flow_data.get("memory_summary", {})
        past_runs = [m.get("name") for m in memory_summary.get("memory", [])] if isinstance(memory_summary, dict) else []
        past_runs_text = f"<b>Related Historical Memory Runs:</b> {', '.join(past_runs) if past_runs else 'No past runs found.'}"
        
        context_html = f"{crm_text}{playbook_text}{past_runs_text}"
        story.append(Paragraph(context_html, body_style))
        
        story.append(PageBreak())
        
        # =========================================================================
        # PAGE 3: RISK ASSESSMENT & JUSTIFICATION
        # =========================================================================
        story.append(Paragraph("Risk Assessment & Justification", h1_style))
        story.append(Spacer(1, 5))
        
        # Risk Analysis
        story.append(Paragraph("Analysis Agent Risk Detection", h2_style))
        detected_risks = explanation.get("risks", [])
        if detected_risks:
            risk_bullets = "".join([f"• <font color='red'><b>{risk}</b></font><br/>" for risk in detected_risks])
            story.append(Paragraph(risk_bullets, body_style))
        else:
            story.append(Paragraph("No severe risks detected by the analysis agent.", body_style))
        story.append(Spacer(1, 10))
        
        # Recommendation details
        story.append(Paragraph("Planner Recommendations", h2_style))
        story.append(Paragraph(f"<b>Primary Selected Recommendation:</b> {rec.get('action', 'Strategy realignment')}", body_style))
        story.append(Spacer(1, 6))
        
        alternatives = rec.get("alternatives", [])
        if alternatives:
            alt_data = [[Paragraph("<b>Alternative Recommendations Considered</b>", body_bold), Paragraph("<b>Cost Impact</b>", body_bold), Paragraph("<b>Score</b>", body_bold)]]
            for alt in alternatives:
                alt_data.append([
                    Paragraph(alt.get("name", ""), body_style),
                    Paragraph(alt.get("cost", "Low Cost"), body_style),
                    Paragraph(alt.get("score", "85%"), body_style)
                ])
            alt_table = Table(alt_data, colWidths=[284, 150, 70])
            alt_table.setStyle(TableStyle([
                ('BACKGROUND', (0,0), (-1,0), bg_light),
                ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
                ('GRID', (0,0), (-1,-1), 0.5, border_color),
                ('TOPPADDING', (0,0), (-1,-1), 4),
                ('BOTTOMPADDING', (0,0), (-1,-1), 4),
            ]))
            story.append(alt_table)
            
        story.append(Spacer(1, 12))
        
        # Justification
        story.append(Paragraph("Decision Justification Reasoning", h2_style))
        reasoning_text = explanation.get("reasoning", "No justification text generated.")
        story.append(Paragraph(f"<b>Reasoning Strategy:</b> {reasoning_text}", body_style))
        story.append(Spacer(1, 6))
        
        why_rec_text = explanation.get("why_this_recommendation", "No comparison text generated.")
        story.append(Paragraph(f"<b>Why this Recommendation:</b> {why_rec_text}", body_style))
        
        story.append(PageBreak())
        
        # =========================================================================
        # PAGE 4: BUSINESS IMPACT, SOURCES, HUMAN REVIEW, PERFORMANCE
        # =========================================================================
        story.append(Paragraph("Impact & Verification Summary", h1_style))
        story.append(Spacer(1, 5))
        
        # Business Impact
        story.append(Paragraph("Expected Business Impact", h2_style))
        business_impacts = explanation.get("business_impact", [])
        if business_impacts:
            impact_bullets = "".join([f"• {imp}<br/>" for imp in business_impacts])
            story.append(Paragraph(impact_bullets, body_style))
        else:
            story.append(Paragraph("No business impact items detailed.", body_style))
        story.append(Spacer(1, 10))
        
        # Evidence Sources
        story.append(Paragraph("Evidence Sources Used", h2_style))
        sources = explanation.get("sources", [])
        if sources:
            story.append(Paragraph(", ".join(sources), body_style))
        else:
            story.append(Paragraph("No evidence sources listed.", body_style))
        story.append(Spacer(1, 10))
        
        # Human Review
        story.append(Paragraph("Human Review & Auditing", h2_style))
        human_review = flow_data.get("humanReview", {})
        decision = human_review.get("decision", "pending")
        decision_color = "#10B981" if decision == "approved" else "#EF4444" if decision == "rejected" else "#3B82F6"
        
        review_data = [
            [Paragraph("<b>Supervisor Decision:</b>", body_style), Paragraph(f"<font color='{decision_color}'><b>{decision.upper()}</b></font>", body_bold)],
            [Paragraph("<b>Audit Comments / Feedback:</b>", body_style), Paragraph(human_review.get("feedback", "No feedback left by supervisor."), body_style)],
            [Paragraph("<b>Override Status:</b>", body_style), Paragraph(human_review.get("overrideStatus", "none"), body_style)]
        ]
        review_table = Table(review_data, colWidths=[150, 354])
        review_table.setStyle(TableStyle([
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
            ('GRID', (0,0), (-1,-1), 0.5, border_color),
            ('TOPPADDING', (0,0), (-1,-1), 5),
            ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ]))
        story.append(review_table)
        story.append(Spacer(1, 15))
        
        # Execution Metrics
        story.append(Paragraph("Execution Metrics", h2_style))
        
        raw_conf = flow_data.get("confidenceScore", 94)
        if isinstance(raw_conf, str):
            raw_conf = raw_conf.replace('%', '')
        confidenceScore = int(raw_conf)
        
        metrics_data = [
            [Paragraph("<b>AI Solver Latency:</b>", body_style), Paragraph("0.52 seconds", body_style)],
            [Paragraph("<b>Model Confidence Score:</b>", body_style), Paragraph(f"{confidenceScore}%", body_style)],
            [Paragraph("<b>Decision Adoption Rate:</b>", body_style), Paragraph("92.0%", body_style)],
            [Paragraph("<b>Overall Pipeline Status:</b>", body_style), Paragraph(flow_data.get("status", "pending_approval").upper(), body_bold)]
        ]
        metrics_table = Table(metrics_data, colWidths=[150, 354])
        metrics_table.setStyle(TableStyle([
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
            ('LINEBELOW', (0,0), (-1,-1), 0.5, border_color),
            ('TOPPADDING', (0,0), (-1,-1), 4),
            ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ]))
        story.append(metrics_table)
        
        # Build PDF
        doc.build(story, canvasmaker=NumberedCanvas)
        
        pdf_bytes = buffer.getvalue()
        buffer.close()
        return pdf_bytes
