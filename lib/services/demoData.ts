export const DEMO_DOCUMENT_ID = "demo-freelance-agreement-v1";
export const DEMO_COMPARISON_DOC_ID = "demo-freelance-agreement-v2";

export const DEMO_CONTRACT_TEXT_V1 = `FREELANCE SERVICES AGREEMENT

This Freelance Services Agreement ("Agreement") is entered into as of October 1, 2026 ("Effective Date"), by and between Horizon Innovations LLC ("Client"), having its principal place of business at 750 Market Street, San Francisco, CA, and Apex Digital Solutions ("Contractor"), having its principal place of business at 1200 Broadway, New York, NY.

SECTION 1. SERVICES AND DELIVERABLES
Contractor agrees to perform digital software design, engineering, and consulting services as described in Statement of Work #1 ("Deliverables"). Contractor shall perform services in a professional and workmanlike manner in accordance with industry standards.

SECTION 2. COMPENSATION AND PAYMENT TERMS
Client shall pay Contractor a monthly retainer fee of $12,500. Payments are due within fifteen (15) calendar days from receipt of Contractor's monthly invoice. Past due balances shall accrue interest at a rate of 1.5% per month (18% per annum) or the maximum legal rate, whichever is less. All payments shall be made in US Dollars via wire transfer or ACH.

SECTION 3. TERM AND TERMINATION
This Agreement shall commence on the Effective Date and remain in effect for an initial term of twelve (12) months. Either party may terminate this Agreement for convenience at any time by providing thirty (30) days' prior written notice to the other party. Either party may terminate immediately upon written notice if the other party materially breaches any provision of this Agreement and fails to cure such breach within ten (10) days of receiving written notification.

SECTION 4. CONFIDENTIALITY
"Confidential Information" includes all non-public technical, business, financial, and product data disclosed by either party. Both parties agree to hold Confidential Information in strict confidence and protect it with reasonable care. Confidentiality obligations shall survive termination of this Agreement for a period of three (3) years.

SECTION 5. INTELLECTUAL PROPERTY RIGHTS
Upon full and final payment of all applicable fees, Contractor assigns to Client all right, title, and interest in and to custom Deliverables created specifically for Client under this Agreement. Contractor retains sole ownership of pre-existing tools, libraries, code frameworks, and foundational software methods ("Contractor IP").

SECTION 6. LIMITATION OF LIABILITY
EXCEPT FOR BREACHES OF CONFIDENTIALITY OR INDEMNIFICATION OBLIGATIONS, NEITHER PARTY SHALL BE LIABLE FOR ANY INDIRECT, INCIDENTAL, CONSEQUENTIAL, OR SPECIAL DAMAGES. CONTRACTOR'S TOTAL AGGREGATE LIABILITY ARISING UNDER THIS AGREEMENT SHALL BE LIMITED TO THE TOTAL FEES PAID BY CLIENT TO CONTRACTOR IN THE PRECEDING SIX (6) MONTHS.

SECTION 7. GOVERNING LAW AND DISPUTE RESOLUTION
This Agreement shall be governed by and construed in accordance with the laws of the State of California, without regard to its conflict of law principles. Any dispute arising out of this Agreement shall be resolved through binding arbitration administered by JAMS in San Francisco, California.

SECTION 8. NOTICES AND AMENDMENTS
All notices required under this Agreement shall be sent via certified mail or trackable overnight courier. This Agreement may only be amended by a written instrument signed by authorized representatives of both parties.`;

export const DEMO_CONTRACT_TEXT_V2 = `FREELANCE SERVICES AGREEMENT (REVISED VERSION)

This Freelance Services Agreement ("Agreement") is entered into as of October 1, 2026 ("Effective Date"), by and between Horizon Innovations LLC ("Client"), having its principal place of business at 750 Market Street, San Francisco, CA, and Apex Digital Solutions ("Contractor"), having its principal place of business at 1200 Broadway, New York, NY.

SECTION 1. SERVICES AND DELIVERABLES
Contractor agrees to perform digital software design, engineering, and consulting services as described in Statement of Work #1 ("Deliverables"). Contractor shall perform services in a professional and workmanlike manner in accordance with industry standards.

SECTION 2. COMPENSATION AND PAYMENT TERMS
Client shall pay Contractor a monthly retainer fee of $15,000. Payments are due within fifteen (15) calendar days from receipt of Contractor's monthly invoice. Past due balances shall accrue interest at an increased rate of 2.5% per month (30% per annum). All payments shall be made in US Dollars via wire transfer.

SECTION 3. TERM AND TERMINATION
This Agreement shall commence on the Effective Date and remain in effect for an initial term of twelve (12) months. Either party may terminate this Agreement for convenience by providing sixty (60) days' prior written notice to the other party. Either party may terminate immediately upon written notice if the other party materially breaches any provision and fails to cure within five (5) days.

SECTION 4. CONFIDENTIALITY
"Confidential Information" includes all non-public technical, business, financial, and product data disclosed by either party. Both parties agree to hold Confidential Information in strict confidence and protect it with reasonable care. Confidentiality obligations shall survive termination of this Agreement for five (5) years.

SECTION 5. INTELLECTUAL PROPERTY RIGHTS
Upon full and final payment of all applicable fees, Contractor assigns to Client all right, title, and interest in and to custom Deliverables created specifically for Client under this Agreement. Contractor retains sole ownership of pre-existing tools, libraries, and frameworks.

SECTION 6. LIMITATION OF LIABILITY
EXCEPT FOR BREACHES OF CONFIDENTIALITY OR INDEMNIFICATION OBLIGATIONS, NEITHER PARTY SHALL BE LIABLE FOR ANY INDIRECT, INCIDENTAL, CONSEQUENTIAL, OR SPECIAL DAMAGES. CONTRACTOR'S TOTAL AGGREGATE LIABILITY ARISING UNDER THIS AGREEMENT SHALL BE LIMITED TO THE TOTAL FEES PAID BY CLIENT TO CONTRACTOR IN THE PRECEDING THREE (3) MONTHS.

SECTION 7. GOVERNING LAW AND DISPUTE RESOLUTION
This Agreement shall be governed by and construed in accordance with the laws of the State of California, without regard to conflict of law principles. Any dispute shall be resolved through binding arbitration in San Francisco, California.

SECTION 8. NOTICES AND AMENDMENTS
All notices required under this Agreement shall be sent via certified mail or trackable overnight courier.`;

export const DEMO_ANALYSIS_DATA = {
  document: {
    id: DEMO_DOCUMENT_ID,
    title: "Freelance Services Agreement v1 (Demo)",
    fileName: "Freelance_Services_Agreement_v1.pdf",
    fileType: "pdf",
    fileSize: 45800,
    pageCount: 3,
    status: "completed",
    isDemo: true,
    rawText: DEMO_CONTRACT_TEXT_V1,
    createdAt: new Date().toISOString()
  },
  overview: {
    documentType: "Freelance Services Agreement",
    overview: "This agreement establishes a 12-month digital software design & engineering consulting partnership between Horizon Innovations LLC (Client) and Apex Digital Solutions (Contractor) at a monthly retainer rate of $12,500.",
    parties: ["Horizon Innovations LLC (Client)", "Apex Digital Solutions (Contractor)"],
    mainPurpose: "Provide digital software engineering, product design, and technology consulting services.",
    summary: "Key terms include a $12,500 monthly fee payable net 15 days, 30 days notice for termination for convenience, 10-day cure period for material breach, 3-year post-termination confidentiality, and a liability cap limited to 6 months of paid fees under California governing law.",
    duration: "12 Months (Starting October 1, 2026)",
    governingLaw: "State of California (Binding JAMS Arbitration in San Francisco)"
  },
  clauses: [
    {
      id: "demo-c-1",
      type: "Payment",
      title: "Monthly Retainer & Payment Terms",
      summary: "Client agrees to pay Contractor $12,500 monthly within 15 calendar days of invoice receipt, with a 1.5% monthly late fee.",
      originalText: "Client shall pay Contractor a monthly retainer fee of $12,500. Payments are due within fifteen (15) calendar days from receipt of Contractor's monthly invoice. Past due balances shall accrue interest at a rate of 1.5% per month.",
      requires: "Remit payment of $12,500 within 15 days of receiving monthly invoice.",
      toCheck: "Are late fees and 15-day payment windows compatible with your internal accounts payable cycle?",
      pageNumber: 1,
      section: "SECTION 2. COMPENSATION AND PAYMENT TERMS",
      confidence: 0.98
    },
    {
      id: "demo-c-2",
      type: "Termination",
      title: "Termination for Convenience & Cure Period",
      summary: "Allows either party to exit with 30 days written notice, or immediately if a material breach is uncured after 10 days.",
      originalText: "Either party may terminate this Agreement for convenience at any time by providing thirty (30) days' prior written notice to the other party. Either party may terminate immediately upon written notice if the other party materially breaches any provision of this Agreement and fails to cure such breach within ten (10) days of receiving written notification.",
      requires: "Provide 30 days written notice prior to terminating for convenience.",
      toCheck: "Does 30 days provide enough cushion to transition ongoing software engineering deliverables?",
      pageNumber: 2,
      section: "SECTION 3. TERM AND TERMINATION",
      confidence: 0.96
    },
    {
      id: "demo-c-3",
      type: "Confidentiality",
      title: "Proprietary Information Protection",
      summary: "Requires strict non-disclosure of non-public technical, financial, and business data for 3 years after termination.",
      originalText: "Both parties agree to hold Confidential Information in strict confidence and protect it with reasonable care. Confidentiality obligations shall survive termination of this Agreement for a period of three (3) years.",
      requires: "Protect confidential technical data from third-party disclosure for 3 years post-termination.",
      toCheck: "Are all trade secret exceptions clearly defined?",
      pageNumber: 2,
      section: "SECTION 4. CONFIDENTIALITY",
      confidence: 0.94
    },
    {
      id: "demo-c-4",
      type: "Intellectual Property",
      title: "Work Product Assignment & Pre-Existing IP",
      summary: "Deliverables created specifically for Client belong to Client upon full payment; Contractor retains pre-existing tools.",
      originalText: "Upon full and final payment of all applicable fees, Contractor assigns to Client all right, title, and interest in and to custom Deliverables created specifically for Client under this Agreement. Contractor retains sole ownership of pre-existing tools, libraries, code frameworks, and foundational software methods.",
      requires: "Full payment of invoices is required before title to Deliverables transfers to Client.",
      toCheck: "Are pre-existing tools clearly segregated from custom deliverable code?",
      pageNumber: 2,
      section: "SECTION 5. INTELLECTUAL PROPERTY RIGHTS",
      confidence: 0.95
    },
    {
      id: "demo-c-5",
      type: "Liability",
      title: "Limitation of Financial Exposure",
      summary: "Total liability capped at fees paid in preceding 6 months. Indirect and consequential damages excluded.",
      originalText: "EXCEPT FOR BREACHES OF CONFIDENTIALITY OR INDEMNIFICATION OBLIGATIONS, NEITHER PARTY SHALL BE LIABLE FOR ANY INDIRECT, INCIDENTAL, CONSEQUENTIAL, OR SPECIAL DAMAGES. CONTRACTOR'S TOTAL AGGREGATE LIABILITY ARISING UNDER THIS AGREEMENT SHALL BE LIMITED TO THE TOTAL FEES PAID BY CLIENT TO CONTRACTOR IN THE PRECEDING SIX (6) MONTHS.",
      requires: "Liability claims cannot exceed total retainer fees paid during the prior 6-month period.",
      toCheck: "Is a 6-month liability cap customary and acceptable for your risk profile?",
      pageNumber: 3,
      section: "SECTION 6. LIMITATION OF LIABILITY",
      confidence: 0.97
    },
    {
      id: "demo-c-6",
      type: "Governing Law",
      title: "Jurisdiction & Binding Arbitration",
      summary: "California law applies; all disputes resolved via binding JAMS arbitration in San Francisco.",
      originalText: "This Agreement shall be governed by and construed in accordance with the laws of the State of California... Any dispute arising out of this Agreement shall be resolved through binding arbitration administered by JAMS in San Francisco, California.",
      requires: "Submit legal disputes to JAMS arbitration in San Francisco, CA.",
      toCheck: "Is California arbitration convenient for both parties?",
      pageNumber: 3,
      section: "SECTION 7. GOVERNING LAW AND DISPUTE RESOLUTION",
      confidence: 0.99
    }
  ],
  obligations: [
    {
      id: "demo-ob-1",
      party: "Client (Horizon Innovations)",
      action: "Pay monthly retainer invoice of $12,500 within 15 calendar days.",
      deadline: "Net 15 days",
      frequency: "Monthly",
      conditions: "Upon receipt of invoice",
      pageNumber: 1,
      section: "SECTION 2"
    },
    {
      id: "demo-ob-2",
      party: "Contractor (Apex Digital)",
      action: "Perform software design & engineering deliverables in a professional and workmanlike manner.",
      deadline: "Project milestones",
      frequency: "Ongoing",
      pageNumber: 1,
      section: "SECTION 1"
    },
    {
      id: "demo-ob-3",
      party: "Both Parties",
      action: "Provide 30 days prior written notice before terminating for convenience.",
      deadline: "30 days prior",
      frequency: "As needed",
      pageNumber: 2,
      section: "SECTION 3"
    },
    {
      id: "demo-ob-4",
      party: "Both Parties",
      action: "Maintain strict confidentiality of proprietary business data for 3 years post-termination.",
      deadline: "3 years post-contract",
      frequency: "Continuous",
      pageNumber: 2,
      section: "SECTION 4"
    }
  ],
  dates: [
    {
      id: "demo-d-1",
      title: "Effective Agreement Date",
      dateValue: "October 1, 2026",
      category: "effective",
      sourceExcerpt: "entered into as of October 1, 2026 (\"Effective Date\")",
      pageNumber: 1,
      section: "Preamble"
    },
    {
      id: "demo-d-2",
      title: "Initial Term Expiration",
      dateValue: "September 30, 2027 (12 Months)",
      category: "expiration",
      sourceExcerpt: "remain in effect for an initial term of twelve (12) months",
      pageNumber: 2,
      section: "SECTION 3"
    },
    {
      id: "demo-d-3",
      title: "Termination Notice Deadline",
      dateValue: "30 Days Prior Written Notice",
      category: "notice",
      sourceExcerpt: "providing thirty (30) days' prior written notice to the other party",
      pageNumber: 2,
      section: "SECTION 3"
    },
    {
      id: "demo-d-4",
      title: "Material Breach Cure Period",
      dateValue: "10 Days Following Notice",
      category: "cure",
      sourceExcerpt: "fails to cure such breach within ten (10) days of receiving written notification",
      pageNumber: 2,
      section: "SECTION 3"
    }
  ],
  payments: [
    {
      id: "demo-p-1",
      title: "Monthly Retainer Fee",
      amount: "$12,500",
      currency: "USD",
      frequency: "Monthly",
      dueDate: "Within 15 days of invoice date",
      lateFee: "1.5% per month (18% per annum)",
      deposits: "None specified",
      refunds: "None specified",
      taxes: "Exclusive of applicable taxes",
      sourceExcerpt: "Client shall pay Contractor a monthly retainer fee of $12,500. Payments are due within fifteen (15) calendar days... Past due balances shall accrue interest at a rate of 1.5% per month.",
      pageNumber: 1,
      section: "SECTION 2"
    }
  ],
  areasToReview: [
    {
      id: "demo-r-1",
      category: "Potentially Significant",
      finding: "Work product title transfer is conditional on full fee payment.",
      whyItMatters: "If an invoice is disputed or unpaid, Client does not hold legal copyright assignment to Deliverables.",
      questionToConsider: "What happens to partially completed work if an invoice is disputed?",
      sourceExcerpt: "Upon full and final payment of all applicable fees, Contractor assigns to Client all right, title, and interest...",
      pageNumber: 2,
      section: "SECTION 5"
    },
    {
      id: "demo-r-2",
      category: "Needs Careful Review",
      finding: "Short 15-day payment window with 1.5% monthly compound interest.",
      whyItMatters: "15 calendar days is shorter than standard corporate Net-30 terms, increasing risk of late penalties.",
      questionToConsider: "Can the payment window be extended to Net-30 to align with corporate accounts payable processing?",
      sourceExcerpt: "Payments are due within fifteen (15) calendar days... Past due balances shall accrue interest at a rate of 1.5% per month.",
      pageNumber: 1,
      section: "SECTION 2"
    },
    {
      id: "demo-r-3",
      category: "Unclear",
      finding: "Scope of pre-existing 'Contractor IP' is not explicitly listed in an exhibit.",
      whyItMatters: "Ambiguity over what software frameworks belong to Contractor versus custom Client code.",
      questionToConsider: "Should an Exhibit A be attached explicitly listing pre-existing Contractor IP?",
      sourceExcerpt: "Contractor retains sole ownership of pre-existing tools, libraries, code frameworks...",
      pageNumber: 2,
      section: "SECTION 5"
    }
  ],
  checklist: [
    {
      id: "demo-ck-1",
      action: "Verify monthly retainer invoice of $12,500 upon receipt.",
      deadline: "Day 1 of each month",
      responsibleParty: "Client Accounts Payable",
      pageNumber: 1,
      section: "SECTION 2",
      completed: true
    },
    {
      id: "demo-ck-2",
      action: "Remit invoice payment within 15 calendar days to avoid 1.5% late interest.",
      deadline: "Net 15 days",
      responsibleParty: "Client",
      pageNumber: 1,
      section: "SECTION 2",
      completed: false
    },
    {
      id: "demo-ck-3",
      action: "Review and approve Statement of Work #1 deliverables milestones.",
      deadline: "End of month",
      responsibleParty: "Project Manager",
      pageNumber: 1,
      section: "SECTION 1",
      completed: false
    },
    {
      id: "demo-ck-4",
      action: "Ensure 30-day notice is calendar-flagged before initiating optional termination.",
      deadline: "30 days prior to exit",
      responsibleParty: "Legal / Ops",
      pageNumber: 2,
      section: "SECTION 3",
      completed: false
    }
  ],
  lawyerPrep: {
    keyFacts: [
      "Contract Title: Freelance Services Agreement (Horizon Innovations LLC & Apex Digital Solutions).",
      "Financial Commitment: $12,500/month ($150,000 total annual initial term).",
      "Term: 12 months starting October 1, 2026.",
      "Dispute Venue: Binding JAMS Arbitration in San Francisco, CA under California Law."
    ],
    provisions: [
      {
        title: "Section 2: Payment & Late Fees",
        excerpt: "Payments due net 15 days; 1.5% interest per month on past due balances.",
        pageNumber: 1,
        section: "SECTION 2"
      },
      {
        title: "Section 3: Termination Notice",
        excerpt: "30 days prior written notice for convenience; 10 days cure period for breach.",
        pageNumber: 2,
        section: "SECTION 3"
      },
      {
        title: "Section 5: Intellectual Property Transfer",
        excerpt: "Title transfers only upon full and final payment of all invoices.",
        pageNumber: 2,
        section: "SECTION 5"
      },
      {
        title: "Section 6: Limitation of Liability Cap",
        excerpt: "Capped to total fees paid in preceding 6 months.",
        pageNumber: 3,
        section: "SECTION 6"
      }
    ],
    questionsToAsk: [
      "Is the net-15 payment term enforceable with a 1.5% monthly late fee under California law?",
      "Does the IP assignment clause adequately safeguard our code ownership if an invoice is temporarily disputed?",
      "Would you recommend requesting mutual indemnification for third-party IP infringement claims?",
      "Is binding JAMS arbitration in San Francisco preferable over court litigation for this contract size?"
    ],
    infoToBring: [
      "Full executed copy of the Freelance Services Agreement (v1)",
      "Statement of Work #1 detailing deliverables & milestone schedule",
      "Email correspondence regarding retainer rate negotiations",
      "List of pre-existing software tools provided by Contractor"
    ]
  }
};
