export const enUS = {
  translation: {
    SKILL_NAME: 'Small Business Lead Form',
    GREETING: [
      'What is the financing option that interests you? Commercial Real Estate or say 1, Loans or say 2, Lines of Credit or say 3',
      'Which financing option would you be interested in? Choose from Commercial Real Estate or say 1, Loans or say 2, Lines of Credit or say 3'
    ],
    GREETING_REPROMPT: [
      'Choose any financing option that interests you like Commercial Real Estate or say 1, Loans or say 2, Lines of Credit or say 3'
    ],
    FINANCING_OPTION_INVALID: [
      'Invalid option? Please choose from Commercial Real Estate or say 1, Loans or say 2, Lines of Credit or say 3'
    ],
    FIRST_NAME_INTENT: [
      'Thanks for your interest in %s. Could you please provide me your first name?',
      'Thanks for your interest in %s. May I know your first first name?',
      '%s great. Could you please provide me your first name?'
    ],
    LAST_NAME_INTENT: [
      'Hi %s! what is your last name?',
      'Hello %s! what is your last name?',
      'Hi %s! your last name?',
      'Hello %s! your last name?',
    ],
    PHONE_INTENT: [
      'What contact number can you be reached at?',
      'What is a good contact number to reach you?',
      'Your contact number please?',
      'What\'s the best number to contact you?',
    ],
    PHONE_INVALID: [
      'Please enter a valid 10 digit phone number.',
      'Please enter a valid phone number',
      'Please enter a valid contact number',
      'Could you please enter a valid contact number'
    ],
    PHONE_CONFIRM_INTENT: [
      '<speak>I got it as <say-as interpret-as="digits">%s. </say-as> Is this correct?</speak>',
      '<speak>You said <say-as interpret-as="digits">%s. </say-as> Is this correct?</speak>',
      '<speak>Contact number recieved as <say-as interpret-as="digits">%s. </say-as> Is this correct?</speak>'
    ],
    YES_NO_INTENT: [
      'Would you like to provide your email address? Please say Yes or No',
      'Would you share you email address? Please say Yes or No',
      'Would you like to give your email address? Please say Yes or No?'
    ],
    YES_NO_INTENT_REPROMPT: [
      'Would you share your email address? Please say Yes or No',
      'Would you like to add your email address? Please say Yes or No'
    ],
    YES_NO_INVALID: [
      'Please say Yes or No only, if you would like to share your email address?',
    ],
    EMAIL_ADDRESS: [
      'What is your email address?',
      'Your email address please?',
    ],
    EMAIL_ADDRESS_REPROMPT: [
      'Email address please?',
      'Your email address please?'
    ],
    INVALID_EMAIL_ADDRESS: [
      'The email address that you have provided is not valid. Please say again.',
      'This email address is invalid. Please provide a valid one.',
      'Please provide a valid email address.'
    ],
    INVALID_EMAIL_ADDRESS_REPROMPT: [
      'The email address that you have provided is invalid. Please say again.',
      'This email address is invalid. Please provide a valid one.',
      'Please provide a valid email address.'
    ],
    LEAD_FORM_CONFIRM: 'Thanks for providing the details. One of our business representatives will contact you shortly.',
    HELP: [
      'Please provide your preference and details so a consultant can get in touch with you.'
    ],
    HELP_REPROMPT: [
      'Please provide your preference and details so a consultant can get in touch with you.'
    ],
    CANCEL_STOP_RESPONSE: [
      'Good bye',
      'Okay. I\'ll be here if you need me.',
      'See you soon',
    ],
    ENV_NOT_CONFIGURED: 'Environment variables are not set. Please see the readme file for help.',
    ERROR: 'Sorry, there is an error while processing your request.',
    ERROR_REPROMPT: 'Sorry, there is an error while processing your request.',

    EMAIL_SUBJECT: 'Greetings from Wells Fargo',
    EMAIL_BODY: 'Hi %s,\n\nThanks for your interest in Wells Fargo products. One of our business representatives will contact you shortly on the contact number %s that you have provided.\n\nBest Regards,\nWells Fargo Team'
  },
};