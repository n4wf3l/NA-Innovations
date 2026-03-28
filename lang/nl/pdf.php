<?php

return [
    // Document titles
    'quote' => 'OFFERTE',
    'invoice' => 'FACTUUR',

    // Header
    'quote_number' => 'Offerte nr:',
    'invoice_number' => 'Factuur nr:',
    'issue_date' => 'Uitgiftedatum:',
    'valid_until' => 'Geldig tot:',
    'due_date' => 'Vervaldatum:',

    // Client
    'billed_to' => 'Factureren aan',
    'vat' => 'BTW',

    // Table
    'description' => 'Omschrijving',
    'qty' => 'Aantal',
    'unit' => 'Eenheid',
    'unit_price' => 'Eenheidsprijs',
    'total' => 'Totaal',
    'optional' => '(optioneel)',

    // Totals
    'subtotal' => 'Subtotaal',
    'discount' => 'Korting',
    'tax' => 'BTW',
    'deposit' => 'Voorschot',
    'amount_paid' => 'Betaald bedrag',
    'amount_due' => 'Openstaand bedrag',

    // Sections
    'scope_of_work' => 'Werkomvang',
    'exclusions' => 'Uitsluitingen',
    'terms_and_conditions' => 'Algemene voorwaarden',
    'payment_instructions' => 'Betalingsinstructies',
    'bank_details' => 'Bankgegevens',
    'bank' => 'Bank',
    'reference' => 'Referentie',
    'notes' => 'Opmerkingen',

    // Signature
    'authorized_signature' => 'Bevoegde handtekening',
    'date' => 'Datum',

    // Validity
    'valid_until_text' => 'Deze offerte is geldig tot',

    // Email defaults
    'quote_email_subject' => 'Uw offerte nr :number van NA Innovations',
    'quote_email_body' => "Beste :name,\n\nBijgevoegd vindt u onze offerte :number voor een totaalbedrag van :total.\n\nDeze offerte is geldig tot :valid_until.\n\nAarzel niet om ons te contacteren bij vragen.\n\nMet vriendelijke groeten,\nNA Innovations",
    'invoice_email_subject' => 'Factuur nr :number van NA Innovations',
    'invoice_email_body' => "Beste :name,\n\nBijgevoegd vindt u factuur :number voor een totaalbedrag van :total.\n\nBetaling wordt verwacht vóór :due_date.\n\nAarzel niet om ons te contacteren bij vragen.\n\nMet vriendelijke groeten,\nNA Innovations",
];
