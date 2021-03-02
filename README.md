# Alexa-nodejs-small-business-lead-form

### How to Build TS file:

* Go to project folder
* Open command prompt from there
* Go to lambda folder
* There are two way to build
    * Compile TS to JS (one-to-one mapping)
        * For Windows: 
        > `tsc.cmd`
        * For Mac/Linux: 
        > `tsc`
        * Once build completed then **.tsc** folder will create
    * Compile TS to JS and create one minified index.js
    > `npm run build`

### How to Deploy to Alexa skill:

* For multiple JS files:
    * Create the same directoty structure of **.tsc** folder in Skill Code->lambda
    * Copy all the JS files content one-by-one
    * Copy the .env file
    * Copy the package.json
    * Save all the files
    * Deploy & test
    
* For single JS file:
    * Create index.js and copy the content
    * Copy the .env file
    * Copy the package.json
    * Save all the files
    * Deploy & test