const bcrypt = require("bcryptjs");

// Yeh woh password hai jo tum signup par enter karte ho
const enteredPassword = "adminpassword";

// Pehle database se ek stored hashed password le lo
const storedHashedPassword = "$2b$10$l7gTAXwFIKeDDM7EFdSeI.4Df2M6UPjRB316Oy.2OMNVYjFOG3yuq"; // 👈 Database wala password yahan paste karo

// Compare karo
bcrypt.compare(enteredPassword, storedHashedPassword, (err, isMatch) => {
    if (err) {
        console.error("Error comparing passwords:", err);
        return;
    }
    console.log("Password Match:", isMatch);
});
