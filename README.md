README — Dine Out Melbourne.

**1. WEBSITE STRUCTURE**
assignment2/
├── index.html     *# Home page*
├── restaurants.html     *# Restaurant listing page*
├── recommend.html     *# Restaurant recommendation page*
├── register.html     *# User registration page*
├── reservation.html     *# Reservation page*
├── css/
│   └── style.css     # Single external stylesheet covering all pages.
│                        Includes desktop (>=1024px), tablet (768–1023px), and mobile (<=767px) responsive breakpoints.
├── js/
│   └── script.js     # All JavaScript for the project (see Section 3 below).
├── images/
│   ├── logo.png     # Site logo displayed in the header on every page
│   ├── hero.jpg     # Hero image on the home page
│   ├── restaurant1.jpg     # Supernormal
│   ├── restaurant2.jpg     # Vue de monde
│   ├── restaurant3.jpg     # Chin Chin
│   ├── restaurant4.jpg     # Tipo 00
│   ├── restaurant5.jpg     # Flower Drum
│   └── restaurant6.jpg     # Mamasita
└── Readme.txt     # Details refer to Submission Requirements

**2. GITHUB REPOSITORY LINK**
  *https://davenguyen05.github.io/wd_assign2_104697710/*

**3. EXPLANATION OF JAVASCRIPT VALIDATION LOGIC**
  3a. SHARED UTILITY FUNCTIONS
  Two helper functions are used throughout the file to keep the validation code clean and avoid repetition:

  - showError(inputId, errorId)
      Adds the CSS class "invalid" to the specified input element (turns its
      border red) and sets the matching error message span to visible.

  - clearError(inputId, errorId)
      Removes the "invalid" class and hides the error message span.

  - isValidEmail(email)
      Tests an email string against a regular expression that checks for the pattern: characters @ characters. two-or-more-characters.
      Returns true if the format is valid, false otherwise.

  **3b. REGISTRATION FORM VALIDATION — validateRegisterForm()**
  Triggered by the "Create Account" button (type="button", no page reload).
  Checks each field in order and calls showError or clearError for each one.
  A boolean variable "valid" starts as true and is set to false whenever any
  rule fails. The success banner is only shown if "valid" is still true after
  all checks.

  *Rules applied:*
  - Username: Must match the pattern ^[a-zA-Z0-9_]{5,}$ — at least 5 characters using only letters, numbers, and underscores.

  - Email: Must pass the isValidEmail() check described above.

  - Phone: Must match ^\d{8,15}$ — digits only, between 8 and 15 digits in total.

  - Password: Must be at least 10 characters long AND contain at least one uppercase letter,
              one lowercase letter, one digit, and one special character. Checked using a single regular
              expression with lookahead assertions.

  - Confirm PW: The value must be identical to the password field and must not be empty.

  - Gender: At least one radio button in the gender group must be selected. Checked using querySelector with: checked.

  - Dietary: At least one checkbox in the dietary group must be ticked.
              Checked using querySelectorAll and testing that the returned NodeList has a length greater than zero.

  - Country: The select element's value must not be the empty string (the placeholder "-- Select your country --" option).

  **3c. RESERVATION PAGE INITIALISATION — initReservationPage()**
  Runs automatically when the page finishes loading (via DOMContentLoaded).
  It first checks whether the restaurant dropdown exists on the page; if not,
  it exits immediately so the same listener is safe on all pages.

  *Steps performed:*
  1. Sets the "min" attribute of the date input to today's date in YYYY-MM-DD
     format. This prevents the date picker UI from allowing past dates.
  2. Reads the URL query string (e.g. ?restaurant=Chin+Chin) using the
     URLSearchParams API. If a "restaurant" parameter is found, it loops
     through the dropdown options and sets the matching one as selected.
  3. Calls updateDeposit() so the deposit panel immediately reflects
     whichever restaurant is now shown in the dropdown.

  **3d. DYNAMIC DEPOSIT DISPLAY — updateDeposit()**
  Called whenever the restaurant dropdown changes (onchange) or on page load.
  Reads the custom "data-deposit" attribute from the currently selected option and writes a human-readable message into the deposit display panel.
  Also stores the numeric deposit value in a hidden input field, so it is included when the form is submitted.

  **3e. CONDITIONAL PAYMENT FIELDS — togglePaymentFields()**
  Called via onchange on both deposit-method radio buttons (Voucher / Online).
  When "Voucher" is selected:
    - The voucher code section is shown (removes CSS class "hidden").
    - The credit card section is hidden (adds CSS class "hidden").
  When "Online Payment" is selected:
    - The credit card section is shown.
    - The voucher code section is hidden.

  **3f. CARD TYPE HANDLING — updateCardPlaceholder()**
  Called via onchange on the card type select.
  - Visa and Mastercard require 16 digits: sets maxlength="16".
  - American Express requires 15 digits: sets maxlength="15".
  The placeholder text is also updated to match.
  The card number field is cleared whenever the card type changes to prevent a previously entered number of the wrong length from being submitted.

  **3g. BILLING EMAIL COPY — copyEmail()**
  Called via onchange on the "Same as email address" checkbox. When the checkbox is ticked: copies the value from the main email field
  into the billing email field and makes the billing field read-only (also changes the background colour to indicate it is not editable.
  When unticked: clears the billing email field and restores it to editable.

  **3h. RESERVATION FORM VALIDATION — validateReservationForm()**
  Attached to the submit button via onclick="return validateReservationForm()".
  Returns true to allow the form to POST to the Mercury server, or false to
  block submission and display errors.

  *Rules applied:*
  - Full Name: Must not be empty.
  - Email: Must pass isValidEmail().
  - Phone: Must match ^\d{10,}$ — digits only, at least 10 digits.
  - Restaurant: The dropdown value must not be the empty placeholder.
  - Date: Must not be empty, and the selected date must be today or in the future (compared using JavaScript Date objects with
          time set to midnight so only the calendar date is compared).
  - Time: Must not be empty.
  - People: Must be a whole number greater than zero (parsed with parseInt and checked with isNaN).
  - Deposit method: At least one radio button must be selected.

  Conditional payment validation (only runs if a method is selected):
  - If Voucher: The voucher code field must contain exactly 12 characters.
  - If Online: Card type must be selected AND the card number must contain exactly the correct number of digits — 15 for Amex, 16 for
                Visa/Mastercard. Validated with a dynamically constructed regular expression: new RegExp("^\\d{" + requiredLen + "}$").
  - Billing Email: Must pass isValidEmail().

  If validation fails, the page scrolls smoothly to the first visible error message using scrollIntoView.

**4. KNOWN ISSUES AND LIMITATIONS**
  - No backend or database is used. The registration form shows a success message via JavaScript only; no data is stored or verified server-side.

**5. REFERENCES**
  Images:
  - Logo.png: Created by Dave Nguyen
  - images/Supernormal.jpg: *https://www.broadsheet.com.au/melbourne/restaurants/supernormal*
  - images/Vue De Monde.jpg: *https://www.bestrestaurants.com.au/vic/melbourne/melbourne-cbd/restaurant/vue-de-monde?srsltid=AfmBOorWNcPWwXLecOurhPg35OtoQ8JIVnqsy6qGGV4DLaeaBRhQc_xa*
  - images/Chin-chin.jpg: *https://www.tripadvisor.com/Restaurant_Review-g255100-d2705861-Reviews-Chin_Chin-Melbourne_Victoria.html*
  - images/Tipo00.jpg: *https://www.broadsheet.com.au/melbourne/restaurants/tipo-00*
  - images/Flower Drum.jpg: *https://www.timeout.com/melbourne/restaurants/flower-drum*
  - images/Mamasita.jpg: *https://www.broadsheet.com.au/melbourne/food-and-drink/article/melbournes-mexican-institution-mamasita-shakes-things-collins-street*
