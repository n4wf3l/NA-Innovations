<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>About — NA</title>
    <link rel="icon" href="{{ asset('NAlogo2.png') }}" type="image/x-icon" />
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,600&display=swap" rel="stylesheet" />
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
    <script src="//unpkg.com/alpinejs" defer></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.js"></script>
<link href="https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.css" rel="stylesheet">

    <!-- Styles -->
    <link rel="stylesheet" href="{{ asset('/about.css') }}">
    @vite('resources/js/public.ts')
</head>

<body>
<a href="#" id="scrollToTop"><i class="fas fa-arrow-up"></i></a>
    <div id="site">
        <!-- Header avec le logo et le menu hamburger (qui remplace les nav links sur les petits écrans) -->
        <div class="flex flex-col py-12 bg-gray-900">
            <div class="flex justify-between items-center self-center mt-1 w-full max-w-[1298px] px-4 relative"> <!-- Ajoutez relative ici pour positionner les éléments absolus par rapport à celui-ci -->
                <div class="text-3xl font-bold text-white" data-aos="zoom-in">NA
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
    class="hidden md:flex gap-5 justify-between pr-5 text-lg font-medium text-white whitespace-nowrap bebas-neue-regular"
    style="letter-spacing: 2px" data-aos="zoom-in">
    <div>
        <a href="/" class="hover:text-teal-300 transition duration-500">Home</a>
    </div>
    <div>
        <a href="{{ url('/') }}#about" class="hover:text-teal-300 transition duration-500">Services</a>
    </div>
    <div>
        <a href="{{ url('/') }}#projects" class="hover:text-teal-300 transition duration-500">Projects</a>
    </div>
    <div>
        <a href="{{ route('about') }}" class="text-teal-300 hover:text-teal-300 transition duration-500">About</a>
    </div>
    <div>
        <a href="{{ route('posts.index') }}" class="hover:text-teal-300 transition duration-500">News</a>
    </div>
    <div>
        <a href="{{ route('contact') }}" class="hover:text-teal-300 transition duration-500 border border-solid rounded-[20.5px] p-3"> <i class="fas fa-envelope"></i> Contact</a>
    </div>
    @auth
    <div>
        | <a href="{{ url('/dashboard') }}" class="hover:text-teal-300">Dashboard</a>
    </div>
    @endauth
</div>
</div>

            <div class="flex gap-5 justify-between self-center mt-44 w-full max-w-[1012px] max-md:flex-wrap max-md:mt-10 max-md:max-w-full w-full max-w-[1012px] mx-auto" data-aos="zoom-in">
                <div class="flex flex-col flex-1 px-5 max-md:max-w-full">
                    <div class="text-center mb-10 mt-11 text-9xl font-bold text-white max-md:mt-10 max-md:max-w-full max-md:text-4xl">
                        About Me
                    </div>
                    <div class="text-center mb-10 mt-11 text-4xl font-bold text-white max-md:mt-10 max-md:max-w-full max-md:text-2xl">
                    <em>In every success story, there is an individual with a unique vision and deep values.</em>
                    </div>
                 <div class="hidden mt-10 md:flex flex-wrap gap-5 justify-between self-center mb-20 max-w-[1070px]">
        <img loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/88cfe832740fbad72af762269deeb7853d23d146e7bb9ebd24562abdc05bfcb1?apiKey=d3784f4c52b7403885832573b3287702&"
            class="flex-1 w-full aspect-[1.49] fill-sky-200" /> <img loading="lazy"
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
            </div>
        </div>

        <section class="px-8 py-12 bg-gray-100">
    <div class="max-w-4xl mx-auto" data-aos="zoom-in">
    <h2 class="text-3xl font-bold mb-6 text-center">Who am I?</h2>
<p class="text-lg mb-6 text-center">
    Hello, my name is Nawfel Ajari and I am a computer engineer passionate about creating captivating and functional online experiences. By merging creativity with solid technical skills, I strive to bring innovative digital concepts to life. My goal is to create websites and mobile applications that not only attract visually but also offer optimal performance and exceptional user-friendliness.
</p>
<p class="text-lg mb-6 text-center">
    In 2023, I took a new step forward by venturing into entrepreneurship and offering my own services. This is how <em>NA Innovations</em> was born, an initiative aimed at providing innovative digital solutions and meeting the diverse needs of our clients. With NA, every pixel becomes a promise of the future.
</p>
<p class="text-lg mb-6 text-center">
    A year later, I diversified my activities by also venturing into video editing, particularly with documentaries and interviews with professional footballers, as well as photography, mainly covering sporting events.
</p>
<p class="text-lg mb-6 text-center">
    My company has been strengthened by collaborations with true professionals in video editing and graphic design, services that are now an integral part of our offerings.
</p>

<!-- Logos -->
<h3 class="text-2xl font-semibold text-center mb-6">Company Evolution</h3>
<div class="flex justify-center items-center mb-10 max-w-2xl mx-auto">
    <div class="flex flex-col items-center mx-4 md:mx-8">
        <img src="{{ asset('justlogo.png') }}" alt="Logo 2023" class="h-24 mb-2 transition-transform duration-300 transform hover:scale-110">
        <p class="text-sm text-center">2023 - 2024</p>
    </div>
    <div class="flex flex-col items-center mx-4 md:mx-8">
        <img src="{{ asset('logonai.png') }}" alt="Logo 2024" class="h-24 mb-2 transition-transform duration-300 transform hover:scale-110">
        <p class="text-sm text-center">2024 - 2025</p>
    </div>
    <div class="flex flex-col items-center mx-4 md:mx-8">
        <div class="h-24 w-24 rounded-full overflow-hidden flex items-center justify-center bg-gray-900 mb-2 transition-transform duration-300 transform hover:scale-110">
            <div class="text-white text-3xl font-bold flex items-center justify-center w-full h-full">
            NA
            </div>
        </div>
        <p class="text-sm text-center">Since 2025</p>
    </div>
</div>

    <h2 class="text-3xl font-bold mb-6 text-center" data-aos="zoom-in">Skills</h2>

<p class="text-lg mb-6" data-aos="zoom-in">
    As a passionate developer, I have acquired strong technical expertise and a proven ability to create effective software solutions. Here is an overview of my technical skills:
</p>

<ul class="list-disc pl-6 mb-6">
    <li class="text-lg mb-4" data-aos="zoom-in">
        👨🏽‍💻 Diverse Portfolio on GitHub: My commitment to solving complex problems and teamwork is reflected in my numerous projects available on GitHub. Each of these projects demonstrates my ability to develop efficient and innovative software solutions.
    </li>
    <li class="text-lg mb-4" data-aos="zoom-in">
        📚 Strong Foundation and Growth Ambition: Graduated in programming from Erasmushogeschool Brussel, I have acquired a solid foundation in the fundamental principles of software development. Currently, I specialize in software engineering, with particular expertise in Laravel 10 PHP, to deepen my skills and understanding of software systems.
    </li>
    <li class="text-lg mb-4" data-aos="zoom-in">
        💻 Technical Skills: I am proficient in a variety of programming languages, including JavaScript (React, Node.js), C#, and Java for Android. Additionally, I am comfortable with modern frameworks that allow me to develop robust and scalable web and mobile applications.
    </li>
    <li class="text-lg mb-4" data-aos="zoom-in">
        🌐 Language Mastery and Adaptability: In addition to my technical skills, I am also fluent in English, Dutch, and French, enabling me to adapt and collaborate effectively in multicultural environments.
    </li>
</ul>
    </div>
</section>

      <section class="px-8 py-12 text-white">
        <div class="max-w-4xl mx-auto">
        <h2 class="text-3xl font-bold mb-6 text-center" data-aos="zoom-in">Specialization</h2>

        <p class="text-lg mb-6 text-right" data-aos="zoom-in">
        My specialization focuses on all aspects related to sports systems, with a particular emphasis on football. My expertise extends to the creation of various platforms, such as sports writing websites, portals for football or futsal clubs, as well as administration systems for these clubs.
    </p>

    <p class="text-lg mb-6" data-aos="zoom-in">
        I am capable of designing advanced features, such as the team of the week, using data from APIs specialized in the field of football. These features aim to provide an immersive and interactive experience to users, while meeting the specific needs of clubs and fans.
    </p>

    <p class="text-lg mb-6 text-right" data-aos="zoom-in">
        Most of my academic projects completed at Erasmushogeschool were developed in collaboration with the Belgian Football Federation. Some of these projects are available on my GitHub profile, providing an insight into my work and skills in this exciting field.
    </p>

    <div class="flex justify-center mt-20 mb-20" data-aos="zoom-in">
        <div class="videoContainer">
            <iframe allowfullscreen="allowfullscreen" class="mainVideo" controls="controls"
                src="https://www.youtube.com/embed/AHnA9_U4K5o"></iframe>
            <img class="dotsImg image-block"
                src="https://workik-widget-assets.s3.amazonaws.com/widget-assets/images/cw3.svg">
        </div>
    </div>
</div>
</section>
</div>

<section class="px-8 py-12 bg-gray-100">
    <div class="max-w-4xl mx-auto" data-aos="zoom-in">
        <h2 class="text-3xl font-bold mb-6 text-center">My vision</h2>

        <p class="text-lg mb-6 text-center">As a computer engineer, my passion lies in creating innovative and highly functional digital experiences. I strive to blend creativity with solid technical expertise to shape software solutions that surpass expectations.
    </p>

    <p class="text-lg mb-6 text-center">My primary goal is to design websites and mobile applications that combine aesthetics, performance, and user-friendliness. I am committed to fully understanding the needs of my clients in order to translate their vision into tangible and innovative solutions.
    </p>

    <p class="text-lg mb-6 text-center">
    With a specialization in sports systems, particularly football, I seek to redefine how clubs interact with their fans and manage their operations. I develop advanced features and immersive experiences to enhance user engagement.
    </p>
    <p class="text-lg mb-6 text-center">
    Additionally, I am constantly seeking learning and improvement, exploring new technologies and expanding my skills to remain at the forefront of innovation. My ultimate goal is to deliver world-class solutions that truly transform the digital landscape.
    </p>
    <h2 class="text-3xl font-bold mb-6 text-center" data-aos="zoom-in">Distinctive</h2>

    <p class="text-lg mb-6" data-aos="zoom-in">
    As a computer engineer, I stand out for my exceptional versatility. With extensive technical skills, I am proficient in software development, graphic editing, and photography. This ability to juggle multiple domains allows me to offer comprehensive and integrated solutions to my clients. Moreover, my fluency in French, Dutch, and English enables me to effectively communicate with a diverse clientele, enhancing my reach and ability to deliver quality projects internationally. 🌐
    </p>

    <p class="text-lg mb-6" data-aos="zoom-in">
    In Belgium, I am the only professional offering specialized services in the field of football. Leveraging my partnership with the Belgian Football Federation and my academic projects carried out in collaboration with renowned clubs, I have gained a deep understanding of the Belgian football ecosystem. This unique expertise allows me to design tailor-made solutions that meet the specific needs of clubs, fans, and sports organizations, while staying ahead of the latest trends and technologies. ⚽
    </p>

    <p class="text-lg mb-6" data-aos="zoom-in">
    Quality and price are essential elements in any project, and I strive to offer an unmatched combination of both. As a industry professional, I am committed to providing high-quality solutions that exceed my clients' expectations while remaining competitive in terms of pricing. My value-added approach ensures that my clients not only benefit from outstanding results but also from excellent value for money that optimizes their return on investment. 💼💰
    </p>

    <p class="text-lg mb-6" data-aos="zoom-in">
    My commitment to excellence is at the core of everything I do. I constantly strive to achieve the highest standards of quality in every project I undertake. Whether developing innovative software solutions, capturing precious moments through photography, or creating impactful visuals through graphic editing, I pride myself on delivering work of exceptional quality at every stage of the process. My passion for excellence is reflected in the results I deliver to my clients, making me a trusted partner for their most ambitious projects. 🏅🚀
    </p>
</div>
</section>


@include('components.footer')
<script src="{{ asset('/about.js') }}"></script>
</body>

</html>