<!DOCTYPE html>
<html lang="en">
    <head>
        <title>myFlix Documentation page</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="shortcut icon" type="image/png" href="#" sizes="32x32">
        <!--Normalizer-->
        <!-- <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet"> 
        <link rel="stylesheet" type="text/css" href="../css/styles.css"> -->
    </head>
    <body>
        <header class="page-header">
            <h1> Documentation Page</h1>
        </header>

        <main>
             <p>
                This application is to demonstate the backend API I have built.
                You will be able to search and keep a list of movies, as well as register as a user to currate your own list and deregister.
             </p>

             <table> 
                <thead>
                    <tr>
                        <th>What it does</th>
                        <th>URL</th>
                        <th>HTTP Method</th>
                        <th>Parameters for Query</th>
                        <th>REQUEST body data format</th>
                        <th>RESPONE body data format</th>
                    </tr>
                </thead>
                
                <tbody>
                    <tr>
                        <td>Shows list of all movies in database</td>
                        <td>/movies</td>
                        <td>GET</td>
                        <td>none</td>
                        <td>none</td>
                        <td>JSON object of full movie list</td>
                    </tr>

                    <tr>
                        <td>Shows the details for a specific movie</td>
                        <td>/movies/:title</td>
                        <td>GET</td>
                        <td>:title</td>
                        <td>none</td>
                        <td>JSON object of specific movie</td>
                    </tr>
                    <tr>
                        <td>Shows a description of that specific genre.</td>
                        <td>/movies/genre/:genreName</td>
                        <td>GET</td>
                        <td>:genreName</td>
                        <td>none</td>
                        <td>JSON object of genre description</td>
                    </tr>
                    <tr>
                        <td>Shows get info about specific director</td>
                        <td>/movies/:directors/:directorName</td>
                        <td>GET</td>
                        <td>:directorName</td>
                        <td>none</td>
                        <td>JSON object with information about that director</td>
                    </tr>
                    
                    <!-- USER Section -->

                    <tr>
                        <td>Allows user to register an account</td>
                        <td>/users/register</td>
                        <td>POST</td>
                        <td>none</td>
                        <td>JSON object of the new user, structed as follows: {"Username": " ", "Password": " ", "Email": " ", "Birthday": "date" (example 01/01/1990) }</td>
                        <td>JSON object of the new user, with generated ID included</td>
                   </tr>
                     <tr>
                        <td>Allows user to update profile name</td>
                        <td>/users/:Username</td>
                        <td>PUT</td>
                        <td>:Username</td>
                       <td>JSON object of the user's new name, structed as follows: {name: " "}</td>
                        <td>JSON object of the stating the name as been changed </td>
                    </tr>
                     <!-- <tr>
                        <td>Shows all movies on favorites list</td>
                        <td>/user/:Username/favorites</td>
                        <td>GET</td>
                        <td>:id</td>
                        <td>None</td>
                        <td>JSON object of user's favorites movies list</td>
                    </tr> -->
                     <tr>
                        <td>Allows user to add movie to their favorites list</td>
                        <td>/users/:Username/favorites/:MovieID</td>
                        <td>PUT</td>
                        <td>:Username, :MovieID</td>
                        <td>None</td>
                        <td>JSON object stating movie has been added to favorites list</td>
                    </tr>
                     <tr>
                        <td>Allows user to remove movie to their favorites list</td>
                        <td>/users/:Username/favorites/:MovieID</td>
                        <td>DELETE</td>
                        <td>:Username, :MovieID</td>
                        <td>None</td>
                        <td>JSON object stating movie has been removed from favorites list</td>
                    </tr>
                     <tr>
                        <td>Allows user to delete their account</td>
                        <td>/users/:UserID</td>
                        <td>DELETE</td>
                        <td>:UserID</td>
                        <td>None</td>
                        <td>JSON object stating user has been deleted</td>
                    </tr>                
                </tbody>
             </table>
        </main>
    
        <script src="#"></script>
    </body>
</html>