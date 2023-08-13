
# MyFlix Movie database API
    This application is to demonstate the backend API I have built.
    You will be able to search and keep a list of movies, as well as register as a user to currate your own list and deregister.
           

             | What it does | URL | HTTP Method | Parameters for Query | REQUEST body data format | RESPONE body data format | JWT Bearer token required |
             | ------------ | ---- |----------- | -------------------- |------------------------- | ------------------------ | --------------------- |
             | Shows list of all movies in database | /movies | GET | None | None | JSON object of full movie list | Yes |
             | Shows the details for a specific movie | /movies/:title | GET | :title |None | JSON object of specific movie | Yes |
             | Shows a description of that specific genre | /movies/genre/:genreName | GET | :genreName | None | JSON object of genre description | Yes |
             | Shows info about specific director | /movies/directors/:directorName | GET| :directorName | None | JSON object with information about that director | Yes |
             | USER Section |
             | Allows user to register an account | /users/register | POST | None | JSON object of the new user, structed as follows: {"Username": " ", "Password": " ", "Email": " ", "Birthday": "date" (example 01/01/1990) }< | JSON object of the new user, with generated ID included | No |
             | Login into account and recieve bearer token | /login?Username=:USERNAME&Password=:PASSWORD | POST | :Username & :Password | None | JSON object with full user's account infomation and JWT Bearer token | No |
             | Allows user to update profile name | /users/:Username | PUT | :Username | JSON object of the user's new information, structed as follows: {"Username": " ", "Password": " " (Required Field), "Email": " ", "Birthday": "date" (example 01/01/1990) (Required Field) } | JSON object of account showing it's been updated | Yes |
             | Allows user to add movie to their favorites list | /users/:Username/favorites/:MovieID | PUT | :Username, :MovieID |  None | JSON object showing movie has been added to favorites list | Yes |
             | Allows user to remove movie to their favorites list | /users/:Username/favorites/:MovieID | DELETE | :Username, :MovieID | None | JSON object showing movie has been removed from favorites list | Yes |
             | Allows user to delete their account | /users/:UserID | DELETE | :UserID | None | JSON object stating user has been deleted | Yes |
