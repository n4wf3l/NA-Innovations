<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>Home - NA</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,600&display=swap" rel="stylesheet" />
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
    <script src="//unpkg.com/alpinejs" defer></script>
    <!-- Styles -->
    <style>
        @tailwind base;
        @tailwind components;
        @tailwind utilities;

        html {
            scroll-behavior: smooth;
        }
        /* Ajoutez ici vos styles supplémentaires */

    </style>
    @vite('resources/css/app.css')
</head>

<body>
    <div id="app">
        <!-- Header avec le logo et le menu hamburger (qui remplace les nav links sur les petits écrans) -->
        <div class="flex flex-col py-12 bg-gray-900">
            <div class="flex justify-between items-center self-center mt-1 w-full max-w-[1298px] px-4">
                <div class="text-3xl font-bold text-white">NA</div>
                <!-- Bouton du menu hamburger (visible uniquement sur les petits écrans) -->
                <button id="hamburgerBtn" class="md:hidden block text-white">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M4 6h16M4 12h16m-7 6h7"></path>
                    </svg>
                </button>
                <!-- Navigation (cachez ceci sur les petits écrans et montrez-le sur les plus grands) -->
                <div id="navLinks"
                    class="hidden md:flex gap-5 justify-between pr-5 text-lg font-medium text-white whitespace-nowrap">
                    <div>
    <a href="" class="text-teal-300 hover:text-teal-300">Accueil</a>
</div>
<div>
    <a href="#about" class="hover:text-teal-300">Services</a>
</div>
<div>
    <a href="#projects" class="hover:text-teal-300">Projets</a>
</div>
<div>
    <a href="{{ route('about') }}" class="hover:text-teal-300">À propos</a>
</div>
<div>
    <a href="" class="hover:text-teal-300">Nouveautés</a>
</div>
<div>
    <a href="{{ route('contact') }}" class="hover:text-teal-300">Contact</a>
</div>
                </div>
            </div>
            <div
                class="flex gap-5 justify-between self-center mt-44 w-full max-w-[1012px] max-md:flex-wrap max-md:mt-10 max-md:max-w-full">
                <div class="flex flex-col flex-1 px-5 max-md:max-w-full">
                    <div class="text-xl font-medium text-neutral-400 max-md:max-w-full">
                        Développement web, mobile et software | Montage vidéo et graphisme | Photographie
                    </div>
                    <div class="mt-11 text-9xl font-bold text-white max-md:mt-10 max-md:max-w-full max-md:text-4xl">
                        We’re creative
                        <br />
                        digital studio.
                    </div>
                </div>
                <img loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/67ee580b211125b63e48b5b003eee10ff257e9dee311f1fc25d332dd76e09b3f?apiKey=d3784f4c52b7403885832573b3287702&"
                    class="self-start aspect-[0.61] w-[49px]" />
            </div>
            <div class="flex gap-2.5 items-start self-center px-5 mt-44 max-w-full w-[350px] max-md:mt-10">
                <img loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/949187d7ee1e2afd8a023c671f59d74c39c29d054926767f17b217fed5475910?apiKey=d3784f4c52b7403885832573b3287702&"
                    class="flex-1 shrink-0 w-full aspect-square hover:bg-teal-300 hover:rounded-full" />
                <img loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/a7d60a3960400d8a490b85c9fa9558bb8a2473d9b8b90dc4a3c6c99c2b361f7f?apiKey=d3784f4c52b7403885832573b3287702&"
                    class="flex-1 shrink-0 w-full aspect-square hover:bg-teal-300 hover:rounded-full" />
                <img loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/20b91319aa8c73e3d645eb4aeefedc7f337acd87cc2bcea1a90ca77d18e63440?apiKey=d3784f4c52b7403885832573b3287702&"
                    class="flex-1 shrink-0 w-full aspect-square hover:bg-teal-300 hover:rounded-full" />
            </div>
            <div class="self-center mt-48 w-full max-w-[1300px] max-md:mt-10 max-md:max-w-full">
                <div class="flex gap-5 max-md:flex-col max-md:gap-0 max-md:">
                    <div class="flex flex-col w-[56%] max-md:ml-0 max-md:w-full">
                        <div
                            class="flex flex-col grow px-5 text-3xl leading-10 text-white max-md:mt-10 max-md:max-w-full">
                            <div class="text-xl max-md:max-w-full">Notre philosophie</div>
                            <div class="mt-11 font-bold max-md:mt-10 max-md:max-w-full">
                            Mon approche est ancrée dans la conviction que la cohérence et la créativité sont essentielles pour construire une marque forte.
                            </div>
                            <div class="mt-16 font-bold max-md:mt-10 max-md:max-w-full">
                            En combinant mes compétences en développement web et mobile avec mon expertise en photographie, montage vidéo et design de logo, je m'engage à créer des stratégies marketing holistiques qui racontent une histoire captivante et laissent une impression durable.
                            </div>
                            <div
                                class="justify-center self-start px-7 py-5 mt-14 text-base leading-6 text-teal-300 uppercase whitespace-nowrap border-2 border-teal-300 border-solid rounded-[29.5px] max-md:px-5 max-md:mt-10">
                                Meet the team
                            </div>
                        </div>
                    </div>
                    <div class="flex flex-col ml-5 w-[44%] max-md:ml-0 max-md:w-full">
                        <div class="mx-auto mt-14 max-w-full h-[474px] w-[530px] max-md:mt-10">
                            <img src="/justlogo.png" alt="">
                        </div>
                    </div>
                </div>
            </div>
        </div>

                <div class="ml-16 mt-20 text-9xl font-semibold text-black max-md:max-w-full max-md:text-4xl max-md:text-center" id="about">
            Nos services
        </div>
        <div class="max-w-lg mx-auto text-gray-600">
    <div class="text-center mt-8 mb-6">
        <h2 class="text-3xl font-bold text-black">Développement Web de Qualité</h2>
        <p class="mt-4">Vous recherchez une équipe de développement web passionnée et hautement qualifiée pour donner vie à vos idées en ligne? Vous êtes au bon endroit. Notre équipe de développeurs web chevronnés est prête à transformer vos concepts en solutions numériques innovantes qui captiveront votre audience et stimuleront votre croissance.</p>
    </div>

    <div class="text-center mb-6">
        <h3 class="text-2xl font-bold text-black">Expertise en Développement Web</h3>
        <p class="mt-4">En tant que diplômé en programmation et spécialisé dans le développement web, notre expertise ne se limite pas seulement à la création de sites web. Nous avons une passion pour l'innovation technologique et une compréhension approfondie des dernières tendances et technologies du secteur. Que vous ayez besoin d'un site web d'entreprise dynamique, d'une plateforme de commerce électronique robuste ou d'une application web interactive, nous sommes là pour répondre à vos besoins avec créativité et expertise.</p>
    </div>

    <div class="text-center mb-6">
        <h3 class="text-2xl font-bold text-black">Spécialisation en Football et API</h3>
        <p class="mt-4">Mais notre engagement envers l'excellence ne s'arrête pas là. Nous avons également une spécialisation unique dans le développement de logiciels liés au football et à ses API. Grâce à notre passion pour le football et notre maîtrise des technologies de pointe, nous sommes en mesure de créer des solutions sur mesure pour les clubs, les plateformes de fans et les fournisseurs de contenu dans le domaine du football. Que ce soit pour intégrer des données en temps réel, analyser les performances des joueurs ou créer des expériences interactives pour les fans, nous sommes prêts à relever tous les défis pour vous aider à atteindre vos objectifs.</p>
    </div>

    <div class="text-center mb-8">
        <h3 class="text-2xl font-bold text-black">Collaborons Ensemble</h3>
        <p class="mt-4">Faites équipe avec nous pour une collaboration exceptionnelle qui marie l'expertise du développement web avec une spécialisation pointue dans le domaine passionnant du football. Ensemble, créons une présence en ligne qui se démarque et qui fait vivre une expérience immersive à vos utilisateurs.</p>
    </div>
</div>


<div class="flex flex-row max-w-full mt-20 mb-20 ml-10 mr-20 border border-black">
    <!-- Development -->
    <div class="w-1/3 text-center pl-5 pr-5">
        <div class="mt-8 text-3xl font-semibold text-black">Développement web</div>
        <div class="mt-4 text-2xl text-neutral-400">
            Plateformes de réservation | Marchés en ligne | Plateformes d'apprentissage en ligne | Sites de petites annonces | Plateformes de crowdfunding | Réseaux professionnels
        </div>
        <div class="mt-8 text-3xl font-semibold text-black">Développement mobile</div>
        <div class="mt-4 text-2xl text-neutral-400">
            Applications nativement codées | Applications hybrides | Applications web progressives (PWA) | Applications d'e-commerce mobile | Applications de médias sociaux mobiles
        </div>
        <div class="mt-8 text-3xl font-semibold text-black">Développement software</div>
        <div class="mt-4 text-2xl text-neutral-400 mb-10">
            Applications de bureau | Applications d'entreprise | Applications de gestion de projet | Systèmes de gestion de contenu (CMS) | Systèmes de gestion de base de données (SGBD) | Applications de bureau à distance | Systèmes de planification des ressources d'entreprise (ERP)
        </div>
    </div>

    <!-- Graphic Design -->
    <div class="w-1/3 text-center  ml-10 mr-10">
        <div class="mt-8 text-3xl font-semibold text-black">Montage vidéo</div>
        <div class="mt-4 text-2xl text-neutral-400">
            Montage narratif | Montage promotionnel | Montage publicitaire | Montage documentaire | Montage expérimental
        </div>
        <div class="mt-8 text-3xl font-semibold text-black">Graphisme</div>
        <div class="mt-4 text-2xl text-neutral-400">
            Conception de logos, d'affiches, de cartes de visite et de brochures | Design d'interface utilisateur (UI) et d'expérience utilisateur (UX) | Infographie
        </div>
    </div>

    <!-- Strategy -->
    <div class="w-1/3 text-center pl-5 pr-5">
        <div class="mt-8 text-3xl font-semibold text-black">Photographie</div>
        <div class="mt-4 text-2xl text-neutral-400">
            Portrait | Photographie documentaire | Sport
        </div>
    </div>
</div>


    
        <section class="py-32 text-black bg-gray-100">
        <div class="ml-16 text-9xl font-semibold text-black max-md:max-w-full max-md:text-4xl max-md:text-center" id="projects">
            Nos projets
        </div>
            <h1 class="text-5xl font-semibold text-center mt-20">Sites web publiés</h1>
            <h3 class="mt-4 text-lg text-center lg:px-56">
                Découvrez ci-dessous divers types de sites web que j'ai développés. La liste n'inclut pas les sites
                portfolios conçus pour des profils individuels. Vous trouverez également des informations sur le temps
                de
                développement, les langages de programmation utilisés, le niveau de satisfaction des clients, ainsi que
                le
                nombre de collaborations entre développeurs.
            </h3>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-20 lg:px-20">
                @foreach ($projets as $projet)
                <div
                    class="flex flex-col p-2 transition-all bg-white border-2 hover:border-black border-gray rounded-3xl">
                    <img src="{{ Storage::url($projet->image) }}" alt="Project Image"
                        class="w-full h-48 object-cover rounded-t-3xl">
                    <div class="p-2">
                        <h4 class="text-lg font-semibold">{{ $projet->nom_societe }}</h4>
                        <div class="flex flex-row items-end">
                            <div class="flex flex-col mr-4">
                                <h5 class="text-4xl font-bold">
                                    {{ $projet->type_societe }}
                                </h5>
                            </div>
                            <div class="flex flex-col">
                                <span class="text-sm text-gray-500">
                                    {{ $projet->type_site }}
                                </span>
                                <span class="text-sm text-gray-500">
                                    {{ $projet->lieu }}
                                </span>
                            </div>
                        </div>
                        <div class="flex flex-row items-center justify-between px-8 py-2 my-4 bg-gray-100 rounded-xl">
                            <div class="flex flex-col">
                                <img src="/speedometer.png" class="self-center icons" alt="development time icon" />
                                <span>{{ $projet->jours_developpement }} J</span>
                            </div>
                            <div class="flex flex-col">
                                <span>
                                    {{ $projet->langage_programmation }}
                                </span>
                            </div>
                            <div class="flex flex-col">
                                <span>
                                    {{ $projet->etoiles }}
                                </span>
                            </div>
                            <div class="flex flex-col">
                                <img src="/users.png" class="self-center icons" alt="team icon" />
                                <span> {{ $projet->nombre_collaborateurs }} personnes</span>
                            </div>
                        </div>
                        <a href="{{ $projet->lien }}"
                            class="transition duration-150 hover:duration-150 block w-full px-4 py-2 font-medium text-center text-black transition-colors border-2 border-black rounded-3xl hover:bg-green-500 hover:text-white">
                            Visiter
                        </a>
                    </div>
                </div>
                @endforeach
            </div>
        </section>


        <section class="py-32 text-black bg-gray-100">


            <h1 class="text-5xl font-semibold text-center">Projets à but non-lucratif</h1>
            <h3 class="mt-4 text-lg text-center lg:px-56">
                Découvrez mes contributions à des projets à but non lucratif, où innovation et collaboration se
                rencontrent
                pour créer des solutions technologiques uniques. Cette sélection reflète mon engagement envers le
                développement communautaire et l'open source, mettant en lumière le temps de développement, les langages
                utilisés et l'impact de ces initiatives. Explorez ces réalisations pour comprendre comment nous pouvons
                ensemble faire avancer la technologie pour le bien commun.
            </h3>


            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-20 lg:px-20">
                @foreach ($academicProjects as $academicProjet)
                <div
                    class="flex flex-col p-2 transition-all bg-white border-2 hover:border-black border-gray rounded-3xl">
                    <img src="{{ Storage::url($academicProjet->image) }}" alt="Project Image"
                        class="w-full h-48 object-cover rounded-t-3xl">
                    <div class="p-2">
                        <h4 class="text-lg font-semibold">{{ $academicProjet->nom_societe }}</h4>
                        <div class="flex flex-row items-end">
                            <div class="flex flex-col mr-4">
                                <h5 class="text-4xl font-bold">
                                    {{ $academicProjet->type_societe }}
                                </h5>
                            </div>
                            <div class="flex flex-col">
                                <span class="text-sm text-gray-500">
                                    {{ $academicProjet->type_site }}
                                </span>
                                <span class="text-sm text-gray-500">
                                    {{ $academicProjet->lieu }}
                                </span>
                            </div>
                        </div>
                        <div class="flex flex-row items-center justify-between px-8 py-2 my-4 bg-gray-100 rounded-xl">
                            <div class="flex flex-col">
                                <img src="/speedometer.png" class="self-center icons" alt="development time icon" />
                                <span>{{ $academicProjet->jours_developpement }} J</span>
                            </div>
                            <div class="flex flex-col">
                                <span>
                                    {{ $academicProjet->langage_programmation }}
                                </span>
                            </div>
                            <div class="flex flex-col">
                                <span>
                                    {{ $academicProjet->etoiles }}
                                </span>
                            </div>
                            <div class="flex flex-col">
                                <img src="/users.png" class="self-center icons" alt="team icon" />
                                <span> {{ $academicProjet->nombre_collaborateurs }} personnes</span>
                            </div>
                        </div>
                        <a href="{{ $academicProjet->lien }}"
                            class="transition duration-150 hover:duration-150 block w-full px-4 py-2 font-medium text-center text-black transition-colors border-2 border-black rounded-3xl hover:bg-green-500 hover:text-white">
                            Visiter
                        </a>
                    </div>
                </div>
                @endforeach
            </div>

        </section>

        <section class="flex flex-col items-center justify-center">
    <div class="w-full bg-gray-200 min-h-[1px] mt-4 max-md:max-w-full"></div>
    <div
            class="flex gap-5 justify-between self-center px-5 mt-20 w-full max-w-[1070px] max-md:flex-wrap max-md:mt-10 max-md:max-w-full">
            <img loading="lazy"
            src="/designteal.png"
                class="flex-1 shrink-0 w-full aspect-[1.49] fill-sky-200" style="width: 100px; height: auto;" />
            <img loading="lazy"
            src="/designteal.png"
                class="flex-1 shrink-0 w-full aspect-[1.49] fill-sky-200" style="width: 100px; height: auto;"/>
            <img loading="lazy"
            src="/designteal.png"
                class="flex-1 shrink-0 w-full aspect-[1.49] fill-sky-200" style="width: 100px; height: auto;"/>
            <img loading="lazy"
            src="/designteal.png"
                class="flex-1 shrink-0 w-full aspect-[1.49] fill-sky-200" style="width: 100px; height: auto;"/>
            <img loading="lazy"
            src="/designteal.png"
                class="flex-1 shrink-0 w-full aspect-[1.49] fill-sky-200" style="width: 100px; height: auto;"/>
        </div>
    <div class="mt-36 text-2xl font-medium text-black whitespace-nowrap max-md:mt-10">
        Collaborations
    </div>
    <div class="flex flex-wrap justify-center gap-5 mt-20 w-full max-w-[1070px] max-md:flex-col max-md:mt-10 max-md:max-w-full">
    <div style="display: flex; flex-direction: column; align-items: center;">
        <a href="https://www.bashir-studios.com/">
            <img src="logomouise.png" alt="Logo" style="transition: transform 0.3s ease-in-out;" onmouseover="this.style.transform='scale(1.2)'" onmouseout="this.style.transform='scale(1)'">
        </a>
        <p>Bashir Studio's</p>
    </div>
</div>

    <div class="mt-28 text-xl whitespace-nowrap text-neutral-400 max-md:mt-10">
        Envie de commencer un projet?
    </div>
    <div class="mt-14 text-9xl font-semibold text-black max-md:mt-10 max-md:max-w-full max-md:text-4xl">
        Discutons-en!
    </div>
    <a href="{{ route('contact') }}" class="px-10 py-5 mt-20 text-base leading-6 text-white bg-teal-300 hover:bg-teal-500 uppercase rounded-[29.5px] border-none focus:outline-none max-md:px-5 max-md:mt-10">
        Contactez-nous
    </a>
    <div class="text-3xl font-bold text-black mt-5">NA</div>
    <div class="text-xs font-medium text-neutral-400 mb-5">
        Ingénieur software et développeur fullstack
    </div>
</div>
</section>



<footer class="bg-gray-100 py-12">
    <div class="container mx-auto">
        <div class="border-t border-gray-300"></div>
        <div class="flex justify-between items-center mt-8">
            <div class="w-1/2 md:w-2/3 lg:w-1/3">
                <h2 class="text-lg font-semibold text-gray-800 mb-4">À propos de NA</h2>
                <p class="text-sm text-gray-600">NA est un ingénieur software et développeur fullstack diplômé et formé à la Haute Ecole Erasmus de Bruxelles. </p>
                <div class="flex items-center mt-6">
                    <img loading="lazy"
                        src="https://cdn.builder.io/api/v1/image/assets/TEMP/949187d7ee1e2afd8a023c671f59d74c39c29d054926767f17b217fed5475910?apiKey=d3784f4c52b7403885832573b3287702&"
                        class="aspect-square w-[50px]" />
                    <img loading="lazy"
                        src="https://cdn.builder.io/api/v1/image/assets/TEMP/a7d60a3960400d8a490b85c9fa9558bb8a2473d9b8b90dc4a3c6c99c2b361f7f?apiKey=d3784f4c52b7403885832573b3287702&"
                        class="aspect-square w-[50px]" />
                    <img loading="lazy"
                        src="https://cdn.builder.io/api/v1/image/assets/TEMP/20b91319aa8c73e3d645eb4aeefedc7f337acd87cc2bcea1a90ca77d18e63440?apiKey=d3784f4c52b7403885832573b3287702&"
                        class="aspect-square w-[50px]" />
              
                </div>
            </div>
            <div class="w-1/2 md:w-1/3 lg:w-1/4">
                <h2 class="text-lg font-semibold text-gray-800 mb-4">Contact</h2>
                <div class="text-sm text-gray-600">
                    <p class="mb-2">170 Nijverheidskaai, Anderlecht</p>
                    <p class="mb-2">info@nawfelajari.be</p>
                    <p>+977-9876543210</p>
                </div>
            </div>
        </div>
        <div class="border-t border-gray-300 mt-12"></div>
    </div>
</footer>


    <script>
        document.addEventListener('DOMContentLoaded', () => {
            const hamburgerBtn = document.getElementById('hamburgerBtn');
            const navLinks = document.getElementById('navLinks');

            hamburgerBtn.addEventListener('click', () => {
                navLinks.classList.toggle('hidden');
            });
        });
    </script>
</body>

</html>