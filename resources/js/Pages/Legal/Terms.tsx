import { Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';

export default function Terms() {
    return (
        <PublicLayout title="Terms & Conditions">
            {/* Hero */}
            <section className="bg-gray-900 py-24">
                <div className="max-w-4xl mx-auto text-center px-4">
                    <h1 className="text-6xl md:text-8xl font-bold text-white bebas" style={{ letterSpacing: '3px' }}>
                        Terms &amp; Conditions
                    </h1>
                    <p className="mt-4 text-gray-400">Last updated: March 2026</p>
                </div>
            </section>

            {/* Content */}
            <section className="py-16 bg-white">
                <div className="max-w-3xl mx-auto px-4 prose prose-lg max-w-none">
                    <h2>1. Introduction</h2>
                    <p>
                        These Terms and Conditions govern your use of the services provided by NA Innovations BV
                        (hereinafter referred to as "NA Innovations", "we", "us", or "our"), a company registered
                        in Belgium with company number 1025.939.504 and VAT number BE1025939504.
                    </p>
                    <p>
                        By engaging our services or using our website, you agree to be bound by these Terms and Conditions.
                        If you do not agree, please do not use our services or website.
                    </p>

                    <h2>2. Services</h2>
                    <p>
                        NA Innovations provides custom software development, web development, mobile application development,
                        SaaS platform development, and related consulting services. The specific scope of services for each
                        project is defined in a separate project proposal or contract.
                    </p>

                    <h2>3. Quotes and Proposals</h2>
                    <p>
                        All quotes and proposals provided by NA Innovations are valid for 30 days from the date of issue
                        unless otherwise specified. Prices are in EUR and exclude VAT unless stated otherwise.
                        A quote becomes a binding agreement once accepted in writing by the client.
                    </p>

                    <h2>4. Payment Terms</h2>
                    <p>
                        Unless otherwise agreed, the following payment terms apply:
                    </p>
                    <ul>
                        <li>An advance payment of 30% of the total project cost is required before work begins.</li>
                        <li>Intermediate payments may be required at defined project milestones.</li>
                        <li>The final balance is due upon project delivery and acceptance.</li>
                        <li>Invoices are payable within 15 days of the invoice date.</li>
                        <li>Late payments may incur interest at the legal rate applicable in Belgium, plus a fixed recovery fee.</li>
                    </ul>

                    <h2>5. Intellectual Property</h2>
                    <p>
                        Upon full payment, the client receives ownership of the custom code developed specifically
                        for their project. NA Innovations retains the right to use general frameworks, libraries,
                        and tools developed independently. NA Innovations reserves the right to showcase the delivered
                        work in its portfolio unless agreed otherwise in writing.
                    </p>

                    <h2>6. Confidentiality</h2>
                    <p>
                        Both parties agree to keep confidential all proprietary information shared during the course
                        of the project. This obligation survives the termination of the agreement. Confidential
                        information does not include information that is publicly available or independently developed.
                    </p>

                    <h2>7. Project Timeline</h2>
                    <p>
                        Timelines provided in proposals are estimates based on the information available at the time.
                        Delays caused by the client (such as late feedback or content delivery) may extend the project
                        timeline. NA Innovations will communicate any anticipated delays as soon as reasonably possible.
                    </p>

                    <h2>8. Revisions and Changes</h2>
                    <p>
                        The scope of work is defined in the project proposal. Changes to the scope after acceptance
                        may affect the timeline and cost. Any scope changes will be documented and require mutual
                        agreement before implementation.
                    </p>

                    <h2>9. Warranty</h2>
                    <p>
                        NA Innovations provides a 30-day warranty period after project delivery, during which any bugs
                        or defects related to the agreed specifications will be fixed at no additional cost. This warranty
                        does not cover issues arising from third-party modifications, misuse, or changes to the hosting
                        environment.
                    </p>

                    <h2>10. Limitation of Liability</h2>
                    <p>
                        NA Innovations shall not be liable for any indirect, incidental, special, or consequential
                        damages arising from the use of our services. Our total liability shall not exceed the total
                        amount paid by the client for the specific project in question.
                    </p>

                    <h2>11. Termination</h2>
                    <p>
                        Either party may terminate a project agreement with 30 days written notice. In case of
                        termination, the client shall pay for all work completed up to the termination date.
                        Any advance payments for undelivered work will be refunded proportionally.
                    </p>

                    <h2>12. Force Majeure</h2>
                    <p>
                        Neither party shall be liable for any failure or delay in performing their obligations due
                        to circumstances beyond their reasonable control, including but not limited to natural disasters,
                        war, pandemic, or government actions.
                    </p>

                    <h2>13. Governing Law</h2>
                    <p>
                        These Terms and Conditions are governed by and construed in accordance with Belgian law.
                        Any disputes arising from these terms shall be submitted to the competent courts in Belgium.
                    </p>

                    <h2>14. Contact</h2>
                    <p>
                        For any questions regarding these Terms and Conditions, please contact us at:
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
