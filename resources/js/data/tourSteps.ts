export interface TourStep {
    target: string;        // data-tour attribute value
    title: string;         // i18n key
    description: string;   // i18n key
    placement?: 'top' | 'bottom' | 'left' | 'right';
}

// ─── CLIENT (13 étapes) ──────────────────────────────────
export const clientDashboardSteps: TourStep[] = [
    {
        target: 'welcome-banner',
        title: 'Bienvenue sur votre espace !',
        description: 'Votre tableau de bord personnel pour suivre vos projets, devis et factures en un coup d\'œil.',
        placement: 'bottom',
    },
    {
        target: 'stats-grid',
        title: 'Vos chiffres clés',
        description: 'Projets actifs, devis en attente, factures impayées et montant total dû - tout est résumé ici.',
        placement: 'bottom',
    },
    {
        target: 'pin-unlock',
        title: 'Données financières protégées',
        description: 'Les montants sont masqués par défaut pour votre sécurité. Cliquez sur ce bouton et entrez votre code PIN pour les afficher pendant 15 minutes. Après ce délai, ils se masquent automatiquement.',
        placement: 'bottom',
    },
    {
        target: 'recent-projects',
        title: 'Vos projets',
        description: 'Accédez directement à vos projets en cours. Cliquez sur un projet pour voir son avancement, sa timeline et ses documents.',
        placement: 'right',
    },
    {
        target: 'recent-invoices',
        title: 'Vos factures',
        description: 'Consultez vos factures récentes, leur statut (payée, en attente, en retard) et les montants.',
        placement: 'left',
    },
    {
        target: 'quotes-section',
        title: 'Vos devis',
        description: 'Retrouvez vos devis reçus. Vous pouvez les consulter et les accepter directement.',
        placement: 'top',
    },
    {
        target: 'nav-projects',
        title: 'Menu - Projets',
        description: 'Tous vos projets avec leur avancement, timeline et documents associés.',
        placement: 'right',
    },
    {
        target: 'nav-documents',
        title: 'Menu - Documents',
        description: 'Vos devis, NDA, contrats et propositions reçues - tous vos documents au même endroit.',
        placement: 'right',
    },
    {
        target: 'nav-invoices',
        title: 'Menu - Factures',
        description: 'L\'historique complet de vos factures avec les montants, dates d\'échéance et statuts de paiement.',
        placement: 'right',
    },
    {
        target: 'nav-support',
        title: 'Support',
        description: 'Besoin d\'aide ? Créez un ticket de support depuis cette page et nous vous répondrons rapidement.',
        placement: 'right',
    },
    {
        target: 'notifications-bell',
        title: 'Notifications',
        description: 'Recevez des alertes en temps réel : nouveau devis, facture envoyée, mise à jour de projet. Le badge rouge indique les notifications non lues.',
        placement: 'bottom',
    },
    {
        target: 'profile-menu',
        title: 'Votre profil & paramètres',
        description: 'Cliquez sur votre avatar pour changer de thème (clair/sombre), de langue (FR/EN/NL), accéder à votre profil ou vous déconnecter.',
        placement: 'bottom',
    },
    {
        target: 'nav-profile',
        title: 'Paramètres du compte',
        description: 'Modifiez vos informations personnelles, vos préférences de notifications et votre mot de passe.',
        placement: 'right',
    },
];

// ─── PARTNER (14 étapes) ─────────────────────────────────
export const partnerDashboardSteps: TourStep[] = [
    {
        target: 'hero-banner',
        title: 'Votre espace partenaire',
        description: 'Retrouvez votre code de parrainage et votre lien unique. Partagez ce lien à vos contacts - chaque client signé vous rapporte une commission !',
        placement: 'bottom',
    },
    {
        target: 'sidebar-cta',
        title: 'Soumettre un client',
        description: 'C\'est le bouton le plus important ! Cliquez ici pour soumettre un nouveau prospect. Remplissez ses coordonnées et nous nous chargeons du reste.',
        placement: 'right',
    },
    {
        target: 'stats-grid',
        title: 'Vos performances',
        description: 'Leads envoyés, taux de conversion, gains totaux et commissions en attente - vos KPIs en un coup d\'œil.',
        placement: 'bottom',
    },
    {
        target: 'pin-unlock',
        title: 'Données financières protégées',
        description: 'Vos montants (commissions, gains, taille moyenne des deals) sont masqués par défaut. Cliquez ici et entrez votre code PIN pour les révéler pendant 15 minutes.',
        placement: 'bottom',
    },
    {
        target: 'pipeline-summary',
        title: 'Pipeline des leads',
        description: 'Suivez la progression de chaque lead dans le cycle de vente : nouveau → contacté → brief → devis → gagné ou perdu.',
        placement: 'bottom',
    },
    {
        target: 'monthly-chart',
        title: 'Performance mensuelle',
        description: 'Visualisez vos leads par mois. Les barres claires = total envoyé, les barres vertes = leads gagnés.',
        placement: 'bottom',
    },
    {
        target: 'recent-leads',
        title: 'Leads récents',
        description: 'Vos derniers leads soumis avec leur statut actuel. Cliquez sur un lead pour voir ses détails.',
        placement: 'right',
    },
    {
        target: 'commissions-card',
        title: 'Vos commissions',
        description: 'Le détail de vos commissions gagnées : montant, taux appliqué et statut de paiement (estimée, confirmée, payée).',
        placement: 'left',
    },
    {
        target: 'nav-leads',
        title: 'Menu - Mes Leads',
        description: 'La liste complète de tous vos leads avec filtres par statut, recherche et détails.',
        placement: 'right',
    },
    {
        target: 'nav-commissions',
        title: 'Menu - Commissions',
        description: 'L\'historique détaillé de toutes vos commissions avec les montants, taux et statuts.',
        placement: 'right',
    },
    {
        target: 'nav-guide',
        title: 'Guide du partenaire',
        description: 'Le guide complet du programme : comment ça marche, calcul des commissions, exemples chiffrés et FAQ.',
        placement: 'right',
    },
    {
        target: 'notifications-bell',
        title: 'Notifications',
        description: 'Recevez des alertes quand un lead change de statut, qu\'une commission est confirmée ou qu\'un paiement est effectué.',
        placement: 'bottom',
    },
    {
        target: 'profile-menu',
        title: 'Votre profil & paramètres',
        description: 'Changez de thème (clair/sombre), de langue (FR/EN/NL), accédez à votre profil ou déconnectez-vous.',
        placement: 'bottom',
    },
    {
        target: 'nav-profile',
        title: 'Paramètres du compte',
        description: 'Gérez vos informations, préférences de notifications, devise d\'affichage et confidentialité.',
        placement: 'right',
    },
];

// ─── DEV (10 étapes) ─────────────────────────────────────
export const devDashboardSteps: TourStep[] = [
    {
        target: 'hero-banner',
        title: 'Votre espace développeur',
        description: 'Bienvenue dans votre workspace. Ici vous gérez vos projets assignés et réclamez de nouveaux projets disponibles.',
        placement: 'bottom',
    },
    {
        target: 'stats-grid',
        title: 'Vos statistiques',
        description: 'Projets actifs, complétés, en attente de réclamation et total assigné - votre activité en un coup d\'œil.',
        placement: 'bottom',
    },
    {
        target: 'pin-unlock',
        title: 'Données financières protégées',
        description: 'Les budgets des projets sont masqués par défaut. Cliquez ici et entrez votre code PIN pour les afficher pendant 15 minutes.',
        placement: 'bottom',
    },
    {
        target: 'monthly-chart',
        title: 'Progression mensuelle',
        description: 'Le nombre de projets que vous avez complétés chaque mois sur les 6 derniers mois.',
        placement: 'bottom',
    },
    {
        target: 'pending-projects',
        title: 'Projets disponibles',
        description: 'Les projets en attente de développeur. Consultez les détails (budget, type, client) puis cliquez « Réclamer » pour vous les attribuer.',
        placement: 'top',
    },
    {
        target: 'my-projects',
        title: 'Mes projets',
        description: 'La liste de vos projets assignés avec le client, le budget et le statut. Cliquez « Voir » pour accéder aux détails.',
        placement: 'top',
    },
    {
        target: 'nav-projects',
        title: 'Menu - Projets',
        description: 'Retrouvez tous vos projets (actifs et en attente) avec filtres, détails complets et historique.',
        placement: 'right',
    },
    {
        target: 'notifications-bell',
        title: 'Notifications',
        description: 'Recevez des alertes quand un nouveau projet est disponible, qu\'un projet est mis à jour ou qu\'un message vous est envoyé.',
        placement: 'bottom',
    },
    {
        target: 'profile-menu',
        title: 'Votre profil & paramètres',
        description: 'Changez de thème (clair/sombre), de langue (FR/EN/NL), accédez à votre profil ou déconnectez-vous.',
        placement: 'bottom',
    },
    {
        target: 'nav-profile',
        title: 'Paramètres du compte',
        description: 'Modifiez vos informations personnelles et paramètres de compte.',
        placement: 'right',
    },
];

export type TourKey = 'client_dashboard' | 'partner_dashboard' | 'dev_dashboard';

export const tourConfigs: Record<TourKey, TourStep[]> = {
    client_dashboard: clientDashboardSteps,
    partner_dashboard: partnerDashboardSteps,
    dev_dashboard: devDashboardSteps,
};
