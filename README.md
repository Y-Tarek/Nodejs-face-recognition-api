# Nodejs-face-recognition-api
  A simple api for my personal usage that is compatable with any client side platform, it supports authintication,authorization services plus a face-recognition model for identifing faces of missing children.
## Prerequisite
   >node v10.16.0 or higher
 
   >mongodb
  
   >Requirments for your os for the face-recognition package follow this link: https://www.npmjs.com/package/face-recognition
  
  ## Installation
  Cloning to the project: 
  
     git clone https://github.com/Y-Tarek/Nodejs-face-recognition-api.git
   
   then run: 
      
      npm install 
   
   If you didnot install the face-recognition package requirments for your operating system and make sure the package is workong fine the project. will crash.
   
   Then in the project directory run:
   
    node server/server.js
   
   
  ## Usage
   Once the project runs it will log the URL with your ip addresss to use in making htto requests,then you can use any of the 
   requests in server/server.js.
   
   User Services:
    
   Request | Performs
------------ | -------------
/register | Registeration of a user with data in the server/db/models/user.js file
/login | Authinticating a user by UserNameOrEmail and password feilds
/post | Uploading image and data of a missing or found child you can find these data in server/db/models/post.js file
/search/gender&type | Search for a missing or found child with an image (type:status of the searched child missing or found,gender:gender of the child)
/profile | Getting user data
/editProfile | Updating user data
/myPosts | Getting the posts of current user
/mypost/id | Getting a specific Post
/deletePost/id | Deleting specific Post
/logout | Sign out Current User

### Note:
   > You cannot make any of these requests unless you are logged in and you have to provide the authToken in the Authorization header as a Bearer Token.
   
   Admin Services:
   
  Request | Performs
------------ | -------------
/users | Getting all users
/allPosts | Getting all posts
/deleteUser/id | Deleting a specific user
/deletePost/id | Deleting a specific Post

   
   

