import { Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';

export default function Privacy() {
    return (
        <PublicLayout title="Privacy Policy">
            {/* Hero */}
            <section className="bg-gray-900 py-24">
                <div className="max-w-4xl mx-auto text-center px-4">
                    <h1 className="text-6xl md:text-8xl font-bold text-white bebas" style={{ letterSpacing: '3px' }}>
                        Privacy Policy
                    </h1>
                    <p className="mt-4 text-gray-400">Last updated: March 2026</p>
                </div>
            </section>

            {/* Content */}
            <section className="py-16 bg-white">
                <div className="max-w-3xl mx-auto px-4 prose prose-lg max-w-none">
                    <h2>1. Introduction</h2>
                    <p>
                        NA Innovations BV ("NA Innovations", "we", "us", or "our"), registered in Belgium with company
                        number 1025.939.504 and VAT number BE1025939504, is committed to protecting your privacy and
                        personal data in accordance with the General Data Protection Regulation (GDPR) (EU) 2016/679
                        and applicable Belgian data protection legislation.
                    </p>
                    <p>
                        This Privacy Policy explains how we collect, use, store, and protect your personal data when
                        you visit our website or use our services.
                    </p>

                    <h2>2. Data Controller</h2>
                    <p>
                        The data controller responsible for your personal data is:
                    </p>
                    <p>
                        NA Innovations BV<br />
                        Email: <a href="mailto:info@nainnovations.be">info@nainnovations.be</a><br />
                        Phone: +32 490 22 19 12
                    </p>

                    <h2>3. What Data We Collect</h2>
                    <p>We may collect the following categories of personal data:</p>
                    <ul>
                        <li><strong>Identity data:</strong> First name, last name, company name.</li>
                        <li><strong>Contact data:</strong> Email address, phone number.</li>
                        <li><strong>Project data:</strong> Information you provide about your project requirements, budget, and timeline.</li>
                        <li><strong>Technical data:</strong> IP address, browser type, device information, and cookies (see Section 8).</li>
                        <li><strong>Communication data:</strong> Messages sent through our contact form or email correspondence.</li>
                    </ul>

                    <h2>4. How We Collect Your Data</h2>
                    <p>We collect personal data through the following means:</p>
                    <ul>
                        <li>Contact forms on our website</li>
                        <li>Quote request forms</li>
                        <li>Email and phone communications</li>
                        <li>Client onboarding processes</li>
                        <li>Automatic collection through cookies and similar technologies</li>
                    </ul>

                    <h2>5. Legal Basis for Processing</h2>
                    <p>We process your personal data based on the following legal grounds under GDPR Article 6:</p>
                    <ul>
                        <li><strong>Consent (Art. 6(1)(a)):</strong> When you voluntarily submit your data through our contact or quote request forms.</li>
                        <li><strong>Contract Performance (Art. 6(1)(b)):</strong> When processing is necessary for the performance of a contract or to take steps at your request prior to entering into a contract.</li>
                        <li><strong>Legitimate Interest (Art. 6(1)(f)):</strong> For improving our services, website analytics, and marketing communications (with opt-out option).</li>
                        <li><strong>Legal Obligation (Art. 6(1)(c)):</strong> When we are required to retain data for accounting, tax, or legal compliance purposes.</li>
                    </ul>

                    <h2>6. How We Use Your Data</h2>
                    <p>We use your personal data for the following purposes:</p>
                    <ul>
                        <li>To respond to your inquiries and contact form submissions</li>
                        <li>To prepare and send project proposals and quotes</li>
                        <li>To manage client relationships and deliver our services</li>
                        <li>To send invoices and process payments</li>
                        <li>To improve our website and services</li>
                        <li>To comply with legal and regulatory obligations</li>
                    </ul>

                    <h2>7. Data Retention</h2>
                    <p>
                        We retain your personal data only for as long as necessary to fulfill the purposes for which
                        it was collected:
                    </p>
                    <ul>
                        <li><strong>Contact form data:</strong> Retained for up to 2 years after your last interaction with us.</li>
                        <li><strong>Client project data:</strong> Retained for the duration of our business relationship plus 7 years for legal and accounting purposes, as required by Belgian law.</li>
                        <li><strong>Invoice and financial data:</strong> Retained for 7 years as required by Belgian accounting regulations.</li>
                    </ul>

                    <h2>8. Cookies</h2>
                    <p>
                        Our website uses cookies and similar technologies. Cookies are small text files stored on
                        your device that help us provide a better user experience. We use:
                    </p>
                    <ul>
                        <li><strong>Essential cookies:</strong> Required for the website to function properly (session management, security).</li>
                        <li><strong>Analytics cookies:</strong> Help us understand how visitors interact with our website.</li>
                    </ul>
                    <p>
                        You can manage cookie preferences through your browser settings. Disabling certain cookies may
                        affect the functionality of our website.
                    </p>

                    <h2>9. Data Sharing</h2>
                    <p>
                        We do not sell your personal data. We may share your data with:
                    </p>
                    <ul>
                        <li><strong>Service providers:</strong> Hosting providers, email services, and payment processors who assist in delivering our services. These providers are contractually bound to protect your data.</li>
                        <li><strong>Legal authorities:</strong> When required by law or in response to valid legal requests.</li>
                    </ul>

                    <h2>10. International Data Transfers</h2>
                    <p>
                        Your data is primarily stored and processed within the European Economic Area (EEA). If any
                        data is transferred outside the EEA, we ensure appropriate safeguards are in place, such as
                        Standard Contractual Clauses approved by the European Commission.
                    </p>

                    <h2>11. Your Rights Under GDPR</h2>
                    <p>Under the GDPR, you have the following rights:</p>
                    <ul>
                        <li><strong>Right of Access (Art. 15):</strong> You can request a copy of the personal data we hold about you.</li>
                        <li><strong>Right to Rectification (Art. 16):</strong> You can request correction of inaccurate or incomplete data.</li>
                        <li><strong>Right to Erasure (Art. 17):</strong> You can request deletion of your personal data, subject to legal retention requirements.</li>
                        <li><strong>Right to Restrict Processing (Art. 18):</strong> You can request that we limit how we use your data.</li>
                        <li><strong>Right to Data Portability (Art. 20):</strong> You can request your data in a structured, machine-readable format.</li>
                        <li><strong>Right to Object (Art. 21):</strong> You can object to the processing of your data for direct marketing or based on legitimate interest.</li>
                        <li><strong>Right to Withdraw Consent:</strong> Where processing is based on consent, you can withdraw it at any time without affecting the lawfulness of prior processing.</li>
                    </ul>
                    <p>
                        To exercise any of these rights, please contact us at <a href="mailto:info@nainnovations.be">info@nainnovations.be</a>.
                        We will respond within 30 days.
                    </p>

                    <h2>12. Data Security</h2>
                    <p>
                        We implement appropriate technical and organizational measures to protect your personal data
                        against unauthorized access, alteration, disclosure, or destruction. These measures include
                        encryption, access controls, secure hosting environments, and regular security assessments.
                    </p>

                    <h2>13. Supervisory Authority</h2>
                    <p>
                        If you believe that our processing of your personal data violates the GDPR, you have the
                        right to lodge a complaint with the Belgian Data Protection Authority:
                    </p>
                    <p>
                        Data Protection Authority (Gegevensbeschermingsautoriteit)<br />
                        Rue de la Presse 35 / Drukpersstraat 35<br />
                        1000 Brussels, Belgium<br />
                        Website: <a href="https://www.dataprotectionauthority.be" target="_blank" rel="noopener noreferrer">www.dataprotectionauthority.be</a>
                    </p>

                    <h2>14. Changes to This Policy</h2>
                    <p>
                        We may update this Privacy Policy from time to time. Any changes will be posted on this page
                        with an updated revision date. We encourage you to review this policy periodically.
                    </p>

                    <h2>15. Contact</h2>
                    <p>
                        For any questions or concerns about this Privacy Policy or our data practices, please contact us at:
                    </p>
                    <p>
                        NA Innovations BV<br />
                        Email: <a href="mailto:info@nainnovations.be">info@nainnovations.be</a><br />
                        Phone: +32 490 22 19 12<br />
                        VAT: BE1025939504
                    </p>
                </div>
            </section>
        </PublicLayout>
    );
}
