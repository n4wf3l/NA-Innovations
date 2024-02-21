<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>Laravel</title>

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
    </style>
    @vite('resources/css/app.css')
</head>

<body>
    <div class="relative h-screen bg-black"
        style="background-image: url('{{ asset('car-hero.png') }}'); background-size: cover; background-position: center; background-repeat: no-repeat;">
        <div x-data="{ open: false }">
            <nav class="flex items-center justify-between px-4 py-8">
                <button @click="open = !open" class="space-y-2 focus:outline-none">
                    <!-- Icône du menu (hamburger) pour mobile -->
                    <div class="w-8 h-0.5 bg-white"></div>
                    <div class="w-8 h-0.5 bg-white"></div>
                    <div class="w-8 h-0.5 bg-white"></div>
                </button>
                <!-- Logo -->
                <a href="/" class="text-3xl text-white uppercase logo transition duration-500">NAWFEL AJARI</a>
                <div class="hidden sm:flex">
                    @if(Route::has('login'))
                    @auth
                    <a class="text-white pr-2 hover:text-yellow-500" href="{{ url('/dashboard') }}"
                        style="cursor: pointer;">ADMIN</a>
                    <span class="text-white pr-2">|</span>
                    <span class="pr-4 text-white hover:text-yellow-500" style="cursor: pointer;"
                        onclick="window.location.href='{{ url('profile') }}'">{{ Auth::user()->name }}</span>
                    <a href="#" onclick="event.preventDefault(); document.getElementById('logout-form').submit();">
                        <img class="inline cursor-pointer h-7" src="{{ asset('logout.png') }}" alt="Déconnexion">
                    </a>
                    <form id="logout-form" action="{{ route('logout') }}" method="POST" style="display: none;">@csrf
                    </form>
                    @endauth
                    @endif
                </div>
            </nav>

            <!-- Sidebar mobile -->
            <div class="absolute top-0 left-0 w-64 h-screen transition-transform duration-200 transform bg-black"
                :class="{'-translate-x-full': !open, 'translate-x-0': open}">
                <button @click="open = false" class="p-4 text-white hover:text-red-400">
                    <img src="/close-menu-icon.png" alt="closing the menu button icon" class="w-8 h-8">
                </button>
                <div class="flex flex-col p-4">
                    <!-- Liens de navigation -->
                    <a href="{{ url('/') }}" class="py-2 text-yellow-500 border-b-2 border-gray-100">Accueil</a>
                    <a href="{{ url('/services') }}" class="py-2 text-white hover:text-yellow-500">Services</a>
                    <a href="{{ url('/about') }}" class="py-2 text-white hover:text-yellow-500">À propos</a>
                    <a href="{{ url('/contact') }}" class="py-2 text-white hover:text-yellow-500">Contact</a>
                    @if(Route::has('login'))
                    @auth
                    <a href="{{ url('/dashboard') }}" class="py-2 text-gray-400 hover:text-yellow-500">Réservations</a>
                    <a href="{{ url('/membres') }}" class="py-2 text-gray-400 hover:text-yellow-500">Membres</a>
                    <a href="{{ url('/cars/create') }}" class="py-2 text-gray-400 hover:text-yellow-500">MyCARS</a>
                    <a href="{{ url('/user/create') }}" class="py-2 text-gray-400 hover:text-yellow-500">MyADMIN</a>
                    <a href="{{ url('/profile') }}" class="sm:hidden py-2 text-gray-400 hover:text-yellow-500">Mon
                        compte</a>
                    <a href="#" class="sm:hidden py-2 text-gray-400 hover:text-yellow-500"
                        onclick="event.preventDefault(); document.getElementById('logout-form-mobile').submit();">
                        <img class="inline cursor-pointer h-3" src="{{ asset('logout.png') }}" alt="Déconnexion">
                        Déconnexion
                    </a>
                    @endauth
                    @endif
                </div>
            </div>
        </div>

        <h1 class="mt-20 text-3xl font-bold text-center text-white lg:text-5xl lg:px-32 duration-[2000ms]">
            Développemet web, mobile et montage vidéo
        </h1>
    </div>
    </div>
    </section>


    <section class="py-32 text-black bg-gray-100">
        <h1 class="text-5xl font-semibold text-center">Sites web publiés</h1>
        <h3 class="mt-4 text-lg text-center lg:px-56">
            Découvrez ci-dessous divers types de sites web que j'ai développés. La liste n'inclut pas les sites
            portfolios conçus pour des profils individuels. Vous trouverez également des informations sur le temps de
            développement, les langages de programmation utilisés, le niveau de satisfaction des clients, ainsi que le
            nombre de collaborations entre développeurs.
        </h3>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-20 lg:px-20">
            @foreach ($projets as $projet)
            <div class="flex flex-col p-2 transition-all bg-white border-2 hover:border-black border-gray rounded-3xl">
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
        <div class="flex justify-center lg:py-12">
            <button id="voirPlusBtn"
                class="text-white transition-colors bg-black border-2 rounded-3xl hover:bg-gray-500 border-inherit hover:border-black mt-20">
                <h4 class="w-full px-8 py-4">Voir plus</h4>
            </button>
        </div>
    </section>


    <section class="py-32 text-black bg-gray-100">


        <h1 class="text-5xl font-semibold text-center">Projets à but non-lucratif</h1>
        <h3 class="mt-4 text-lg text-center lg:px-56">
            Découvrez mes contributions à des projets à but non lucratif, où innovation et collaboration se rencontrent
            pour créer des solutions technologiques uniques. Cette sélection reflète mon engagement envers le
            développement communautaire et l'open source, mettant en lumière le temps de développement, les langages
            utilisés et l'impact de ces initiatives. Explorez ces réalisations pour comprendre comment nous pouvons
            ensemble faire avancer la technologie pour le bien commun.
        </h3>


        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-20 lg:px-20">
            @foreach ($academicProjects as $academicProjet)
            <div class="flex flex-col p-2 transition-all bg-white border-2 hover:border-black border-gray rounded-3xl">
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
        <div class="flex justify-center lg:py-12">
            <button id="voirPlusBtn"
                class="text-white transition-colors bg-black border-2 rounded-3xl hover:bg-gray-500 border-inherit hover:border-black mt-20">
                <h4 class="w-full px-8 py-4">Voir plus</h4>
            </button>
        </div>
    </section>

    <section class="px-4 py-8 sm:px-8 md:px-16 lg:px-32 lg:py-32">
        <h1 class="text-3xl font-semibold text-center md:text-4xl lg:text-5xl">Comment ça marche</h1>
        <h3 class="mt-4 text-center text-base md:text-lg lg:px-56">
            Louer une voiture au Maroc n'a jamais été aussi simple. Notre processus optimisé rend la réservation et la
            confirmation de votre véhicule de choix en ligne facile et rapide.
        </h3>

        <div class="flex flex-col lg:flex-row mt-16">
            <div class="relative flex flex-col">
                <!-- Bloc 1 -->
                <div class="flex flex-col lg:flex-row items-center gap-4 p-8 bg-white border-2 border-gray rounded-3xl">
                    <div class="flex items-center h-full px-4 bg-gray-200 rounded-xl">
                        <img src="/search.png" alt="magnifier icon for search" class="icons-2">
                    </div>
                    <div class="flex flex-col w-full gap-4">
                        <h3 class="text-xl font-semibold">Parcourez et sélectionnez</h3>
                        <p>Choisissez parmi notre gamme de voitures, sélectionnez les dates et les lieux de prise en
                            charge qui vous conviennent le mieux.</p>
                    </div>
                </div>
                <!-- Bloc 2 -->
                <div class="flex flex-col lg:flex-row items-center gap-4 p-8 bg-white border-2 border-gray rounded-3xl">
                    <div class="flex items-center h-full px-4 bg-gray-200 rounded-xl">
                        <img src="/calendar.png" alt="calendar icon" class="icons-2">
                    </div>
                    <div class="flex flex-col w-full gap-4">
                        <h3 class="text-xl font-semibold">Réservez et confirmez</h3>
                        <p>Réservez la voiture de votre choix en seulement quelques clics et recevez une confirmation
                            instantanée par e-mail ou SMS.</p>
                    </div>
                </div>
                <!-- Bloc 3 -->
                <div
                    class="flex flex-col lg:flex-row items-center gap-4 p-8 mb-16 bg-white border-2 border-gray rounded-3xl">
                    <div class="flex items-center h-full px-4 bg-gray-200 rounded-xl">
                        <img src="/face-happy.png" alt="smiley icon" class="icons-2">
                    </div>
                    <div class="flex flex-col w-full gap-4">
                        <h3 class="text-xl font-semibold">Profitez de votre trajet</h3>
                        <p>Récupérez votre voiture à l'emplacement désigné et profitez de votre expérience de conduite
                            haut de gamme avec notre service de qualité supérieure.</p>
                    </div>
                </div>

                <div class="absolute right-0 w-40 h-full bg-gray-100 -z-10 rounded-l-3xl hidden lg:block"></div>
            </div>

            <div class="flex items-center p-8 bg-gray-100 rounded-r-full hidden lg:block">
                <img src="/jeep.png" alt="jeep car" class="w-full h-auto">
            </div>
        </div>
    </section>



    <footer class="text-white bg-black border-t-2 border-gray-200">
        <div class="flex flex-col lg:flex-row items-center justify-between py-4 px-4 lg:px-12 gap-4">
            <div>
                <h1 class="text-2xl lg:text-3xl uppercase logo">Bxcars</h1>
            </div>
            <div class="flex justify-between gap-2 lg:gap-4">
                <a href="{{ url('/about') }}" class="text-gray-300 transition-colors hover:text-white">À propos</a>
                <a href="/services#section1" class="text-gray-300 transition-colors hover:text-white">Conditions</a>
                <a href="/contact" class="text-gray-300 transition-colors hover:text-white">Contact</a>
            </div>
            <div class="flex flex-row gap-2 lg:gap-4">
                <a href="https://www.instagram.com/bx_cars_rental/" target="_blank" rel="noopener noreferrer">
                    <div
                        class="flex items-center justify-center w-8 h-8 transition-transform bg-gray-300 rounded-full hover:bg-gray-200 hover:scale-110">
                        <img src="/instagram.svg" alt="instagram icon">
                    </div>
                </a>

                <!-- Facebook -->
                <a href="https://www.facebook.com/people/Bx-Cars/pfbid0K5HQSNgyJPMsKygqBWgqgy8Mtrr99SHEcJt2s2LckipK9GatJLFvcA8r6zeYxiFel/"
                    target="_blank" rel="noopener noreferrer">
                    <div
                        class="flex items-center justify-center w-8 h-8 transition-transform bg-gray-300 rounded-full hover:bg-gray-200 hover:scale-110">
                        <img src="{{ asset('facebook.svg') }}" alt="facebook icon">
                    </div>
                </a>

                <!-- Snapchat -->
                <a href="https://www.snapchat.com/add/bxcars-tanger?share_id=HxAMeEKaQeY&locale=fr-BE" target="_blank"
                    rel="noopener noreferrer">
                    <div
                        class="flex items-center justify-center w-8 h-8 transition-transform bg-gray-300 rounded-full hover:bg-gray-200 hover:scale-110">
                        <img src="{{ asset('snapchat.svg') }}" alt="snapchat icon">
                    </div>
                </a>
            </div>
        </div>
        <div class="w-full text-xs lg:text-sm text-center py-2 bg-yellow-500 custom-font">
            <p>MADE IT WITH PASSION ♥ ~ <a href="http://nawfelajari.be" class="text-white hover:text-gray-800"
                    target="_blank" rel="noopener noreferrer">NAWFEL AJARI</a> &#169; 2024</p>
        </div>
    </footer>
    <script>

    </script>
</body>

</html>