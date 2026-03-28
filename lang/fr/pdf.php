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

    // Email defaults
    'quote_email_subject' => 'Votre devis n° :number de NA Innovations',
    'quote_email_body' => "Cher(e) :name,\n\nVeuillez trouver ci-joint notre devis :number pour un montant total de :total.\n\nCe devis est valable jusqu'au :valid_until.\n\nN'hésitez pas à nous contacter pour toute question.\n\nCordialement,\nNA Innovations",
    'invoice_email_subject' => 'Facture n° :number de NA Innovations',
    'invoice_email_body' => "Cher(e) :name,\n\nVeuillez trouver ci-joint la facture :number pour un montant total de :total.\n\nLe paiement est attendu avant le :due_date.\n\nN'hésitez pas à nous contacter pour toute question.\n\nCordialement,\nNA Innovations",
];
