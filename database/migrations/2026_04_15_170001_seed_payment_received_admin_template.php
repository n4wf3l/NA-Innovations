<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $variables = json_encode(['invoice_number', 'client_name', 'amount', 'remaining', 'status']);
        $now = now();

        $rows = [
            [
                'locale' => 'fr',
                'name' => 'Paiement reçu — admin',
                'subject' => 'Paiement reçu : {{ amount }} € sur facture {{ invoice_number }}',
                'body' => '<p>Un paiement de <strong>{{ amount }} €</strong> vient d\'être enregistré sur la facture <strong>{{ invoice_number }}</strong> ({{ client_name }}).</p><p>Reste dû : <strong>{{ remaining }} €</strong> — statut : {{ status }}.</p>',
            ],
            [
                'locale' => 'en',
                'name' => 'Payment received — admin',
                'subject' => 'Payment received: {{ amount }} € on invoice {{ invoice_number }}',
                'body' => '<p>A payment of <strong>{{ amount }} €</strong> has been recorded on invoice <strong>{{ invoice_number }}</strong> ({{ client_name }}).</p><p>Remaining due: <strong>{{ remaining }} €</strong> — status: {{ status }}.</p>',
            ],
            [
                'locale' => 'nl',
                'name' => 'Betaling ontvangen — admin',
                'subject' => 'Betaling ontvangen: {{ amount }} € op factuur {{ invoice_number }}',
                'body' => '<p>Een betaling van <strong>{{ amount }} €</strong> werd geregistreerd op factuur <strong>{{ invoice_number }}</strong> ({{ client_name }}).</p><p>Openstaand saldo: <strong>{{ remaining }} €</strong> — status: {{ status }}.</p>',
            ],
        ];

        foreach ($rows as $row) {
            DB::table('email_templates')->updateOrInsert(
                ['slug' => 'payment-received-admin', 'locale' => $row['locale']],
                [
                    'name' => $row['name'],
                    'subject' => $row['subject'],
                    'body' => $row['body'],
                    'available_variables' => $variables,
                    'category' => 'invoice',
                    'is_active' => true,
                    'updated_at' => $now,
                    'created_at' => $now,
                ],
            );
        }
    }

    public function down(): void
    {
        DB::table('email_templates')->where('slug', 'payment-received-admin')->delete();
    }
};
