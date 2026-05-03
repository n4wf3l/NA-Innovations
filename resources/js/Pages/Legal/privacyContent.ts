// Static, multilingual Privacy Policy content for /privacy.
// Scope: visitors of the public landing page only (not internal client/dev portal users).
// GDPR-compliant (Reg. EU 2016/679) + Belgian law of 30 July 2018.
// No physical address exposed (uses email contact only).

export type LegalContent = {
    title: string;
    lastUpdate: string;
    html: string;
};

const LAST_UPDATE = {
    fr: '3 mai 2026',
    en: 'May 3, 2026',
    nl: '3 mei 2026',
};

export const privacyContent: Record<'fr' | 'en' | 'nl', LegalContent> = {
    // ────────────────────────────────────────────────────────────────────────
    // FRANÇAIS
    // ────────────────────────────────────────────────────────────────────────
    fr: {
        title: 'Politique de Confidentialité',
        lastUpdate: LAST_UPDATE.fr,
        html: `
<p><strong>Dernière mise à jour :</strong> ${LAST_UPDATE.fr}</p>

<p>NA Innovations BV (« nous », « notre ») accorde une importance particulière à la protection de vos données personnelles. La présente Politique de Confidentialité décrit la manière dont nous collectons, utilisons et protégeons les données personnelles que vous nous transmettez via le site <strong>nainnovations.be</strong> (« le Site »).</p>

<p>Cette politique s'applique <strong>uniquement aux visiteurs du Site</strong>. Les utilisateurs disposant d'un compte privé (clients, développeurs, partenaires) sont régis par des contrats spécifiques distincts.</p>

<h2>Article 1 — Responsable du traitement</h2>
<p><strong>NA Innovations BV</strong>, société à responsabilité limitée de droit belge, inscrite à la Banque-Carrefour des Entreprises sous le numéro <strong>1025.939.504</strong>, numéro de TVA <strong>BE 1025.939.504</strong>.</p>
<p>Pour toute question relative à la protection de vos données : <a href="mailto:info@nainnovations.be">info@nainnovations.be</a></p>

<h2>Article 2 — Données personnelles collectées</h2>
<p>Nous collectons uniquement les données strictement nécessaires aux finalités décrites à l'article 3.</p>
<p><strong>Via le formulaire de contact :</strong></p>
<ul>
    <li>Nom et prénom</li>
    <li>Adresse email</li>
    <li>Numéro de téléphone (facultatif)</li>
    <li>Nom de l'entreprise (facultatif)</li>
    <li>Contenu du message</li>
</ul>
<p><strong>Via le simulateur de prix et le formulaire de devis :</strong></p>
<ul>
    <li>Choix techniques effectués (type de projet, fonctionnalités, budget, délai souhaité, etc.)</li>
    <li>Coordonnées de contact si vous demandez à recevoir l'estimation</li>
    <li>Pièces jointes éventuelles (PDF, DOC, XLS, images — maximum 5 fichiers de 10 Mo chacun)</li>
</ul>
<p><strong>Données techniques (logs serveur) :</strong></p>
<ul>
    <li>Adresse IP</li>
    <li>Type de navigateur et version (user-agent)</li>
    <li>Pages consultées, date et heure de la visite</li>
</ul>
<p><strong>Cookies :</strong> voir Article 8.</p>

<h2>Article 3 — Finalités du traitement</h2>
<p>Vos données sont traitées exclusivement pour :</p>
<ul>
    <li>répondre à vos demandes de contact ou d'information ;</li>
    <li>établir une estimation tarifaire personnalisée si vous en faites la demande ;</li>
    <li>assurer le bon fonctionnement, la sécurité et l'amélioration du Site ;</li>
    <li>détecter et prévenir les abus, fraudes ou tentatives d'intrusion.</li>
</ul>
<p>Vos données ne sont <strong>jamais</strong> vendues, louées, ni utilisées à des fins de prospection commerciale non sollicitée par des tiers.</p>

<h2>Article 4 — Base légale du traitement</h2>
<p>Conformément à l'article 6 du RGPD, nous traitons vos données sur les bases suivantes :</p>
<ul>
    <li><strong>Votre consentement</strong> (Art. 6.1.a) : lorsque vous remplissez volontairement un formulaire ou utilisez le simulateur ;</li>
    <li><strong>Mesures précontractuelles</strong> (Art. 6.1.b) : pour traiter une demande de devis en vue d'éventuelles négociations contractuelles ;</li>
    <li><strong>Intérêt légitime</strong> (Art. 6.1.f) : pour la sécurité du Site, la prévention des abus, et l'analyse technique non identifiante.</li>
</ul>

<h2>Article 5 — Destinataires et sous-traitants</h2>
<p>Vos données sont traitées en interne par NA Innovations BV. Pour assurer le fonctionnement du Site, certains traitements sont confiés à des sous-traitants, contractuellement tenus de respecter le RGPD (clauses de traitement conformes à l'Art. 28 RGPD) :</p>
<ul>
    <li><strong>Hébergeur web</strong> (situé dans l'Espace économique européen) — stockage du Site et des données.</li>
    <li><strong>Fournisseur d'envoi d'emails transactionnels</strong> (situé dans l'EEE) — réponses aux demandes de contact et de devis.</li>
    <li><strong>Cloudflare, Inc.</strong> (États-Unis) — protection anti-bot et anti-spam via le service <em>Turnstile</em> sur les formulaires (contact, login, devis). Cloudflare reçoit votre adresse IP et certains signaux navigateur le temps de la vérification. Encadré par les Clauses Contractuelles Types (CCT) de la Commission européenne et le DPA de Cloudflare.</li>
    <li><strong>Google LLC</strong> (États-Unis) — service <em>Gemini AI</em> utilisé par le chatbot conversationnel du Site. <strong>Uniquement si vous interagissez avec le chatbot</strong>, vos messages sont transmis à Google pour générer une réponse. Encadré par les CCT de la Commission européenne et le DPA Google Cloud. Si vous ne souhaitez pas que vos messages soient traités par Google, n'utilisez simplement pas le chatbot.</li>
</ul>
<p>Aucune autre communication à des tiers à des fins commerciales n'est effectuée sans votre consentement explicite préalable. Vos données ne sont jamais vendues, ni cédées à des fins publicitaires.</p>

<h2>Article 6 — Durée de conservation</h2>
<p>Vos données sont conservées uniquement le temps nécessaire aux finalités décrites à l'article 3. Les durées indicatives suivantes servent de référence pour notre revue périodique des données :</p>
<ul>
    <li><strong>Messages via formulaire de contact :</strong> jusqu'à 24 mois après la dernière interaction ;</li>
    <li><strong>Demandes de devis non concrétisées :</strong> jusqu'à 12 mois ;</li>
    <li><strong>Demandes ayant abouti à un contrat :</strong> durée du contrat puis jusqu'à 10 ans (obligations comptables et fiscales belges) ;</li>
    <li><strong>Logs techniques :</strong> selon la politique de notre hébergeur (généralement entre 3 et 12 mois) ;</li>
    <li><strong>Cookies techniques et stockage local :</strong> durée de la session ou de la préférence définie par le navigateur.</li>
</ul>
<p>Vous pouvez demander la suppression anticipée de vos données à tout moment en nous contactant (voir article 7), sous réserve de nos obligations légales de conservation.</p>

<h2>Article 7 — Vos droits</h2>
<p>Conformément aux articles 15 à 22 du RGPD, vous disposez des droits suivants :</p>
<ul>
    <li><strong>Droit d'accès</strong> à vos données personnelles ;</li>
    <li><strong>Droit de rectification</strong> en cas de données inexactes ou incomplètes ;</li>
    <li><strong>Droit à l'effacement</strong> (« droit à l'oubli ») ;</li>
    <li><strong>Droit à la limitation</strong> du traitement ;</li>
    <li><strong>Droit d'opposition</strong> au traitement ;</li>
    <li><strong>Droit à la portabilité</strong> de vos données ;</li>
    <li><strong>Droit de retirer votre consentement</strong> à tout moment, sans affecter la licéité du traitement antérieur.</li>
</ul>
<p>Pour exercer l'un de ces droits, envoyez un email à <a href="mailto:info@nainnovations.be">info@nainnovations.be</a>. Une réponse vous sera apportée dans le délai légal d'<strong>un mois</strong> (prolongeable de deux mois en cas de demande complexe).</p>

<h2>Article 8 — Cookies et stockage local</h2>
<p>Le Site utilise <strong>uniquement des cookies et données de stockage local strictement nécessaires</strong> à son fonctionnement, exemptés du consentement préalable selon la directive ePrivacy (2002/58/CE) :</p>
<ul>
    <li>Préférence de langue (FR / EN / NL) ;</li>
    <li>Préférence de thème (clair / sombre) ;</li>
    <li>Identifiant de session anonyme (sécurité, prévention CSRF) ;</li>
    <li>Préférences d'interface (état des bandeaux fermés, splash écran, prompt d'installation PWA, historique de chat conservé en mémoire de session) ;</li>
    <li>Cookies techniques déposés par <strong>Cloudflare Turnstile</strong> lors de la vérification anti-bot des formulaires (durée limitée à la session de vérification).</li>
</ul>
<p>Aucun cookie de mesure d'audience, publicitaire, de réseau social ou de profilage marketing n'est déposé sur le Site, ni avec ni sans consentement.</p>

<h2>Article 9 — Sécurité des données</h2>
<p>Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données contre tout accès non autorisé, perte, altération ou divulgation, notamment :</p>
<ul>
    <li>chiffrement des communications via HTTPS (TLS) ;</li>
    <li>hashage des mots de passe avec l'algorithme bcrypt ;</li>
    <li>contrôle d'accès strict aux systèmes selon le principe du moindre privilège ;</li>
    <li>protection anti-bot et anti-spam des formulaires (Cloudflare Turnstile) ;</li>
    <li>sauvegardes régulières effectuées par notre hébergeur situé dans l'EEE.</li>
</ul>

<h2>Article 10 — Transferts hors Union européenne</h2>
<p>Vos données sont <strong>principalement traitées et stockées au sein de l'Espace économique européen (EEE)</strong> (hébergement, base de données, emails transactionnels).</p>
<p>Toutefois, certains traitements limités impliquent des sous-traitants établis aux <strong>États-Unis</strong> :</p>
<ul>
    <li><strong>Cloudflare, Inc.</strong> pour la protection anti-bot des formulaires (Turnstile) ;</li>
    <li><strong>Google LLC</strong> pour le service Gemini AI utilisé par le chatbot, uniquement si vous l'utilisez.</li>
</ul>
<p>Ces transferts s'effectuent dans le cadre des <strong>Clauses Contractuelles Types (CCT)</strong> adoptées par la Commission européenne (décision 2021/914), qui constituent des garanties appropriées au sens de l'article 46 du RGPD. Vous pouvez demander une copie de ces clauses en nous écrivant à <a href="mailto:info@nainnovations.be">info@nainnovations.be</a>.</p>

<h2>Article 11 — Modification de la Politique</h2>
<p>NA Innovations BV se réserve le droit de modifier la présente Politique à tout moment, afin notamment de refléter les évolutions légales, techniques ou organisationnelles. La date de dernière mise à jour figure en haut du document. Nous vous invitons à la consulter régulièrement.</p>

<h2>Article 12 — Contact et réclamation</h2>
<p>Pour toute question, exercice de droit ou réclamation relative au traitement de vos données : <a href="mailto:info@nainnovations.be">info@nainnovations.be</a></p>
<p>Si vous estimez que vos droits ne sont pas respectés, vous disposez du droit d'introduire une réclamation auprès de l'<strong>Autorité de Protection des Données belge (APD)</strong> :</p>
<ul>
    <li>Rue de la Presse 35, 1000 Bruxelles</li>
    <li>Email : <a href="mailto:contact@apd-gba.be">contact@apd-gba.be</a></li>
    <li>Site : <a href="https://www.autoriteprotectiondonnees.be" target="_blank" rel="noopener noreferrer">www.autoriteprotectiondonnees.be</a></li>
</ul>
        `.trim(),
    },

    // ────────────────────────────────────────────────────────────────────────
    // ENGLISH
    // ────────────────────────────────────────────────────────────────────────
    en: {
        title: 'Privacy Policy',
        lastUpdate: LAST_UPDATE.en,
        html: `
<p><strong>Last updated:</strong> ${LAST_UPDATE.en}</p>

<p>NA Innovations BV ("we", "our") attaches particular importance to the protection of your personal data. This Privacy Policy describes how we collect, use and protect the personal data you transmit to us via the website <strong>nainnovations.be</strong> ("the Site").</p>

<p>This policy applies <strong>only to visitors of the Site</strong>. Users with a private account (clients, developers, partners) are governed by separate specific contracts.</p>

<h2>Article 1 — Data controller</h2>
<p><strong>NA Innovations BV</strong>, a private limited liability company under Belgian law, registered with the Crossroads Bank for Enterprises under number <strong>1025.939.504</strong>, VAT number <strong>BE 1025.939.504</strong>.</p>
<p>For any question regarding the protection of your data: <a href="mailto:info@nainnovations.be">info@nainnovations.be</a></p>

<h2>Article 2 — Personal data collected</h2>
<p>We collect only the data strictly necessary for the purposes described in Article 3.</p>
<p><strong>Via the contact form:</strong></p>
<ul>
    <li>First and last name</li>
    <li>Email address</li>
    <li>Phone number (optional)</li>
    <li>Company name (optional)</li>
    <li>Message content</li>
</ul>
<p><strong>Via the price simulator and the quote form:</strong></p>
<ul>
    <li>Technical choices made (project type, features, budget, desired timeline, etc.)</li>
    <li>Contact details if you request to receive the estimate</li>
    <li>Optional file attachments (PDF, DOC, XLS, images — maximum 5 files of 10 MB each)</li>
</ul>
<p><strong>Technical data (server logs):</strong></p>
<ul>
    <li>IP address</li>
    <li>Browser type and version (user-agent)</li>
    <li>Pages viewed, date and time of visit</li>
</ul>
<p><strong>Cookies:</strong> see Article 8.</p>

<h2>Article 3 — Purposes of processing</h2>
<p>Your data is processed exclusively to:</p>
<ul>
    <li>respond to your requests for contact or information;</li>
    <li>provide a personalized price estimate upon your request;</li>
    <li>ensure the proper operation, security and improvement of the Site;</li>
    <li>detect and prevent abuse, fraud or intrusion attempts.</li>
</ul>
<p>Your data is <strong>never</strong> sold, rented, or used for unsolicited commercial prospecting by third parties.</p>

<h2>Article 4 — Legal basis for processing</h2>
<p>In accordance with Article 6 of the GDPR, we process your data on the following bases:</p>
<ul>
    <li><strong>Your consent</strong> (Art. 6.1.a): when you voluntarily fill in a form or use the simulator;</li>
    <li><strong>Pre-contractual measures</strong> (Art. 6.1.b): to process a quotation request with a view to potential contractual negotiations;</li>
    <li><strong>Legitimate interest</strong> (Art. 6.1.f): for Site security, abuse prevention, and non-identifying technical analysis.</li>
</ul>

<h2>Article 5 — Recipients and sub-processors</h2>
<p>Your data is processed internally by NA Innovations BV. To ensure the operation of the Site, certain processing operations are entrusted to sub-processors, contractually bound to comply with the GDPR (data processing terms compliant with Art. 28 GDPR):</p>
<ul>
    <li><strong>Web hosting provider</strong> (located in the European Economic Area) — storage of the Site and data.</li>
    <li><strong>Transactional email service provider</strong> (located in the EEA) — replies to contact and quotation requests.</li>
    <li><strong>Cloudflare, Inc.</strong> (United States) — anti-bot and anti-spam protection via the <em>Turnstile</em> service on our forms (contact, login, quotation). Cloudflare receives your IP address and certain browser signals during verification. Covered by the European Commission's Standard Contractual Clauses (SCCs) and Cloudflare's DPA.</li>
    <li><strong>Google LLC</strong> (United States) — <em>Gemini AI</em> service used by the Site's conversational chatbot. <strong>Only if you interact with the chatbot</strong>, your messages are sent to Google to generate a response. Covered by the European Commission's SCCs and Google Cloud's DPA. If you do not wish your messages to be processed by Google, simply do not use the chatbot.</li>
</ul>
<p>No other communication to third parties for commercial purposes is carried out without your prior explicit consent. Your data is never sold or transferred for advertising purposes.</p>

<h2>Article 6 — Data retention period</h2>
<p>Your data is retained only for as long as necessary for the purposes described in Article 3. The following indicative periods serve as a reference for our periodic data review:</p>
<ul>
    <li><strong>Contact form messages:</strong> up to 24 months after the last interaction;</li>
    <li><strong>Unconverted quotation requests:</strong> up to 12 months;</li>
    <li><strong>Requests resulting in a contract:</strong> contract duration, then up to 10 years (Belgian accounting and tax obligations);</li>
    <li><strong>Technical logs:</strong> according to our hosting provider's policy (typically between 3 and 12 months);</li>
    <li><strong>Technical cookies and local storage:</strong> session duration or as set by browser preferences.</li>
</ul>
<p>You may request earlier deletion of your data at any time by contacting us (see Article 7), subject to our legal retention obligations.</p>

<h2>Article 7 — Your rights</h2>
<p>In accordance with Articles 15 to 22 of the GDPR, you have the following rights:</p>
<ul>
    <li><strong>Right of access</strong> to your personal data;</li>
    <li><strong>Right to rectification</strong> in case of inaccurate or incomplete data;</li>
    <li><strong>Right to erasure</strong> ("right to be forgotten");</li>
    <li><strong>Right to restriction</strong> of processing;</li>
    <li><strong>Right to object</strong> to processing;</li>
    <li><strong>Right to data portability</strong>;</li>
    <li><strong>Right to withdraw your consent</strong> at any time, without affecting the lawfulness of prior processing.</li>
</ul>
<p>To exercise any of these rights, send an email to <a href="mailto:info@nainnovations.be">info@nainnovations.be</a>. A response will be provided within the legal period of <strong>one month</strong> (extendable by two months in case of complex requests).</p>

<h2>Article 8 — Cookies and local storage</h2>
<p>The Site uses <strong>only strictly necessary cookies and local storage data</strong> for its operation, exempt from prior consent under the ePrivacy Directive (2002/58/EC):</p>
<ul>
    <li>Language preference (FR / EN / NL);</li>
    <li>Theme preference (light / dark);</li>
    <li>Anonymous session identifier (security, CSRF prevention);</li>
    <li>Interface preferences (state of dismissed banners, splash screen, PWA install prompt, in-session chat history);</li>
    <li>Technical cookies set by <strong>Cloudflare Turnstile</strong> during anti-bot verification on forms (limited to the verification session).</li>
</ul>
<p>No analytics, advertising, social network or marketing profiling cookies are placed on the Site, with or without consent.</p>

<h2>Article 9 — Data security</h2>
<p>We implement appropriate technical and organizational measures to protect your data against any unauthorized access, loss, alteration or disclosure, in particular:</p>
<ul>
    <li>encryption of communications via HTTPS (TLS);</li>
    <li>password hashing with the bcrypt algorithm;</li>
    <li>strict access control to systems based on the principle of least privilege;</li>
    <li>anti-bot and anti-spam protection on forms (Cloudflare Turnstile);</li>
    <li>regular backups performed by our hosting provider located in the EEA.</li>
</ul>

<h2>Article 10 — Transfers outside the European Union</h2>
<p>Your data is <strong>primarily processed and stored within the European Economic Area (EEA)</strong> (hosting, database, transactional emails).</p>
<p>However, certain limited processing operations involve sub-processors established in the <strong>United States</strong>:</p>
<ul>
    <li><strong>Cloudflare, Inc.</strong> for anti-bot protection on forms (Turnstile);</li>
    <li><strong>Google LLC</strong> for the Gemini AI service used by the chatbot, only if you use it.</li>
</ul>
<p>These transfers take place under the <strong>Standard Contractual Clauses (SCCs)</strong> adopted by the European Commission (Decision 2021/914), which constitute appropriate safeguards within the meaning of Article 46 of the GDPR. You may request a copy of these clauses by writing to <a href="mailto:info@nainnovations.be">info@nainnovations.be</a>.</p>

<h2>Article 11 — Modification of the Policy</h2>
<p>NA Innovations BV reserves the right to modify this Policy at any time, in particular to reflect legal, technical or organizational developments. The last update date appears at the top of the document. We invite you to consult it regularly.</p>

<h2>Article 12 — Contact and complaint</h2>
<p>For any question, exercise of rights or complaint regarding the processing of your data: <a href="mailto:info@nainnovations.be">info@nainnovations.be</a></p>
<p>If you consider that your rights are not respected, you have the right to lodge a complaint with the <strong>Belgian Data Protection Authority (APD/GBA)</strong>:</p>
<ul>
    <li>Rue de la Presse 35, 1000 Brussels</li>
    <li>Email: <a href="mailto:contact@apd-gba.be">contact@apd-gba.be</a></li>
    <li>Website: <a href="https://www.autoriteprotectiondonnees.be" target="_blank" rel="noopener noreferrer">www.autoriteprotectiondonnees.be</a></li>
</ul>
        `.trim(),
    },

    // ────────────────────────────────────────────────────────────────────────
    // NEDERLANDS
    // ────────────────────────────────────────────────────────────────────────
    nl: {
        title: 'Privacybeleid',
        lastUpdate: LAST_UPDATE.nl,
        html: `
<p><strong>Laatste update:</strong> ${LAST_UPDATE.nl}</p>

<p>NA Innovations BV ("wij", "ons") hecht bijzonder belang aan de bescherming van uw persoonsgegevens. Dit Privacybeleid beschrijft hoe wij persoonsgegevens verzamelen, gebruiken en beschermen die u ons via de website <strong>nainnovations.be</strong> ("de Site") doorgeeft.</p>

<p>Dit beleid is <strong>uitsluitend van toepassing op bezoekers van de Site</strong>. Gebruikers met een privéaccount (klanten, ontwikkelaars, partners) worden geregeld door afzonderlijke specifieke contracten.</p>

<h2>Artikel 1 — Verwerkingsverantwoordelijke</h2>
<p><strong>NA Innovations BV</strong>, besloten vennootschap naar Belgisch recht, ingeschreven bij de Kruispuntbank van Ondernemingen onder het nummer <strong>1025.939.504</strong>, btw-nummer <strong>BE 1025.939.504</strong>.</p>
<p>Voor elke vraag betreffende de bescherming van uw gegevens: <a href="mailto:info@nainnovations.be">info@nainnovations.be</a></p>

<h2>Artikel 2 — Verzamelde persoonsgegevens</h2>
<p>Wij verzamelen enkel de gegevens die strikt noodzakelijk zijn voor de doeleinden beschreven in artikel 3.</p>
<p><strong>Via het contactformulier:</strong></p>
<ul>
    <li>Voor- en achternaam</li>
    <li>E-mailadres</li>
    <li>Telefoonnummer (facultatief)</li>
    <li>Naam van de onderneming (facultatief)</li>
    <li>Inhoud van het bericht</li>
</ul>
<p><strong>Via de prijssimulator en het offerteformulier:</strong></p>
<ul>
    <li>Gemaakte technische keuzes (projecttype, functionaliteiten, budget, gewenste tijdlijn, enz.)</li>
    <li>Contactgegevens als u de raming wenst te ontvangen</li>
    <li>Eventuele bijlagen (PDF, DOC, XLS, beelden — maximum 5 bestanden van elk 10 MB)</li>
</ul>
<p><strong>Technische gegevens (serverlogs):</strong></p>
<ul>
    <li>IP-adres</li>
    <li>Browsertype en -versie (user-agent)</li>
    <li>Bezochte pagina's, datum en tijdstip van het bezoek</li>
</ul>
<p><strong>Cookies:</strong> zie Artikel 8.</p>

<h2>Artikel 3 — Doeleinden van de verwerking</h2>
<p>Uw gegevens worden uitsluitend verwerkt om:</p>
<ul>
    <li>te antwoorden op uw contact- of informatieaanvragen;</li>
    <li>op uw verzoek een gepersonaliseerde prijsraming op te stellen;</li>
    <li>de goede werking, veiligheid en verbetering van de Site te verzekeren;</li>
    <li>misbruik, fraude of inbraakpogingen op te sporen en te voorkomen.</li>
</ul>
<p>Uw gegevens worden <strong>nooit</strong> verkocht, verhuurd, of gebruikt voor ongevraagde commerciële prospectie door derden.</p>

<h2>Artikel 4 — Rechtsgrond voor de verwerking</h2>
<p>Overeenkomstig artikel 6 van de AVG verwerken wij uw gegevens op de volgende grondslagen:</p>
<ul>
    <li><strong>Uw toestemming</strong> (Art. 6.1.a): wanneer u vrijwillig een formulier invult of de simulator gebruikt;</li>
    <li><strong>Precontractuele maatregelen</strong> (Art. 6.1.b): om een offerteaanvraag te behandelen met het oog op eventuele contractuele onderhandelingen;</li>
    <li><strong>Gerechtvaardigd belang</strong> (Art. 6.1.f): voor de veiligheid van de Site, de preventie van misbruik, en niet-identificeerbare technische analyses.</li>
</ul>

<h2>Artikel 5 — Ontvangers en subverwerkers</h2>
<p>Uw gegevens worden intern verwerkt door NA Innovations BV. Om de werking van de Site te verzekeren, worden bepaalde verwerkingen toevertrouwd aan subverwerkers, contractueel verplicht om de AVG na te leven (verwerkersovereenkomst conform Art. 28 AVG):</p>
<ul>
    <li><strong>Webhostingprovider</strong> (gevestigd in de Europese Economische Ruimte) — opslag van de Site en gegevens.</li>
    <li><strong>Transactionele e-maildienstverlener</strong> (gevestigd in de EER) — antwoorden op contact- en offerteaanvragen.</li>
    <li><strong>Cloudflare, Inc.</strong> (Verenigde Staten) — anti-bot- en antispam-beveiliging via de <em>Turnstile</em>-dienst op onze formulieren (contact, login, offerte). Cloudflare ontvangt uw IP-adres en bepaalde browsersignalen tijdens de verificatie. Gedekt door de Modelcontractbepalingen (Standard Contractual Clauses) van de Europese Commissie en de DPA van Cloudflare.</li>
    <li><strong>Google LLC</strong> (Verenigde Staten) — <em>Gemini AI</em>-dienst gebruikt door de conversationele chatbot van de Site. <strong>Enkel als u met de chatbot communiceert</strong>, worden uw berichten naar Google gestuurd om een antwoord te genereren. Gedekt door de Modelcontractbepalingen van de Europese Commissie en de Google Cloud DPA. Indien u niet wenst dat uw berichten door Google worden verwerkt, gebruik de chatbot eenvoudigweg niet.</li>
</ul>
<p>Geen andere mededeling aan derden voor commerciële doeleinden gebeurt zonder uw voorafgaande uitdrukkelijke toestemming. Uw gegevens worden nooit verkocht of overgedragen voor reclamedoeleinden.</p>

<h2>Artikel 6 — Bewaartermijn van de gegevens</h2>
<p>Uw gegevens worden enkel zo lang bewaard als noodzakelijk voor de doeleinden beschreven in artikel 3. De volgende indicatieve termijnen dienen als richtlijn voor onze periodieke gegevenscontrole:</p>
<ul>
    <li><strong>Berichten via contactformulier:</strong> tot 24 maanden na de laatste interactie;</li>
    <li><strong>Niet-geconcretiseerde offerteaanvragen:</strong> tot 12 maanden;</li>
    <li><strong>Aanvragen die tot een contract hebben geleid:</strong> contractduur, vervolgens tot 10 jaar (Belgische boekhoudkundige en fiscale verplichtingen);</li>
    <li><strong>Technische logs:</strong> volgens het beleid van onze hostingprovider (doorgaans tussen 3 en 12 maanden);</li>
    <li><strong>Technische cookies en lokale opslag:</strong> sessieduur of zoals ingesteld door de browservoorkeuren.</li>
</ul>
<p>U kunt op elk moment de vroegtijdige verwijdering van uw gegevens aanvragen door ons te contacteren (zie artikel 7), onder voorbehoud van onze wettelijke bewaarplicht.</p>

<h2>Artikel 7 — Uw rechten</h2>
<p>Overeenkomstig de artikelen 15 tot 22 van de AVG beschikt u over de volgende rechten:</p>
<ul>
    <li><strong>Recht op inzage</strong> van uw persoonsgegevens;</li>
    <li><strong>Recht op rectificatie</strong> bij onjuiste of onvolledige gegevens;</li>
    <li><strong>Recht op gegevenswissing</strong> ("recht om vergeten te worden");</li>
    <li><strong>Recht op beperking</strong> van de verwerking;</li>
    <li><strong>Recht van bezwaar</strong> tegen de verwerking;</li>
    <li><strong>Recht op overdraagbaarheid</strong> van uw gegevens;</li>
    <li><strong>Recht om uw toestemming in te trekken</strong> op elk moment, zonder afbreuk te doen aan de rechtmatigheid van de eerdere verwerking.</li>
</ul>
<p>Om een van deze rechten uit te oefenen, stuurt u een e-mail naar <a href="mailto:info@nainnovations.be">info@nainnovations.be</a>. U ontvangt een antwoord binnen de wettelijke termijn van <strong>één maand</strong> (verlengbaar met twee maanden bij complexe aanvragen).</p>

<h2>Artikel 8 — Cookies en lokale opslag</h2>
<p>De Site gebruikt <strong>uitsluitend strikt noodzakelijke cookies en lokale opslaggegevens</strong> voor zijn werking, vrijgesteld van voorafgaande toestemming volgens de ePrivacy-richtlijn (2002/58/EG):</p>
<ul>
    <li>Taalvoorkeur (FR / EN / NL);</li>
    <li>Themavoorkeur (licht / donker);</li>
    <li>Anonieme sessie-identificator (veiligheid, CSRF-preventie);</li>
    <li>Interface-voorkeuren (status van gesloten banners, splashscherm, PWA-installatieprompt, chatgeschiedenis bewaard in sessiegeheugen);</li>
    <li>Technische cookies geplaatst door <strong>Cloudflare Turnstile</strong> tijdens de anti-botverificatie van formulieren (beperkt tot de verificatiesessie).</li>
</ul>
<p>Er worden geen cookies voor analyse, reclame, sociale netwerken of marketingprofilering op de Site geplaatst, met of zonder toestemming.</p>

<h2>Artikel 9 — Beveiliging van de gegevens</h2>
<p>Wij implementeren passende technische en organisatorische maatregelen om uw gegevens te beschermen tegen ongeoorloofde toegang, verlies, wijziging of openbaarmaking, met name:</p>
<ul>
    <li>versleuteling van de communicatie via HTTPS (TLS);</li>
    <li>hashen van wachtwoorden met het bcrypt-algoritme;</li>
    <li>strikte toegangscontrole tot de systemen volgens het minimale rechtenbeginsel;</li>
    <li>anti-bot- en antispam-bescherming op formulieren (Cloudflare Turnstile);</li>
    <li>regelmatige back-ups uitgevoerd door onze hostingprovider gevestigd in de EER.</li>
</ul>

<h2>Artikel 10 — Doorgifte buiten de Europese Unie</h2>
<p>Uw gegevens worden <strong>hoofdzakelijk verwerkt en opgeslagen binnen de Europese Economische Ruimte (EER)</strong> (hosting, database, transactionele e-mails).</p>
<p>Bepaalde beperkte verwerkingen betrekken evenwel subverwerkers gevestigd in de <strong>Verenigde Staten</strong>:</p>
<ul>
    <li><strong>Cloudflare, Inc.</strong> voor anti-botbeveiliging op formulieren (Turnstile);</li>
    <li><strong>Google LLC</strong> voor de Gemini AI-dienst gebruikt door de chatbot, enkel indien u die gebruikt.</li>
</ul>
<p>Deze doorgiftes vinden plaats in het kader van de <strong>Modelcontractbepalingen (Standard Contractual Clauses)</strong> aangenomen door de Europese Commissie (Besluit 2021/914), die passende waarborgen vormen in de zin van artikel 46 AVG. U kunt een kopie van deze bepalingen aanvragen door ons te schrijven op <a href="mailto:info@nainnovations.be">info@nainnovations.be</a>.</p>

<h2>Artikel 11 — Wijziging van het Beleid</h2>
<p>NA Innovations BV behoudt zich het recht voor dit Beleid op elk moment te wijzigen, met name om wettelijke, technische of organisatorische ontwikkelingen weer te geven. De datum van de laatste update staat bovenaan het document. Wij nodigen u uit het regelmatig te raadplegen.</p>

<h2>Artikel 12 — Contact en klacht</h2>
<p>Voor elke vraag, uitoefening van rechten of klacht betreffende de verwerking van uw gegevens: <a href="mailto:info@nainnovations.be">info@nainnovations.be</a></p>
<p>Indien u meent dat uw rechten niet worden gerespecteerd, heeft u het recht een klacht in te dienen bij de <strong>Belgische Gegevensbeschermingsautoriteit (GBA)</strong>:</p>
<ul>
    <li>Drukpersstraat 35, 1000 Brussel</li>
    <li>E-mail: <a href="mailto:contact@apd-gba.be">contact@apd-gba.be</a></li>
    <li>Website: <a href="https://www.gegevensbeschermingsautoriteit.be" target="_blank" rel="noopener noreferrer">www.gegevensbeschermingsautoriteit.be</a></li>
</ul>
        `.trim(),
    },
};

export function getPrivacyContent(locale: string | undefined): LegalContent {
    const key = (locale === 'fr' || locale === 'en' || locale === 'nl') ? locale : 'fr';
    return privacyContent[key];
}
