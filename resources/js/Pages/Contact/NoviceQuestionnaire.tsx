import { useMemo, useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

export interface NoviceAnswers {
    [questionId: string]: 'yes' | 'no';
}

export interface NoviceEffects {
    features: Set<string>;
    design: string | null;
    maintenance: string | null;
    timeline: string | null;
}

interface QuestionEffect {
    features?: string[];
    setDesign?: string;
    setMaintenance?: string;
    setTimeline?: string;
}

interface Question {
    id: string;
    text: string;
    hint?: string;
    onYes?: QuestionEffect;
    onNo?: QuestionEffect;
}

// ─── Per-type question sets ─────────────────────────────────────

const staticSiteQuestions: Question[] = [
    { id: 'ss_goal_conversion', text: 'Votre page a-t-elle pour objectif principal de convertir des visiteurs (inscriptions, demandes de devis, téléchargements) ?', hint: 'Si oui, on renforcera les boutons d\'action et les formulaires.', onYes: { features: ['newsletter'] } },
    { id: 'ss_countdown', text: 'Avez-vous une offre limitée dans le temps (promo, lancement) qui nécessite un compte à rebours ?', onYes: { features: ['countdown_timer'] } },
    { id: 'ss_video_hero', text: 'Voulez-vous une vidéo en fond d\'écran d\'accueil pour capter immédiatement l\'attention ?', onYes: { features: ['video_hero'] } },
    { id: 'ss_testimonials', text: 'Voulez-vous afficher des témoignages clients pour rassurer vos visiteurs ?', onYes: { features: ['testimonials_block'] } },
    { id: 'ss_partners', text: 'Avez-vous des logos de partenaires ou de clients prestigieux à afficher pour renforcer votre crédibilité ?', onYes: { features: ['partners_logos'] } },
    { id: 'ss_map', text: 'Avez-vous une adresse physique à afficher sur une carte interactive ?', onYes: { features: ['google_maps', 'opening_hours'] } },
    { id: 'ss_faq', text: 'Voulez-vous une section FAQ pour répondre aux questions fréquentes de vos prospects ?', onYes: { features: ['faq_section'] } },
    { id: 'ss_whatsapp', text: 'Voulez-vous un bouton WhatsApp ou click-to-call pour contact immédiat depuis mobile ?', onYes: { features: ['whatsapp_cta'] } },
    { id: 'ss_pixel', text: 'Faites-vous de la publicité Facebook Ads ou Google Ads (suivi de conversions, retargeting) ?', onYes: { features: ['pixel_tracking'] } },
    { id: 'ss_social', text: 'Voulez-vous afficher vos réseaux sociaux (liens, icônes, feed Instagram) ?', onYes: { features: ['social_media'] } },
    { id: 'ss_animations', text: 'Voulez-vous des animations élégantes au défilement pour rendre la page vivante ?', onYes: { features: ['animations'] } },
    { id: 'ss_newsletter', text: 'Voulez-vous collecter les emails de vos visiteurs pour une future newsletter ?', onYes: { features: ['newsletter'] } },
    { id: 'ss_seo', text: 'Votre page doit-elle apparaître en haut des résultats Google pour des recherches précises ?', onYes: { features: ['seo'] } },
    { id: 'ss_analytics', text: 'Voulez-vous mesurer combien de visiteurs consultent votre page et ce qu\'ils font dessus ?', onYes: { features: ['analytics'] } },
    { id: 'ss_multilang', text: 'Votre audience est-elle internationale ? (plusieurs langues nécessaires)', onYes: { features: ['multilingual'] } },
];

const showcaseSiteQuestions: Question[] = [
    { id: 'sw_team', text: 'Voulez-vous une page "Équipe" présentant vos collaborateurs avec photos et biographies ?', onYes: { features: ['team_page'] } },
    { id: 'sw_services', text: 'Voulez-vous une page dédiée détaillant chacun de vos services ?', onYes: { features: ['services_page'] } },
    { id: 'sw_pricing', text: 'Voulez-vous afficher vos tarifs publiquement (grille de prix, formules) ?', hint: 'Certaines activités préfèrent ne pas afficher les prix publiquement.', onYes: { features: ['pricing_page'] } },
    { id: 'sw_testimonials', text: 'Voulez-vous un carrousel de témoignages clients avec photos et citations ?', onYes: { features: ['testimonials_block'] } },
    { id: 'sw_partners', text: 'Voulez-vous afficher les logos de partenaires, clients ou certifications pour votre crédibilité ?', onYes: { features: ['partners_logos', 'certifications'] } },
    { id: 'sw_map', text: 'Avez-vous un local physique à localiser sur une carte Google Maps ?', onYes: { features: ['google_maps'] } },
    { id: 'sw_hours', text: 'Avez-vous des horaires d\'ouverture à afficher (statut ouvert/fermé automatique) ?', onYes: { features: ['opening_hours'] } },
    { id: 'sw_blog', text: 'Voulez-vous publier régulièrement des articles ou actualités pour votre référencement ?', onYes: { features: ['blog_section'] } },
    { id: 'sw_portfolio', text: 'Voulez-vous afficher un portfolio visuel ou une galerie de vos réalisations ?', onYes: { features: ['gallery'] } },
    { id: 'sw_booking', text: 'Vos clients doivent-ils pouvoir prendre rendez-vous directement en ligne via un calendrier ?', onYes: { features: ['booking'] } },
    { id: 'sw_live_chat', text: 'Voulez-vous un chat en direct pour répondre aux visiteurs pendant vos heures d\'ouverture ?', onYes: { features: ['live_chat'] } },
    { id: 'sw_whatsapp', text: 'Voulez-vous un bouton WhatsApp pour contact immédiat depuis mobile ?', onYes: { features: ['whatsapp_cta'] } },
    { id: 'sw_newsletter', text: 'Voulez-vous collecter des emails pour envoyer une newsletter à vos clients ?', onYes: { features: ['newsletter'] } },
    { id: 'sw_social', text: 'Voulez-vous intégrer vos réseaux sociaux (feed Instagram, liens Facebook, etc.) ?', onYes: { features: ['social_media'] } },
    { id: 'sw_video', text: 'Voulez-vous intégrer des vidéos (présentation, témoignages vidéo, visite de vos locaux) ?', onYes: { features: ['video_bg'] } },
    { id: 'sw_animations', text: 'Voulez-vous des animations élégantes pour un rendu premium ?', onYes: { features: ['animations'] } },
    { id: 'sw_seo', text: 'Voulez-vous apparaître en premier sur Google quand des clients cherchent vos services localement ?', onYes: { features: ['seo'] } },
    { id: 'sw_analytics', text: 'Voulez-vous voir combien de visiteurs consultent votre site et quelles pages les intéressent ?', onYes: { features: ['analytics'] } },
    { id: 'sw_multilang', text: 'Votre clientèle est-elle multilingue ? (FR/NL/EN pour la Belgique par exemple)', onYes: { features: ['multilingual'] } },
    { id: 'sw_gdpr', text: 'Allez-vous collecter des données personnelles (formulaire de contact, newsletter) ?', hint: 'Obligatoire en Europe (RGPD).', onYes: { features: ['gdpr'] } },
];

const blogPortfolioQuestions: Question[] = [
    { id: 'bp_search', text: 'Vos lecteurs doivent-ils pouvoir rechercher un article précis via un moteur de recherche ?', onYes: { features: ['search'] } },
    { id: 'bp_tags', text: 'Voulez-vous organiser votre contenu par catégories et tags (mode, voyage, tech, etc.) ?', onYes: { features: ['tags_categories'] } },
    { id: 'bp_comments', text: 'Vos lecteurs doivent-ils pouvoir commenter les articles (avec modération) ?', onYes: { features: ['comments'] } },
    { id: 'bp_authors', text: 'Avez-vous plusieurs auteurs contribuant au blog (pages auteur avec bio) ?', onYes: { features: ['author_profiles'] } },
    { id: 'bp_related', text: 'Voulez-vous afficher des articles similaires en bas de page pour garder vos lecteurs plus longtemps ?', onYes: { features: ['related_posts'] } },
    { id: 'bp_reading', text: 'Voulez-vous afficher le temps de lecture estimé pour chaque article (ex : "5 min de lecture") ?', onYes: { features: ['reading_time'] } },
    { id: 'bp_rss', text: 'Voulez-vous un flux RSS pour que vos lecteurs suivent votre blog depuis leur app préférée ?', onYes: { features: ['rss_feed'] } },
    { id: 'bp_scheduled', text: 'Voulez-vous programmer la publication de vos articles à l\'avance (calendrier éditorial) ?', onYes: { features: ['scheduled_pub'] } },
    { id: 'bp_gallery', text: 'Voulez-vous une section galerie/portfolio visuel pour exposer des photos ou réalisations ?', onYes: { features: ['gallery'] } },
    { id: 'bp_social', text: 'Voulez-vous permettre le partage des articles sur les réseaux sociaux en un clic ?', onYes: { features: ['social_media'] } },
    { id: 'bp_newsletter', text: 'Voulez-vous envoyer une newsletter régulière avec vos derniers articles ?', onYes: { features: ['newsletter'] } },
    { id: 'bp_migration', text: 'Avez-vous déjà un blog existant (WordPress, Medium, etc.) dont il faut importer les articles ?', onYes: { features: ['migration'] } },
    { id: 'bp_animations', text: 'Voulez-vous des animations élégantes à la lecture (transitions, apparitions au défilement) ?', onYes: { features: ['animations'] } },
    { id: 'bp_video', text: 'Publierez-vous des contenus vidéo intégrés aux articles ?', onYes: { features: ['video_bg'] } },
    { id: 'bp_seo', text: 'Votre SEO est-il critique ? (Google Search comme source principale de trafic)', onYes: { features: ['seo'] } },
    { id: 'bp_analytics', text: 'Voulez-vous savoir quels articles fonctionnent le mieux, combien de temps les lecteurs restent ?', onYes: { features: ['analytics'] } },
    { id: 'bp_multilang', text: 'Votre blog sera-t-il publié dans plusieurs langues ?', onYes: { features: ['multilingual'] } },
];

const ecommerceQuestions: Question[] = [
    { id: 'ec_payment', text: 'Voulez-vous accepter les paiements par carte bancaire (Visa, Mastercard via Stripe ou Mollie) ?', onYes: { features: ['payment'] } },
    { id: 'ec_local_payment', text: 'Vos clients sont-ils principalement en Belgique/Pays-Bas ? (Bancontact, iDeal, KBC)', onYes: { features: ['local_payment'] } },
    { id: 'ec_catalog_500', text: 'Votre catalogue contiendra-t-il plus de 50 produits ?', onYes: { features: ['catalog_500'] } },
    { id: 'ec_catalog_large', text: 'Votre catalogue dépassera-t-il 500 produits ? (optimisation performance requise)', onYes: { features: ['catalog_plus'] } },
    { id: 'ec_variants', text: 'Vos produits ont-ils des variantes (tailles, couleurs, modèles) à gérer individuellement ?', onYes: { features: ['product_variants'] } },
    { id: 'ec_inventory', text: 'Voulez-vous suivre votre stock en temps réel et être alerté quand un produit est presque épuisé ?', onYes: { features: ['inventory'] } },
    { id: 'ec_shipping', text: 'Vendez-vous des produits physiques à livrer (calcul automatique des frais selon poids/destination) ?', onYes: { features: ['shipping'] } },
    { id: 'ec_discounts', text: 'Voulez-vous proposer des codes promo, soldes ou réductions automatiques ?', onYes: { features: ['discounts'] } },
    { id: 'ec_gift_cards', text: 'Voulez-vous vendre des cartes cadeaux (pour offrir un montant à dépenser en boutique) ?', onYes: { features: ['gift_cards'] } },
    { id: 'ec_reviews', text: 'Vos clients doivent-ils pouvoir laisser des avis et des notes sur vos produits ?', onYes: { features: ['product_reviews'] } },
    { id: 'ec_wishlist', text: 'Vos clients doivent-ils pouvoir créer une liste de souhaits pour revenir acheter plus tard ?', onYes: { features: ['wishlist'] } },
    { id: 'ec_abandoned_cart', text: 'Voulez-vous récupérer les paniers abandonnés avec des emails automatiques de relance ?', onYes: { features: ['abandoned_cart'] } },
    { id: 'ec_vat', text: 'Vendez-vous à l\'étranger ? (gestion automatique de la TVA selon les pays, B2B/B2C)', onYes: { features: ['vat_mgmt'] } },
    { id: 'ec_multi_currency', text: 'Vos clients paient-ils dans plusieurs devises (EUR, USD, GBP) ?', onYes: { features: ['multi_currency'] } },
    { id: 'ec_accounts', text: 'Vos clients doivent-ils créer un compte pour passer commande et voir leur historique ?', onYes: { features: ['customer_accounts'] } },
    { id: 'ec_emails', text: 'Voulez-vous des emails automatiques (confirmation de commande, expédition, suivi de livraison) ?', onYes: { features: ['automated_emails_shop'] } },
    { id: 'ec_newsletter', text: 'Voulez-vous collecter des emails pour des campagnes marketing (nouveaux produits, promos) ?', onYes: { features: ['newsletter'] } },
    { id: 'ec_pixel', text: 'Faites-vous de la publicité sur Facebook/Instagram/Google pour vendre (retargeting des paniers abandonnés) ?', onYes: { features: ['pixel_tracking'] } },
    { id: 'ec_booking', text: 'Vos produits nécessitent-ils une réservation/créneau (cours, événements, services) plutôt qu\'une vente simple ?', onYes: { features: ['booking'] } },
    { id: 'ec_animations', text: 'Voulez-vous des animations premium pour les fiches produits (galerie zoomable, transitions) ?', onYes: { features: ['animations'] } },
    { id: 'ec_seo', text: 'Votre SEO est-il critique ? (fiches produits doivent apparaître en haut de Google)', onYes: { features: ['seo'] } },
    { id: 'ec_analytics', text: 'Voulez-vous suivre vos ventes, vos taux de conversion et le comportement de vos acheteurs ?', onYes: { features: ['analytics'] } },
    { id: 'ec_gdpr', text: 'Vous collectez forcément des données personnelles : voulez-vous la conformité RGPD complète ?', onYes: { features: ['gdpr'] } },
    { id: 'ec_multilang', text: 'Vendez-vous dans plusieurs langues/pays ?', onYes: { features: ['multilingual'] } },
];

const cmsQuestions: Question[] = [
    { id: 'cms_types', text: 'Avez-vous plusieurs types de contenus distincts à gérer (articles + événements + produits + projets) ?', onYes: { features: ['content_types'] } },
    { id: 'cms_media', text: 'Voulez-vous une bibliothèque centralisée pour organiser toutes vos images, vidéos et documents ?', onYes: { features: ['media_library'] } },
    { id: 'cms_scheduled', text: 'Voulez-vous programmer la publication de contenus à l\'avance (calendrier éditorial) ?', onYes: { features: ['scheduled_pub_cms'] } },
    { id: 'cms_versioning', text: 'Voulez-vous conserver l\'historique des modifications avec possibilité de revenir à une version précédente ?', onYes: { features: ['versioning'] } },
    { id: 'cms_workflow', text: 'Avez-vous besoin d\'un workflow d\'approbation ? (rédacteur rédige → éditeur valide → admin publie)', onYes: { features: ['workflow'] } },
    { id: 'cms_custom_fields', text: 'Avez-vous des champs spécifiques à votre métier (prix, date, lieu, catégorie personnalisée) ?', onYes: { features: ['custom_fields'] } },
    { id: 'cms_preview', text: 'Vos éditeurs doivent-ils pouvoir prévisualiser le rendu avant de publier ?', onYes: { features: ['preview_mode'] } },
    { id: 'cms_bulk', text: 'Voulez-vous pouvoir modifier/supprimer plusieurs contenus en une seule action (édition en masse) ?', onYes: { features: ['bulk_editing'] } },
    { id: 'cms_roles', text: 'Plusieurs utilisateurs vont-ils gérer le CMS avec des rôles différents (admin, éditeur, rédacteur) ?', onYes: { features: ['auth_roles'] } },
    { id: 'cms_search', text: 'Vos visiteurs doivent-ils pouvoir rechercher dans tout le contenu via un moteur de recherche ?', onYes: { features: ['search'] } },
    { id: 'cms_blog', text: 'Votre site aura-t-il une section blog/actualités ?', onYes: { features: ['blog_section'] } },
    { id: 'cms_gallery', text: 'Voulez-vous une galerie photo ou portfolio ?', onYes: { features: ['gallery'] } },
    { id: 'cms_newsletter', text: 'Voulez-vous collecter des emails pour une newsletter ?', onYes: { features: ['newsletter'] } },
    { id: 'cms_seo', text: 'Votre SEO est-il critique ? (le CMS doit produire des URLs optimisées, sitemaps, meta tags)', onYes: { features: ['seo'] } },
    { id: 'cms_analytics', text: 'Voulez-vous analyser quels contenus performent le mieux ?', onYes: { features: ['analytics'] } },
    { id: 'cms_multilang', text: 'Votre CMS doit-il gérer plusieurs langues avec traductions ?', onYes: { features: ['multilingual'] } },
    { id: 'cms_migration', text: 'Avez-vous un CMS existant (WordPress, Drupal) dont il faut migrer le contenu ?', onYes: { features: ['migration'] } },
];

const saasQuestions: Question[] = [
    { id: 'saas_permissions', text: 'Votre plateforme aura-t-elle plusieurs rôles avec des permissions fines (qui voit quoi, qui peut faire quoi) ?', onYes: { features: ['permissions_matrix'] } },
    { id: 'saas_onboarding', text: 'Voulez-vous un onboarding pas à pas pour guider les nouveaux utilisateurs (tour interactif) ?', onYes: { features: ['onboarding'] } },
    { id: 'saas_team', text: 'Vos clients travaillent-ils en équipe (inviter des collègues, gérer leur organisation) ?', onYes: { features: ['team_mgmt'] } },
    { id: 'saas_multi_tenant', text: 'Chaque client aura-t-il son propre espace complètement isolé (ses propres données, utilisateurs) ?', hint: 'Essentiel pour un vrai SaaS vendu à plusieurs entreprises.', onYes: { features: ['multi_tenancy'] } },
    { id: 'saas_white_label', text: 'Voulez-vous proposer votre plateforme en marque blanche (chaque client voit son propre logo et ses couleurs) ?', onYes: { features: ['white_label'] } },
    { id: 'saas_subscription', text: 'Votre plateforme sera-t-elle basée sur un abonnement mensuel ou annuel (avec facturation automatique) ?', onYes: { features: ['subscription_billing'] } },
    { id: 'saas_realtime', text: 'Vos utilisateurs doivent-ils recevoir des notifications en temps réel sans rafraîchir la page ?', onYes: { features: ['realtime_notif'] } },
    { id: 'saas_emails', text: 'La plateforme doit-elle envoyer des emails automatiques (bienvenue, factures, rappels, alertes) ?', onYes: { features: ['automated_emails'] } },
    { id: 'saas_file_upload', text: 'Vos utilisateurs doivent-ils pouvoir téléverser des fichiers (documents, images, PDF) ?', onYes: { features: ['file_upload'] } },
    { id: 'saas_webhooks', text: 'Voulez-vous envoyer des webhooks à des outils externes comme Zapier, Make ou n8n ?', hint: 'Utile pour connecter votre plateforme à des milliers d\'autres apps.', onYes: { features: ['webhooks'] } },
    { id: 'saas_api', text: 'Voulez-vous exposer une API publique pour que vos clients intègrent la plateforme à leurs propres outils ?', onYes: { features: ['public_api'] } },
    { id: 'saas_integrations', text: 'Voulez-vous intégrer des services externes (Stripe, Google Maps, SendGrid, Slack, etc.) ?', onYes: { features: ['api_integration'] } },
    { id: 'saas_reports', text: 'Voulez-vous des rapports personnalisables avec graphiques, KPIs et exports ?', onYes: { features: ['custom_reports'] } },
    { id: 'saas_data_export', text: 'Vos utilisateurs doivent-ils pouvoir exporter toutes leurs données (CSV, Excel, PDF) ?', onYes: { features: ['data_export'] } },
    { id: 'saas_data_import', text: 'Vos clients ont-ils déjà des données (Excel, CSV, autre outil) à importer au démarrage ?', onYes: { features: ['data_import'] } },
    { id: 'saas_audit', text: 'Avez-vous besoin d\'un journal d\'audit traçant toutes les actions (pour conformité ou sécurité) ?', onYes: { features: ['audit_logs'] } },
    { id: 'saas_2fa', text: 'Voulez-vous une authentification à deux facteurs (code Google Authenticator/SMS) pour sécuriser les comptes ?', onYes: { features: ['2fa'] } },
    { id: 'saas_social_login', text: 'Vos utilisateurs préfèrent-ils se connecter avec Google, Microsoft ou Apple (pas de mot de passe) ?', onYes: { features: ['social_login_saas'] } },
    { id: 'saas_gdpr', text: 'Votre plateforme doit-elle être conforme RGPD (droit à l\'oubli, export de données personnelles, consentement) ?', onYes: { features: ['gdpr'] } },
    { id: 'saas_analytics', text: 'Voulez-vous des analytics intégrés pour suivre l\'utilisation de votre propre plateforme ?', onYes: { features: ['analytics'] } },
    { id: 'saas_multilang', text: 'Votre plateforme sera-t-elle utilisée par des clients dans plusieurs langues ?', onYes: { features: ['multilingual'] } },
];

const mobileAppQuestions: Question[] = [
    { id: 'ma_cross', text: 'Votre app doit-elle être disponible sur iPhone ET Android ?', hint: 'Sinon on se limite à une seule plateforme, ce qui réduit les coûts de moitié.', onYes: { features: ['cross_platform'] }, onNo: { features: ['ios_only'] } },
    { id: 'ma_push', text: 'Voulez-vous envoyer des notifications push sur les téléphones de vos utilisateurs ?', onYes: { features: ['push_notif'] } },
    { id: 'ma_biometric', text: 'Voulez-vous permettre la connexion via Face ID ou empreinte digitale (plus sécurisé et rapide) ?', onYes: { features: ['biometric'] } },
    { id: 'ma_social_login', text: 'Vos utilisateurs doivent-ils pouvoir se connecter avec Google, Apple ou Facebook (pas de mot de passe à retenir) ?', onYes: { features: ['social_login'] } },
    { id: 'ma_in_app_pay', text: 'Les utilisateurs achèteront-ils des produits, contenus ou abonnements directement dans l\'app ?', hint: 'Apple et Google prennent 30% de commission sur ces achats.', onYes: { features: ['in_app_pay'] } },
    { id: 'ma_offline', text: 'L\'app doit-elle fonctionner même sans connexion Internet (avec synchronisation ensuite) ?', onYes: { features: ['offline'] } },
    { id: 'ma_camera', text: 'L\'app doit-elle utiliser la caméra pour prendre des photos ou scanner ?', onYes: { features: ['camera_gps'] } },
    { id: 'ma_qr', text: 'Voulez-vous un scanner de QR code ou codes-barres intégré (tickets, coupons, produits) ?', onYes: { features: ['qr_scanner'] } },
    { id: 'ma_gps', text: 'L\'app doit-elle utiliser la position GPS (carte, géolocalisation, trajets) ?', onYes: { features: ['camera_gps'] } },
    { id: 'ma_chat', text: 'Avez-vous besoin d\'un chat entre utilisateurs dans l\'app (messagerie, support) ?', onYes: { features: ['in_app_chat'] } },
    { id: 'ma_deep_link', text: 'Voulez-vous pouvoir envoyer un lien (dans un email ou SMS) qui ouvre l\'app directement sur la bonne page ?', onYes: { features: ['deep_linking'] } },
    { id: 'ma_crash', text: 'Voulez-vous un suivi automatique des crashes pour corriger les bugs avant que les utilisateurs se plaignent ?', onYes: { features: ['crash_reporting'] } },
    { id: 'ma_store', text: 'Voulez-vous que nous nous occupions de la publication sur App Store et Google Play (screenshots, description, validation) ?', onYes: { features: ['store_submit'] } },
    { id: 'ma_file_upload', text: 'Vos utilisateurs doivent-ils téléverser des photos ou documents depuis l\'app ?', onYes: { features: ['file_upload'] } },
    { id: 'ma_api', text: 'L\'app doit-elle se connecter à des services externes (paiement, maps, analytics) ?', onYes: { features: ['api_integration'] } },
    { id: 'ma_realtime', text: 'Les utilisateurs doivent-ils recevoir des données en temps réel (scores sportifs, bourse, livraison en cours) ?', onYes: { features: ['realtime_notif'] } },
    { id: 'ma_analytics', text: 'Voulez-vous suivre comment vos utilisateurs utilisent l\'app (écrans visités, boutons cliqués) ?', onYes: { features: ['analytics'] } },
    { id: 'ma_multilang', text: 'Votre app sera-t-elle disponible en plusieurs langues ?', onYes: { features: ['multilingual'] } },
    { id: 'ma_gdpr', text: 'Votre app collecte-t-elle des données personnelles (RGPD obligatoire) ?', onYes: { features: ['gdpr'] } },
];

const desktopAppQuestions: Question[] = [
    { id: 'da_cross', text: 'Votre app doit-elle fonctionner sur Windows ET macOS ?', hint: 'Sinon on se concentre sur une seule plateforme.', onYes: { features: ['desktop_cross'] }, onNo: { features: ['windows_only'] } },
    { id: 'da_offline', text: 'L\'app doit-elle fonctionner complètement hors ligne (sans internet requis) ?', onYes: { features: ['offline_desktop', 'local_db'] } },
    { id: 'da_local_db', text: 'Vos utilisateurs stockent-ils des données importantes localement (documents, projets, paramètres) ?', onYes: { features: ['local_db'] } },
    { id: 'da_sync', text: 'Vos utilisateurs doivent-ils pouvoir synchroniser leurs données entre plusieurs ordinateurs via le cloud ?', onYes: { features: ['file_sync'] } },
    { id: 'da_auto_update', text: 'Voulez-vous que l\'app se mette à jour automatiquement en arrière-plan ?', onYes: { features: ['auto_update'] } },
    { id: 'da_tray', text: 'Voulez-vous que l\'app reste accessible depuis la barre système/menu bar (comme Spotify, Slack) ?', onYes: { features: ['system_tray'] } },
    { id: 'da_notifications', text: 'L\'app doit-elle envoyer des notifications natives du système (popup Windows, Notification Center macOS) ?', onYes: { features: ['notifications_desktop'] } },
    { id: 'da_printer', text: 'L\'app doit-elle imprimer des documents ou exporter en PDF ?', onYes: { features: ['printer'] } },
    { id: 'da_shortcuts', text: 'Voulez-vous des raccourcis clavier personnalisables pour les utilisateurs avancés ?', onYes: { features: ['shortcuts'] } },
    { id: 'da_license', text: 'Vendez-vous votre app avec un système de licences (clés d\'activation, abonnements) ?', onYes: { features: ['license_system'] } },
    { id: 'da_roles', text: 'Plusieurs utilisateurs auront-ils des rôles différents dans l\'app ?', onYes: { features: ['auth_roles'] } },
    { id: 'da_api', text: 'L\'app doit-elle communiquer avec un serveur ou des API externes (cloud, paiement) ?', onYes: { features: ['api_integration'] } },
    { id: 'da_file_upload', text: 'Vos utilisateurs doivent-ils importer/exporter des fichiers (Excel, images, documents) ?', onYes: { features: ['file_upload'] } },
    { id: 'da_analytics', text: 'Voulez-vous des analytics anonymes pour comprendre comment vos utilisateurs se servent de l\'app ?', onYes: { features: ['analytics'] } },
    { id: 'da_multilang', text: 'Votre app sera-t-elle disponible dans plusieurs langues ?', onYes: { features: ['multilingual'] } },
];

const apiBackendQuestions: Question[] = [
    { id: 'api_graphql', text: 'Voulez-vous une API GraphQL en plus de (ou à la place de) REST ?', hint: 'GraphQL permet aux clients de demander exactement les données dont ils ont besoin.', onYes: { features: ['graphql'] } },
    { id: 'api_realtime', text: 'Avez-vous besoin de communication temps réel (WebSockets) pour du chat, des dashboards live ou des notifications ?', onYes: { features: ['websockets'] } },
    { id: 'api_webhooks', text: 'Votre API doit-elle notifier des systèmes externes en temps réel via webhooks ?', onYes: { features: ['webhooks_api'] } },
    { id: 'api_oauth', text: 'Votre API sera-t-elle accessible à des apps tierces via OAuth 2.0 ? (comme "Se connecter avec...")', onYes: { features: ['oauth'] } },
    { id: 'api_jwt', text: 'Voulez-vous une authentification stateless par tokens JWT pour vos propres clients ?', onYes: { features: ['jwt_auth'] } },
    { id: 'api_rate_limit', text: 'Voulez-vous limiter le nombre de requêtes par client pour éviter les abus (rate limiting) ?', onYes: { features: ['rate_limiting'] } },
    { id: 'api_docs', text: 'Voulez-vous une documentation interactive type Swagger/Postman pour vos développeurs utilisateurs ?', onYes: { features: ['api_docs'] } },
    { id: 'api_caching', text: 'Votre API doit-elle servir énormément de requêtes ? (cache Redis pour des performances optimales)', onYes: { features: ['caching'] } },
    { id: 'api_queue', text: 'Avez-vous des traitements longs à exécuter en arrière-plan (envoi d\'emails en masse, génération de PDF, imports) ?', onYes: { features: ['queue_system'] } },
    { id: 'api_cron', text: 'Avez-vous besoin de tâches planifiées récurrentes (rapports quotidiens, nettoyage, rappels) ?', onYes: { features: ['cron_jobs'] } },
    { id: 'api_monitoring', text: 'Voulez-vous un monitoring 24/7 avec alertes automatiques en cas de panne ou de ralentissement ?', onYes: { features: ['monitoring'] } },
    { id: 'api_versioning', text: 'Votre API aura-t-elle plusieurs versions cohabitant (v1, v2) pour ne pas casser les clients existants ?', onYes: { features: ['api_versioning'] } },
    { id: 'api_audit', text: 'Voulez-vous un journal détaillé de toutes les requêtes API (compliance, débogage, facturation à l\'usage) ?', onYes: { features: ['audit_logs_api'] } },
    { id: 'api_files', text: 'Votre API doit-elle gérer l\'upload et le stockage de fichiers (images, documents) ?', onYes: { features: ['file_upload_api'] } },
    { id: 'api_encryption', text: 'Votre API manipule-t-elle des données sensibles nécessitant un chiffrement (santé, finance, données personnelles) ?', onYes: { features: ['encryption'] } },
    { id: 'api_integrations', text: 'Votre backend doit-il s\'intégrer à des services externes (Stripe, SendGrid, Twilio, Google Cloud) ?', onYes: { features: ['api_integration'] } },
];

// ─── Universal closing questions (always asked at the end) ──────

const domainHostingQuestions: Question[] = [
    { id: 'u_domain', text: 'Avez-vous déjà un nom de domaine (ex : monentreprise.be) ?', hint: 'Si non, nous l\'achetons et le configurons pour vous.', onNo: { features: ['domain_ssl'] } },
    { id: 'u_hosting', text: 'Avez-vous déjà un hébergeur web (serveur, OVH, AWS, etc.) ?', hint: 'Si non, nous nous occupons de tout mettre en place.', onNo: { features: ['hosting'] } },
];

const brandingQuestions: Question[] = [
    { id: 'u_branding', text: 'Avez-vous déjà un logo et une identité visuelle bien définis (couleurs, polices) ?', hint: 'Si non, nous créons tout votre univers graphique depuis zéro.', onNo: { setDesign: 'branding' } },
    { id: 'u_mockups', text: 'Avez-vous déjà des maquettes (Figma, Sketch, PDF) prêtes à implémenter ?', hint: 'Si oui, nous les intégrons fidèlement au pixel près.', onYes: { setDesign: 'from_mockups' } },
];

const timelineQuestions: Question[] = [
    { id: 'u_urgent', text: 'Avez-vous besoin que le projet soit livré en moins de 2 mois ?', hint: 'Cela mobilise plus de ressources, d\'où un supplément de prix.', onYes: { setTimeline: 'priority' } },
    { id: 'u_very_urgent', text: 'Est-ce vraiment urgent, il vous le faut dans les 2 prochaines semaines ?', hint: 'Nous travaillerons en priorité absolue.', onYes: { setTimeline: 'urgent' } },
];

const maintenanceQuestions: Question[] = [
    { id: 'u_maintenance', text: 'Voulez-vous être accompagné après le lancement (corrections, petites mises à jour, questions techniques) ?', onYes: { setMaintenance: 'basic_3m' } },
    { id: 'u_long_maintenance', text: 'Préférez-vous un suivi sur le long terme (12 mois complets avec priorité) ?', onYes: { setMaintenance: 'premium_12m' } },
    { id: 'u_priority_support', text: 'Avez-vous besoin d\'une assistance prioritaire avec réponse garantie en moins de 24h ?', onYes: { setMaintenance: 'premium_12m' } },
];

// ─── Question set resolver ──────────────────────────────────────

const questionSetsByType: Record<string, Question[]> = {
    static_site: staticSiteQuestions,
    showcase_site: showcaseSiteQuestions,
    blog_portfolio: blogPortfolioQuestions,
    ecommerce: ecommerceQuestions,
    custom_cms: cmsQuestions,
    platform_saas: saasQuestions,
    mobile_app: mobileAppQuestions,
    desktop_app: desktopAppQuestions,
    api_backend: apiBackendQuestions,
};

// Some types (mobile_app, desktop_app) don't need domain/hosting questions
const webBasedTypes = new Set(['static_site', 'showcase_site', 'blog_portfolio', 'ecommerce', 'custom_cms', 'platform_saas']);

export function filterQuestionsForType(type: string): Question[] {
    const typeQuestions = questionSetsByType[type] || [];
    const closing: Question[] = [];
    if (webBasedTypes.has(type)) {
        closing.push(...domainHostingQuestions);
    }
    closing.push(...brandingQuestions);
    closing.push(...timelineQuestions);
    closing.push(...maintenanceQuestions);
    return [...typeQuestions, ...closing];
}

export function computeEffects(questions: Question[], answers: NoviceAnswers): NoviceEffects {
    const features = new Set<string>();
    let design: string | null = null;
    let maintenance: string | null = null;
    let timeline: string | null = null;

    for (const q of questions) {
        const ans = answers[q.id];
        if (!ans) continue;
        const effect = ans === 'yes' ? q.onYes : q.onNo;
        if (!effect) continue;
        effect.features?.forEach(f => features.add(f));
        if (effect.setDesign) design = effect.setDesign;
        if (effect.setMaintenance) maintenance = effect.setMaintenance;
        if (effect.setTimeline) timeline = effect.setTimeline;
    }

    return { features, design, maintenance, timeline };
}

// ─── Component ──────────────────────────────────────────────────

interface Props {
    selectedType: string;
    answers: NoviceAnswers;
    setAnswers: (next: NoviceAnswers) => void;
    currentIndex: number;
    setCurrentIndex: (i: number) => void;
    onComplete: (effects: NoviceEffects) => void;
    onExit: () => void;
}

export default function NoviceQuestionnaire({
    selectedType,
    answers,
    setAnswers,
    currentIndex,
    setCurrentIndex,
    onComplete,
    onExit,
}: Props) {
    const { t } = useTranslation();
    const [animating, setAnimating] = useState<'none' | 'yes' | 'no'>('none');
    const cardRef = useRef<HTMLDivElement | null>(null);

    const questions = useMemo(() => filterQuestionsForType(selectedType), [selectedType]);
    const total = questions.length;
    const current = questions[currentIndex];

    useEffect(() => {
        if (cardRef.current) {
            const rect = cardRef.current.getBoundingClientRect();
            const top = window.scrollY + rect.top - 100;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    }, [currentIndex]);

    const answer = (value: 'yes' | 'no') => {
        if (!current || animating !== 'none') return;
        setAnimating(value);
        const next = { ...answers, [current.id]: value };
        setAnswers(next);

        setTimeout(() => {
            setAnimating('none');
            if (currentIndex + 1 >= total) {
                const effects = computeEffects(questions, next);
                onComplete(effects);
            } else {
                setCurrentIndex(currentIndex + 1);
            }
        }, 350);
    };

    const goBack = () => {
        if (currentIndex === 0) return;
        setCurrentIndex(currentIndex - 1);
    };

    if (!current) return null;

    const progress = Math.round(((currentIndex + 1) / total) * 100);
    const currentAnswer = answers[current.id];

    return (
        <div ref={cardRef}>
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">2. {t('Questionnaire guidé')}</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        {t('Répondez simplement par Oui ou Non. Chaque réponse personnalise votre devis.')}
                    </p>
                </div>
                <button
                    onClick={onExit}
                    className="text-xs text-gray-500 dark:text-gray-400 hover:text-teal-600 underline underline-offset-2"
                >
                    {t('Mode expert')}
                </button>
            </div>

            {/* Progress bar */}
            <div className="mb-6">
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
                    <span className="font-medium">{t('Question')} {currentIndex + 1} / {total}</span>
                    <span>{progress}%</span>
                </div>
                <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-teal-400 to-emerald-500 transition-all duration-500 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* Question card */}
            <div
                key={current.id}
                className={`bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-8 transition-all duration-300 ${
                    animating === 'yes' ? 'scale-[0.98] border-teal-400' : animating === 'no' ? 'scale-[0.98] border-gray-400' : 'animate-fade-in'
                }`}
            >
                <div className="flex items-start gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white shadow-lg shadow-teal-500/20 flex-shrink-0">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M12 17.25h.008v.008H12v-.008zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-snug">
                            {t(current.text)}
                        </h3>
                        {current.hint && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">
                                {t(current.hint)}
                            </p>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <button
                        onClick={() => answer('yes')}
                        disabled={animating !== 'none'}
                        className={`group relative overflow-hidden p-6 rounded-2xl border-2 font-bold text-lg transition-all duration-200 ${
                            currentAnswer === 'yes'
                                ? 'border-teal-500 bg-gradient-to-br from-teal-500 to-emerald-600 text-white shadow-xl shadow-teal-500/30'
                                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:border-teal-400 hover:shadow-lg hover:-translate-y-0.5'
                        }`}
                    >
                        <div className="flex items-center justify-center gap-3">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                            <span>{t('Oui')}</span>
                        </div>
                    </button>

                    <button
                        onClick={() => answer('no')}
                        disabled={animating !== 'none'}
                        className={`group relative overflow-hidden p-6 rounded-2xl border-2 font-bold text-lg transition-all duration-200 ${
                            currentAnswer === 'no'
                                ? 'border-gray-500 bg-gradient-to-br from-gray-700 to-gray-900 text-white shadow-xl'
                                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:border-gray-400 hover:shadow-lg hover:-translate-y-0.5'
                        }`}
                    >
                        <div className="flex items-center justify-center gap-3">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            <span>{t('Non')}</span>
                        </div>
                    </button>
                </div>
            </div>

            {/* Navigation */}
            <div className="mt-6 flex items-center justify-between">
                <button
                    onClick={goBack}
                    disabled={currentIndex === 0}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-teal-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                    {t('Question précédente')}
                </button>

                <p className="text-xs text-gray-400 dark:text-gray-500">
                    {t('Vos réponses sont sauvegardées automatiquement')}
                </p>
            </div>
        </div>
    );
}
