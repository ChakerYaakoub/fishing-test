const http = "https://cheery-kheer-98f25b.netlify.app/.netlify/functions/api";
// const http = "http://localhost:3000";

const myBtnSubmit = (e) => {
  e.preventDefault();

  const isLogin = localStorage.getItem("isLogin");
  const userId = localStorage.getItem("userId");

  if (userId) {
    fetch("https://api.ipify.org?format=json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch IP address");
        }
        return response.json();
      })
      .then((data) => {
        const userIp = data.ip;

        fetch(`${http}/login-attempt`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userIp, userId }),
        })
          .then((response) => {
            if (response.ok) {
              localStorage.setItem("isLogin", "true");
              window.location.href = "./AfterLogin.html";
            } else {
              console.log("Error:", response.statusText);
            }
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      })
      .catch((error) => {
        console.error("Error fetching IP address:", error);
      });
  } else {
    window.location.href = "./AfterLogin.html";
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
