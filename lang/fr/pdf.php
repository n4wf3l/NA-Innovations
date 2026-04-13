<?php

return [
    // Document titles
    'quote' => 'DEVIS',
    'invoice' => 'FACTURE',

    // Header
    'quote_number' => 'Devis n° :',
    'invoice_number' => 'Facture n° :',
    'issue_date' => "Date d'émission :",
    'valid_until' => "Valide jusqu'au :",
    'due_date' => "Date d'échéance :",

    // Client
    'billed_to' => 'Facturer à',
    'vat' => 'TVA',

    // Table
    'description' => 'Description',
    'qty' => 'Qté',
    'unit' => 'Unité',
    'unit_price' => 'Prix unitaire',
    'total' => 'Total',
    'optional' => '(optionnel)',

    // Totals
    'subtotal' => 'Sous-total',
    'discount' => 'Remise',
    'tax' => 'TVA',
    'deposit' => 'Acompte',
    'amount_paid' => 'Montant payé',
    'amount_due' => 'Montant dû',

    // Sections
    'scope_of_work' => 'Périmètre',
    'exclusions' => 'Exclusions',
    'terms_and_conditions' => 'Conditions générales',
    'payment_instructions' => 'Instructions de paiement',
    'bank_details' => 'Coordonnées bancaires',
    'bank' => 'Banque',
    'reference' => 'Référence',
    'notes' => 'Notes',

    // Signature
    'authorized_signature' => 'Signature autorisée',
    'date' => 'Date',

    // Validity
    'valid_until_text' => "Ce devis est valable jusqu'au",

    // Purchase Order
    'purchase_order' => 'BON DE COMMANDE',
    'po_number' => 'N° BC :',
    'quote_reference' => 'Référence devis',
    'ordered_by' => 'Commandé par',

    // Credit Note
    'credit_note' => 'AVOIR',
    'credit_note_for_invoice' => 'Avoir pour la facture',

    // Timesheet
    'timesheet' => 'Feuille de temps',
    'to' => 'au',
    'total_hours' => 'Heures totales',
    'billable_hours' => 'Heures facturables',
    'total_amount' => 'Montant total',
    'date_col' => 'Date',
    'category' => 'Catégorie',
    'billable' => 'Facturable',
    'hours' => 'Heures',
    'grand_total' => 'Total général',
    'generated_on' => 'Généré le',

    // Earning Statement
    'earning_statement' => 'Relevé de revenus',
    'developer' => 'Développeur',
    'email' => 'Email',
    'period' => 'Période',
    'hourly_rate' => 'Tarif horaire',
    'status' => 'Statut',
    'amount' => 'Montant',
    'approved_billable' => 'Approuvées (facturables)',
    'pending_approval' => "En attente d'approbation",
    'non_billable' => 'Non facturables',
    'total_earned_month' => 'Total gagné ce mois',
    'confidential_document' => 'Document confidentiel',

    // Monthly Report
    'monthly_financial_report' => 'Rapport financier mensuel',
    'total_invoiced' => 'Total facturé',
    'total_paid' => 'Total payé',
    'outstanding' => 'En cours',
    'new_leads' => 'Nouveaux leads',
    'lead_funnel' => 'Entonnoir de leads',
    'metric' => 'Indicateur',
    'count' => 'Nombre',
    'won_leads' => 'Leads gagnés',
    'lost_leads' => 'Leads perdus',
    'conversion_rate' => 'Taux de conversion',
    'revenue_by_service' => 'Revenus par service',
    'service_type' => 'Type de service',
    'simple_pl' => 'Compte de résultat simplifié',
    'revenue' => 'Revenus',
    'commissions' => 'Commissions',
    'net_result' => 'Résultat net',

    // Partner Commissions
    'commission_statement' => 'Relevé de commissions',
    'partner' => 'Partenaire',
    'referral_code' => 'Code de parrainage',
    'commission_rate_default' => 'Taux de commission par défaut',
    'estimated' => 'Estimé',
    'confirmed' => 'Confirmé',
    'scheduled' => 'Programmé',
    'paid_commissions' => 'Payé',
    'base_amount' => 'Base HT',
    'rate' => 'Taux',
    'commission' => 'Commission',

    // Annual Summary
    'annual_billing_summary' => 'Récapitulatif annuel de facturation',
    'client' => 'Client',
    'company' => 'Entreprise',
    'year' => 'Année',
    'type' => 'Type',
    'paid' => 'Payé',

    // Email defaults
    'quote_email_subject' => 'Votre devis n° :number de NA Innovations',
    'quote_email_body' => "Cher(e) :name,\n\nVeuillez trouver ci-joint notre devis :number pour un montant total de :total.\n\nCe devis est valable jusqu'au :valid_until.\n\nN'hésitez pas à nous contacter pour toute question.\n\nCordialement,\nNA Innovations",
    'invoice_email_subject' => 'Facture n° :number de NA Innovations',
    'invoice_email_body' => "Cher(e) :name,\n\nVeuillez trouver ci-joint la facture :number pour un montant total de :total.\n\nLe paiement est attendu avant le :due_date.\n\nN'hésitez pas à nous contacter pour toute question.\n\nCordialement,\nNA Innovations",
];
