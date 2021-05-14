# User stories

1. **As a new user (driver/user) I want to be able to create my own profile and save it, so I don’t have to sign up every time**
    - Feature Tasks:
      - User can create account with unique username and password.
      - The username and password have to be saved to data base.
    - Acceptance Test:
      - After entering a unique username and password, account creation success message pops up
      - Ensure user can sign in with the same username and password


2. **As a rider, I want to alert the system when I need a new ride**
    - Feature Tasks:
      - Rider can request a new ride using his current location and requesting destination.
      - Request is sent to “ride pick up queue”.
    - Acceptance Test:
      - User is able to provide information about his current location
      - User is able to provide information about his destination
      - After request is made, rider gets a message with estimate arrival time of driver.

3. **As a rider, I want to have ability to determine my current location** 
    - Feature Tasks:
      - Rider can allow access to his current location.
      - Rider can deny access to his current location 
    - Acceptance Test:
      - Ensure location is determined correctly


4. **As a driver, I want to be able to get notified when there is a new trip request.**
    - Feature Tasks:
      - Driver gets notified if there is request for a new ride.
      - Driver is able to accept a request for a new ride.
      - Driver is able to reject a request for a new ride
      - Driver is able to see details of upcoming ride (rider’s name, pick up and drop off locations)
    - Acceptance Test:
      - Driver is able to see all requests in “ride pick up queue”

5. **As an administrator, I want to be able to monitor general events (ride request, ride pick up, ride ended)**
    - Feature Tasks:
      - Administrator gets notified when there is a new request for a ride.
      - Administrator gets notified when driver accept a request from a rider.
      - Administrator gets notified when trip is ended
    - Acceptance Test:
      - Administrator is able to see all information about trip (rider’s name, driver’s name, pick up location, drop off location)
      - Only administrator with proper role assigned (‘admin’) can have access to this information 
