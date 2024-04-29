# nawfelajari.be

## Introduction

This project is a dynamic website developed using Laravel PHP framework. It serves as a portfolio for showcasing deployed sites and academic projects, with additional features including an about page, a CRUD functionality for a customized 'blog' accessible via a dashboard, and a functional email sender for the contact page. Users also have the option to log in to access the administration panel.

## Project Setup

Follow these steps to set up and run the project locally:

-   Open your terminal
-   Use these commands :

    -   composer install
    -   cp .env.example .env
    -   php artisan key:generate
    -   php artisan migrate:fresh --seed (Wait for Seeding database)
    -   php artisan serve

    Open a new terminal and use these commands:

    -   npm install
    -   npm run dev

Now open your browser on [http://127.0.0.1:8000] and enjoy our website!

## Configurations and Structure

-   Go to the .env file and copy this code from line 31 to 38:
    MAIL_MAILER=smtp
    MAIL_HOST=smtp.googlemail.com
    MAIL_PORT=465
    MAIL_USERNAME=//youremail//
    MAIL_PASSWORD=//yourpassword//
    MAIL_ENCRYPTION=ssl
    MAIL_FROM_ADDRESS=//youremail//
    MAIL_FROM_NAME="nawfelajari.be"

    The XAMPP software is essential to activate the Apache and MySQL modules. By clicking the 'Admin' button next to start for MySQL, you will have access to the database with PhpMyAdmin.

    ### About Laravel

Laravel is a web application framework with expressive, elegant syntax. We believe development must be an enjoyable and creative experience to be truly fulfilling. Laravel takes the pain out of development by easing common tasks used in many web projects, such as:

-   [Simple, fast routing engine](https://laravel.com/docs/routing).
-   [Powerful dependency injection container](https://laravel.com/docs/container).
-   Multiple back-ends for [session](https://laravel.com/docs/session) and [cache](https://laravel.com/docs/cache) storage.
-   Expressive, intuitive [database ORM](https://laravel.com/docs/eloquent).
-   Database agnostic [schema migrations](https://laravel.com/docs/migrations).
-   [Robust background job processing](https://laravel.com/docs/queues).
-   [Real-time event broadcasting](https://laravel.com/docs/broadcasting).

Laravel is accessible, powerful, and provides tools required for large, robust applications.

### Learning Laravel

Laravel has the most extensive and thorough [documentation](https://laravel.com/docs) and video tutorial library of all modern web application frameworks, making it a breeze to get started with the framework.

You may also try the [Laravel Bootcamp](https://bootcamp.laravel.com), where you will be guided through building a modern Laravel application from scratch.

If you don't feel like reading, [Laracasts](https://laracasts.com) can help. Laracasts contains over 2000 video tutorials on a range of topics including Laravel, modern PHP, unit testing, and JavaScript. Boost your skills by digging into our comprehensive video library.

## Programming languages, technologies and frameworks

The programming language used in this project is PHP. A portion of the project has been generated using Laravel 10 framework. For the frontend, we utilized Tailwind to simplify the design of our views.

-   Programming languages : PHP
-   Framework : Laravel 20
-   Database management system : PhpMyAdmin (via XAMPP)
  
-   Styling : HTML, CSS and JS
-   JavaScript Framework: Ajax
-   Styling frameworks : Tailwind
  
## Usage

Once the application is installed and running, you can use it to showcase your deployed sites and academic projects on the welcome page. The about page provides information about you or your business. You can manage your blog posts using the CRUD functionality accessible via the dashboard. Additionally, visitors can contact you using the functional email sender on the contact page.

## Contributing

If you'd like to contribute to this project, you can follow these steps:

1. Fork the repository on GitHub.
2. Clone your forked repository to your local machine.
3. Create a new branch to work on: `git checkout -b feature/new-feature`.
4. Make your changes and commit them: `git commit -am 'Add new feature'`.
5. Push your changes to your forked repository: `git push origin feature/new-feature`.
6. Create a pull request on the original repository's GitHub page.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
