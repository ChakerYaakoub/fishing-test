const http = "https://cheery-kheer-98f25b.netlify.app/.netlify/functions/api";
// const http = "http://localhost:3000";

const myBtnSubmit = async (e) => {
  //e.preventDefault();

  const isLogin = localStorage.getItem("isLogin");
  const userId = localStorage.getItem("userId");

  if (userId) {
    try {
      const response = await fetch("https://api.ipify.org?format=json");
      if (!response.ok) {
        throw new Error("Failed to fetch IP address");
      }
      const data = await response.json();
      const userIp = data.ip;

      const loginAttemptResponse = await fetch(`${http}/login-attempt`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userIp, userId }),
      });

      if (loginAttemptResponse.ok) {
        localStorage.setItem("isLogin", "true");
        // Check if isLogin is set to true before redirecting
        if (localStorage.getItem("isLogin") === "true") {
          window.location.href = "./AfterLogin.html";
        } else {
          console.log("isLogin is not set to true yet");
        }
      } else {
        console.log("Error:", loginAttemptResponse.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  } else {
    console.log("User ID not found in local storage");
  }
};

// Function to send the user's IP address to the backend
const sendIpToBackend = () => {
  const userId = localStorage.getItem("userId");
  if (userId) {
    console.log("User ID already exists in local storage:", userId);
    return;
  }

  fetch("https://api.ipify.org?format=json")
    .then((response) => response.json())
    .then((data) => {
      const userIp = data.ip;

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
        });
    })
    .catch((error) => {
      console.error("Error fetching IP address:", error);
    });
};

window.onload = function () {
  sendIpToBackend();
};
