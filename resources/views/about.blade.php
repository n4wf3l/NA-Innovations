<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>A propos - NA</title>

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

        .mainVideo {
            width: 85%;
            height: 450px;
            margin-top: -30px;
            margin-right: 0px;
            margin-bottom: 0px;
            margin-left: 0px;
            border-top-left-radius: 10px;
            border-top-right-radius: 10px;
            border-bottom-right-radius: 10px;
            border-bottom-left-radius: 10px;
            z-index: 10;
        }

        .videoContainer {
            width: 46%;
            height: 600px;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            position: relative;
            padding-top: 0px;
            padding-right: 0px;
            padding-bottom: 0px;
            padding-left: 10px;
        }

        .dotsImg {
            position: absolute;
            width: 80%;
            height: 500px;
            top: 0px;
            right: 0px;
            object-fit: cover;
        }

    </style>
    @vite('resources/css/app.css')
</head>

<body>
    <div id="app">
        <!-- Header avec le logo et le menu hamburger (qui remplace les nav links sur les petits écrans) -->
        <div class="flex flex-col py-12 bg-gray-900">
            <div class="flex justify-between items-center self-center mt-1 w-full max-w-[1298px] px-4 relative"> <!-- Ajoutez relative ici pour positionner les éléments absolus par rapport à celui-ci -->
                <div class="text-3xl font-bold text-white">NA
                    @auth <!-- Vérifie si l'utilisateur est connecté -->
                    <span id="logoutMenuBtn" class="ml-2 text-teal-300 cursor-pointer"> <!-- Ajoutez un ID pour le bouton de déconnexion -->
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 inline-block transform rotate-90"
                                viewBox="0 0 20 20" fill="currentColor"> <!-- Ajoute une icône de flèche déroulante -->
                                <path fill-rule="evenodd"
                                    d="M10 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1.447-.895l8 6a1 1 0 0 1 0 1.79l-8 6A1 1 0 0 1 10 18z"></path>
                            </svg>
                            <div id="logoutMenu"
                                class="absolute mt-2 bg-gray-900 border border-gray-300 rounded-md shadow-md hidden"> <!-- Utilisez top-full pour positionner le menu en dessous de la flèche déroulante -->
                                <a href="{{ route('logout') }}"
                                    class="block px-4 py-2 text-sm text-white hover:bg-red-800 hover:text-white transition duration-500" onclick="event.preventDefault(); document.getElementById('logout-form').submit();"> <!-- Lien de déconnexion -->
                                    {{ __('Log Out') }}
                                </a>
                                <form id="logout-form" action="{{ route('logout') }}" method="POST"
                                    style="display: none;">
                                    @csrf
                                </form>
                            </div>
                        </span>
                        @endauth
                </div>
                <!-- Bouton du menu hamburger (visible uniquement sur les petits écrans) -->
                <button id="hamburgerBtn" class="md:hidden block text-white">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M4 6h16M4 12h16m-7 6h7"></path>
                    </svg>
                </button>
 
                <div id="navLinks"
                    class="hidden md:flex gap-5 justify-between pr-5 text-lg font-medium text-white whitespace-nowrap">
                    <div>
                        <a href="/" class="hover:text-teal-300 transition duration-500">Accueil</a>
                    </div>
                    <div>
                        <a href="#about" class="hover:text-teal-300 transition duration-500">Services</a>
                    </div>
                    <div>
                        <a href="#projects" class="hover:text-teal-300 transition duration-500">Projets</a>
                    </div>
                    <div>
                        <a href="{{ route('about') }}" class="text-teal-300 hover:text-teal-300 transition duration-500">À propos</a>
                    </div>
                    <div>
                        <a href="" class="hover:text-teal-300 transition duration-500">Nouveautés</a>
                    </div>
                    <div>
                        <a href="{{ route('contact') }}" class="hover:text-teal-300 transition duration-500">Contact</a>
                    </div>
                    @auth
                    |
                    <div>
                        <a href="{{ url('/dashboard') }}"
                            class="hover:text-teal-300">Dashboard</a>
                    </div>
                    @endauth
                </div>
            </div>

        <div class="mt-4 w-full bg-gray-200 min-h-[1px] max-md:max-w-full"></div>
        <div class="self-center mt-36 text-2xl font-medium text-black whitespace-nowrap max-md:mt-10">
            Teams and companies we work with
        </div>
        <div
            class="flex gap-5 justify-between self-center px-5 mt-20 w-full max-w-[1070px] max-md:flex-wrap max-md:mt-10 max-md:max-w-full">
            <img loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/88cfe832740fbad72af762269deeb7853d23d146e7bb9ebd24562abdc05bfcb1?apiKey=d3784f4c52b7403885832573b3287702&"
                class="flex-1 shrink-0 w-full aspect-[1.49] fill-sky-200" />
            <img loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/88cfe832740fbad72af762269deeb7853d23d146e7bb9ebd24562abdc05bfcb1?apiKey=d3784f4c52b7403885832573b3287702&"
                class="flex-1 shrink-0 w-full aspect-[1.49] fill-sky-200" />
            <img loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/88cfe832740fbad72af762269deeb7853d23d146e7bb9ebd24562abdc05bfcb1?apiKey=d3784f4c52b7403885832573b3287702&"
                class="flex-1 shrink-0 w-full aspect-[1.49] fill-sky-200" />
            <img loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/88cfe832740fbad72af762269deeb7853d23d146e7bb9ebd24562abdc05bfcb1?apiKey=d3784f4c52b7403885832573b3287702&"
                class="flex-1 shrink-0 w-full aspect-[1.49] fill-sky-200" />
            <img loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/88cfe832740fbad72af762269deeb7853d23d146e7bb9ebd24562abdc05bfcb1?apiKey=d3784f4c52b7403885832573b3287702&"
                class="flex-1 shrink-0 w-full aspect-[1.49] fill-sky-200" />
        </div>
        <div class="self-center mt-28 text-xl whitespace-nowrap text-neutral-400 max-md:mt-10">
            Want to start a project?
        </div>
        <div class="self-center mt-14 text-9xl font-semibold text-black max-md:mt-10 max-md:max-w-full max-md:text-4xl">
            Let’s Talk
        </div>

        <div class="videoContainer">
                    <iframe allowfullscreen="allowfullscreen" class="mainVideo" controls="controls"
                        src="https://www.youtube.com/embed/AHnA9_U4K5o">
                    </iframe>
                    <img class="dotsImg image-block"
                        src="https://workik-widget-assets.s3.amazonaws.com/widget-assets/images/cw3.svg">
                </div>
        <div
            class="justify-center self-center px-10 py-5 mt-20 text-base leading-6 text-purple-500 uppercase whitespace-nowrap border-2 border-purple-500 border-solid rounded-[29.5px] max-md:px-5 max-md:mt-10">
            Contact us
        </div>
        <div class="flex gap-3.5 self-start mt-28 ml-16 max-md:mt-10 max-md:ml-2.5">
            <div class="grow text-3xl font-bold text-black">NA</div>
            <div class="text-xs font-medium text-neutral-400">
                UI/UX Designer &
                <br />
                Product Designer
            </div>
        </div>

        <div class="mt-8 w-full bg-gray-200 min-h-[1px] max-md:max-w-full"></div>
        <div
            class="flex gap-5 justify-between self-center mt-16 w-full max-w-[1296px] max-md:flex-wrap max-md:mt-10 max-md:max-w-full">
            <div class="flex flex-col px-5">
                <div class="text-2xl font-medium text-neutral-400">
                    NA is an award UI/UX designer
                    <br />
                    and Product designer based in
                    <br />
                    Brussels, Belgium.
                </div>
                <div class="flex gap-2.5 justify-between mt-8">
                    <img loading="lazy"
                        src="https://cdn.builder.io/api/v1/image/assets/TEMP/949187d7ee1e2afd8a023c671f59d74c39c29d054926767f17b217fed5475910?apiKey=d3784f4c52b7403885832573b3287702&"
                        class="aspect-square w-[50px]" />
                    <img loading="lazy"
                        src="https://cdn.builder.io/api/v1/image/assets/TEMP/a7d60a3960400d8a490b85c9fa9558bb8a2473d9b8b90dc4a3c6c99c2b361f7f?apiKey=d3784f4c52b7403885832573b3287702&"
                        class="aspect-square w-[50px]" />
                    <img loading="lazy"
                        src="https://cdn.builder.io/api/v1/image/assets/TEMP/20b91319aa8c73e3d645eb4aeefedc7f337acd87cc2bcea1a90ca77d18e63440?apiKey=d3784f4c52b7403885832573b3287702&"
                        class="aspect-square w-[50px]" />
                    <img loading="lazy"
                        src="https://cdn.builder.io/api/v1/image/assets/TEMP/838b7c845f263d78ac50df4c09cfc843e08ba74eb6e3e603983064d37fbee81c?apiKey=d3784f4c52b7403885832573b3287702&"
                        class="aspect-square w-[50px]" />
                    <img loading="lazy"
                        src="https://cdn.builder.io/api/v1/image/assets/TEMP/2b2f9975f0a242de8fc7b1cc38447d6fce622ea7f35746a56b62556deeadabac?apiKey=d3784f4c52b7403885832573b3287702&"
                        class="aspect-square w-[50px]" />
                    <img loading="lazy"
                        src="https://cdn.builder.io/api/v1/image/assets/TEMP/8abdd2a2e215a6ae5858c9b7aafe359917e9bc82d828f4da9d246fb1d91edebc?apiKey=d3784f4c52b7403885832573b3287702&"
                        class="aspect-square w-[50px]" />
                </div>
            </div>
            <div class="flex flex-col self-start px-5 text-2xl font-medium whitespace-nowrap text-neutral-400">
                <div>address</div>
                <div class="mt-8">contact@nawfelajari.be</div>
                <div class="mt-7">+977-9876543210</div>
            </div>
        </div>
        <div class="mt-12 w-full bg-gray-200 min-h-[1px] max-md:mt-10 max-md:max-w-full"></div>
    </div>
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            const hamburgerBtn = document.getElementById('hamburgerBtn');
            const navLinks = document.getElementById('navLinks');

            hamburgerBtn.addEventListener('click', () => {
                navLinks.classList.toggle('hidden');
            });
        });

        document.addEventListener('DOMContentLoaded', function () {
            const logoutMenuBtn = document.getElementById('logoutMenuBtn');
            const logoutMenu = document.getElementById('logoutMenu');

            // Fonction pour basculer l'affichage du menu de déconnexion
            function toggleLogoutMenu() {
                logoutMenu.classList.toggle('hidden');
            }

            // Ajoutez un gestionnaire d'événements pour le clic sur le bouton de menu de déconnexion
            logoutMenuBtn.addEventListener('click', function () {
                toggleLogoutMenu();
            });

            // Ajoutez un gestionnaire d'événements pour masquer le menu de déconnexion lorsque l'utilisateur clique en dehors de celui-ci
            document.addEventListener('click', function (event) {
                if (!logoutMenuBtn.contains(event.target) && !logoutMenu.contains(event.target)) {
                    logoutMenu.classList.add('hidden');
                }
            });
        });
    </script>
</body>

</html>