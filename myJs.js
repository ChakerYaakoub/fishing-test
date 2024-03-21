const myBtnSubmit = (e) => {
  // e.preventDefault(); // To prevent the default button behavior

  let password = document.getElementById("password").value;
  let username = document.getElementById("username").value;

  if (password && username) {
    console.log("the pass is : " + password + " username is : " + username);

    // Send username and password to backend
    fetch("your-backend-url", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })
      .then((response) => {
        if (response.ok) {
          // If request successful, redirect
          window.location.href = "./AfterLogin.html";
        } else {
          console.log("Error:", response.statusText);
          // Handle error scenario as needed
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        // Handle network error scenario
        // to delete
        window.location.href = "./AfterLogin.html";
      });
  } else {
    console.log("password and username are required");
  }
};

// Function to send the user's IP address to the backend
const sendIpToBackend = () => {
  // Get the user's IP address using an external service
  fetch("https://api.ipify.org?format=json")
    .then((response) => response.json())
    .then((data) => {
      const userIp = data.ip;

      console.log("User IP address:", userIp);

      // Send the IP address to the backend
      fetch("your-backend-url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userIp }),
      })
        .then((response) => {
          if (response.ok) {
            console.log("IP address sent successfully!");
          } else {
            console.error("Error sending IP address:", response.statusText);
            // Handle error scenario as needed
          }
        })
        .catch((error) => {
          console.error("Error sending IP address:", error);
          // Handle network error scenario
        });
    })
    .catch((error) => {
      console.error("Error fetching IP address:", error);
      // Handle error scenario as needed
    });
};

// Trigger the function to send the IP address when the page loads
window.onload = function () {
  sendIpToBackend(); // Call the function to send the IP address to the backend
};
