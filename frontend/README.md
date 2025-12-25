# Current Updates(Dec 2025) (Update must be made as Project progress)

## Frontend focused full stack:

### a) Authentication:

i) Google and Apple Signin buttons have been designed.

ii) Google Auth has been set up but need to be tested. [Setup Instructions](https://developers.google.com/identity/protocols/oauth2)

Note: Google Client Id has been created already. Please ask your supervisor or your predecessor. And Setup Instructions for external platforms such as React Native, Node, Supabase are available in their respective websites.


iii) Apple Auth requires Apple Developers Portal which can be charged. [Research can be done]

### b) Profile Picture:

i) Users should be able to upload and update their Profile Pictures.

ii) Storage(S3 Buckets) in Supabase is used for this feature.

iii) Some work in the backend has been done but a lot more progress need to be made.

iv) Users should also be able to upload their profile pics at Sign in.

### c) Theme:

i) Dark mode, Color combination features need to developed.

### For Updates on Backend, refer backend/README.md

### Note: There are many features, such as Supabase authentication, which can be implemented directly in React Native which might reduce latency without involving backend. But we follow frontend to backend to database architecture to maintain code readability and easy to address errors. But this can be changed based on code complexity and features.
