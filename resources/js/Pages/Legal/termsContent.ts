// Static, multilingual Terms of Use (CGU) content for /terms.
// Scope: rules for VISITORS browsing the public landing page only.
// Does NOT cover commercial contracts (separate quotation/contract per project).

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

export const termsContent: Record<'fr' | 'en' | 'nl', LegalContent> = {
    // ────────────────────────────────────────────────────────────────────────
    // FRANÇAIS
    // ────────────────────────────────────────────────────────────────────────
    fr: {
        title: "Conditions Générales d'Utilisation",
        lastUpdate: LAST_UPDATE.fr,
        html: `
<p><strong>Dernière mise à jour :</strong> ${LAST_UPDATE.fr}</p>

<p>Les présentes Conditions Générales d'Utilisation (« CGU ») régissent l'accès et l'utilisation du site <strong>nainnovations.be</strong> (« le Site »). En accédant au Site, vous acceptez sans réserve les présentes CGU. Si vous n'êtes pas d'accord avec l'une de ces dispositions, nous vous invitons à ne pas utiliser le Site.</p>

<h2>Article 1 — Éditeur du Site</h2>
<p>Le Site est édité par <strong>NA Innovations BV</strong>, société à responsabilité limitée de droit belge, inscrite à la Banque-Carrefour des Entreprises sous le numéro <strong>1025.939.504</strong>, numéro de TVA <strong>BE 1025.939.504</strong>.</p>
<p>Contact : <a href="mailto:info@nainnovations.be">info@nainnovations.be</a></p>

<h2>Article 2 — Objet du Site</h2>
<p>Le Site est un site informationnel présentant les activités, services et réalisations de NA Innovations BV. Il met à disposition des visiteurs :</p>
<ul>
    <li>une présentation des services et produits proposés ;</li>
    <li>un formulaire de contact et un formulaire de demande de devis ;</li>
    <li>un simulateur de prix indicatif ;</li>
    <li>un portfolio et un blog d'actualités ;</li>
    <li>lorsque disponible, un assistant conversationnel (chatbot) basé sur l'intelligence artificielle, fourni à titre purement informatif.</li>
</ul>
<p>L'utilisation du Site est gratuite et ne crée aucun lien contractuel commercial entre NA Innovations BV et le visiteur. Toute mission ou prestation fait l'objet d'un contrat distinct, négocié et signé séparément.</p>

<h2>Article 3 — Caractère indicatif des informations</h2>
<p>Les contenus présents sur le Site, y compris le simulateur de prix, sont fournis à titre purement <strong>informatif et indicatif</strong>. Ils ne constituent ni une offre commerciale, ni un engagement contractuel. Toute estimation affichée est susceptible d'évoluer en fonction du périmètre exact du projet, et ne devient ferme que dans le cadre d'un devis personnalisé écrit.</p>
<p>NA Innovations BV met à jour ces contenus avec soin mais ne garantit pas leur exhaustivité, leur exactitude permanente ou leur adéquation à un besoin particulier.</p>

<h2>Article 4 — Propriété intellectuelle</h2>
<p>L'ensemble des éléments composant le Site (textes, images, logos, vidéos, code, design, marques, identité visuelle) sont la propriété exclusive de NA Innovations BV ou de ses partenaires, et sont protégés par les droits de propriété intellectuelle belges et internationaux.</p>
<p>Toute reproduction, représentation, modification, adaptation ou exploitation, totale ou partielle, par quelque procédé que ce soit, sans autorisation écrite préalable, est strictement interdite et constituerait une contrefaçon sanctionnée par le Livre XI du Code de droit économique belge.</p>

<h2>Article 5 — Comportement de l'utilisateur</h2>
<p>L'utilisateur s'engage à utiliser le Site de manière loyale et conforme à sa destination. Sont notamment interdits :</p>
<ul>
    <li>toute tentative d'accès non autorisé aux systèmes ou bases de données ;</li>
    <li>le scraping automatisé, l'extraction massive ou la copie systématique de données ;</li>
    <li>l'envoi de spam, contenus malveillants ou messages frauduleux via les formulaires ;</li>
    <li>toute action visant à perturber, ralentir ou compromettre le fonctionnement du Site ;</li>
    <li>l'usurpation d'identité ou la fourniture d'informations volontairement erronées.</li>
</ul>
<p>NA Innovations BV se réserve le droit de bloquer tout accès, sans préavis ni indemnité, en cas d'utilisation contraire aux présentes CGU.</p>

<h2>Article 6 — Liens externes</h2>
<p>Le Site peut contenir des liens hypertextes vers des sites tiers. NA Innovations BV n'exerce aucun contrôle sur ces sites externes et décline toute responsabilité quant à leur contenu, leur disponibilité ou leurs propres conditions d'utilisation.</p>

<h2>Article 7 — Disponibilité du Site</h2>
<p>Le Site est mis à disposition « <strong>en l'état</strong> » et selon sa disponibilité. NA Innovations BV ne garantit pas une disponibilité ininterrompue, l'absence d'erreurs ou de bugs, ni la compatibilité avec tous les équipements ou navigateurs. Des interruptions peuvent survenir pour des raisons de maintenance, de mise à jour ou indépendantes de notre volonté (hébergeur, force majeure, etc.).</p>

<h2>Article 8 — Protection des données personnelles</h2>
<p>Les données personnelles éventuellement collectées via le Site (notamment via le formulaire de contact, le formulaire de devis, le simulateur de prix ou le chatbot conversationnel) sont traitées conformément au Règlement général sur la protection des données (RGPD — Règlement UE 2016/679) et à la loi belge du 30 juillet 2018. Pour plus d'informations sur la nature des données collectées, leur usage, les sous-traitants concernés et vos droits, veuillez consulter notre <a href="/privacy">Politique de Confidentialité</a>.</p>

<h2>Article 9 — Cookies</h2>
<p>Le Site utilise uniquement des cookies et données de stockage local strictement nécessaires à son fonctionnement (préférence de langue, thème clair/sombre, identifiant de session, préférences d'interface, cookies techniques Cloudflare Turnstile pour la protection anti-bot des formulaires). Aucun cookie publicitaire, de mesure d'audience tiers, de réseau social ou de profilage marketing n'est déposé sur le Site. Pour plus de détails, consultez la <a href="/privacy">Politique de Confidentialité</a>.</p>

<h2>Article 10 — Modification des CGU</h2>
<p>NA Innovations BV se réserve le droit de modifier les présentes CGU à tout moment, sans préavis. La version applicable est celle en vigueur au moment de votre visite. La date de dernière mise à jour figure en haut du présent document.</p>

<h2>Article 11 — Droit applicable et juridiction</h2>
<p>Les présentes CGU sont régies par le <strong>droit belge</strong>. Tout litige relatif à l'interprétation, l'exécution ou la validité des présentes relèvera de la compétence exclusive des <strong>tribunaux de l'arrondissement judiciaire de Bruxelles</strong>.</p>
<p>Les utilisateurs consommateurs résidant dans l'Union européenne peuvent également recourir à la plateforme européenne de règlement des litiges en ligne : <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer">https://ec.europa.eu/consumers/odr</a>.</p>
        `.trim(),
    },

    // ────────────────────────────────────────────────────────────────────────
    // ENGLISH
    // ────────────────────────────────────────────────────────────────────────
    en: {
        title: 'Terms of Use',
        lastUpdate: LAST_UPDATE.en,
        html: `
<p><strong>Last updated:</strong> ${LAST_UPDATE.en}</p>

<p>These Terms of Use ("Terms") govern access to and use of the website <strong>nainnovations.be</strong> ("the Site"). By accessing the Site, you fully and unreservedly accept these Terms. If you do not agree with any of these provisions, please refrain from using the Site.</p>

<h2>Article 1 — Site publisher</h2>
<p>The Site is published by <strong>NA Innovations BV</strong>, a private limited liability company under Belgian law, registered with the Crossroads Bank for Enterprises under number <strong>1025.939.504</strong>, VAT number <strong>BE 1025.939.504</strong>.</p>
<p>Contact: <a href="mailto:info@nainnovations.be">info@nainnovations.be</a></p>

<h2>Article 2 — Purpose of the Site</h2>
<p>The Site is an informational website presenting the activities, services and projects of NA Innovations BV. It provides visitors with:</p>
<ul>
    <li>a presentation of the services and products offered;</li>
    <li>a contact form and a quotation request form;</li>
    <li>an indicative price simulator;</li>
    <li>a portfolio and a news blog;</li>
    <li>when available, an AI-powered conversational assistant (chatbot), provided strictly for informational purposes.</li>
</ul>
<p>Use of the Site is free and does not create any commercial contractual relationship between NA Innovations BV and the visitor. Any assignment or service is governed by a separate contract, negotiated and signed independently.</p>

<h2>Article 3 — Indicative nature of the information</h2>
<p>The content available on the Site, including the price simulator, is provided for purely <strong>informational and indicative</strong> purposes. It does not constitute a commercial offer or a contractual commitment. Any estimate displayed may evolve depending on the exact scope of the project, and only becomes binding within the framework of a written personalized quotation.</p>
<p>NA Innovations BV updates this content with care but does not guarantee its completeness, permanent accuracy or suitability for a particular purpose.</p>

<h2>Article 4 — Intellectual property</h2>
<p>All elements making up the Site (texts, images, logos, videos, code, design, trademarks, visual identity) are the exclusive property of NA Innovations BV or its partners, and are protected by Belgian and international intellectual property rights.</p>
<p>Any reproduction, representation, modification, adaptation or exploitation, in whole or in part, by any means whatsoever, without prior written authorization, is strictly prohibited and would constitute infringement sanctioned by Book XI of the Belgian Code of Economic Law.</p>

<h2>Article 5 — User conduct</h2>
<p>The user undertakes to use the Site fairly and in accordance with its intended purpose. The following are notably prohibited:</p>
<ul>
    <li>any attempt at unauthorized access to systems or databases;</li>
    <li>automated scraping, mass extraction or systematic copying of data;</li>
    <li>sending spam, malicious content or fraudulent messages via the forms;</li>
    <li>any action aimed at disrupting, slowing down or compromising the operation of the Site;</li>
    <li>identity theft or the provision of deliberately incorrect information.</li>
</ul>
<p>NA Innovations BV reserves the right to block any access, without notice or compensation, in the event of use contrary to these Terms.</p>

<h2>Article 6 — External links</h2>
<p>The Site may contain hypertext links to third-party sites. NA Innovations BV exercises no control over these external sites and disclaims all responsibility for their content, their availability or their own terms of use.</p>

<h2>Article 7 — Site availability</h2>
<p>The Site is provided "<strong>as is</strong>" and according to its availability. NA Innovations BV does not guarantee uninterrupted availability, the absence of errors or bugs, nor compatibility with all devices or browsers. Interruptions may occur for reasons of maintenance, updates or factors beyond our control (hosting provider, force majeure, etc.).</p>

<h2>Article 8 — Personal data protection</h2>
<p>Personal data potentially collected via the Site (notably through the contact form, quotation form, price simulator or conversational chatbot) is processed in accordance with the General Data Protection Regulation (GDPR — Regulation EU 2016/679) and the Belgian law of 30 July 2018. For more information on the nature of the data collected, its use, the sub-processors involved and your rights, please consult our <a href="/privacy">Privacy Policy</a>.</p>

<h2>Article 9 — Cookies</h2>
<p>The Site only uses cookies and local storage data strictly necessary for its operation (language preference, light/dark theme, session identifier, interface preferences, Cloudflare Turnstile technical cookies for anti-bot form protection). No advertising, third-party analytics, social network or marketing profiling cookies are placed on the Site. For more details, see the <a href="/privacy">Privacy Policy</a>.</p>

<h2>Article 10 — Modification of the Terms</h2>
<p>NA Innovations BV reserves the right to modify these Terms at any time, without notice. The applicable version is the one in force at the time of your visit. The last update date appears at the top of this document.</p>

<h2>Article 11 — Applicable law and jurisdiction</h2>
<p>These Terms are governed by <strong>Belgian law</strong>. Any dispute relating to the interpretation, performance or validity of these Terms shall fall under the exclusive jurisdiction of the <strong>courts of the judicial district of Brussels</strong>.</p>
<p>Consumer users residing in the European Union may also use the European online dispute resolution platform: <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer">https://ec.europa.eu/consumers/odr</a>.</p>
        `.trim(),
    },

    // ────────────────────────────────────────────────────────────────────────
    // NEDERLANDS
    // ────────────────────────────────────────────────────────────────────────
    nl: {
        title: 'Gebruiksvoorwaarden',
        lastUpdate: LAST_UPDATE.nl,
        html: `
<p><strong>Laatste update:</strong> ${LAST_UPDATE.nl}</p>

<p>Deze gebruiksvoorwaarden ("Voorwaarden") regelen de toegang tot en het gebruik van de website <strong>nainnovations.be</strong> ("de Site"). Door de Site te bezoeken, aanvaardt u deze Voorwaarden volledig en zonder voorbehoud. Indien u niet akkoord gaat met een van deze bepalingen, verzoeken wij u de Site niet te gebruiken.</p>

<h2>Artikel 1 — Uitgever van de Site</h2>
<p>De Site wordt uitgegeven door <strong>NA Innovations BV</strong>, besloten vennootschap naar Belgisch recht, ingeschreven bij de Kruispuntbank van Ondernemingen onder het nummer <strong>1025.939.504</strong>, btw-nummer <strong>BE 1025.939.504</strong>.</p>
<p>Contact: <a href="mailto:info@nainnovations.be">info@nainnovations.be</a></p>

<h2>Artikel 2 — Doel van de Site</h2>
<p>De Site is een informatieve website die de activiteiten, diensten en realisaties van NA Innovations BV presenteert. Hij stelt aan bezoekers ter beschikking:</p>
<ul>
    <li>een presentatie van de aangeboden diensten en producten;</li>
    <li>een contactformulier en een offerteaanvraagformulier;</li>
    <li>een indicatieve prijssimulator;</li>
    <li>een portfolio en een nieuwsblog;</li>
    <li>indien beschikbaar, een AI-gebaseerde conversationele assistent (chatbot), louter ter informatie verstrekt.</li>
</ul>
<p>Het gebruik van de Site is gratis en creëert geen enkele commerciële contractuele band tussen NA Innovations BV en de bezoeker. Elke opdracht of dienst wordt geregeld door een afzonderlijk contract, dat afzonderlijk wordt onderhandeld en ondertekend.</p>

<h2>Artikel 3 — Indicatief karakter van de informatie</h2>
<p>De inhoud op de Site, met inbegrip van de prijssimulator, wordt louter <strong>ter informatie en indicatief</strong> verstrekt. Het vormt geen commercieel aanbod en geen contractuele verbintenis. Elke weergegeven raming kan evolueren naargelang de exacte omvang van het project en wordt enkel bindend in het kader van een schriftelijke gepersonaliseerde offerte.</p>
<p>NA Innovations BV werkt deze inhoud zorgvuldig bij maar garandeert niet de volledigheid, de permanente juistheid of de geschiktheid voor een bepaald doel.</p>

<h2>Artikel 4 — Intellectuele eigendom</h2>
<p>Alle elementen waaruit de Site is samengesteld (teksten, beelden, logo's, video's, code, ontwerp, merken, visuele identiteit) zijn de exclusieve eigendom van NA Innovations BV of haar partners, en zijn beschermd door de Belgische en internationale intellectuele eigendomsrechten.</p>
<p>Elke reproductie, weergave, wijziging, aanpassing of exploitatie, geheel of gedeeltelijk, op welke wijze dan ook, zonder voorafgaande schriftelijke toestemming, is strikt verboden en zou een inbreuk vormen die wordt bestraft door Boek XI van het Belgische Wetboek van economisch recht.</p>

<h2>Artikel 5 — Gedrag van de gebruiker</h2>
<p>De gebruiker verbindt zich ertoe de Site loyaal en overeenkomstig zijn bestemming te gebruiken. Met name zijn verboden:</p>
<ul>
    <li>elke poging tot ongeoorloofde toegang tot de systemen of databanken;</li>
    <li>geautomatiseerde scraping, massale extractie of systematische kopie van gegevens;</li>
    <li>het verzenden van spam, kwaadaardige inhoud of frauduleuze berichten via de formulieren;</li>
    <li>elke handeling die de werking van de Site verstoort, vertraagt of in gevaar brengt;</li>
    <li>identiteitsdiefstal of het verstrekken van opzettelijk onjuiste informatie.</li>
</ul>
<p>NA Innovations BV behoudt zich het recht voor om elke toegang te blokkeren, zonder voorafgaande kennisgeving of vergoeding, in geval van gebruik in strijd met deze Voorwaarden.</p>

<h2>Artikel 6 — Externe links</h2>
<p>De Site kan hyperlinks naar sites van derden bevatten. NA Innovations BV oefent geen controle uit op deze externe sites en wijst elke verantwoordelijkheid af voor hun inhoud, hun beschikbaarheid of hun eigen gebruiksvoorwaarden.</p>

<h2>Artikel 7 — Beschikbaarheid van de Site</h2>
<p>De Site wordt aangeboden "<strong>as is</strong>" en volgens zijn beschikbaarheid. NA Innovations BV garandeert geen ononderbroken beschikbaarheid, geen afwezigheid van fouten of bugs, noch compatibiliteit met alle apparaten of browsers. Onderbrekingen kunnen optreden om redenen van onderhoud, updates of factoren buiten onze wil (hostingprovider, overmacht, enz.).</p>

<h2>Artikel 8 — Bescherming van persoonsgegevens</h2>
<p>Persoonsgegevens die eventueel via de Site worden verzameld (met name via het contactformulier, het offerteformulier, de prijssimulator of de conversationele chatbot) worden verwerkt overeenkomstig de Algemene Verordening Gegevensbescherming (AVG — Verordening EU 2016/679) en de Belgische wet van 30 juli 2018. Voor meer informatie over de aard van de verzamelde gegevens, hun gebruik, de betrokken subverwerkers en uw rechten, raadpleeg ons <a href="/privacy">Privacybeleid</a>.</p>

<h2>Artikel 9 — Cookies</h2>
<p>De Site gebruikt uitsluitend cookies en lokale opslaggegevens die strikt noodzakelijk zijn voor zijn werking (taalvoorkeur, licht/donker thema, sessie-identificator, interfacevoorkeuren, technische cookies van Cloudflare Turnstile voor anti-botbescherming van formulieren). Er worden geen cookies voor reclame, analyses van derden, sociale netwerken of marketingprofilering op de Site geplaatst. Raadpleeg het <a href="/privacy">Privacybeleid</a> voor meer details.</p>

<h2>Artikel 10 — Wijziging van de Voorwaarden</h2>
<p>NA Innovations BV behoudt zich het recht voor deze Voorwaarden op elk moment te wijzigen, zonder voorafgaande kennisgeving. De toepasselijke versie is die welke van kracht is op het moment van uw bezoek. De datum van de laatste update staat bovenaan dit document.</p>

<h2>Artikel 11 — Toepasselijk recht en bevoegdheid</h2>
<p>Deze Voorwaarden worden beheerst door het <strong>Belgisch recht</strong>. Elk geschil met betrekking tot de interpretatie, uitvoering of geldigheid van deze Voorwaarden valt onder de uitsluitende bevoegdheid van de <strong>rechtbanken van het gerechtelijk arrondissement Brussel</strong>.</p>
<p>Consumenten die in de Europese Unie wonen, kunnen ook gebruikmaken van het Europese platform voor onlinegeschillenbeslechting: <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer">https://ec.europa.eu/consumers/odr</a>.</p>
        `.trim(),
    },
};

export function getTermsContent(locale: string | undefined): LegalContent {
    const key = (locale === 'fr' || locale === 'en' || locale === 'nl') ? locale : 'fr';
    return termsContent[key];
}
