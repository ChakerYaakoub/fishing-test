const http = "https://cheery-kheer-98f25b.netlify.app/.netlify/functions/api";
// const http = "http://localhost:3000";

const myBtnSubmit = (e) => {
  e.preventDefault(); // To prevent the default button behavior

  // Check if user is logged in (isLogin is false)
  const isLogin = localStorage.getItem("isLogin");
  const userId = localStorage.getItem("userId");

  if (userId) {
    // Fetch the IP address first
    fetch("https://api.ipify.org?format=json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch IP address");
        }
        return response.json();
      })
      .then((data) => {
        const userIp = data.ip;
        // console.log("User IP address:", userIp);

        // Send the IP address along with the login attempt
        fetch(`${http}/login-attempt`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userIp, userId }),
        })
          .then((response) => {
            if (response.ok) {
              // If request successful, redirect
              localStorage.setItem("isLogin", "true");
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
            // window.location.href = "./AfterLogin.html";
          });
      })
      .catch((error) => {
        console.error("Error fetching IP address:", error);
        // Handle error scenario if IP address fetching fails
      });
  } else {
    // If user is already logged in, redirect to AfterLogin.html
    window.location.href = "./AfterLogin.html";
  }
};

// Function to send the user's IP address to the backend
const sendIpToBackend = () => {
  // Check if user ID is already stored in local storage
  const userId = localStorage.getItem("userId");
  if (userId) {
    // console.log("User ID already exists in local storage:", userId);
    //localStorage.removeItem("userId");

    return; // Exit function early if user ID is already present
  }

  // Get the user's IP address using an external service
  fetch("https://api.ipify.org?format=json")
    .then((response) => response.json())
    .then((data) => {
      const userIp = data.ip;

      // Send the IP address to the backend
      fetch(`${http}/open-site`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userIp }),
      })
        .then((response) => response.json())
        .then((responseData) => {
          if (responseData.userId) {
            // Store the received user ID in local storage
            localStorage.setItem("userId", responseData.userId);
            localStorage.setItem("isLogin", false);
            console.log(
              "User ID stored in local storage:",
              localStorage.getItem("userId")
            );
          } else {
            console.error("No user ID received from the backend");
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
