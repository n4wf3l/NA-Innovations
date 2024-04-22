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
    <a href="/" class="hover:text-teal-300">Accueil</a>
</div>
<div>
    <a href="{{ route('about') }}" class="text-teal-300 hover:text-teal-300">A propos</a>
</div>
<div>
    <a href="" class="hover:text-teal-300">Projets</a>
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
                        Développement web et mobile | Montage vidéo | Photographie | Logo
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
                    class="flex-1 shrink-0 w-full aspect-square" />
                <img loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/a7d60a3960400d8a490b85c9fa9558bb8a2473d9b8b90dc4a3c6c99c2b361f7f?apiKey=d3784f4c52b7403885832573b3287702&"
                    class="flex-1 shrink-0 w-full aspect-square" />
                <img loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/20b91319aa8c73e3d645eb4aeefedc7f337acd87cc2bcea1a90ca77d18e63440?apiKey=d3784f4c52b7403885832573b3287702&"
                    class="flex-1 shrink-0 w-full aspect-square" />
                <img loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/838b7c845f263d78ac50df4c09cfc843e08ba74eb6e3e603983064d37fbee81c?apiKey=d3784f4c52b7403885832573b3287702&"
                    class="flex-1 shrink-0 w-full aspect-square" />
                <img loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/9403ecab02afe3c00fe0542805a71a7548580a16b9cff1677033d82ad6a60f77?apiKey=d3784f4c52b7403885832573b3287702&"
                    class="flex-1 shrink-0 w-full aspect-square" />
                <img loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/8abdd2a2e215a6ae5858c9b7aafe359917e9bc82d828f4da9d246fb1d91edebc?apiKey=d3784f4c52b7403885832573b3287702&"
                    class="flex-1 shrink-0 w-full aspect-square" />
            </div>
            <div class="self-center mt-48 w-full max-w-[1300px] max-md:mt-10 max-md:max-w-full">
                <div class="flex gap-5 max-md:flex-col max-md:gap-0 max-md:">
                    <div class="flex flex-col w-[56%] max-md:ml-0 max-md:w-full">
                        <div
                            class="flex flex-col grow px-5 text-3xl leading-10 text-black max-md:mt-10 max-md:max-w-full">
                            <div class="text-xl max-md:max-w-full">Our Philosophy</div>
                            <div class="mt-11 font-bold max-md:mt-10 max-md:max-w-full">
                                Lorem Ipsum is simply dummy text of the printing and typesetting
                                industry.
                            </div>
                            <div class="mt-16 font-bold max-md:mt-10 max-md:max-w-full">
                                Lorem Ipsum has been the industry's standard dummy text ever since
                                the 1500s, when an unknown printer took a galley of type and
                                scrambled it to make a type specimen book.
                            </div>
                            <div
                                class="justify-center self-start px-7 py-5 mt-14 text-base leading-6 text-purple-500 uppercase whitespace-nowrap border-2 border-purple-500 border-solid rounded-[29.5px] max-md:px-5 max-md:mt-10">
                                Meet the team
                            </div>
                        </div>
                    </div>
                    <div class="flex flex-col ml-5 w-[44%] max-md:ml-0 max-md:w-full">
                        <div class="mx-auto mt-14 max-w-full bg-fuchsia-100 h-[474px] w-[530px] max-md:mt-10"></div>
                    </div>
                </div>
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
    </script>
</body>

</html>