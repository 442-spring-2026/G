### Section: Authentication (Pre-Login)

### Context: Unauthenticated User on Login/Sign-up Pages

L1: Given the login page, the system must display an email input field.

L2: Given the login page, the system must display a password input field.

L3: When the user clicks "Sign in with Google," the system must use Firebase Authentication to trigger a Google OAuth provider popup.

L4: When the user enters valid credentials and clicks "Log in," the system must redirect the user to the Dashboard (Saved Medicine Cabinet).

L5: When the user enters an incorrect password, the system must display an error message.

L6: When the user clicks the "Forgot Password" link, the system must navigate them to the Password Recovery page.

S1: Given the sign-up page, the system must display the input field for Name.

S2: Given the sign-up page, the system must display the input fields for Email.

S3: Given the sign-up page, the system must display the input fields for Password.

S4: When a user clicks "Sign Up" with an empty name field, the system must display an error message.

S5: When a user clicks "Sign Up" with an empty email field, the system must display an error message.

S6: When a user clicks "Sign Up" with an empty password field, the system must display an error message.

S7: When a user submits a valid sign-up form, the system must create a new record in the Firebase Users collection.

S8: When a new account is successfully created, the system must automatically redirect the user to the Dashboard (Saved Medicine Cabinet).

S9: When a user submits a sign-up form with an email that is already registered, the system must display an error message indicating the account already exists.

### Section: Navigation (Post-Login)

### Context: Authenticated User (Global Sidebar/Header)

N1: The system must display a permanent navigation bar on all pages except Authentication pages.

N2: The nav bar should have an icon for "Home”

N3: The nav bar should have an icon for "Add medicine”

N4: The nav bar should have an icon for "Reminders”

N5: When the user clicks the "Home" icon on the nav bar, the system must navigate to the Saved Medicine Cabinet page.

N6: When the user clicks the “Add medicine” icon on the nav bar, the system must navigate to the Add Medicine page.

N7: When the user clicks the “Reminders” icon, the system must navigate to the Past Reminders/History page.

### Section: Add Medicine (Form Entry)

### Context: Authenticated User on Add Medicine Page

M1: The system must provide an upload input that accepts image file types from the user's local directory.

M2: When a file is selected, the system must display a preview of the image before saving.

M3: The system must provide a text input field for "Medication Name."

M4: The system must provide a text input field for "Dosage."

M5: The system must provide a text input field for "Additional Notes."

M6: The system must provide a time picker that saves the reminder time in 24-hour format.

M7: The system must provide a date picker for the user to select a medication expiration date.

M8: When the user clicks "Save" and the expiration date is in the past, the system must display a "Date invalid" error message.

M9: When the user clicks "Save" with the Name field empty, the system must display an error message

M10: When the user clicks "Save" with the Dosage field empty, the system must display an error message.

M11: When the user clicks "Save" with the Reminder Time field empty, the system must display an error message.

M12: When the user clicks "Save" with all valid fields, the system must save the data to Firestore and redirect to the Saved Medicine Cabinet.

### Section: Saved Medicine Cabinet (Dashboard)

### Context: Authenticated User on Dashboard Page

C1: Given an empty cabinet, the system must display a message saying "No medications added yet."

C2: Given saved medication, each card should display a name.

C3: Given saved medication, each card should display dosage.

C4: Given saved medication, each card should display time.

C5: When the user clicks an individual medication card, the system must navigate to the Medication Management page for that item.

C6: If no image was uploaded, the system must display a default placeholder medicine icon.

### Section: Medication Management (Edit/Delete)

### Context: Authenticated User on Management Page

MM1: If data from the Add medicine page exists for the selected medicine, the system must populate the form field with the current saved name.

MM2: If data from the Add medicine page exists for the selected medicine, the system must populate the form field with the current saved dose.

MM3: If data from the Add medicine page exists for the selected medicine, the system must populate the form field with the current saved time.

MM4: If data from the Add medicine page exists for the selected medicine, the system must populate the form field with the current saved additional notes.

MM5: When the user updates any field and clicks "Update," the system must modify that specific document in the database.

MM6: When the user is viewing the medication management page, there will be a warning message near the delete button to confirm that the delete action cannot be undone.

MM7: When the user confirms deletion, the system must remove the medication from the database and return the user to the Cabinet.

### Section: Reminders & Notifications

### Context: Authenticated User with App Open on Laptop

R1: When the laptop system time matches a medication's scheduled time, the system must display a reminder message.

R2: When the laptop system time matches a medication's scheduled time, the reminder message must include a "Yes" button to confirm.

R3: When the laptop system time matches a medication's scheduled time, the reminder message must include a "Ignore" button to confirm.

R4: When the user clicks "Yes," the system must log a "Taken" status with a timestamp in the database.

R5: When the user clicks "Ignore," the system must log a "Missed" status in the database.

R6: When the user navigates to the reminders page, it must display a list of the 5 most recent missed reminders.

