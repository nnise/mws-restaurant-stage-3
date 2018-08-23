# Restaurant Reviews
---
With this project I became a certified Mobile Web Specialist thanks to the Udacity-Google EMEA Scholarship 2018.

This is a functional mobile-ready web application that includes standard accesibility features, is reponsive on different sized displays and is accessible for screen reader use. The application uses Service Worker technology and Background Sync to create a semless offline experience for users.
Users are allowed to create their own reviews for each restaurant and mark their favorites.


The scores of this project in the Lighthouse audit are:
Progressive Web App 99<br>
Performance score 92<br>
Accessibility 94<br>



### How to run this application?

You have to run two shell windows on your machine, one acting as the server and the other as the client.

To run the Local Development API Server

[node server](#local-development-api-server)
[web app](#run-the-webApp)


## Local Development API Server

Development local API Server
Location of server = /server Server depends on node.js LTS Version: v6.11.2 , npm, and sails.js Please make sure you have these installed before proceeding forward.

Great, you are ready to proceed forward; awesome!

Let's start with running commands in your terminal, known as command line interface (CLI)

Install project dependancies
### npm i
Install Sails.js globally
### npm i sails -g
Start the server
### node server
You should now have access to your API server environment
debug: Environment : development debug: Port : 1337


## Run the WebAPP

For running the website, be sure that 

1. In this folder, start up a simple HTTP server to serve up the site files on your local computer. Python has some simple tools to do this, and you don't even need to know Python. For most people, it's already installed on your computer. 

In a terminal, check the version of Python you have: `python -V`. If you have Python 2.x, spin up the server with `python -m SimpleHTTPServer 8000` (or some other port, if port 8000 is already in use.) For Python 3.x, you can use `python3 -m http.server 8000`. If you don't have Python installed, navigate to Python's [website](https://www.python.org/) to download and install the software.

2. With your server running, visit the site: `http://localhost:8000/dist`

### Note about ES6

Most of the code in this project has been written to the ES6 JavaScript specification for compatibility with modern web browsers and future proofing JavaScript code. As much as possible, try to maintain use of ES6 in any additional JavaScript you write. 



