<?php

namespace Database\Seeders;

use App\Models\Page;
use Illuminate\Database\Seeder;

class PageSeeder extends Seeder
{
    public function run(): void
    {
        Page::updateOrCreate(
            ['slug' => 'partner-program-guide'],
            [
                'title' => 'Partner Program Guide',
                'content' => '<h2>Welcome to the NA Innovations Partner Program</h2>
<p>Thank you for joining our referral network. This guide explains how the program works, how you earn commissions, and what to expect at every stage.</p>

<h3>How It Works</h3>
<ol>
<li><strong>Submit a Client</strong> - Use the "Submit a Client" button to refer someone who needs web or mobile development services.</li>
<li><strong>We Reach Out</strong> - Our team contacts the client within 24 hours with a professional proposal.</li>
<li><strong>Project Starts</strong> - If the client accepts, the project is assigned to a developer.</li>
<li><strong>You Get Paid</strong> - Your commission is calculated on each payment we receive from the client.</li>
</ol>

<h3>Commission Structure</h3>
<ul>
<li>Your commission rate is set individually (visible in your Profile page).</li>
<li>Commission is calculated on the <strong>pre-tax amount</strong> (HT) of each invoice paid by the client.</li>
<li>Commission lifecycle: <strong>Estimated → Confirmed → Scheduled → Paid</strong>.</li>
<li>Payments are typically processed within 30 days after confirmation.</li>
</ul>

<h3>What Counts as a Referral</h3>
<ul>
<li>The client must be <strong>new</strong> - not an existing client of NA Innovations.</li>
<li>The client must be submitted through the platform (not informally).</li>
<li>The referral is attributed to you for <strong>12 months</strong> - any project from that client within 12 months earns you commission.</li>
</ul>

<h3>Payment Methods</h3>
<p>You can choose your preferred payment method in your Profile settings:</p>
<ul>
<li>Bank transfer (SEPA)</li>
<li>PayPal</li>
<li>Cash (by arrangement)</li>
</ul>

<h3>Important Rules</h3>
<ul>
<li>You cannot refer yourself or your own company.</li>
<li>Commission is only earned on <strong>paid</strong> invoices - if the client doesn\'t pay, no commission is due.</li>
<li>If a project is cancelled after partial payment, commission is earned only on the amount actually paid.</li>
<li>NA Innovations reserves the right to modify commission rates with 30 days notice.</li>
</ul>',
                'audience' => 'partner',
                'is_published' => true,
                'sort_order' => 1,
                'icon' => 'M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25',
            ]
        );

        Page::updateOrCreate(
            ['slug' => 'partner-faq'],
            [
                'title' => 'FAQ',
                'content' => '<h2>Frequently Asked Questions</h2>

<h3>When do I get paid?</h3>
<p>Commissions are paid once they reach "Scheduled" status. Payments are typically processed within 30 days after the commission is confirmed. You can see scheduled payment dates on your Commissions page.</p>

<h3>How is my commission calculated?</h3>
<p>Your commission is a percentage of the pre-tax (HT) amount on each paid invoice linked to your referral. For example, if a client pays a €10,000 invoice (including 21% VAT), the base is €8,264.46, and at 10% your commission would be €826.45.</p>

<h3>What happens if the client cancels?</h3>
<p>If the client cancels before any payment, no commission is earned. If they\'ve already made a partial payment (e.g., a deposit), you earn commission on that amount. The remaining unpaid portion is cancelled.</p>

<h3>Can I see what the client was quoted?</h3>
<p>Yes. Once a lead is marked as "Won", you can see the project details, quote amount, and project status on the lead detail page.</p>

<h3>Why was my lead marked as "Lost"?</h3>
<p>A lead can be lost for various reasons: budget mismatch, timing issues, or the client choosing another provider. When available, the reason is displayed on the lead detail page.</p>

<h3>Can I refer multiple clients at once?</h3>
<p>Currently, clients are submitted one at a time through the form. This ensures each referral gets proper attention and follow-up.</p>

<h3>How do I change my payment details?</h3>
<p>Go to Profile &amp; Settings in the sidebar. You can update your payment method, bank IBAN, or PayPal email at any time.</p>

<h3>Who do I contact for support?</h3>
<p>For any questions about the program, your commissions, or a specific lead, contact us at <strong>info@nawfelajari.be</strong>.</p>',
                'audience' => 'partner',
                'is_published' => true,
                'sort_order' => 2,
                'icon' => 'M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z',
            ]
        );
    }
}
