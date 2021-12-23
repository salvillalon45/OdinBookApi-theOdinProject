<h1 align="center">
[The Odin Project: Node] - Project: OdinBook API
</h1>

## Intro

-   The repos associated with project:
    -   [OdinBook Client](https://github.com/salvillalon45/theOdinProject-OdinBookClient)
-   This is the API for the OdinBook project. This is part of the Final Project for the Node Module. THe overall project is to create an api and build a client that will make requests to this api. The idea is to create a minimal replica of Facebook
-   For this project, I decided to practice creating a Node + TypeScript application along with JS Refactoring and Reusability
-   You can find more on the project here: [The Odin Project - OdinBook](https://www.theodinproject.com/paths/full-stack-javascript/courses/nodejs/lessons/odin-book)

## Overall

-   In this project, I tried doing the following:

    -   **TypeScript**: I was getting more comfortable with JS. The next step was for me to try TS out
    -   **Image Uploads**: I was curious to see how to implement image uploads in a web application and I am proud that I got it to work
    -   **JS Refactoring and Reusable Code**: I challenged myself to see areas that can turn into a utility. Most of my code in this repo is reusable code and utilities!

    -   **TypeScript:**

        -   I do see a difference in how I implemented the api vs the client view. I do see more use of TypeScript in the client view since I was getting more practice there. In the api, I was trying out TypeScript and you can see that I do not use it as much such as creating types and using those types to annotate functions and variables. Next project, I will try to give more use of TypeScript + Node

    -   **Image Uploads**

        -   **IMPORTANT**

            -   **Cloud Based Storage for Images**
                -   When deploying my apps, I noticed that I was getting 404 for images that I would upload. I was able to figure out how to show the images, but I realized that my current solution will not work since my images will always get deleted
                -   From Heroku [`This is crucial on Heroku, because your app’s dynos have an ephemeral filesystem. This means that all files that aren’t part of your application’s slug are lost whenever a dyno restarts or is replaced (this happens at least once daily).`](https://devcenter.heroku.com/articles/simple-file-upload)
                -   They did suggest [Simple File Upload](https://app.simplefileupload.com/pricing) but I need to pay to use this
                -   For now I commented out the code for uploading files since we need a cloud based storage. Might try Firebase next time

        -   I learned about the multer npm package and how to use it
        -   I learned how to use the `new FormData()` and append files to it in the UI and then send it to the backend.
        -   **_console.log does not work on FormData_**

            -   If you append a new item to your FormData and try to do console.log of it. It will be empty. I thought that I was not using it properly but then I found this [stackoverflow post explaining how to view the contents of FormData](https://stackoverflow.com/a/17067016)

            ```
                // Create a test FormData object
                var formData = new FormData();
                formData.append('key1', 'value1');
                formData.append('key2', 'value2');

                // Display the key/value pairs
                for (var pair of formData.entries()) {
                    console.log(pair[0]+ ', ' + pair[1]);
                }
            ```

        -   **_Sending Form Data Through Request_**
            -   Now that I knew how to use FormData. I learned that to send FormData in a request you cannot use `Content-Type: 'application/json` since it is not JSON Data
            -   After researching I found out that you do not need to include any `Content-Type` headers when sending the request. Look at the function below called `createHeadersForRequest()`
        -   **_Proper Way to Build Headers_**

            -   Then I realized I was getting TS errors in the client side since I was just creating objects and attaching them to headers. TS said that headers where missing fields. That is when I learned about the `new Headers()` api. I used this to properly created headers and set it to the headers in the request. Here is the function I used. If the request has files, then do not include Content-Type and return the headers

            ```
            function createHeadersForRequest(
                authorization?: string,
                withFilesFlag?: string
            ): Headers {
                const headers = new Headers();

                if (!!withFilesFlag) {
                    headers.append('Authorization', authorization ?? '');
                    return headers;
                }

                headers.append('Authorization', authorization ?? '');
                headers.append('Content-Type', 'application/json');

                return headers;
            }
            ```

        -   **_Cannot Send JSON and Form Data at the Same Time_**
            -   I learned that I could not send JSON and FormData at the same time in the body of a request. When I was trying to implement the image upload for Posts and Updating User Profile I had to create two `PUT` routes to handle it so whenever a user created a new post and it included an image, then it will call the `create_post` endpoint first then the `update_post_with_image` endpoint
            -   Also since I created a reusable function to send requestes. I had to make a change in the body field of the request since you cannot use JSON.stringify on FormData. This function checks the associated value of withFilesFlag. If it is true, then it will return the image file. If not it will do JSON.stringify
            ```
            function checkDataForRequest(bodyData: any, withFilesFlag?: string): any {
            	return !!withFilesFlag ? bodyData.image_obj : JSON.stringify(bodyData);
            }
            ```
        -   **Serving Static Files**
            -   Learning how the static directories work was crucial. This link helped me understand https://expressjs.com/en/starter/static-files.html

    -   **JS Refactoring and Reusable Code**
        -   One thing I practiced was reducing the lines of codes for files. I ended up creating 5 util files (inside the libs folder). I used to keep all utils in one file, but this will get messy. Separating them made it organized
        -   Also I created constants to use in error messages that will describe from what functions the error took place so that it is easier to see

## Next Steps

-   This was the last project of the Node Module. I learned a lot and I am grateful that this curriculum exists since I like how the whole course is organize to teach us the basics then step by step giving us more challenges. Each project I learned something new and I am proud of all that I did. Now that I am done with this module, this are some of the things I am looking forward to:
-   **Moving Forward**

    -   **Proficient Backend Developer**

        -   I want to become a proficient backend developer. My goal is to get involved in projects that use Node as their backend stack. I want to know how it is used in industry

    -   **Fully Use TypeScript**
        -   Learn how to use the most out of TypeScript when building a Node API
    -   **Create Reliable APIs**
        -   Learn how to create a reliable and professionally built api. I want my api to be reliable, has clear and consistent error messages that developer are not confused on what the error is, and be consistent with how data is send. Also learn what are the tools needed to create apis that can support a lot of users
    -   **Node + GraphQL + TypeScript + Apollo**
        -   Next I want to learn how to build a Node + GraphQL + TypeScript + Apollo api. I know that web development is transitioning to using query languages like GraphQL to fetch data instead of REST due to all the benefits it brings. I want to learn how to create one so that I am more comfortable with GraphQL!

## Technologies:

-   JWT
-   Heroku
-   Node
-   Mongoose
-   Multer
-   TypeScript
