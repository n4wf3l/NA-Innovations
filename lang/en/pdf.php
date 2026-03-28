<?php

return [
    // Document titles
    'quote' => 'QUOTE',
    'invoice' => 'INVOICE',

    // Header
    'quote_number' => 'Quote #:',
    'invoice_number' => 'Invoice #:',
    'issue_date' => 'Issue Date:',
    'valid_until' => 'Valid Until:',
    'due_date' => 'Due Date:',

    // Client
    'billed_to' => 'Billed To',
    'vat' => 'VAT',

    // Table
    'description' => 'Description',
    'qty' => 'Qty',
    'unit' => 'Unit',
    'unit_price' => 'Unit Price',
    'total' => 'Total',
    'optional' => '(optional)',

    // Totals
    'subtotal' => 'Subtotal',
    'discount' => 'Discount',
    'tax' => 'Tax',
    'deposit' => 'Deposit',
    'amount_paid' => 'Amount Paid',
    'amount_due' => 'Amount Due',

    // Sections
    'scope_of_work' => 'Scope of Work',
    'exclusions' => 'Exclusions',
    'terms_and_conditions' => 'Terms and Conditions',
    'payment_instructions' => 'Payment Instructions',
    'bank_details' => 'Bank Details',
    'bank' => 'Bank',
    'reference' => 'Reference',
    'notes' => 'Notes',

    // Signature
    'authorized_signature' => 'Authorized Signature',
    'date' => 'Date',

    // Validity
    'valid_until_text' => 'This quote is valid until',

    // Email defaults
    'quote_email_subject' => 'Your quote #:number from NA Innovations',
    'quote_email_body' => "Dear :name,\n\nPlease find attached our quote :number for a total of :total.\n\nThis quote is valid until :valid_until.\n\nPlease don't hesitate to contact us if you have any questions.\n\nBest regards,\nNA Innovations",
    'invoice_email_subject' => 'Invoice #:number from NA Innovations',
    'invoice_email_body' => "Dear :name,\n\nPlease find attached invoice :number for a total of :total.\n\nPayment is due by :due_date.\n\nPlease don't hesitate to contact us if you have any questions.\n\nBest regards,\nNA Innovations",
];
